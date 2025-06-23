import { ActionRowBuilder, ChatInputCommandInteraction } from "discord.js";
import { safeReply } from "../../utils/reply-utils";
import errorMessages from "../../views/messages/error-messages";
import { isNewsOrTextChannel } from "../../utils/channel-utils";
import successMessages from "../../views/messages/success-messages";
import rolesEmbed from "../../views/embeds/roles";
import roleSelectButton from "../../views/buttons/roles";

export default async function sendRoles(interaction: ChatInputCommandInteraction) {
	const channel = interaction.options.getChannel("target-channel");
	if (!isNewsOrTextChannel(channel)) return safeReply(interaction, errorMessages.notTextChannel);

	await channel.send({
		embeds: [rolesEmbed],
		components: [new ActionRowBuilder().addComponents(roleSelectButton).toJSON()]
	});

	await safeReply(interaction, successMessages.rolesSent(channel.id));
}
