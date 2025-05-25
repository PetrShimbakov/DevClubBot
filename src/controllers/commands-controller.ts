import { ChatInputCommandInteraction, Client, Events, Interaction, ContextMenuCommandInteraction } from "discord.js";
import slashCommands from "../commands/slash-commands";
import contextMenuCommands from "../commands/context-menu-commands";
import { CommandsBuilder } from "../commands/commands-builder";
import errorMessages from "../views/messages/error-messages";
import { safeReply } from "../utils/reply-utils";
import { Command, SlashCommand } from "../commands/types/commands.types";

export function initializeCommandsController(client: Client) {
	const commands: CommandsBuilder<Command> = CommandsBuilder.combine(slashCommands, contextMenuCommands);

	client.on(Events.InteractionCreate, interaction => {
		if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand()) return;
		if (!interaction.inCachedGuild()) return;
		if (!interaction.member) return; // Recommendation from community.

		const command = commands.commandsCollection.get(interaction.commandName);
		if (!command) return;

		const hasRequiredRoles = command.requiredRoles.some(roleId => interaction.member.roles.cache.has(roleId));
		const isGuildOwner = interaction.user.id === interaction.guild.ownerId;

		if (!hasRequiredRoles && !isGuildOwner) return safeReply(interaction, errorMessages.noRights);

		command.execute(interaction as ChatInputCommandInteraction & ContextMenuCommandInteraction).catch(error => {
			safeReply(interaction, errorMessages.unknown);
			console.error(
				`[commands-controller] Error while executing command: ${error instanceof Error ? error.message : "Unknown error."}`
			);
		});
	});
}
