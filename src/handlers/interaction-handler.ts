import { Client, Events } from "discord.js";
import { handleCommand } from "../controllers/commands-controller";
import { handleRoleSelectButton } from "../controllers/roles-controller";
import { ROLE_SELECT_BUTTON_ID, UPDATE_BIO_BUTTON_ID, UPDATE_BIO_MODAL_ID } from "../constants/component-ids";
import { handleUpdateBioButton, handleUpdateBioModal } from "../controllers/bio-update-controller";

export function handleInteractions(client: Client) {
	client.on(Events.InteractionCreate, interaction => {
		if (!interaction.inCachedGuild()) return;
		if (!interaction.member) return; // Recommendation from community.

		if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) return handleCommand(interaction);

		if (interaction.isModalSubmit() && interaction.customId === UPDATE_BIO_MODAL_ID)
			return handleUpdateBioModal(interaction);

		if (interaction.isButton()) {
			switch (interaction.customId) {
				case ROLE_SELECT_BUTTON_ID:
					return handleRoleSelectButton(interaction);
				case UPDATE_BIO_BUTTON_ID:
					return handleUpdateBioButton(interaction);
			}
		}
	});
}
