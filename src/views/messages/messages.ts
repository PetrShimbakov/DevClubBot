import { ActionRowBuilder, AttachmentBuilder, InteractionReplyOptions, MessageCreateOptions, MessageFlags, MessageReplyOptions, User } from "discord.js";
import config from "../../config";
import { confirmActionDescriptions } from "../../constants/confirm-action-descriptions";
import {
	DEFAULT_ORDER_COOLDOWN_LIMIT,
	DEFAULT_ORDER_LIMIT,
	DEFAULT_TAKEN_ORDERS_LIMIT,
	roleOrderCooldownLimits,
	roleOrderLimits,
	roleTakenOrdersLimits
} from "../../constants/orders/order-limits";
import { orderRoles } from "../../constants/orders/order-roles";
import { OrderData, OrderType } from "../../types/order";
import { IUserData } from "../../types/user-data";
import bioUpdateButton from "../buttons/bio";
import confirmActionButtons from "../buttons/confirm-action";
import { myOrdersListButtons, orderMenuButtons } from "../buttons/orders/orders-manage";
import ordersModerateListButtons from "../buttons/orders/orders-moderate";
import { getOrderTakenButtons, ordersListButtons, viewOrdersListButton } from "../buttons/orders/orders-work";
import roleSelectButton from "../buttons/roles";
import supportButton from "../buttons/support";
import userModerateButtons from "../buttons/user-moderate";
import { getConfirmActionEmbed } from "../embeds/confirm-action";
import { getMyOrdersListEmbed, orderMenuEmbed } from "../embeds/orders/orders-manage";
import { getOrderClosedLogEmbed, getOrderModLogEmbed, getOrderRejectedLogEmbed, getOrdersModerateListEmbed, getUserModLogEmbed } from "../embeds/orders/orders-moderate";
import { getOrderCreatedEmbed, getOrderInfoEmbed, getOrdersListEmbed, getOrderTakenEmbed } from "../embeds/orders/orders-work";
import punishmentsEmbed from "../embeds/punishments";
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

	public newOrder(orderType: OrderType, clientUserId: string): MessageCreateOptions {
		const pings = orderRoles[orderType].map(roleId => `<@&${roleId}>`).join(", ");

		return {
			content: `🆕 ${pings}, у вас новый заказ от <@${clientUserId}>! Нажмите кнопку ниже, чтобы увидеть все доступные вам заказы. Не затягивайте — кто-то может успеть взять заказ раньше!`,
			components: [new ActionRowBuilder().addComponents(viewOrdersListButton).toJSON()]
		};
	}

	public orderTaken(order: OrderData, developerData: IUserData): MessageCreateOptions {
		return {
			content: `<@${order.orderedBy}>, ваш заказ взял разработчик <@${order.takenBy}> в работу.`,
			embeds: [getOrderTakenEmbed(developerData)],
			components: [getOrderTakenButtons(order.id.toString()).toJSON()]
		};
	}

	public newOrderChannelInfo(order: OrderData): MessageCreateOptions {
		return {
			content: `<@${order.orderedBy}>`,
			embeds: [getOrderCreatedEmbed(order)]
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

	public confirmAction(interactionId: string, description: keyof typeof confirmActionDescriptions): InteractionReplyOptions {
		return {
			embeds: [getConfirmActionEmbed(description)],
			components: [confirmActionButtons(interactionId)],
			flags: MessageFlags.Ephemeral
		};
	}

	public userModLog(user: User, moderator: User, permissionType: keyof IUserData["permissions"], isBan: boolean): MessageCreateOptions {
		return {
			content: "@everyone",
			embeds: [getUserModLogEmbed(user, moderator, permissionType, isBan)]
		};
	}

	public orderClosedLog(order: OrderData, closedBy: string): MessageCreateOptions {
		return {
			content: "@everyone",
			embeds: [getOrderClosedLogEmbed(order, closedBy)]
		};
	}

	public orderRejectedLog(order: OrderData, rejectedBy: string): MessageCreateOptions {
		return {
			content: "@everyone",
			embeds: [getOrderRejectedLogEmbed(order, rejectedBy)]
		};
	}

	public orderClosedBySelf(order: OrderData): MessageCreateOptions {
		return {
			content: `Вы успешно закрыли заказ №${order.orderNumber}.`,
			embeds: [getOrderInfoEmbed(order)]
		};
	}

	public orderRejected(order: OrderData): MessageCreateOptions {
		return {
			content: `Заказ №${order.orderNumber} был возвращен в статус ожидание отклика, вы больше не работаете над этим заказом.`,
			embeds: [getOrderInfoEmbed(order)]
		};
	}

	public orderClosedByOther(order: OrderData, closedBy: string): MessageCreateOptions {
		return {
			content: `Пользователь <@${closedBy}> закрыл ваш заказ №${order.orderNumber}.`,
			embeds: [getOrderInfoEmbed(order)]
		};
	}

	public orderArchive(orderNumber: number, attachments: AttachmentBuilder[]): MessageCreateOptions {
		return {
			content: `Архив заказа **№${orderNumber}**.`,
			files: attachments
		};
	}

	public orderArchiveAdditionalFiles(orderNumber: number, attachments: AttachmentBuilder[]): MessageReplyOptions {
		return {
			content: `Архив заказа **№${orderNumber}**. Дополнительные файлы.`,
			files: attachments
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

	public readonly punishments: MessageCreateOptions = { embeds: [punishmentsEmbed] };

	public readonly priceList: MessageCreateOptions = {
		content: `# 📋 Прайс-лист сервера

### 👤 Обычный пользователь
**Привилегии:**
1. Возможность одновременно создавать до **${DEFAULT_ORDER_LIMIT}** заказов с кулдауном **${DEFAULT_ORDER_COOLDOWN_LIMIT} минут**.  
2. Возможность одновременно брать до **${DEFAULT_TAKEN_ORDERS_LIMIT}** заказов.  
**Стоимость:** Бесплатно  
**Срок:** Всегда  

### 💎 Донат-роль \`Super Client\`
**Привилегии:** Возможность одновременно создавать до **${roleOrderLimits[config.roleIds.superClient]}** заказов с кулдауном **${
			roleOrderCooldownLimits[config.roleIds.superClient]
		} минут**.  
**Стоимость:** 9 USD | 999 Robux
**Срок:** Роль выдаётся навсегда

### 💻 Донат-роль \`Super Developer\`
**Привилегии:** Возможность одновременно брать до **${roleTakenOrdersLimits[config.roleIds.superDev]}** заказов  
**Стоимость:** 9 USD | 999 Robux
**Срок:** Роль выдаётся навсегда

### 🚀 Донат-роль \`Server Booster\`
**Привилегии:**
1. Возможность одновременно создавать до **${roleOrderLimits[config.roleIds.booster]}** заказов с кулдауном **${roleOrderCooldownLimits[config.roleIds.booster]} минут**.  
2. Возможность одновременно брать до **${roleTakenOrdersLimits[config.roleIds.booster]}** заказов.  
**Стоимость:** Boost этого сервера  
**Срок:** На всё время действия буста


## Для покупки роли пишите в личные сообщения - <@1058787941364797490>
Оплата принимается криптовалютой, PayPal, Robux; другие способы можно уточнить.`
	};
}

const messages = new Messages();
export default messages;
