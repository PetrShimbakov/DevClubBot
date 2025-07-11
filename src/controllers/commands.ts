import {
	ChatInputCommandInteraction,
	ContextMenuCommandInteraction,
	MessageContextMenuCommandInteraction,
	UserContextMenuCommandInteraction
} from "discord.js";
import { CommandsBuilder } from "../commands/commands-builder";
import contextMenuCommands from "../commands/context-menu-commands";
import slashCommands from "../commands/slash-commands";
import { COMMANDS_RATE_LIMIT } from "../constants/rate-limits";
import { Command } from "../types/commands";
import rateLimit from "../utils/rate-limit";
import { safeReply } from "../utils/reply-utils";
import errorMessages from "../views/messages/error-messages";

type CommandHandlerInteraction =
	| ChatInputCommandInteraction<"cached">
	| UserContextMenuCommandInteraction<"cached">
	| MessageContextMenuCommandInteraction<"cached">;

export const handleCommand = rateLimit<CommandHandlerInteraction>(COMMANDS_RATE_LIMIT)(function (
	interaction: CommandHandlerInteraction
) {
	const commands: CommandsBuilder<Command> = CommandsBuilder.combine(slashCommands, contextMenuCommands);
	const command = commands.getCommand(interaction.commandName, interaction.commandType);

	if (!command) {
		const commandKey = `${interaction.commandName}:${interaction.commandType}`;
		console.error(`[commands-controller] Failed to execute command "${commandKey}": Command not found.`);
		return safeReply(interaction, errorMessages.commandNotFound);
	}

	const hasRequiredRoles = command.requiredRoles.some(roleId => interaction.member.roles.cache.has(roleId));

	const isGuildOwner = interaction.user.id === interaction.guild.ownerId;

	if (!hasRequiredRoles && !isGuildOwner) return safeReply(interaction, errorMessages.noRights);

	command.execute(interaction as ChatInputCommandInteraction & ContextMenuCommandInteraction).catch(error => {
		console.error(`[commands-controller] Failed to execute command "${command.data.name}":`, error);
		safeReply(interaction, errorMessages.unknown);
	});
});
