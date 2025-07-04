import { CommandsBuilder } from "./commands-builder";
import { SlashCommandChannelOption, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types/commands";
import sendRules from "../controllers/commands/send-rules";
import sendRoles from "../controllers/commands/send-roles";
import config from "../config";
import sendOrderMenu from "../controllers/commands/send-order-menu";

const slashCommands = new CommandsBuilder<SlashCommand>()

	.addCommand(
		new SlashCommandBuilder()
			.setName("send-roles")
			.setDescription("Отошлет меню для авторизации и описание ролей в указанный канал.")
			.addChannelOption(
				new SlashCommandChannelOption()
					.setName("target-channel")
					.setDescription("Канал, в который будет отправлено меню авторизации.")
					.setRequired(true)
			),
		sendRoles,
		[] // An empty array means only the server owner can access this command
	)

	.addCommand(
		new SlashCommandBuilder()
			.setName("send-rules")
			.setDescription("Отошлет правила сервера в указанный канал.")
			.addChannelOption(
				new SlashCommandChannelOption()
					.setName("target-channel")
					.setDescription("Канал, в который будут отправлены правила.")
					.setRequired(true)
			),
		sendRules,
		[]
	)

	.addCommand(
		new SlashCommandBuilder()
			.setName("send-order-menu")
			.setDescription("Отошлет меню для заказа контента в указанный канал.")
			.addChannelOption(
				new SlashCommandChannelOption()
					.setName("target-channel")
					.setDescription("Канал, в который будет отправлено меню.")
					.setRequired(true)
			),
		sendOrderMenu,
		[]
	);

export default slashCommands;
