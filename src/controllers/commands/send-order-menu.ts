import { ChatInputCommandInteraction } from "discord.js";
import { safeReply } from "../../utils/reply-utils";
import errorMessages from "../../views/messages/error-messages";
import { isNewsOrTextChannel } from "../../utils/channel-utils";
import successMessages from "../../views/messages/success-messages";
import orderMenuEmbed from "../../views/embeds/order-menu";
import orderMenuButtons from "../../views/buttons/order-menu";

export default async function sendOrderMenu(interaction: ChatInputCommandInteraction) {
	const channel = interaction.options.getChannel("target-channel");
	if (!isNewsOrTextChannel(channel)) return safeReply(interaction, errorMessages.notTextChannel);

	await channel.send({ embeds: [orderMenuEmbed], components: [orderMenuButtons.toJSON()] });
	await safeReply(interaction, successMessages.orderMenuSent(channel.id));
}
