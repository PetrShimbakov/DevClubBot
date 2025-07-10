import { Events } from "discord.js";
import client from "../client";
import ordersData from "../models/orders-data";
import usersData from "../models/users-data";

export default function handleMemberRemove() {
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
