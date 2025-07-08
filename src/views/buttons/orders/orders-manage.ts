import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { CREATE_ORDER_BUTTON_ID, VIEW_MY_ORDERS_BUTTON_ID, REMOVE_ORDER_BUTTON_ID } from "../../../constants/component-ids";

export const orderMenuButtons = new ActionRowBuilder().addComponents(
	new ButtonBuilder()
		.setLabel("Заказать контент")
		.setEmoji("📦")
		.setCustomId(CREATE_ORDER_BUTTON_ID)
		.setStyle(ButtonStyle.Primary),
	new ButtonBuilder()
		.setLabel("Посмотреть мои заказы")
		.setEmoji("📋")
		.setCustomId(VIEW_MY_ORDERS_BUTTON_ID)
		.setStyle(ButtonStyle.Secondary)
);

export default function getRemoveOrderButton(orderNumber: number) {
	return new ButtonBuilder()
		.setLabel("Отменить заказ")
		.setEmoji("🗑️")
		.setCustomId(REMOVE_ORDER_BUTTON_ID + orderNumber)
		.setStyle(ButtonStyle.Danger);
}
