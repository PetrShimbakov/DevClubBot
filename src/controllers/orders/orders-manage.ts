import { ButtonInteraction, ComponentType } from "discord.js";
import {
	MY_ORDERS_LIST_NEXT_BUTTON_ID,
	MY_ORDERS_LIST_PREV_BUTTON_ID,
	MY_ORDERS_LIST_REMOVE_BUTTON_ID,
	ORDER_BUDGET_INPUT_ID,
	ORDER_DESCRIPTION_INPUT_ID,
	ORDER_MODAL_ID,
	ORDER_TYPE_SELECT_MENU_ID
} from "../../constants/component-ids";
import { DEFAULT_ORDER_LIMIT, roleOrderLimits } from "../../constants/orders/order-limits";
import { CREATE_ORDER_BUTTON_RATE_LIMIT, VIEW_MY_ORDERS_BUTTON_RATE_LIMIT } from "../../constants/rate-limits";
import { MY_ORDERS_LIST_TIMEOUT, ORDER_CREATION_TIMEOUT } from "../../constants/timeouts";
import ordersData from "../../models/orders-data";
import usersData from "../../models/users-data";
import { closeOrder } from "../../services/orders/close-order-service";
import { createOrder } from "../../services/orders/create-order-service";
import { OrderType } from "../../types/order";
import { AbortControllerMap, awaitWithAbort } from "../../utils/abort-utils";
import { deleteMsgFlags } from "../../utils/message-utils";
import { getNextPage, getPrevPage } from "../../utils/page-utils";
import rateLimit from "../../utils/rate-limit";
import { safeDeleteReply, safeReply } from "../../utils/reply-utils";
import errorMessages from "../../views/messages/error-messages";
import messages from "../../views/messages/messages";
import successMessages from "../../views/messages/success-messages";
import { getOrderModal } from "../../views/modals/orders/orders-manage";

const createOrderSessions = new AbortControllerMap();
export const handleCreateOrderButton = rateLimit<ButtonInteraction<"cached">>(CREATE_ORDER_BUTTON_RATE_LIMIT)(async function (
	initialInteraction: ButtonInteraction<"cached">
): Promise<void> {
	const userId = initialInteraction.user.id;
	const member = initialInteraction.member;
	const userOrdersQty = (await ordersData.getOrders(userId)).length;

	if (!member) return safeReply(initialInteraction, errorMessages.unknown); // recommendation from community

	const abortController = createOrderSessions.start(userId);

	try {
		const userData = await usersData.getUser(userId);
		if (!userData) return safeReply(initialInteraction, errorMessages.notRegistered);
		if (!userData.permissions.canCreateOrders) return safeReply(initialInteraction, errorMessages.blockedFeature);

		const ordersLimit = member.roles.cache.reduce((max, role) => Math.max(max, roleOrderLimits[role.id] ?? DEFAULT_ORDER_LIMIT), DEFAULT_ORDER_LIMIT);
		if (userOrdersQty >= ordersLimit) return safeReply(initialInteraction, errorMessages.ordersLimitReached(ordersLimit));

		let selectMenuInteraction;
		try {
			await initialInteraction.reply(messages.orderTypeSelection(userId));
			const message = await initialInteraction.fetchReply();
			selectMenuInteraction = await awaitWithAbort(
				message.awaitMessageComponent({
					filter: i => i.user.id === userId && i.customId === ORDER_TYPE_SELECT_MENU_ID,
					componentType: ComponentType.StringSelect,
					time: ORDER_CREATION_TIMEOUT
				}),
				abortController
			);
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
			await safeDeleteReply(initialInteraction);
			modalInteraction = await awaitWithAbort(
				selectMenuInteraction.awaitModalSubmit({
					filter: i => i.user.id === userId && i.customId === ORDER_MODAL_ID,
					time: ORDER_CREATION_TIMEOUT
				}),
				abortController
			);
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

		await createOrder(modalInteraction.user, orderDescription, orderBudget, selectedOrderType);

		await safeReply(modalInteraction, successMessages.ordered);
	} catch (error) {
		if (error instanceof Error && error.message === "abort") {
			safeDeleteReply(initialInteraction);
			return;
		}
		console.error(`[orders-manage-controller] Unknown error for user ${userId}:`, error);
		return safeReply(initialInteraction, errorMessages.unknown);
	} finally {
		createOrderSessions.finish(userId, abortController);
	}
});

const ordersListSessions = new AbortControllerMap();
export const handleViewMyOrdersListButton = rateLimit<ButtonInteraction<"cached">>(VIEW_MY_ORDERS_BUTTON_RATE_LIMIT)(async function (
	interaction: ButtonInteraction<"cached">
): Promise<void> {
	const ALLOWED_BUTTON_IDS = [MY_ORDERS_LIST_PREV_BUTTON_ID, MY_ORDERS_LIST_NEXT_BUTTON_ID, MY_ORDERS_LIST_REMOVE_BUTTON_ID];
	const userId = interaction.user.id;

	const abortController = ordersListSessions.start(userId);

	try {
		if (!(await usersData.isUserRegistered(userId))) return safeReply(interaction, errorMessages.notRegistered);

		const orders = await ordersData.getOrders(userId);
		const ordersQty = orders.length;
		let currentPage = 1;

		if (ordersQty === 0) return safeReply(interaction, errorMessages.myOrdersNotFound);

		await interaction.reply(messages.myOrdersList(orders[currentPage - 1], currentPage, ordersQty));
		const message = await interaction.fetchReply();

		while (true) {
			const buttonInteraction = await awaitWithAbort(
				message.awaitMessageComponent({
					filter: i => i.user.id === userId && ALLOWED_BUTTON_IDS.some(cId => cId === i.customId),
					componentType: ComponentType.Button,
					time: MY_ORDERS_LIST_TIMEOUT
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
				case MY_ORDERS_LIST_REMOVE_BUTTON_ID:
					const currentOrder = orders[currentPage - 1];
					const realCurrentOrder = await ordersData.getOrder(currentOrder.id);
					if (!realCurrentOrder) return safeReply(buttonInteraction, errorMessages.orderNotFound);
					await closeOrder(realCurrentOrder, userId);
					await safeReply(interaction, successMessages.orderRemoved(currentOrder.orderNumber));
					return await safeDeleteReply(interaction);
				case MY_ORDERS_LIST_PREV_BUTTON_ID:
				case MY_ORDERS_LIST_NEXT_BUTTON_ID:
					currentPage = buttonInteraction.customId === MY_ORDERS_LIST_PREV_BUTTON_ID ? getPrevPage(currentPage, ordersQty) : getNextPage(currentPage, ordersQty);
					const msg = deleteMsgFlags(messages.myOrdersList(orders[currentPage - 1], currentPage, ordersQty)); // Remove 'flags' to prevent Discord API error on update
					await buttonInteraction.update(msg);
			}
		}
	} catch (error) {
		console.error(`[orders-work-controller] Unknown error for user ${userId}:`, error);
		return safeReply(interaction, errorMessages.unknown);
	} finally {
		ordersListSessions.finish(userId, abortController);
	}
});
