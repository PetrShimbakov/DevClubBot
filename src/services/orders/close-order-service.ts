import { ChannelType } from "discord.js";
import client from "../../client";
import config from "../../config";
import ordersData from "../../models/orders-data";
import { OrderData } from "../../types/order";
import { safeSendDM } from "../../utils/dm-utils";
import messages from "../../views/messages/messages";
import { archiveOrderChat } from "./order-archive-service";
import { sendOrderLog } from "./order-log-service";

export async function closeOrder(orderData: OrderData, closedBy: string) {
	let channelDeleted = false;

	try {
		const guild = client.guilds.cache.get(config.guildId) || (await client.guilds.fetch(config.guildId));
		const channel = guild.channels.cache.get(orderData.orderChannelId) || (await guild.channels.fetch(orderData.orderChannelId));

		if (channel && channel.type === ChannelType.GuildText) {
			await archiveOrderChat(channel, orderData);
			await channel.delete(`Заказ был закрыт пользователем ${closedBy}.`);
			channelDeleted = true;
		} else console.warn(`[close-order-service] Channel not found for order ${orderData.id}, will still remove order from DB.`);

		await ordersData.removeOrder(orderData.id);

		const orderClient = await guild.members.fetch(orderData.orderedBy).catch(() => undefined);
		if (orderClient) safeSendDM(orderClient.user, orderData.orderedBy === closedBy ? messages.orderClosedBySelf(orderData) : messages.orderClosedByOther(orderData, closedBy));

		if (orderData.isTaken && orderData.takenBy) {
			const orderDev = await guild.members.fetch(orderData.takenBy).catch(() => undefined);
			if (orderDev) safeSendDM(orderDev.user, orderData.takenBy === closedBy ? messages.orderClosedBySelf(orderData) : messages.orderClosedByOther(orderData, closedBy));
		}

		sendOrderLog(messages.orderClosedLog(orderData, closedBy));
	} catch (err) {
		if (channelDeleted) {
			console.error(`[close-order-service] Channel for order ${orderData.id} deleted, but failed to remove order from DB! MANUAL FIX NEEDED`, err);
		} else {
			console.error(`[close-order-service] Failed to close order ${orderData.id}:`, err);
		}
		throw err;
	}
}
