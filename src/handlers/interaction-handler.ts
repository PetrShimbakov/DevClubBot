import { Client, Events } from "discord.js";
import { handleCommand } from "../controllers/commands-controller";
import { handleRoleSelectButton } from "../controllers/roles-controller";
import {
	CREATE_ORDER_BUTTON_ID,
	REMOVE_ORDER_BUTTON_ID,
	ROLE_SELECT_BUTTON_ID,
	UPDATE_BIO_BUTTON_ID,
	UPDATE_BIO_MODAL_ID,
	VIEW_MY_ORDERS_BUTTON_ID
} from "../constants/component-ids";
import { handleUpdateBioButton, handleUpdateBioModal } from "../controllers/bio-update-controller";
import {
	handleCreateOrderButton,
	handleRemoveOrderButton,
	handleViewMyOrdersButton
} from "../controllers/orders-controller";

export default function handleInteractions(client: Client) {
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
				case CREATE_ORDER_BUTTON_ID:
					return handleCreateOrderButton(interaction);
				case VIEW_MY_ORDERS_BUTTON_ID:
					return handleViewMyOrdersButton(interaction);
				default:
					if (interaction.customId.startsWith(REMOVE_ORDER_BUTTON_ID)) return handleRemoveOrderButton(interaction);
					break;
			}
		}
	});
}
