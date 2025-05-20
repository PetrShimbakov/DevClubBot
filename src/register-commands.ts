import { REST } from "discord.js";
import slashCommands from "./commands/slash-commands";
import config from "./config";
import contextMenuCommands from "./commands/context-menu-commands";
import { CommandsBuilder } from "./commands/commands-builder";

const rest = new REST().setToken(config.bot.token);
const commands = CommandsBuilder.combine(slashCommands, contextMenuCommands);

console.log(`Commands Started refreshing ${commands.commandsCollection.size} commands.`);

commands
	.register(rest)
	.then(data => {
		console.log(`Commands Successfully refreshed ${Array.isArray(data) ? data.length : ""} commands.`);
	})
	.catch(error => {
		console.error(`Error while registering commands: ${error instanceof Error ? error.message : "Unknown error."}`);
	});
