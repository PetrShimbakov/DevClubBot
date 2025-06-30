import { EmbedBuilder } from "discord.js";
import config from "../../config";
import { OrderData } from "../../types/order";
import { orderEmojis, orderLabels } from "../../constants/order-labels";
import { getDiscordDate } from "../../utils/message-utils";

export default function getOrderInfoEmbed(order: OrderData): EmbedBuilder {
	return new EmbedBuilder()
		.setTitle(`Заказ номер ${order.orderNumber}`)
		.setColor("#816CE0")
		.setFooter({
			text: "Ваш заказ",
			iconURL: config.imageUrls.logo
		})
		.setDescription(
			[
				`**Тип:** ${orderEmojis[order.type]} ${orderLabels[order.type]}`,
				`**Статус:** ${order.isTaken ? "В работе" : "Ожидание отклика"}`,
				`**Дата создания:** ${getDiscordDate(order.createdAt)}`,
				`**Бюджет:** ${order.budget}`,
				`**Описание:** ${order.description}`
			].join("\n")
		);
}
