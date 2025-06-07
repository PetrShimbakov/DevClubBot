import config from "../config";
import { CommandsBuilder } from "./commands-builder";
import { ContextMenuCommandBuilder, ApplicationCommandType } from "discord.js";
import { ContextMenuCommand } from "../types/commands";

const contextMenuCommands = new CommandsBuilder<ContextMenuCommand>();
// .addCommand(
// 	new ContextMenuCommandBuilder().setName("Информация пользователя.").setType(ApplicationCommandType.User),
// 	async interaction => {
// 		throw new Error("В разработке");
// 	},
// 	[config.roleIds.member, config.roleIds.administrator]
// );

export default contextMenuCommands;
