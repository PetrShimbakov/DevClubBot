import { ButtonInteraction, ComponentType } from "discord.js";
import client from "../../client";
import config from "../../config";
import { OrderType } from "../../types/order";
import messages from "../../views/messages/messages";
import errorMessages from "../../views/messages/error-messages";
import { safeReply } from "../../utils/reply-utils";
import ordersData from "../../models/orders-data";
import { orderRoles } from "../../constants/orders/order-roles";
import {
	ORDERS_LIST_NEXT_BUTTON_ID,
	ORDERS_LIST_PREV_BUTTON_ID,
	ORDERS_LIST_TAKE_BUTTON_ID
} from "../../constants/component-ids";
import { awaitWithAbort } from "../../utils/await-utils";
import { ORDERS_LIST_TIMEOUT } from "../../constants/timeouts";
import { getNextPage, getPrevPage } from "../../utils/page-utils";
import { deleteMsgFlags } from "../../utils/message-utils";

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

const abortControllers = new Map<string, AbortController>();
export async function handleViewOrdersListButton(interaction: ButtonInteraction<"cached">) {
	const ALLOWED_BUTTON_IDS = [ORDERS_LIST_PREV_BUTTON_ID, ORDERS_LIST_NEXT_BUTTON_ID, ORDERS_LIST_TAKE_BUTTON_ID];
	const userId = interaction.user.id;

	if (abortControllers.has(userId)) abortControllers.get(userId)!.abort();

	const abortController = new AbortController();
	abortControllers.set(userId, abortController);

	try {
		const orders = await ordersData.getOrders();
		const userRoles = interaction.member.roles.cache;
		const availableOrders = orders.filter(order => orderRoles[order.type].some(roleId => userRoles.has(roleId)));
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
					interaction.deleteReply();
					return safeReply(interaction, errorMessages.orderListInactivity);
				}
				if (error.message === "abort") return interaction.deleteReply();
				throw error;
			});

			if (!buttonInteraction) return;
			if (!(buttonInteraction instanceof ButtonInteraction)) return;

			switch (buttonInteraction.customId) {
				case ORDERS_LIST_TAKE_BUTTON_ID:
					// TODO: implement take order button.
					break;
				case ORDERS_LIST_PREV_BUTTON_ID:
				case ORDERS_LIST_NEXT_BUTTON_ID:
					currentPage =
						buttonInteraction.customId === ORDERS_LIST_PREV_BUTTON_ID
							? getPrevPage(currentPage, ordersQty)
							: getNextPage(currentPage, ordersQty);
					const msg = deleteMsgFlags(messages.ordersList(orders[currentPage - 1], currentPage, ordersQty)); // Remove 'flags' to prevent Discord API error on update
					await buttonInteraction.update(msg);
			}
		}
	} catch (error) {
		console.error(`[orders-work-controller] Unknown error for user ${userId}:`, error);
		return safeReply(interaction, errorMessages.unknown);
	} finally {
		if (abortControllers.get(userId) === abortController) abortControllers.delete(userId);
	}
}
