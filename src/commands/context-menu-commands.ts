import { ApplicationCommandType, ContextMenuCommandBuilder, ContextMenuCommandInteraction, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from "discord.js";
import config from "../config";
import moderateUser from "../controllers/commands/moderate-user";
import sendUserInfo from "../controllers/commands/user-info";
import { ContextMenuCommand } from "../types/commands";
import { CommandsBuilder } from "./commands-builder";

function isUserContextMenu(interaction: ContextMenuCommandInteraction<"cached">): interaction is UserContextMenuCommandInteraction<"cached"> {
	return interaction.commandType === ApplicationCommandType.User;
}

function isMessageContextMenu(interaction: ContextMenuCommandInteraction<"cached">): interaction is MessageContextMenuCommandInteraction<"cached"> {
	return interaction.commandType === ApplicationCommandType.Message;
}

const contextMenuCommands = new CommandsBuilder<ContextMenuCommand>()

	.addCommand(
		new ContextMenuCommandBuilder().setName("Информация пользователя").setType(ApplicationCommandType.User),
		async interaction => {
			if (!isUserContextMenu(interaction)) return;
			await sendUserInfo(interaction);
		},
		Object.values(config.devRoleIds)
	)

	.addCommand(
		new ContextMenuCommandBuilder().setName("Поменять ограничения").setType(ApplicationCommandType.User),
		async interaction => {
			if (!isUserContextMenu(interaction)) return;
			await moderateUser(interaction);
		},
		Object.values(config.devRoleIds)
	);

export default contextMenuCommands;
