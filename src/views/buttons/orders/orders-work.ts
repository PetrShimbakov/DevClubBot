import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import {
	ORDERS_LIST_NEXT_BUTTON_ID,
	ORDERS_LIST_PREV_BUTTON_ID,
	ORDERS_LIST_TAKE_BUTTON_ID,
	VIEW_ORDERS_LIST_BUTTON_ID
} from "../../../constants/component-ids";

export const ordersListButtons = new ActionRowBuilder().addComponents(
	new ButtonBuilder().setEmoji("⬅️").setCustomId(ORDERS_LIST_PREV_BUTTON_ID).setStyle(ButtonStyle.Primary),
	new ButtonBuilder().setLabel("Взять").setEmoji("✅").setCustomId(ORDERS_LIST_TAKE_BUTTON_ID).setStyle(ButtonStyle.Success),
	new ButtonBuilder().setEmoji("➡️").setCustomId(ORDERS_LIST_NEXT_BUTTON_ID).setStyle(ButtonStyle.Primary)
);

export const viewOrdersListButton = new ButtonBuilder()
	.setLabel("Посмотреть заказы")
	.setEmoji("🔎")
	.setCustomId(VIEW_ORDERS_LIST_BUTTON_ID)
	.setStyle(ButtonStyle.Primary);
