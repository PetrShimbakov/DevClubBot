import config from "../config";
import { CommandsBuilder } from "./commands-builder";
import {
	ContextMenuCommandBuilder,
	ApplicationCommandType,
	UserContextMenuCommandInteraction,
	ContextMenuCommandInteraction,
	MessageContextMenuCommandInteraction
} from "discord.js";
import { ContextMenuCommand } from "../types/commands";
import sendUserInfo from "../controllers/commands/user-info";

function isUserContextMenu(
	interaction: ContextMenuCommandInteraction<"cached">
): interaction is UserContextMenuCommandInteraction<"cached"> {
	return interaction.commandType === ApplicationCommandType.User;
}

function isMessageContextMenu(
	interaction: ContextMenuCommandInteraction<"cached">
): interaction is MessageContextMenuCommandInteraction<"cached"> {
	return interaction.commandType === ApplicationCommandType.Message;
}

const contextMenuCommands = new CommandsBuilder<ContextMenuCommand>().addCommand(
	new ContextMenuCommandBuilder().setName("Информация пользователя").setType(ApplicationCommandType.User),
	async interaction => {
		if (!isUserContextMenu(interaction)) return;
		await sendUserInfo(interaction);
	},
	Object.values(config.devRoleIds)
);

export default contextMenuCommands;
