import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import {
	CREATE_ORDER_BUTTON_ID,
	MY_ORDERS_LIST_NEXT_BUTTON_ID,
	MY_ORDERS_LIST_PREV_BUTTON_ID,
	MY_ORDERS_LIST_REMOVE_BUTTON_ID,
	VIEW_MY_ORDERS_BUTTON_ID
} from "../../../constants/component-ids";

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

export const myOrdersListButtons = new ActionRowBuilder().addComponents(
	new ButtonBuilder().setEmoji("⬅️").setCustomId(MY_ORDERS_LIST_PREV_BUTTON_ID).setStyle(ButtonStyle.Primary),
	new ButtonBuilder()
		.setLabel("Отменить заказ")
		.setEmoji("🗑️")
		.setCustomId(MY_ORDERS_LIST_REMOVE_BUTTON_ID)
		.setStyle(ButtonStyle.Danger),
	new ButtonBuilder().setEmoji("➡️").setCustomId(MY_ORDERS_LIST_NEXT_BUTTON_ID).setStyle(ButtonStyle.Primary)
);
