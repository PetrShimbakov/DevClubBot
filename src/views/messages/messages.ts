import { ActionRowBuilder, InteractionReplyOptions, MessageCreateOptions, MessageFlags, User } from "discord.js";
import { orderRoles } from "../../constants/orders/order-roles";
import { OrderData, OrderType } from "../../types/order";
import { IUserData } from "../../types/user-data";
import bioUpdateButton from "../buttons/bio";
import { myOrdersListButtons, orderMenuButtons } from "../buttons/orders/orders-manage";
import ordersModerateListButtons from "../buttons/orders/orders-moderate";
import { getOrderTakenButtons, ordersListButtons, viewOrdersListButton } from "../buttons/orders/orders-work";
import roleSelectButton from "../buttons/roles";
import supportButton from "../buttons/support";
import userModerateButtons from "../buttons/user-moderate";
import { getMyOrdersListEmbed, orderMenuEmbed } from "../embeds/orders/orders-manage";
import { getOrderModLogEmbed, getOrdersModerateListEmbed, getUserModLogEmbed } from "../embeds/orders/orders-moderate";
import { getOrdersListEmbed } from "../embeds/orders/orders-work";
import rolesEmbed from "../embeds/roles";
import rulesEmbed from "../embeds/rules";
import supportEmbed from "../embeds/support";
import { getSupportRequestEmbed } from "../embeds/support-request";
import getUserInfoEmbed from "../embeds/user-info";
import getUserModerateEmbed from "../embeds/user-moderate";
import { getOrderTypeSelectMenu } from "../select-menus/orders/orders-manage";
import getRoleSelectMenu from "../select-menus/roles";

class Messages {
	public roleSelection(userId: string, userData?: IUserData): InteractionReplyOptions {
		return {
			content: `<@${userId}>, выберите свою роль.`,
			components: [new ActionRowBuilder().addComponents(getRoleSelectMenu(userData)).toJSON()],
			flags: MessageFlags.Ephemeral,
			withResponse: true
		};
	}

	public supportRequest(userId: string, message: string): MessageCreateOptions {
		return {
			content: "@everyone",
			embeds: [getSupportRequestEmbed(userId, message)]
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

	public ordersList(orderData: OrderData, currentPage: number, pagesQty: number): InteractionReplyOptions {
		return {
			components: [ordersListButtons.toJSON()],
			embeds: [getOrdersListEmbed(orderData, currentPage, pagesQty)],
			flags: MessageFlags.Ephemeral
		};
	}
	public userModerate(user: User, permissions: IUserData["permissions"]): InteractionReplyOptions {
		return {
			components: [userModerateButtons(permissions)],
			embeds: [getUserModerateEmbed(user)],
			flags: MessageFlags.Ephemeral
		};
	}

	public ordersModerateList(orderData: OrderData, currentPage: number, pagesQty: number): InteractionReplyOptions {
		return {
			components: [ordersModerateListButtons.toJSON()],
			embeds: [getOrdersModerateListEmbed(orderData, currentPage, pagesQty)],
			flags: MessageFlags.Ephemeral
		};
	}

	public myOrdersList(orderData: OrderData, currentPage: number, pagesQty: number): InteractionReplyOptions {
		return {
			components: [myOrdersListButtons.toJSON()],
			embeds: [getMyOrdersListEmbed(orderData, currentPage, pagesQty)],
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

	public orderTaken(order: OrderData, userData: IUserData, user: User): MessageCreateOptions {
		return {
			content: `<@${order.orderedBy}>, ваш заказ взял разработчик <@${order.takenBy}>. В этом чате вы можете обсудить детали работы. Когда заказ будет выполнен, нажмите кнопку ниже — после этого чат и вся переписка будут удалены. Ниже вы найдете информацию о разработчике.`,
			components: [getOrderTakenButtons(order.id.toString()).toJSON()],
			embeds: [getUserInfoEmbed(userData, user)]
		};
	}

	public newOrderChannelInfo(order: OrderData): MessageCreateOptions {
		return {
			content: `💼 Это приватный чат для <@${order.orderedBy}> и разработчика. Здесь вы можете обсудить детали заказа, задать любые вопросы, а также получить уведомление, когда ваш заказ возьмут в работу. Чтобы отменить заказ, перейдите в канал <#1272850187882205194>. Этот чат виден только вам, разработчику и модераторам.`
		};
	}

	public userInfo(userData: IUserData, target: User): InteractionReplyOptions {
		return {
			embeds: [getUserInfoEmbed(userData, target)],
			flags: MessageFlags.Ephemeral
		};
	}
	public orderModLog(order: OrderData, moderator: User, success: boolean, withBan: boolean): MessageCreateOptions {
		return {
			content: "@everyone",
			embeds: [getOrderModLogEmbed(order, moderator, success, withBan)]
		};
	}
	public userModLog(user: User, moderator: User, permissionType: keyof IUserData["permissions"], isBan: boolean): MessageCreateOptions {
		return {
			content: "@everyone",
			embeds: [getUserModLogEmbed(user, moderator, permissionType, isBan)]
		};
	}

	public readonly orderMenu: MessageCreateOptions = {
		embeds: [orderMenuEmbed],
		components: [orderMenuButtons.toJSON()]
	};

	public readonly roles: MessageCreateOptions = {
		embeds: [rolesEmbed],
		components: [new ActionRowBuilder().addComponents(roleSelectButton, bioUpdateButton).toJSON()]
	};

	public readonly support: MessageCreateOptions = {
		embeds: [supportEmbed],
		components: [new ActionRowBuilder().addComponents(supportButton).toJSON()]
	};

	public readonly rules: MessageCreateOptions = { embeds: [rulesEmbed] };
}

const messages = new Messages();
export default messages;
