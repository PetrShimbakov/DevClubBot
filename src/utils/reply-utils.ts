import { Interaction, InteractionReplyOptions } from "discord.js";

async function unsafeReply(interaction: Interaction, options: InteractionReplyOptions): Promise<void> {
	if (!interaction.isRepliable()) return;

	if (interaction.replied || interaction.deferred) {
		await interaction.followUp(options);
	} else {
		await interaction.reply(options);
	}
}

export async function safeReply(
	interaction: Interaction,
	options: InteractionReplyOptions,
	retries: number = 0
): Promise<void> {
	if (!interaction.isRepliable())
		return console.error("[reply-utils] safeReply can only be used with repliable interactions.");

	for (let _ = 0; _ <= retries; _++) {
		try {
			await unsafeReply(interaction, options);
			break;
		} catch (error) {
			if (error && typeof error === "object" && "code" in error && (error as any).code === 10062) return; // ignore error Unknown interaction

			console.error("[reply-utils] Error while sending a reply:", error);
		}

		await new Promise(resolve => setTimeout(resolve, 1000));
	}
}

export async function safeDeleteReply(interaction: Interaction): Promise<void> {
	try {
		if (!interaction.isRepliable())
			return console.error("[reply-utils] safeDeleteReply can only be used with repliable interactions.");
		if (interaction.deferred || interaction.replied) await interaction.deleteReply();
	} catch (error) {
		if (error && typeof error === "object" && "code" in error && (error as any).code === 10008) return; // ignore error Unknown Message
		console.error("[reply-utils] Error in safeDeleteReply:", error);
	}
}
