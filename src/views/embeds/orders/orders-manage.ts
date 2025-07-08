import { EmbedBuilder } from "discord.js";
import config from "../../../config";
import { OrderData } from "../../../types/order";
import { orderEmojis, orderLabels } from "../../../constants/orders/order-labels";
import { getDiscordDate } from "../../../utils/message-utils";

export const orderMenuEmbed = new EmbedBuilder()
	.setTitle("Заказ контента")
	.setThumbnail(config.imageUrls.logo)
	.setColor("#816CE0")
	.setFooter({
		text: "Ложные заказы — блокировка аккаунта.",
		iconURL: config.imageUrls.logo
	})
	.addFields(
		{
			name: "Как это работает?",
			value:
				"Всё максимально просто, вы заполняете небольшую анкету и отправляете заказ. После этого он сразу появляется на сервере, и свободные разработчики смогут его увидеть и взять в работу. Вам останется только немного подождать!"
		},
		{
			name: "Важная информация",
			value:
				"- Мы не предоставляем встроенную систему оплаты, поэтому все денежные вопросы вы решаете самостоятельно.\n" +
				"- Будьте внимательны и осторожны — хотя мы активно следим за мошенниками, полностью исключить риски невозможно.\n" +
				"- Мы не можем нести ответственность за действия других людей на сервере.\n" +
				"- О проблеме или нарушении можно сообщить в канале <#1388776609351209040>.\n" +
				"- Продолжая оформление заказа, вы соглашаетесь с нашими условиями использования."
		}
	);

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
