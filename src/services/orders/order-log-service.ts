import { MessageCreateOptions } from "discord.js";
import client from "../../client";
import config from "../../config";

export async function sendOrderLog(message: MessageCreateOptions) {
	try {
		const guild = client.guilds.cache.get(config.guildId) || (await client.guilds.fetch(config.guildId));
		const channel = guild.channels.cache.get(config.channels.orderLog) || (await guild.channels.fetch(config.channels.orderLog));
		if (!channel || !channel.isSendable()) throw new Error("order-log-service: channel is not sendable!");
		await channel.send(message);
	} catch (err) {
		console.error("[order-log-service] Error while sending a order log:", err);
	}
}
