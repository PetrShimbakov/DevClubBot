import { Client, Events } from "discord.js";
import usersData from "../models/users-data";
import ordersData from "../models/orders-data";

export default function handleMemberRemove(client: Client) {
	client.on(Events.GuildMemberRemove, async member => {
		const userId = member.user.id;

		await usersData.removeUser(userId).catch(error => {
			console.error(`[member-removed-handler] Failed to remove user '${userId}' from database:`, error);
		});

		await ordersData.removeOrders(userId).catch(error => {
			console.error(`[member-removed-handler] Failed to remove orders of user '${userId}' from database:`, error);
		});

		console.log(`${member.user.tag} left us.`);
	});
}
