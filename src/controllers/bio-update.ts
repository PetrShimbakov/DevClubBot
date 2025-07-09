import { ButtonInteraction, ModalSubmitInteraction } from "discord.js";
import getBioUpdateModal from "../views/modals/bio";
import usersData from "../models/users-data";
import { safeReply } from "../utils/reply-utils";
import errorMessages from "../views/messages/error-messages";
import { UPDATE_BIO_INPUT_ID } from "../constants/component-ids";
import successMessages from "../views/messages/success-messages";
import rateLimit from "../utils/rate-limit";
import { UPDATE_BIO_BUTTON_RATE_LIMIT, UPDATE_BIO_MODAL_RATE_LIMIT } from "../constants/rate-limits";

export const handleUpdateBioButton = rateLimit<ButtonInteraction<"cached">>(UPDATE_BIO_BUTTON_RATE_LIMIT)(
	async function handleUpdateBioButton(interaction: ButtonInteraction<"cached">) {
		try {
			const userData = await usersData.getUser(interaction.user.id);
			if (!userData) return safeReply(interaction, errorMessages.notRegistered);
			await interaction.showModal(getBioUpdateModal(userData.bio));
		} catch (error) {
			console.error("[bio-update-controller] Unknown error:", error);
			safeReply(interaction, errorMessages.unknown);
		}
	}
);

export const handleUpdateBioModal = rateLimit<ModalSubmitInteraction<"cached">>(UPDATE_BIO_MODAL_RATE_LIMIT)(async function (
	interaction: ModalSubmitInteraction<"cached">
) {
	try {
		const userInput = interaction.fields.getTextInputValue(UPDATE_BIO_INPUT_ID);
		if (userInput.length > 300) return safeReply(interaction, errorMessages.tooLongBio(300));
		await usersData.updateBio(interaction.user.id, userInput);
		await safeReply(interaction, successMessages.bioUpdated);
	} catch (error) {
		console.error("[bio-update-controller] Unknown error:", error);
		safeReply(interaction, errorMessages.unknown);
	}
});
