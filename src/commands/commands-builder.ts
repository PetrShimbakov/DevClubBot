import { Collection, RESTPostAPIApplicationCommandsJSONBody, Routes, REST } from "discord.js";
import config from "../config";
import { Command } from "./types/commands-types";

export class CommandsBuilder<T extends Command> {
	protected commands = new Collection<string, T>();

	public static combine(...commandsBuilders: CommandsBuilder<Command>[]) {
		const combinedCommandBuilder = new CommandsBuilder();

		commandsBuilders.forEach(commandsBuilder => {
			commandsBuilder.commands.forEach((command, name) => {
				combinedCommandBuilder.addCommand(command.data, command.execute, command.requiredRoles);
			});
		});
		return combinedCommandBuilder;
	}

	public addCommand(data: T["data"], execute: T["execute"], requiredRoles: T["requiredRoles"]): this {
		if (this.commands.has(data.name)) {
			throw new Error(`[commands-builder] Cannot add command ${data.name}: a command with this name already exists.`);
		}

		this.commands.set(data.name, { data, execute, requiredRoles } as T);
		return this;
	}

	public register(rest: REST): Promise<unknown> {
		const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
		this.commands.forEach(command => commands.push(command.data.toJSON()));
		const data = rest.put(Routes.applicationGuildCommands(config.bot.id, config.guildId), {
			body: commands
		});
		return data;
	}

	get commandsCollection() {
		return this.commands;
	}
}
