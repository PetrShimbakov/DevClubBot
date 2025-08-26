import { EmbedBuilder } from "discord.js";
import config from "../../../config";
import { orderEmojis, orderLabels } from "../../../constants/orders/order-labels";
import { OrderData } from "../../../types/order";
import { getDiscordDate } from "../../../utils/message-utils";

export const orderMenuEmbed = new EmbedBuilder()
	.setTitle("Заказ контента")
	.setThumbnail(config.imageUrls.logo)
	.setColor("#816CE0")
	.setFooter({
		text: "Спасибо, что пользуетесь нашим сервисом!",
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
				"- Все финансовые вопросы решаются напрямую между вами и исполнителем.\n" +
				"- Пожалуйста, будьте внимательны: мы стараемся предотвращать мошенничество, но полностью исключить риски невозможно.\n" +
				"- Администрация сервера не несёт ответственности за действия других участников.\n" +
				"- Если вы заметили проблему или нарушение — сообщите об этом в канале <#1388776609351209040>.\n" +
				"- Заказом считается только предложение с гарантированной денежной оплатой. Все прочие варианты (поиск партнёров, сотрудничество, доля с прибыли и т. п.) заказами не являются. Размещение их как заказов считается ложным заказом и может привести к наказанию.\n" +
				"- Оформляя заказ, вы подтверждаете согласие с нашими условиями использования."
		}
	);

export function getMyOrdersListEmbed(order: OrderData, currentPage: number, pagesQty: number) {
	return new EmbedBuilder()
		.setTitle(`Ваш заказ номер ${order.orderNumber}`)
		.setColor("#816CE0")
		.setFooter({
			text: `📄 Страница ${currentPage} из ${pagesQty}.`
		})
		.setDescription(
			[
				`**Тип:** ${orderEmojis[order.type]} ${orderLabels[order.type]}`,
				`**Статус:** ${order.isTaken ? "В работе" : "Ожидание отклика"}`,
				`**Дата создания:** ${getDiscordDate(order.createdAt)}`,
				`**Бюджет:** ${order.budget}`,
				`**Чат заказа:** <#${order.orderChannelId}>`,
				`**Описание:** ${order.description}`
			].join("\n")
		);
}
