import { ButtonInteraction, ModalSubmitInteraction } from "discord.js";
import getBioUpdateModal from "../views/modals/bio";
import usersData from "../models/users-data";
import { safeReply } from "../utils/reply-utils";
import errorMessages from "../views/messages/error-messages";
import { UPDATE_BIO_INPUT_ID } from "../constants/component-ids";
import successMessages from "../views/messages/success-messages";

export async function handleUpdateBioButton(interaction: ButtonInteraction<"cached">) {
	try {
		const userData = await usersData.getUser(interaction.user.id);
		if (!userData) return safeReply(interaction, errorMessages.notRegistered);
		await interaction.showModal(getBioUpdateModal(userData.bio));
	} catch (error) {
		console.error("[bio-update-controller] Unknown error:", error);
		safeReply(interaction, errorMessages.unknown);
	}
}

export async function handleUpdateBioModal(interaction: ModalSubmitInteraction<"cached">) {
	try {
		const userInput = interaction.fields.getTextInputValue(UPDATE_BIO_INPUT_ID);
		if (userInput.length > 300) return safeReply(interaction, errorMessages.tooLongBio(300));
		await usersData.updateBio(interaction.user.id, userInput);
		await safeReply(interaction, successMessages.bioUpdated);
	} catch (error) {
		console.error("[bio-update-controller] Unknown error:", error);
		safeReply(interaction, errorMessages.unknown);
	}
}
