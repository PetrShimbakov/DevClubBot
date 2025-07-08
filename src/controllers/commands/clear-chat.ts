import { ChatInputCommandInteraction } from "discord.js";
import { safeReply } from "../../utils/reply-utils";
import successMessages from "../../views/messages/success-messages";

export default async function clearChat(interaction: ChatInputCommandInteraction<"cached">) {
	const amount = interaction.options.getNumber("amount");
	if (typeof amount !== "number" || amount > 100 || amount < 1) return;
	if (!interaction.channel) return;

	await interaction.channel.bulkDelete(amount, true);

	await safeReply(interaction, successMessages.messagesCleared(amount));
}
