import { Interaction, InteractionReplyOptions } from "discord.js";

async function unsafeReply(interaction: Interaction, options: InteractionReplyOptions): Promise<void> {
	if (!interaction.isRepliable()) return;

	if (interaction.replied || interaction.deferred) {
		await interaction.followUp(options);
	} else {
		await interaction.reply(options);
	}
}

async function safeReply(interaction: Interaction, options: InteractionReplyOptions, retries: number = 0): Promise<void> {
	if (!interaction.isRepliable()) throw new Error("[reply-utils] safeReply can only be used with repliable interactions.");

	for (let _ = 0; _ <= retries; _++) {
		try {
			await unsafeReply(interaction, options);
			break;
		} catch (error) {
			console.error("[reply-utils] Error while sending a reply:", error);
		}

		await new Promise(resolve => setTimeout(resolve, 1000));
	}
}

export { safeReply };
