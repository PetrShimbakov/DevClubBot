import { ChatInputCommandInteraction } from "discord.js";
import { safeReply } from "../../utils/reply-utils";
import rulesEmbed from "../../views/embeds/rules";
import errorMessages from "../../views/messages/error-messages";
import { isNewsOrTextChannel } from "../../utils/channel-utils";
import successMessages from "../../views/messages/success-messages";
import messages from "../../views/messages/messages";

export default async function sendRules(interaction: ChatInputCommandInteraction) {
	const channel = interaction.options.getChannel("target-channel");
	if (!isNewsOrTextChannel(channel)) return safeReply(interaction, errorMessages.notTextChannel);

	await channel.send(messages.rules);
	await safeReply(interaction, successMessages.rulesSent(channel.id));
}
