import { ChannelType, User } from "discord.js";
import client from "../../client";
import config from "../../config";
import ordersData from "../../models/orders-data";
import { OrderData } from "../../types/order";
import { IUserData } from "../../types/user-data";
import messages from "../../views/messages/messages";

export async function takeOrder(orderData: OrderData, userData: IUserData, user: User) {
	await ordersData.takeOrder(orderData.id, userData.discordId);

	const guild = client.guilds.cache.get(config.guildId) || (await client.guilds.fetch(config.guildId));
	const channel = guild.channels.cache.get(orderData.orderChannelId) || (await guild.channels.fetch(orderData.orderChannelId));
	const orderId = orderData.id;
	const takenOrderData = await ordersData.getOrder(orderId);

	if (!takenOrderData) throw new Error("take-order-service: Order not found in database.");
	if (!channel || channel.type !== ChannelType.GuildText)
		throw new Error(`take-order-service: Channel for order ${orderId} not found or is not a text channel. Channel: ${channel?.id ?? "undefined"}, Type: ${channel?.type ?? "undefined"}`);

	try {
		await channel.permissionOverwrites.edit(takenOrderData.takenBy as string, {
			ViewChannel: true,
			SendMessages: true,
			AttachFiles: true,
			ReadMessageHistory: true
		});

		const res = await channel.send(messages.orderTaken(takenOrderData, userData));
		await ordersData.setOrderTakenMessageId(orderId, res.id);
	} catch (err) {
		try {
			await ordersData.rejectOrder(orderId);

			await channel.permissionOverwrites.edit(takenOrderData.takenBy as string, {
				ViewChannel: false,
				SendMessages: false,
				AttachFiles: false,
				ReadMessageHistory: false
			});
			const currentOrderData = await ordersData.getOrder(orderId);
			if (currentOrderData?.orderTakenMessageId) {
				await channel.messages
					.fetch(currentOrderData.orderTakenMessageId)
					.then(msg => msg.delete())
					.catch(err => console.error(`[take-order-service] Failed to remove orderTakenMessage after revert for order ${orderId}:`, err));
				await ordersData.unsetOrderTakenMessageId(orderId);
			}
		} catch (err) {
			console.error("[take-order-service] Failed to revert channel permissions after takeOrder error:", err);
		}
		throw err;
	}
}
