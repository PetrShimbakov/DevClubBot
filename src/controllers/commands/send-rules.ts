import { ChatInputCommandInteraction } from "discord.js";
import { safeReply } from "../../utils/reply-utils";
import messages from "../../views/messages/messages";
import rulesEmbed from "../../views/embeds/rules";
import errorMessages from "../../views/messages/error-messages";
import { isNewsOrTextChannel } from "../../utils/channel-utils";

async function sendRules(interaction: ChatInputCommandInteraction) {
	const channel = interaction.options.getChannel("target-channel");
	if (!isNewsOrTextChannel(channel)) return safeReply(interaction, errorMessages.notTextChannel);

	await channel.send({ embeds: [rulesEmbed] });
	await safeReply(interaction, messages.rulesSent(channel.id));
}

export default sendRules;
