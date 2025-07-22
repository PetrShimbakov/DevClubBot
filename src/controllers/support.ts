import { ButtonInteraction, ModalSubmitInteraction } from "discord.js";
import client from "../client";
import config from "../config";
import { SUPPORT_MESSAGE_INPUT_ID } from "../constants/component-ids";
import { SUPPORT_BUTTON_RATE_LIMIT, SUPPORT_MODAL_RATE_LIMIT } from "../constants/rate-limits";
import usersData from "../models/users-data";
import rateLimit from "../utils/rate-limit";
import { safeReply } from "../utils/reply-utils";
import errorMessages from "../views/messages/error-messages";
import messages from "../views/messages/messages";
import successMessages from "../views/messages/success-messages";
import supportModal from "../views/modals/support";

export const handleSupportButton = rateLimit<ButtonInteraction<"cached">>(SUPPORT_BUTTON_RATE_LIMIT)(async function handleUpdateBioButton(interaction: ButtonInteraction<"cached">) {
	try {
		const userData = await usersData.getUser(interaction.user.id);
		if (!userData) return safeReply(interaction, errorMessages.notRegistered);
		await interaction.showModal(supportModal);
	} catch (error) {
		console.error("[support-controller] Unknown error:", error);
		safeReply(interaction, errorMessages.unknown);
	}
});

export const handleSupportModal = rateLimit<ModalSubmitInteraction<"cached">>(SUPPORT_MODAL_RATE_LIMIT)(async function (interaction: ModalSubmitInteraction<"cached">) {
	try {
		const userInput = interaction.fields.getTextInputValue(SUPPORT_MESSAGE_INPUT_ID);
		if (userInput.length > 500) return safeReply(interaction, errorMessages.tooSupportRequest(500));

		const guild = client.guilds.cache.get(config.guildId) || (await client.guilds.fetch(config.guildId));

		const channel = guild.channels.cache.get(config.channels.supportLog) || (await guild.channels.fetch(config.channels.supportLog));

		if (!channel || !channel.isSendable()) throw new Error("supportLog channel is not sendable!");

		await channel.send(messages.supportRequest(interaction.user.id, userInput));

		await safeReply(interaction, successMessages.supportRequestSent);
	} catch (error) {
		console.error("[support-controller] Unknown error:", error);
		safeReply(interaction, errorMessages.unknown);
	}
});
