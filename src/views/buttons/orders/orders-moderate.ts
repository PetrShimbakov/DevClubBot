import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import {
	ORDERS_MODERATE_LIST_NEXT_BUTTON_ID,
	ORDERS_MODERATE_LIST_PREV_BUTTON_ID,
	ORDERS_MODERATE_LIST_REMOVE_AND_BAN_BUTTON_ID,
	ORDERS_MODERATE_LIST_REMOVE_BUTTON_ID
} from "../../../constants/component-ids";

const ordersModerateListButtons = new ActionRowBuilder().addComponents(
	new ButtonBuilder().setEmoji("⬅️").setCustomId(ORDERS_MODERATE_LIST_PREV_BUTTON_ID).setStyle(ButtonStyle.Primary),
	new ButtonBuilder().setEmoji("➡️").setCustomId(ORDERS_MODERATE_LIST_NEXT_BUTTON_ID).setStyle(ButtonStyle.Primary),
	new ButtonBuilder().setLabel("Удалить заказ").setEmoji("🗑️").setCustomId(ORDERS_MODERATE_LIST_REMOVE_BUTTON_ID).setStyle(ButtonStyle.Danger),
	new ButtonBuilder()
		.setLabel("Удалить заказ и запретить пользователю создавать заказы.")
		.setEmoji("🚫")
		.setCustomId(ORDERS_MODERATE_LIST_REMOVE_AND_BAN_BUTTON_ID)
		.setStyle(ButtonStyle.Danger)
);

export default ordersModerateListButtons;
