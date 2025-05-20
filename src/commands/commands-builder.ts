import {
	Collection,
	ContextMenuCommandBuilder,
	RESTPostAPIApplicationCommandsJSONBody,
	Routes,
	SlashCommandOptionsOnlyBuilder,
	type Interaction,
	type REST
} from "discord.js";
import config from "../config";

type Command = {
	data: SlashCommandOptionsOnlyBuilder | ContextMenuCommandBuilder;
	execute: (interaction: Interaction) => Promise<void>;
	requiredRoles: (typeof config.roleIds)[keyof typeof config.roleIds][];
};

export class CommandsBuilder {
	protected commands = new Collection<string, Command>();

	public static combine(...commandsBuilders: CommandsBuilder[]) {
		const combinedCommandBuilder = new CommandsBuilder();

		commandsBuilders.forEach(commandsBuilder => {
			commandsBuilder.commands.forEach((command, name) => {
				combinedCommandBuilder.commands.set(name, command);
			});
		});
		return combinedCommandBuilder;
	}

	public addCommand(data: Command["data"], execute: Command["execute"], requiredRoles: Command["requiredRoles"]): this {
		this.commands.set(data.name, { data, execute, requiredRoles });
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
