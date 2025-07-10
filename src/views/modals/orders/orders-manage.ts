import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ORDER_BUDGET_INPUT_ID, ORDER_DESCRIPTION_INPUT_ID, ORDER_MODAL_ID } from "../../../constants/component-ids";
import { orderLabels } from "../../../constants/orders/order-labels";
import { OrderType } from "../../../types/order";

export function getOrderModal(orderType: OrderType): ModalBuilder {
	return new ModalBuilder()
		.setCustomId(ORDER_MODAL_ID)
		.setTitle(`Заказ: ${orderLabels[orderType]}`)
		.addComponents(
			new ActionRowBuilder<TextInputBuilder>().addComponents(
				new TextInputBuilder()
					.setCustomId(ORDER_DESCRIPTION_INPUT_ID)
					.setLabel("Что заказываем? (опишите подробно)")
					.setStyle(TextInputStyle.Paragraph)
					.setMaxLength(300)
					.setRequired(true)
			),
			new ActionRowBuilder<TextInputBuilder>().addComponents(
				new TextInputBuilder()
					.setCustomId(ORDER_BUDGET_INPUT_ID)
					.setLabel("Бюджет? (необязательное поле)")
					.setStyle(TextInputStyle.Short)
					.setMaxLength(50)
					.setRequired(false)
			)
		);
}
