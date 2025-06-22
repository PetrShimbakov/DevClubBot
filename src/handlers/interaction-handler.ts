import { Client, Events } from "discord.js";
import { handleCommand } from "../controllers/commands-controller";
import { handleRoleSelectButton } from "../controllers/roles-controller";
import { ROLE_SELECT_BUTTON_ID } from "../constants/component-ids";

export function handleInteractions(client: Client) {
	client.on(Events.InteractionCreate, interaction => {
		if (!interaction.inCachedGuild()) return;
		if (!interaction.member) return; // Recommendation from community.

		if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) handleCommand(interaction);

		if (interaction.isButton() && interaction.customId === ROLE_SELECT_BUTTON_ID) handleRoleSelectButton(interaction);
	});
}
