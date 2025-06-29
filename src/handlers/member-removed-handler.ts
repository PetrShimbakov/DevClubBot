import { Client, Events } from "discord.js";
import usersData from "../models/users-data";

export default function handleMemberRemove(client: Client) {
	client.on(Events.GuildMemberRemove, member => {
		const userId = member.user.id;
		usersData
			.removeUser(userId)
			.catch(error => console.error(`[member-removed-handler] Failed to remove user '${userId}' from data base:`, error));
		console.log(`${member.user.tag} left us.`);
	});
}
