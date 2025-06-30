import { ButtonBuilder, ButtonStyle } from "discord.js";
import { REMOVE_ORDER_BUTTON_ID } from "../../constants/component-ids";

export default function getRemoveOrderButton(orderNumber: number) {
	return new ButtonBuilder()
		.setLabel("Отменить заказ")
		.setEmoji("🗑️")
		.setCustomId(REMOVE_ORDER_BUTTON_ID + orderNumber)
		.setStyle(ButtonStyle.Danger);
}
