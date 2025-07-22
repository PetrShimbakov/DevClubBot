import { EmbedBuilder } from "discord.js";
import { orderEmojis, orderLabels } from "../../../constants/orders/order-labels";
import { OrderData } from "../../../types/order";
import { getDiscordDate } from "../../../utils/message-utils";

export function getOrdersModerateListEmbed(order: OrderData, currentPage: number, pagesQty: number) {
	return new EmbedBuilder()
		.setTitle(`Ваш заказ номер ${order.orderNumber}`)
		.setColor("#816CE0")
		.setFooter({
			text: `📄 Страница ${currentPage} из ${pagesQty}.`
		})
		.setDescription(
			[
				`**Номер:** ${order.orderNumber}`,
				`**ID:** ${order.id}`,
				`**Тип:** ${orderEmojis[order.type]} ${orderLabels[order.type]}`,
				`**Статус:** ${order.isTaken ? "В работе" : "Ожидание отклика"}`,
				order.isTaken && `**Взял: ${order.takenBy}**`,
				`**Дата создания:** ${getDiscordDate(order.createdAt)}`,
				`**Бюджет:** ${order.budget}`,
				`**Чат заказа:** <#${order.orderChannelId}>`,
				`**Описание:** ${order.description}`
			].join("\n")
		);
}
