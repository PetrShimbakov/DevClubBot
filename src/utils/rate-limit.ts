import { Interaction } from "discord.js";
import errorMessages from "../views/messages/error-messages";

export default function rateLimit<T extends Interaction = Interaction>(limit: number) {
	const activeSessions = new Map<string, number>();

	setInterval(() => {
		const now = Date.now();
		for (const [userId, lastRequest] of activeSessions.entries()) {
			if (now - lastRequest >= limit) {
				activeSessions.delete(userId);
			}
		}
	}, limit * 4);

	return function (fn: (interaction: T) => any) {
		return function (interaction: T) {
			const userId = interaction.user.id;

			if (!userId) return fn(interaction);

			const lastRequest = activeSessions.get(userId) ?? 0;
			if (Date.now() - lastRequest < limit) {
				if (interaction.isRepliable()) interaction.reply(errorMessages.tooManyRequests).catch(() => {});
				return;
			}

			activeSessions.set(userId, Date.now());
			return fn(interaction);
		};
	};
}
