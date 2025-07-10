import { REST } from "discord.js";
import { CommandsBuilder } from "./commands/commands-builder";
import contextMenuCommands from "./commands/context-menu-commands";
import slashCommands from "./commands/slash-commands";
import config from "./config";

const rest = new REST().setToken(config.bot.token);
const commands = CommandsBuilder.combine(slashCommands, contextMenuCommands);

console.log(`Commands Started refreshing ${commands.commandsQty} commands.`);

commands
	.register(rest)
	.then(data => {
		console.log(`Commands Successfully refreshed ${Array.isArray(data) ? data.length : ""} commands.`);
	})
	.catch(error => {
		console.error(`Error while registering commands: ${error instanceof Error ? error.message : "Unknown error."}`);
	});
