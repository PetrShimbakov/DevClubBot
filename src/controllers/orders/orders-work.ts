import { ButtonInteraction, ChannelType, ComponentType, User } from "discord.js";
import { ObjectId } from "mongodb";
import client from "../../client";
import config from "../../config";
import {
	ORDER_DONE_BUTTON_ID,
	ORDER_REJECT_BUTTON_ID,
	ORDERS_LIST_NEXT_BUTTON_ID,
	ORDERS_LIST_PREV_BUTTON_ID,
	ORDERS_LIST_TAKE_BUTTON_ID
} from "../../constants/component-ids";
import { DEFAULT_TAKEN_ORDERS_LIMIT, roleTakenOrdersLimits } from "../../constants/orders/order-limits";
import { orderRoles } from "../../constants/orders/order-roles";
import { ORDER_DONE_BUTTON_RATE_LIMIT, VIEW_ORDERS_BUTTON_RATE_LIMIT } from "../../constants/rate-limits";
import { ORDERS_LIST_TIMEOUT } from "../../constants/timeouts";
import ordersData from "../../models/orders-data";
import usersData from "../../models/users-data";
import { OrderType } from "../../types/order";
import { IUserData } from "../../types/user-data";
import { AbortControllerMap, awaitWithAbort } from "../../utils/abort-utils";
import { deleteMsgFlags } from "../../utils/message-utils";
import { getNextPage, getPrevPage } from "../../utils/page-utils";
import rateLimit from "../../utils/rate-limit";
import { safeDeleteReply, safeReply } from "../../utils/reply-utils";
import errorMessages from "../../views/messages/error-messages";
import messages from "../../views/messages/messages";
import successMessages from "../../views/messages/success-messages";

export async function sendOrder(orderType: OrderType) {
	try {
		const channel = await client.channels.fetch(config.channels.ordersList);
		if (!channel) throw new Error("[orders-work-controller] Failed to find the ordersList channel.");
		if (!channel.isSendable())
			throw new Error("[orders-work-controller] Cannot send message: ordersList channel is not sendable.");
		await channel.send(messages.newOrder(orderType));
	} catch (error) {
		console.error(`[orders-work-controller] Unknown error while sending order:`, error);
	}
}

const ordersListSessions = new AbortControllerMap();
export const handleViewOrdersListButton = rateLimit<ButtonInteraction<"cached">>(VIEW_ORDERS_BUTTON_RATE_LIMIT)(
	async function (interaction: ButtonInteraction<"cached">) {
		const ALLOWED_BUTTON_IDS = [ORDERS_LIST_PREV_BUTTON_ID, ORDERS_LIST_NEXT_BUTTON_ID, ORDERS_LIST_TAKE_BUTTON_ID];
		const userId = interaction.user.id;

		const abortController = ordersListSessions.start(userId);

		try {
			const orders = await ordersData.getOrders();
			const userRoles = interaction.member.roles.cache;
			const availableOrders = orders.filter(order =>
				orderRoles[order.type].some(roleId => userRoles.has(roleId) && !order.isTaken)
			);

			const ordersQty = availableOrders.length;
			let currentPage = 1;

			if (ordersQty === 0) return safeReply(interaction, errorMessages.availableOrdersNotFound);

			await interaction.reply(messages.ordersList(availableOrders[currentPage - 1], currentPage, ordersQty));
			const message = await interaction.fetchReply();

			while (true) {
				const buttonInteraction = await awaitWithAbort(
					message.awaitMessageComponent({
						filter: i => i.user.id === userId && ALLOWED_BUTTON_IDS.some(cId => cId === i.customId),
						componentType: ComponentType.Button,
						time: ORDERS_LIST_TIMEOUT
					}),
					abortController
				).catch(error => {
					if (error.code === "InteractionCollectorError") {
						safeDeleteReply(interaction);
						return safeReply(interaction, errorMessages.orderListInactivity);
					}
					if (error.message === "abort") return safeDeleteReply(interaction);
					throw error;
				});

				if (!buttonInteraction) return;
				if (!(buttonInteraction instanceof ButtonInteraction)) return;

				switch (buttonInteraction.customId) {
					case ORDERS_LIST_TAKE_BUTTON_ID:
						handleTakeOrderButton(buttonInteraction, availableOrders[currentPage - 1].id);
						return await safeDeleteReply(interaction);
					case ORDERS_LIST_PREV_BUTTON_ID:
					case ORDERS_LIST_NEXT_BUTTON_ID:
						currentPage =
							buttonInteraction.customId === ORDERS_LIST_PREV_BUTTON_ID
								? getPrevPage(currentPage, ordersQty)
								: getNextPage(currentPage, ordersQty);
						const msg = deleteMsgFlags(messages.ordersList(availableOrders[currentPage - 1], currentPage, ordersQty)); // Remove 'flags' to prevent Discord API error on update
						await buttonInteraction.update(msg);
				}
			}
		} catch (error) {
			console.error(`[orders-work-controller] Unknown error for user ${userId}:`, error);
			return safeReply(interaction, errorMessages.unknown);
		} finally {
			ordersListSessions.finish(userId, abortController);
		}
	}
);

async function handleTakeOrderButton(interaction: ButtonInteraction<"cached">, orderId: ObjectId) {
	const userId = interaction.user.id;
	try {
		const ordersLimit = interaction.member.roles.cache.reduce(
			(max, role) => Math.max(max, roleTakenOrdersLimits[role.id] ?? DEFAULT_TAKEN_ORDERS_LIMIT),
			DEFAULT_TAKEN_ORDERS_LIMIT
		);
		const ordersQty = await ordersData.countTakenOrdersByUser(userId);
		if (ordersQty >= ordersLimit) return safeReply(interaction, errorMessages.takenOrdersLimitReached(ordersLimit));

		const userData = await usersData.getUser(userId);
		const order = await ordersData.getOrder(orderId);

		if (!order) return safeReply(interaction, errorMessages.orderNotFound);
		if (order.isTaken) return safeReply(interaction, errorMessages.orderIsAlreadyTaken);
		if (order.userDiscordId === userId) return safeReply(interaction, errorMessages.thisIsYourOrder);
		if (!userData) throw new Error("UserData not found.");

		await ordersData.takeOrder(order.id, userId);
		await updateOrderChannel(orderId, userData, interaction.user);

		await safeReply(interaction, successMessages.orderTaken(order.orderChannelId));
		return await safeDeleteReply(interaction);
	} catch (error) {
		console.error(`[orders-work-controller] Unknown error for user ${userId}:`, error);
		safeReply(interaction, errorMessages.unknown);
	}
}

export const handleOrderDoneButton = rateLimit<ButtonInteraction<"cached">>(ORDER_DONE_BUTTON_RATE_LIMIT)(async function (
	interaction: ButtonInteraction<"cached">
) {
	try {
		const userId = interaction.user.id;
		const orderId = new ObjectId(interaction.customId.replace(ORDER_DONE_BUTTON_ID, ""));
		const order = await ordersData.getOrder(orderId);

		if (!order) throw new Error("Order not found in database.");
		if (userId !== order.userDiscordId && userId !== order.takenBy) return safeReply(interaction, errorMessages.noRights);

		const guild = client.guilds.cache.get(config.guildId) || (await client.guilds.fetch(config.guildId));
		const channel = guild.channels.cache.get(order.orderChannelId) || (await guild.channels.fetch(order.orderChannelId));

		await channel?.delete();
		await ordersData.removeOrder(orderId);
	} catch (error) {
		console.error(`[orders-work-controller] handleOrderDoneButton: Unknown error for user ${interaction.user.id}:`, error);
		return safeReply(interaction, errorMessages.unknown);
	}
});

export const handleOrderRejectButton = rateLimit<ButtonInteraction<"cached">>(ORDER_DONE_BUTTON_RATE_LIMIT)(async function (
	interaction: ButtonInteraction<"cached">
) {
	try {
		const userId = interaction.user.id;
		const orderId = new ObjectId(interaction.customId.replace(ORDER_REJECT_BUTTON_ID, ""));
		const order = await ordersData.getOrder(orderId);

		if (!order) throw new Error("Order not found in database.");
		if (userId !== order.userDiscordId && userId !== order.takenBy) return safeReply(interaction, errorMessages.noRights);

		const guild = client.guilds.cache.get(config.guildId) || (await client.guilds.fetch(config.guildId));
		const channel = guild.channels.cache.get(order.orderChannelId) || (await guild.channels.fetch(order.orderChannelId));

		if (!channel || channel.type !== ChannelType.GuildText)
			throw new Error(`updateOrderChannel: Order channel not found. Order: ${order}`);

		if (!order.orderTakenMessageId) return;
		await channel.messages
			.fetch(order.orderTakenMessageId)
			.then(msg => msg.delete())
			.catch(err => console.log("jddj", err));

		await (channel as any).permissionOverwrites.edit(order.takenBy, {
			ViewChannel: false,
			SendMessages: false,
			AttachFiles: false,
			ReadMessageHistory: false
		});

		await ordersData.rejectOrder(orderId);

		sendOrder(order.type);

		safeReply(interaction, successMessages.orderRejected);
	} catch (error) {
		console.error(`[orders-work-controller] handleOrderRejectButton: Unknown error for user ${interaction.user.id}:`, error);
		return safeReply(interaction, errorMessages.unknown);
	}
});

async function updateOrderChannel(orderId: ObjectId, userData: IUserData, user: User): Promise<void> {
	const order = await ordersData.getOrder(orderId);
	if (!order) throw new Error("Order not found.");
	const guild = client.guilds.cache.get(config.guildId) || (await client.guilds.fetch(config.guildId));
	const channel = guild.channels.cache.get(order.orderChannelId) || (await guild.channels.fetch(order.orderChannelId));

	if (!channel || channel.type !== ChannelType.GuildText)
		throw new Error(`updateOrderChannel: Order channel not found. Order: ${order}`);

	if (!order.takenBy || !order.isTaken) throw new Error(`updateOrderChannel: Order is not taken: ${order}`);

	await channel.permissionOverwrites.edit(order.takenBy, {
		ViewChannel: true,
		SendMessages: true,
		AttachFiles: true,
		ReadMessageHistory: true
	});

	const res = await channel.send(messages.orderTaken(order, userData, user));
	await ordersData.setOrderTakenMessageId(orderId, res.id);
}
