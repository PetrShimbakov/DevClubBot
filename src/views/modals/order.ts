import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ORDER_MODAL_ID, ORDER_DESCRIPTION_INPUT_ID, ORDER_BUDGET_INPUT_ID } from "../../constants/component-ids";
import { OrderType } from "../../types/order";
import { orderLabels } from "../../constants/order-labels";

export default function getOrderModal(orderType: OrderType): ModalBuilder {
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
