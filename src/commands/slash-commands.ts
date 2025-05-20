import config from "../config";
import { CommandsBuilder } from "./commands-builder";
import { Interaction, SlashCommandChannelOption, SlashCommandBuilder } from "discord.js";

const slashCommands = new CommandsBuilder()

	.addCommand(
		new SlashCommandBuilder()
			.setName("send-roles")
			.setDescription("Отошлет меню для авторизации и описание ролей в указанный канал.")
			.addChannelOption(
				new SlashCommandChannelOption()
					.setName("Целевой канал.")
					.setDescription("Канал, в который будет отправлено меню авторизации.")
					.setRequired(true)
			),
		async (interaction: Interaction) => {
			throw new Error("В разработке");
		},
		[] // An empty array means only the server owner can access this command
	)

	.addCommand(
		new SlashCommandBuilder()
			.setName("send-rules")
			.setDescription("Отошлет правила сервера в указанный канал.")
			.addChannelOption(
				new SlashCommandChannelOption()
					.setName("Целевой канал.")
					.setDescription("Канал, в который будут отправлены правила.")
					.setRequired(true)
			),
		async (interaction: Interaction) => {
			throw new Error("В разработке");
		},
		[]
	);

export default slashCommands;
