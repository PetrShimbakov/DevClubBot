import { ButtonInteraction, ComponentType } from "discord.js";
import { safeReply } from "../../utils/reply-utils";
import errorMessages from "../../views/messages/error-messages";
import messages from "../../views/messages/messages";
import successMessages from "../../views/messages/success-messages";
import {
	ORDER_BUDGET_INPUT_ID,
	ORDER_DESCRIPTION_INPUT_ID,
	ORDER_MODAL_ID,
	ORDER_TYPE_SELECT_MENU_ID,
	REMOVE_ORDER_BUTTON_ID
} from "../../constants/component-ids";
import { OrderType } from "../../types/order";
import ordersData from "../../models/orders-data";
import { roleOrderLimits } from "../../constants/orders/order-limits";
import { getOrderModal } from "../../views/modals/orders/orders-manage";
import { sendOrder } from "./orders-work";

const pendingOrderUsers = new Set<string>();
const INTERACTION_TIMEOUT = 120_000;

export async function handleCreateOrderButton(initialInteraction: ButtonInteraction<"cached">): Promise<void> {
	const userId = initialInteraction.user.id;
	const member = initialInteraction.member;
	const userOrdersQty = (await ordersData.getOrders(userId)).length;

	if (!member) return safeReply(initialInteraction, errorMessages.unknown); // recommendation from community

	try {
		if (pendingOrderUsers.has(userId)) return safeReply(initialInteraction, errorMessages.tooManyRequests);
		pendingOrderUsers.add(userId);

		const ordersLimit = member.roles.cache.reduce((max, role) => Math.max(max, roleOrderLimits[role.id] ?? 1), 1);
		if (userOrdersQty >= ordersLimit) return safeReply(initialInteraction, errorMessages.ordersLimitReached(ordersLimit));

		let selectMenuInteraction;
		try {
			await initialInteraction.reply(messages.orderTypeSelection(userId));
			const message = await initialInteraction.fetchReply();
			selectMenuInteraction = await message.awaitMessageComponent({
				filter: i => i.user.id === userId && i.customId === ORDER_TYPE_SELECT_MENU_ID,
				componentType: ComponentType.StringSelect,
				time: INTERACTION_TIMEOUT
			});
		} catch (error) {
			if (error instanceof Error && "code" in error && error.code === "InteractionCollectorError") {
				return safeReply(initialInteraction, errorMessages.timeLimit);
			}
			throw error;
		}

		const selectedOrderType = selectMenuInteraction.values[0] as OrderType;

		if (!Object.values(OrderType).includes(selectedOrderType)) {
			throw new Error(`Unsupported order type "${selectedOrderType}" selected by user "${userId}".`);
		}

		let modalInteraction;
		try {
			await selectMenuInteraction.showModal(getOrderModal(selectedOrderType));
			await initialInteraction.deleteReply();
			modalInteraction = await selectMenuInteraction.awaitModalSubmit({
				filter: i => i.user.id === userId && i.customId === ORDER_MODAL_ID,
				time: INTERACTION_TIMEOUT
			});
		} catch (error) {
			if (error instanceof Error && "code" in error && error.code === "InteractionCollectorError") {
				return safeReply(modalInteraction ?? selectMenuInteraction, errorMessages.timeLimit);
			}
			throw error;
		}

		const orderDescription = modalInteraction.fields.getTextInputValue(ORDER_DESCRIPTION_INPUT_ID).trim();
		const orderBudget = modalInteraction.fields.getTextInputValue(ORDER_BUDGET_INPUT_ID).trim() || "Договорной";

		if (orderDescription.length > 300) return safeReply(modalInteraction, errorMessages.tooLongOrderDescription(300));
		if (orderBudget.length > 50) return safeReply(modalInteraction, errorMessages.tooLongOrderBudget(50));

		await ordersData.addOrder(selectedOrderType, userId, orderDescription, orderBudget);
		await safeReply(modalInteraction, successMessages.ordered);
		sendOrder(selectedOrderType);
	} catch (error) {
		console.error(`[orders-controller] Unknown error for user ${userId}:`, error);
		return safeReply(initialInteraction, errorMessages.unknown);
	} finally {
		pendingOrderUsers.delete(userId);
	}
}

export async function handleViewMyOrdersButton(interaction: ButtonInteraction<"cached">): Promise<void> {
	try {
		const orders = await ordersData.getOrders(interaction.user.id);
		if (orders.length < 1) return safeReply(interaction, errorMessages.myOrdersNotFound);
		for (const order of orders) await safeReply(interaction, messages.orderInfo(order));
	} catch (error) {
		console.error(`[orders-controller] Unknown error for user ${interaction.user.id}:`, error);
		return safeReply(interaction, errorMessages.unknown);
	}
}

export async function handleRemoveOrderButton(interaction: ButtonInteraction<"cached">): Promise<void> {
	try {
		const orderNumber = parseInt(interaction.customId.replace(REMOVE_ORDER_BUTTON_ID, ""));
		if (!(await ordersData.hasOrder(interaction.user.id, orderNumber)))
			return safeReply(interaction, errorMessages.orderAlreadyDeleted);
		await ordersData.removeOrder(interaction.user.id, orderNumber);

		safeReply(interaction, successMessages.orderRemoved(orderNumber));
	} catch (error) {
		console.error(`[orders-controller] Unknown error for user ${interaction.user.id}:`, error);
		return safeReply(interaction, errorMessages.unknown);
	}
}
