import client from "../../client";
import config from "../../config";
import ordersData from "../../models/orders-data";
import { OrderData } from "../../types/order";

export async function closeOrder(orderData: OrderData) {
	let channelDeleted = false;

	try {
		const guild = client.guilds.cache.get(config.guildId) || (await client.guilds.fetch(config.guildId));
		const channel = guild.channels.cache.get(orderData.orderChannelId) || (await guild.channels.fetch(orderData.orderChannelId));

		if (channel) {
			await channel.delete();
			channelDeleted = true;
		} else console.warn(`[close-order-service] Channel not found for order ${orderData.id}, will still remove order from DB.`);

		await ordersData.removeOrder(orderData.id);
	} catch (err) {
		if (channelDeleted) {
			console.error(`[close-order-service] Channel for order ${orderData.id} deleted, but failed to remove order from DB! MANUAL FIX NEEDED`, err);
		} else {
			console.error(`[close-order-service] Failed to close order ${orderData.id}:`, err);
		}
		throw err;
	}
}
