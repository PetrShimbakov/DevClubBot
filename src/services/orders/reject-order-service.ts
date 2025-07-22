import { ChannelType } from "discord.js";
import client from "../../client";
import config from "../../config";
import ordersData from "../../models/orders-data";
import { OrderData } from "../../types/order";
import { sendOrder } from "./send-order-service";

export async function rejectOrder(orderData: OrderData) {
	const guild = client.guilds.cache.get(config.guildId) || (await client.guilds.fetch(config.guildId));
	const channel = guild.channels.cache.get(orderData.orderChannelId) || (await guild.channels.fetch(orderData.orderChannelId));

	if (!channel || channel.type !== ChannelType.GuildText) throw new Error(`reject-order-service: Order channel not found. Channel ID: ${orderData.orderChannelId}`);
	if (!orderData.takenBy || !orderData.isTaken) throw new Error(`reject-order-service: Order is not taken: ${orderData.orderChannelId}`);

	try {
		await (channel as any).permissionOverwrites.edit(orderData.takenBy, {
			ViewChannel: false,
			SendMessages: false,
			AttachFiles: false,
			ReadMessageHistory: false
		});

		await ordersData.rejectOrder(orderData.id);

		if (orderData.orderTakenMessageId) {
			await channel.messages
				.fetch(orderData.orderTakenMessageId)
				.then(msg => msg.delete())
				.catch(err => console.error("[reject-order-service] Failed to remove orderTakenMessage:", err));
		}

		sendOrder(orderData.type);
	} catch (err) {
		try {
			await (channel as any).permissionOverwrites.edit(orderData.takenBy, {
				ViewChannel: true,
				SendMessages: true,
				AttachFiles: true,
				ReadMessageHistory: true
			});

			await ordersData.takeOrder(orderData.id, orderData.takenBy);
		} catch (error) {
			console.error("[reject-order-service] Failed to revert order reject after rejectOrder error:", err);
		}
		throw err;
	}
}
