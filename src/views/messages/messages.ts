import { ActionRowBuilder, InteractionReplyOptions, MessageCreateOptions, MessageFlags } from "discord.js";
import { IUserData } from "../../types/user-data";
import getRoleSelectMenu from "../select-menus/roles";
import { OrderData, OrderType } from "../../types/order";
import getRemoveOrderButton from "../buttons/orders/orders-manage";
import getOrderInfoEmbed from "../embeds/orders/orders-manage";
import { getOrdersListEmbed } from "../embeds/orders/orders-work";
import { ordersListButtons, viewOrdersListButton } from "../buttons/orders/orders-work";
import { getOrderTypeSelectMenu } from "../select-menus/orders/orders-manage";
import { orderRoles } from "../../constants/orders/order-roles";

class Messages {
	public roleSelection(userId: string, userData?: IUserData): InteractionReplyOptions {
		return {
			content: `<@${userId}>, выберите свою роль.`,
			components: [new ActionRowBuilder().addComponents(getRoleSelectMenu(userData)).toJSON()],
			flags: MessageFlags.Ephemeral,
			withResponse: true
		};
	}

	public orderTypeSelection(userId: string): InteractionReplyOptions {
		return {
			content: `<@${userId}>, выберите что будете заказывать.`,
			components: [new ActionRowBuilder().addComponents(getOrderTypeSelectMenu()).toJSON()],
			flags: MessageFlags.Ephemeral,
			withResponse: true
		};
	}

	public orderInfo(orderData: OrderData): InteractionReplyOptions {
		return {
			components: [new ActionRowBuilder().addComponents(getRemoveOrderButton(orderData.orderNumber)).toJSON()],
			embeds: [getOrderInfoEmbed(orderData)],
			flags: MessageFlags.Ephemeral
		};
	}

	public ordersList(orderData: OrderData, currentPage: number, pagesQty: number): InteractionReplyOptions {
		return {
			components: [ordersListButtons.toJSON()],
			embeds: [getOrdersListEmbed(orderData, currentPage, pagesQty)],
			flags: MessageFlags.Ephemeral
		};
	}

	public newOrder(orderType: OrderType): MessageCreateOptions {
		const pings = orderRoles[orderType].map(roleId => `<@&${roleId}>`).join(", ");

		return {
			content: `🆕 ${pings}, у вас новый заказ! Нажмите кнопку ниже, чтобы увидеть все доступные вам заказы. Не затягивайте — кто-то может успеть взять заказ раньше!`,
			components: [new ActionRowBuilder().addComponents(viewOrdersListButton).toJSON()]
		};
	}
}

const messages = new Messages();
export default messages;
