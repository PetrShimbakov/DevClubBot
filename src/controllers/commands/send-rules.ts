import { ChatInputCommandInteraction } from "discord.js";
import { isNewsOrTextChannel } from "../../utils/channel-utils";
import { safeReply } from "../../utils/reply-utils";
import errorMessages from "../../views/messages/error-messages";
import messages from "../../views/messages/messages";
import successMessages from "../../views/messages/success-messages";

export default async function sendRules(interaction: ChatInputCommandInteraction) {
	const channel = interaction.options.getChannel("target-channel");
	if (!isNewsOrTextChannel(channel)) return safeReply(interaction, errorMessages.notTextChannel);

	await channel.send(messages.rules);
	await safeReply(interaction, successMessages.rulesSent(channel.id));
}
