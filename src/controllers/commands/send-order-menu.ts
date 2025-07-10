import { ChatInputCommandInteraction } from "discord.js";
import { safeReply } from "../../utils/reply-utils";
import errorMessages from "../../views/messages/error-messages";
import { isNewsOrTextChannel } from "../../utils/channel-utils";
import successMessages from "../../views/messages/success-messages";
import { orderMenuButtons } from "../../views/buttons/orders/orders-manage";
import { orderMenuEmbed } from "../../views/embeds/orders/orders-manage";
import messages from "../../views/messages/messages";

export default async function sendOrderMenu(interaction: ChatInputCommandInteraction) {
	const channel = interaction.options.getChannel("target-channel");
	if (!isNewsOrTextChannel(channel)) return safeReply(interaction, errorMessages.notTextChannel);

	await channel.send(messages.orderMenu);
	await safeReply(interaction, successMessages.orderMenuSent(channel.id));
}
