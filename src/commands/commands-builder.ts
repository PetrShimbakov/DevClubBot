import { ApplicationCommandType, Collection, REST, RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord.js";
import config from "../config";
import { Command, CommandMinimum } from "../types/commands";

export class CommandsBuilder<T extends Command> {
	private commands = new Collection<string, T>();
	private getCommandKey = (command: CommandMinimum) => `${command.name}:${"type" in command ? command.type : 1}`;

	public static combine(...commandsBuilders: CommandsBuilder<Command>[]) {
		const combinedCommandBuilder = new CommandsBuilder();

		commandsBuilders.forEach(commandsBuilder => {
			commandsBuilder.commands.forEach(command => {
				combinedCommandBuilder.addCommand(command.data, command.execute, command.requiredRoles);
			});
		});
		return combinedCommandBuilder;
	}

	public addCommand(data: T["data"], execute: T["execute"], requiredRoles: T["requiredRoles"]): this {
		if (this.commands.has(this.getCommandKey(data))) {
			throw new Error(`[commands-builder] Cannot add command ${data.name}: a command with this key already exists.`);
		}

		this.commands.set(this.getCommandKey(data), { data, execute, requiredRoles } as T);
		return this;
	}

	public getCommand(name: string, type: ApplicationCommandType): T | undefined {
		return this.commands.get(this.getCommandKey({ name, type }));
	}

	public get commandsQty() {
		return this.commands.size;
	}

	public register(rest: REST): Promise<unknown> {
		const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
		this.commands.forEach(command => commands.push(command.data.toJSON()));
		const data = rest.put(Routes.applicationGuildCommands(config.bot.id, config.guildId), {
			body: commands
		});
		return data;
	}
}
