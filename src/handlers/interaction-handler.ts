import { Events } from "discord.js";
import client from "../client";
import {
	CREATE_ORDER_BUTTON_ID,
	ORDER_DONE_BUTTON_ID,
	ORDER_REJECT_BUTTON_ID,
	ROLE_SELECT_BUTTON_ID,
	SUPPORT_BUTTON_ID,
	SUPPORT_MODAL_ID,
	UPDATE_BIO_BUTTON_ID,
	UPDATE_BIO_MODAL_ID,
	VIEW_MY_ORDERS_BUTTON_ID
} from "../constants/component-ids";
import { handleUpdateBioButton, handleUpdateBioModal } from "../controllers/bio-update";
import { handleCommand } from "../controllers/commands";
import { handleCreateOrderButton, handleViewMyOrdersListButton } from "../controllers/orders/orders-manage";
import { handleOrderDoneButton, handleOrderRejectButton, handleViewOrdersListButton } from "../controllers/orders/orders-work";
import { handleRoleSelectButton } from "../controllers/roles";
import { handleSupportButton, handleSupportModal } from "../controllers/support";
import { VIEW_ORDERS_LIST_BUTTON_ID } from "./../constants/component-ids";

export default function handleInteractions() {
	client.on(Events.InteractionCreate, interaction => {
		if (!interaction.inCachedGuild()) return;
		if (!interaction.member) return; // Recommendation from community.

		if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) return handleCommand(interaction);

		if (interaction.isModalSubmit()) {
			switch (interaction.customId) {
				case UPDATE_BIO_MODAL_ID:
					return handleUpdateBioModal(interaction);
				case SUPPORT_MODAL_ID:
					return handleSupportModal(interaction);
				default:
					break;
			}
		}

		if (interaction.isButton()) {
			switch (interaction.customId) {
				case ROLE_SELECT_BUTTON_ID:
					return handleRoleSelectButton(interaction);
				case UPDATE_BIO_BUTTON_ID:
					return handleUpdateBioButton(interaction);
				case SUPPORT_BUTTON_ID:
					return handleSupportButton(interaction);
				case CREATE_ORDER_BUTTON_ID:
					return handleCreateOrderButton(interaction);
				case VIEW_MY_ORDERS_BUTTON_ID:
					return handleViewMyOrdersListButton(interaction);
				case VIEW_ORDERS_LIST_BUTTON_ID:
					return handleViewOrdersListButton(interaction);
				default:
					if (interaction.customId.startsWith(ORDER_DONE_BUTTON_ID)) return handleOrderDoneButton(interaction);
					if (interaction.customId.startsWith(ORDER_REJECT_BUTTON_ID)) return handleOrderRejectButton(interaction);
					break;
			}
		}
	});
}
