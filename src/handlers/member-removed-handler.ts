import { Events } from "discord.js";
import client from "../client";
import config from "../config";
import ordersData from "../models/orders-data";
import usersData from "../models/users-data";

export default function handleMemberRemove() {
	client.on(Events.GuildMemberRemove, async member => {
		const userId = member.user.id;

		await usersData.handleUserLeftServer(userId).catch(error => {
			console.error(`[member-removed-handler] Failed to remove user '${userId}' from database:`, error);
		});

		try {
			const guild = client.guilds.cache.get(config.guildId) || (await client.guilds.fetch(config.guildId));
			const orders = await ordersData.getOrders(userId);
			for (const order of orders) {
				const channel = guild.channels.cache.get(order.orderChannelId) || (await guild.channels.fetch(order.orderChannelId).catch(() => null));
				if (channel) {
					await channel.delete(`Пользователь вышел с сервера, заказ #${order.orderNumber} удалён`);
				}
			}
		} catch (error) {
			console.error(`[member-removed-handler] Failed to delete order channels of user '${userId}' from guild:`, error);
		}

		await ordersData.removeOrders(userId).catch(error => {
			console.error(`[member-removed-handler] Failed to remove orders of user '${userId}' from database:`, error);
		});

		console.log(`${member.user.tag} left us.`);
	});
}
