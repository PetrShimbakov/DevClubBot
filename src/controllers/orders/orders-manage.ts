import { ButtonInteraction, ComponentType } from "discord.js";
import { safeDeleteReply, safeReply } from "../../utils/reply-utils";
import errorMessages from "../../views/messages/error-messages";
import messages from "../../views/messages/messages";
import successMessages from "../../views/messages/success-messages";
import {
	MY_ORDERS_LIST_NEXT_BUTTON_ID,
	MY_ORDERS_LIST_PREV_BUTTON_ID,
	MY_ORDERS_LIST_REMOVE_BUTTON_ID,
	ORDER_BUDGET_INPUT_ID,
	ORDER_DESCRIPTION_INPUT_ID,
	ORDER_MODAL_ID,
	ORDER_TYPE_SELECT_MENU_ID
} from "../../constants/component-ids";
import { OrderType } from "../../types/order";
import ordersData from "../../models/orders-data";
import { roleOrderLimits } from "../../constants/orders/order-limits";
import { getOrderModal } from "../../views/modals/orders/orders-manage";
import { sendOrder } from "./orders-work";
import { MY_ORDERS_LIST_TIMEOUT, ORDER_CREATION_TIMEOUT } from "../../constants/timeouts";
import { awaitWithAbort } from "../../utils/await-utils";
import { deleteMsgFlags } from "../../utils/message-utils";
import { getNextPage, getPrevPage } from "../../utils/page-utils";
import rateLimit from "../../utils/rate-limit";
import { CREATE_ORDER_BUTTON_RATE_LIMIT, VIEW_MY_ORDERS_BUTTON_RATE_LIMIT } from "../../constants/rate-limits";

const createOrderAbortControllers = new Map<string, AbortController>();
export const handleCreateOrderButton = rateLimit<ButtonInteraction<"cached">>(CREATE_ORDER_BUTTON_RATE_LIMIT)(
	async function (initialInteraction: ButtonInteraction<"cached">): Promise<void> {
		const userId = initialInteraction.user.id;
		const member = initialInteraction.member;
		const userOrdersQty = (await ordersData.getOrders(userId)).length;

		if (!member) return safeReply(initialInteraction, errorMessages.unknown); // recommendation from community
		if (createOrderAbortControllers.has(userId)) createOrderAbortControllers.get(userId)!.abort();

		const abortController = new AbortController();
		createOrderAbortControllers.set(userId, abortController);

		try {
			const ordersLimit = member.roles.cache.reduce((max, role) => Math.max(max, roleOrderLimits[role.id] ?? 1), 1);
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

			await ordersData.addOrder(selectedOrderType, userId, orderDescription, orderBudget);
			await safeReply(modalInteraction, successMessages.ordered);
			sendOrder(selectedOrderType);
		} catch (error) {
			if (error instanceof Error && error.message === "abort") {
				safeDeleteReply(initialInteraction);
				return;
			}
			console.error(`[orders-controller] Unknown error for user ${userId}:`, error);
			return safeReply(initialInteraction, errorMessages.unknown);
		} finally {
			if (createOrderAbortControllers.get(userId) === abortController) createOrderAbortControllers.delete(userId);
		}
	}
);

const ordersListAbortControllers = new Map<string, AbortController>();
export const handleViewMyOrdersListButton = rateLimit<ButtonInteraction<"cached">>(VIEW_MY_ORDERS_BUTTON_RATE_LIMIT)(
	async function (interaction: ButtonInteraction<"cached">): Promise<void> {
		const ALLOWED_BUTTON_IDS = [
			MY_ORDERS_LIST_PREV_BUTTON_ID,
			MY_ORDERS_LIST_NEXT_BUTTON_ID,
			MY_ORDERS_LIST_REMOVE_BUTTON_ID
		];
		const userId = interaction.user.id;

		if (ordersListAbortControllers.has(userId)) ordersListAbortControllers.get(userId)!.abort();

		const abortController = new AbortController();
		ordersListAbortControllers.set(userId, abortController);

		try {
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
						const orderNumber = orders[currentPage - 1].orderNumber;
						await ordersData.removeOrder(userId, orderNumber);
						await safeReply(interaction, successMessages.orderRemoved(orderNumber));
						return await safeDeleteReply(interaction);
					case MY_ORDERS_LIST_PREV_BUTTON_ID:
					case MY_ORDERS_LIST_NEXT_BUTTON_ID:
						currentPage =
							buttonInteraction.customId === MY_ORDERS_LIST_PREV_BUTTON_ID
								? getPrevPage(currentPage, ordersQty)
								: getNextPage(currentPage, ordersQty);
						const message = deleteMsgFlags(messages.myOrdersList(orders[currentPage - 1], currentPage, ordersQty)); // Remove 'flags' to prevent Discord API error on update
						await buttonInteraction.update(message);
				}
			}
		} catch (error) {
			console.error(`[orders-work-controller] Unknown error for user ${userId}:`, error);
			return safeReply(interaction, errorMessages.unknown);
		} finally {
			if (ordersListAbortControllers.get(userId) === abortController) ordersListAbortControllers.delete(userId);
		}
	}
);
