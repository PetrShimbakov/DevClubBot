import { EmbedBuilder, User } from "discord.js";
import { orderEmojis, orderLabels } from "../../../constants/orders/order-labels";
import { OrderData } from "../../../types/order";
import { IUserData } from "../../../types/user-data";
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
				`**Заказал:** <@${order.orderedBy}>`,
				`**Тип:** ${orderEmojis[order.type]} ${orderLabels[order.type]}`,
				`**Статус:** ${order.isTaken ? "В работе" : "Ожидание отклика"}`,
				order.isTaken && `**Взял: <@${order.takenBy}>**`,
				`**Дата создания:** ${getDiscordDate(order.createdAt)}`,
				`**Бюджет:** ${order.budget}`,
				`**Чат заказа:** <#${order.orderChannelId}>`,
				`**Описание:** ${order.description}`
			]
				.filter(Boolean)
				.join("\n")
		);
}

export function getOrderModLogEmbed(order: OrderData, moderator: User, success: boolean, withBan: boolean) {
	return new EmbedBuilder()
		.setTitle(`Модератор ${moderator.displayName} словил фраера!`)
		.setColor("#816CE0")

		.addFields(
			{
				name: "📦 Подробности заказа:",
				value: [
					`**Номер:** ${order.orderNumber}`,
					`**ID:** ${order.id}`,
					`**Заказал:** <@${order.orderedBy}>`,
					`**Тип:** ${orderEmojis[order.type]} ${orderLabels[order.type]}`,
					`**Статус:** ${order.isTaken ? "В работе" : "Ожидание отклика"}`,
					order.isTaken && `**Взял: <@${order.takenBy}>**`,
					`**Дата создания:** ${getDiscordDate(order.createdAt)}`,
					`**Бюджет:** ${order.budget}`,
					`**Чат заказа:** <#${order.orderChannelId}>`,
					`**Описание:** ${order.description}`
				]
					.filter(Boolean)
					.join("\n")
			},
			{
				name: "⚖️ Подробности наказания:",
				value: [
					`**Наказал:** <@${moderator.id}>`,
					`**Успешно:** ${success ? "да" : "нет (требуется вмешательство)"}`,
					`**Наказание:** ${withBan ? "Удаление заказа и блокировка к созданию заказов." : "Удаление заказа"}`,
					`**Дата наказания:** ${getDiscordDate(new Date())}`
				].join("\n")
			}
		);
}

export function getUserModLogEmbed(user: User, moderator: User, permissionType: keyof IUserData["permissions"], isBan: boolean) {
	const permissionTypeLabels: Record<keyof IUserData["permissions"], string> = {
		canCreateOrders: "создание заказов",
		canWriteSupport: "поддержка",
		canTakeOrders: "взятие заказов"
	};

	if (isBan)
		return new EmbedBuilder()
			.setTitle(`Фраера опять заблокировали!`)
			.setColor("#816CE0")
			.setTimestamp()
			.setDescription([`**Заблокировал:** <@${moderator.id}>`, `**Фраер:** <@${user.id}>`, `**Блокировка:** ${permissionTypeLabels[permissionType]}`].filter(Boolean).join("\n"));
	else
		return new EmbedBuilder()
			.setTitle(`Была снята блокировка!`)
			.setColor("#816CE0")
			.setTimestamp()
			.setDescription([`**Снял:** <@${moderator.id}>`, `**Помилованный:** <@${user.id}>`, `**Блокировка:** ${permissionTypeLabels[permissionType]}`].filter(Boolean).join("\n"));
}

export function getOrderClosedLogEmbed(order: OrderData, closedBy: string) {
	return new EmbedBuilder()
		.setTitle(`Заказ №${order.orderNumber} закрыт`)
		.setColor("#816CE0")

		.addFields(
			{
				name: "📦 Подробности заказа:",
				value: [
					`**Номер:** ${order.orderNumber}`,
					`**ID:** ${order.id}`,
					`**Заказал:** <@${order.orderedBy}>`,
					`**Тип:** ${orderEmojis[order.type]} ${orderLabels[order.type]}`,
					`**Статус:** ${order.isTaken ? "В работе" : "Ожидание отклика"}`,
					order.isTaken && `**Взял: <@${order.takenBy}>**`,
					`**Дата создания:** ${getDiscordDate(order.createdAt)}`,
					`**Бюджет:** ${order.budget}`,
					`**Чат заказа:** <#${order.orderChannelId}>`,
					`**Описание:** ${order.description}`
				]
					.filter(Boolean)
					.join("\n")
			},
			{
				name: "🏁 Подробности закрытия:",
				value: [`**Закрыл:** <@${closedBy}>`, `**Дата:** ${getDiscordDate(new Date())}`].join("\n")
			}
		);
}
