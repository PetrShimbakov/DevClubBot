import { ButtonInteraction, ChatInputCommandInteraction, ComponentType } from "discord.js";
import config from "../../config";
import {
	ORDERS_MODERATE_LIST_NEXT_BUTTON_ID,
	ORDERS_MODERATE_LIST_PREV_BUTTON_ID,
	ORDERS_MODERATE_LIST_REMOVE_AND_BAN_BUTTON_ID,
	ORDERS_MODERATE_LIST_REMOVE_BUTTON_ID
} from "../../constants/component-ids";
import { ORDERS_MODERATE_LIST_TIMEOUT } from "../../constants/timeouts";
import ordersData from "../../models/orders-data";
import usersData from "../../models/users-data";
import { sendModLog } from "../../services/mod-log-service";
import { closeOrder } from "../../services/orders/close-order-service";
import { AbortControllerMap, awaitWithAbort } from "../../utils/abort-utils";
import { confirmAction } from "../../utils/confirm-action";
import { deleteMsgFlags } from "../../utils/message-utils";
import { getNextPage, getPrevPage } from "../../utils/page-utils";
import { safeDeleteReply, safeReply } from "../../utils/reply-utils";
import errorMessages from "../../views/messages/error-messages";
import messages from "../../views/messages/messages";
import successMessages from "../../views/messages/success-messages";

const ordersModerateSessions = new AbortControllerMap();
export async function moderateOrders(interaction: ChatInputCommandInteraction<"cached">) {
	const ALLOWED_BUTTON_IDS = [ORDERS_MODERATE_LIST_NEXT_BUTTON_ID, ORDERS_MODERATE_LIST_PREV_BUTTON_ID, ORDERS_MODERATE_LIST_REMOVE_AND_BAN_BUTTON_ID, ORDERS_MODERATE_LIST_REMOVE_BUTTON_ID];
	const userId = interaction.user.id;

	const abortController = ordersModerateSessions.start(userId);

	try {
		const orders = await ordersData.getOrders();
		const ordersQty = orders.length;
		let currentPage = 1;

		if (ordersQty === 0) return safeReply(interaction, errorMessages.ordersNotFound);

		await interaction.reply(messages.ordersModerateList(orders[currentPage - 1], currentPage, ordersQty));
		const message = await interaction.fetchReply();

		while (true) {
			const buttonInteraction = await awaitWithAbort(
				message.awaitMessageComponent({
					filter: i => i.user.id === userId && ALLOWED_BUTTON_IDS.some(cId => cId === i.customId),
					componentType: ComponentType.Button,
					time: ORDERS_MODERATE_LIST_TIMEOUT
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
				case ORDERS_MODERATE_LIST_REMOVE_BUTTON_ID:
				case ORDERS_MODERATE_LIST_REMOVE_AND_BAN_BUTTON_ID:
					if (buttonInteraction.member.roles.cache.has(config.roleIds.moderator)) {
						const currentOrder = orders[currentPage - 1];
						const realCurrentOrder = await ordersData.getOrder(currentOrder.id);
						if (!realCurrentOrder) return safeReply(buttonInteraction, errorMessages.orderNotFound);

						let success = true;
						const withBan = buttonInteraction.customId === ORDERS_MODERATE_LIST_REMOVE_AND_BAN_BUTTON_ID;

						const isConfirmed = await confirmAction(buttonInteraction, withBan ? "closeOrderAndBan" : "closeOrder");
						if (!isConfirmed) continue;

						try {
							await closeOrder(realCurrentOrder, userId);
							if (withBan)
								await usersData.disablePermission(realCurrentOrder.orderedBy, "canCreateOrders").catch(err => {
									console.error(`[moderate-orders-command-controller] Cannot disable canCreateOrders permission for user ${buttonInteraction.user.id}:`, err);
									throw err;
								});
						} catch (err) {
							success = false;
							throw err;
						} finally {
							await sendModLog(messages.orderModLog(realCurrentOrder, buttonInteraction.user, success, withBan));
						}

						await safeReply(buttonInteraction, successMessages.orderRemoved(realCurrentOrder.orderNumber));
						return safeDeleteReply(interaction);
					} else safeReply(buttonInteraction, errorMessages.noRights);
					break;
				case ORDERS_MODERATE_LIST_PREV_BUTTON_ID:
				case ORDERS_MODERATE_LIST_NEXT_BUTTON_ID:
					currentPage = buttonInteraction.customId === ORDERS_MODERATE_LIST_PREV_BUTTON_ID ? getPrevPage(currentPage, ordersQty) : getNextPage(currentPage, ordersQty);
					const msg = deleteMsgFlags(messages.ordersModerateList(orders[currentPage - 1], currentPage, ordersQty)); // Remove 'flags' to prevent Discord API error on update
					await buttonInteraction.update(msg);
					break;
			}
		}
	} finally {
		ordersModerateSessions.finish(userId, abortController);
	}
}
