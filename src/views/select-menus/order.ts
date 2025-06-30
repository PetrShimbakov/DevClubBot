import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { ORDER_TYPE_SELECT_MENU_ID } from "../../constants/component-ids";
import { OrderType } from "../../types/order";
import { orderDescriptions, orderEmojis, orderLabels } from "../../constants/order-labels";

const orderTypes: OrderType[] = Object.values(OrderType);

export default function getOrderTypeSelectMenu() {
	const orderTypeOptions = orderTypes.map(orderType => {
		return new StringSelectMenuOptionBuilder()
			.setLabel(orderLabels[orderType])
			.setValue(orderType)
			.setEmoji(orderEmojis[orderType])
			.setDescription(orderDescriptions[orderType]);
	});

	return new StringSelectMenuBuilder()
		.setCustomId(ORDER_TYPE_SELECT_MENU_ID)
		.setPlaceholder("Что сегодня заказываем?")
		.setMinValues(1)
		.setMaxValues(1)
		.addOptions(orderTypeOptions);
}
