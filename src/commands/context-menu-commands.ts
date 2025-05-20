import config from "../config";
import { CommandsBuilder } from "./commands-builder";
import { Interaction, ContextMenuCommandBuilder, ApplicationCommandType } from "discord.js";

const contextMenuCommands = new CommandsBuilder().addCommand(
	new ContextMenuCommandBuilder().setName("Информация пользователя.").setType(ApplicationCommandType.User),
	async (interaction: Interaction) => {
		throw new Error("В разработке");
	},
	[config.roleIds.member, config.roleIds.administrator]
);

export default contextMenuCommands;
