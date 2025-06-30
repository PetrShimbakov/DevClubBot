import { ActionRowBuilder, InteractionReplyOptions, MessageFlags } from "discord.js";
import { IUserData } from "../../types/user-data";
import getRoleSelectMenu from "../select-menus/roles";
import getOrderTypeSelectMenu from "../select-menus/order";
import getRemoveOrderButton from "../buttons/remove-order";
import { OrderData } from "../../types/order";
import getOrderInfoEmbed from "../embeds/order-info";

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
}

const messages = new Messages();
export default messages;
