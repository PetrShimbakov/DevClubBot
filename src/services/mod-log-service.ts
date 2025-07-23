import { MessageCreateOptions } from "discord.js";
import client from "../client";
import config from "../config";

export async function sendModLog(message: MessageCreateOptions) {
	try {
		const guild = client.guilds.cache.get(config.guildId) || (await client.guilds.fetch(config.guildId));
		const channel = guild.channels.cache.get(config.channels.modLog) || (await guild.channels.fetch(config.channels.modLog));
		if (!channel || !channel.isSendable()) throw new Error("modLog channel is not sendable!");
		channel.send(message);
	} catch (err) {
		console.error("[mod-log-service] Error while sending a moderation log:", err);
	}
}
