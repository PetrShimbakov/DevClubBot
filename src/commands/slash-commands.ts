import { SlashCommandBuilder, SlashCommandChannelOption, SlashCommandNumberOption } from "discord.js";
import clearChat from "../controllers/commands/clear-chat";
import sendOrderMenu from "../controllers/commands/send-order-menu";
import sendRoles from "../controllers/commands/send-roles";
import sendRules from "../controllers/commands/send-rules";
import { SlashCommand } from "../types/commands";
import { CommandsBuilder } from "./commands-builder";

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
	)

	.addCommand(
		new SlashCommandBuilder()
			.setName("clear")
			.setDescription("Удаляет указанное количество последних сообщений в этом канале.")
			.addNumberOption(
				new SlashCommandNumberOption()
					.setName("amount")
					.setDescription("Сколько сообщений удалить.")
					.setRequired(true)
					.setMaxValue(100)
					.setMinValue(1)
			),

		clearChat,
		[]
	);

export default slashCommands;
