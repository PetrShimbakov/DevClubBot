import {
	ApplicationCommandType,
	ChatInputCommandInteraction,
	ContextMenuCommandBuilder,
	ContextMenuCommandInteraction,
	SlashCommandOptionsOnlyBuilder
} from "discord.js";
import config from "../config";

interface BaseCommand<TData, TInteraction> {
	data: TData;
	execute: (interaction: TInteraction) => Promise<void>;
	requiredRoles: (typeof config.roleIds)[keyof typeof config.roleIds][];
}

type SlashCommand = BaseCommand<SlashCommandOptionsOnlyBuilder, ChatInputCommandInteraction>;
type ContextMenuCommand = BaseCommand<ContextMenuCommandBuilder, ContextMenuCommandInteraction>;
type Command = SlashCommand | ContextMenuCommand;
type CommandMinimum = { type?: ApplicationCommandType; name: string };

export { ContextMenuCommand, SlashCommand, Command, CommandMinimum };
