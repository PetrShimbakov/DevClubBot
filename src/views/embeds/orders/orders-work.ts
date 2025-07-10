import { EmbedBuilder } from "discord.js";
import { orderEmojis, orderLabels } from "../../../constants/orders/order-labels";
import { OrderData } from "../../../types/order";
import { getDiscordDate } from "../../../utils/message-utils";

export function getOrdersListEmbed(order: OrderData, currentPage: number, pagesQty: number) {
	return new EmbedBuilder()
		.setTitle("Заказы")
		.setColor("#816CE0")
		.setFooter({
			text: `📄 Страница ${currentPage} из ${pagesQty}.`
		})
		.setDescription(
			[
				`**Тип:** ${orderEmojis[order.type]} ${orderLabels[order.type]}`,
				`**Автор:** <@${order.userDiscordId}>`,
				`**Дата создания:** ${getDiscordDate(order.createdAt)}`,
				`**Бюджет:** ${order.budget}`,
				`**Описание:** ${order.description}`
			].join("\n")
		);
}
