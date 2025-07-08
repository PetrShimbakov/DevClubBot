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

const abortControllers = new Map<string, AbortController>();
const INTERACTION_TIMEOUT = 300_000;

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

		let currentPage = 1;

		if (availableOrders.length === 0) return safeReply(interaction, errorMessages.availableOrdersNotFound);

		await interaction.reply(messages.ordersList(availableOrders[currentPage - 1], currentPage, availableOrders.length));
		const message = await interaction.fetchReply();

		while (true) {
			const buttonInteraction = await awaitWithAbort(
				message.awaitMessageComponent({
					filter: i => i.user.id === interaction.user.id && ALLOWED_BUTTON_IDS.some(cId => cId === i.customId),
					componentType: ComponentType.Button,
					time: INTERACTION_TIMEOUT
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
					break;
				case ORDERS_LIST_PREV_BUTTON_ID: {
					if (currentPage <= 1) currentPage = availableOrders.length;
					else currentPage -= 1;

					const { flags, ...orderListMsg } = messages.ordersList(
						availableOrders[currentPage - 1],
						currentPage,
						availableOrders.length
					);

					await buttonInteraction.update(orderListMsg);
					break;
				}
				case ORDERS_LIST_NEXT_BUTTON_ID:
					if (currentPage === availableOrders.length) currentPage = 1;
					else currentPage += 1;

					const { flags, ...orderListMsg } = messages.ordersList(
						availableOrders[currentPage - 1],
						currentPage,
						availableOrders.length
					);

					await buttonInteraction.update(orderListMsg);
					break;
				default:
					break;
			}
		}
	} catch (error) {
		console.error(`[orders-work-controller] Unknown error for user ${interaction.user.id}:`, error);
		return safeReply(interaction, errorMessages.unknown);
	} finally {
		if (abortControllers.get(userId) === abortController) abortControllers.delete(userId);
	}
}
