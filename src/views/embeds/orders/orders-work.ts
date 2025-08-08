import { EmbedBuilder } from "discord.js";
import config from "../../../config";
import { orderEmojis, orderLabels } from "../../../constants/orders/order-labels";
import { OrderData } from "../../../types/order";
import { IUserData } from "../../../types/user-data";
import { getDiscordDate, getUserInfoString } from "../../../utils/message-utils";

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
				`**Автор:** <@${order.orderedBy}>`,
				`**Дата создания:** ${getDiscordDate(order.createdAt)}`,
				`**Бюджет:** ${order.budget}`,
				`**Описание:** ${order.description}`
			].join("\n")
		);
}

export function getOrderInfoEmbed(order: OrderData) {
	return new EmbedBuilder()
		.setTitle("Сводная информация об заказе:")
		.setColor("#816CE0")
		.setFooter({
			text: "Roblox Developer Club",
			iconURL: config.imageUrls.logo
		})
		.setTimestamp()
		.setImage(config.imageUrls.banner)
		.setDescription(
			[
				`**Номер:** ${order.orderNumber}`,
				`**Автор:** <@${order.orderedBy}>`,
				order.isTaken && `**Исполнитель: <@${order.takenBy}>**`,
				`**Тип:** ${orderEmojis[order.type]} ${orderLabels[order.type]}`,
				`**Описание:** ${order.description}`,
				`**Бюджет:** ${order.budget}`,
				`**Дата создания:** ${getDiscordDate(order.createdAt)}`
			]
				.filter(Boolean)
				.join("\n")
		);
}

export function getOrderCreatedEmbed(order: OrderData) {
	return new EmbedBuilder()
		.setTitle(`Чат заказа №${order.orderNumber}`)
		.setColor("#816CE0")
		.setDescription(
			"Это приватный чат, созданный специально для вашего заказа. Сюда будет добавлен разработчик, который возьмёт ваш заказ в работу. В этом чате вы можете обсудить детали, задать вопросы и получить уведомление о начале выполнения. Чтобы отменить заказ, перейдите в канал <#1272850187882205194>."
		)
		.addFields(
			{
				name: "Подробности заказа:",
				value: [
					`Тип: ${orderEmojis[order.type]} ${orderLabels[order.type]}`,
					`Автор: <@${order.orderedBy}>`,
					`Дата создания: ${getDiscordDate(order.createdAt)}`,
					`Бюджет: ${order.budget}`,
					`Описание: ${order.description}`
				].join("\n")
			},
			{
				name: "Предупреждение:",
				value: "- Этот чат может быть сохранен и доступ к транскрипции и самому чату может иметь модерация.\n" + "- Просим быть особо осторожными при отправке чувствительной информации"
			}
		);
}

export function getOrderTakenEmbed(developerData: IUserData) {
	return new EmbedBuilder()
		.setTitle(`Информация взятия заказа`)
		.setColor("#816CE0")
		.setDescription("Когда заказ будет выполнен, нажмите кнопку ниже — после этого чат и вся переписка будут удалены.")
		.addFields({
			name: "Информация об разработчике взявшем этот заказ:",
			value: getUserInfoString(developerData)
		});
}
