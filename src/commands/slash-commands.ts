import { SlashCommandBuilder, SlashCommandChannelOption, SlashCommandNumberOption } from "discord.js";
import config from "../config";
import clearChat from "../controllers/commands/clear-chat";
import { moderateOrders } from "../controllers/commands/moderate-orders";
import sendOrderMenu from "../controllers/commands/send-order-menu";
import sendPriceList from "../controllers/commands/send-price-list";
import sendPunishments from "../controllers/commands/send-punishments";
import sendRoles from "../controllers/commands/send-roles";
import sendRules from "../controllers/commands/send-rules";
import sendSupport from "../controllers/commands/send-support";
import { SlashCommand } from "../types/commands";
import { CommandsBuilder } from "./commands-builder";

const slashCommands = new CommandsBuilder<SlashCommand>()

	.addCommand(
		new SlashCommandBuilder()
			.setName("send-roles")
			.setDescription("Отошлет меню для авторизации и описание ролей в указанный канал.")
			.addChannelOption(new SlashCommandChannelOption().setName("target-channel").setDescription("Канал, в который будет отправлено меню авторизации.").setRequired(true)),
		sendRoles,
		[] // An empty array means only the server owner can access this command
	)

	.addCommand(
		new SlashCommandBuilder()
			.setName("send-rules")
			.setDescription("Отошлет правила сервера в указанный канал.")
			.addChannelOption(new SlashCommandChannelOption().setName("target-channel").setDescription("Канал, в который будут отправлены правила.").setRequired(true)),
		sendRules,
		[]
	)

	.addCommand(
		new SlashCommandBuilder()
			.setName("send-punishments")
			.setDescription("Отошлет список наказаний в указанный канал.")
			.addChannelOption(new SlashCommandChannelOption().setName("target-channel").setDescription("Канал, в который будет отправлен список.").setRequired(true)),
		sendPunishments,
		[]
	)

	.addCommand(
		new SlashCommandBuilder()
			.setName("send-order-menu")
			.setDescription("Отошлет меню для заказа контента в указанный канал.")
			.addChannelOption(new SlashCommandChannelOption().setName("target-channel").setDescription("Канал, в который будет отправлено меню.").setRequired(true)),
		sendOrderMenu,
		[]
	)

	.addCommand(
		new SlashCommandBuilder()
			.setName("send-support")
			.setDescription("Отошлет меню для обращения в поддержку в указанный канал.")
			.addChannelOption(new SlashCommandChannelOption().setName("target-channel").setDescription("Канал, в который будет отправлено меню.").setRequired(true)),
		sendSupport,
		[]
	)

	.addCommand(
		new SlashCommandBuilder()
			.setName("send-price-list")
			.setDescription("Отошлет прайс-лист в указанный канал.")
			.addChannelOption(new SlashCommandChannelOption().setName("target-channel").setDescription("Канал, в который будет отправлен прайс-лист.").setRequired(true)),
		sendPriceList,
		[]
	)

	.addCommand(
		new SlashCommandBuilder()
			.setName("clear")
			.setDescription("Удаляет указанное количество последних сообщений в этом канале.")
			.addNumberOption(new SlashCommandNumberOption().setName("amount").setDescription("Сколько сообщений удалить.").setRequired(true).setMaxValue(100).setMinValue(1)),

		clearChat,
		[]
	)

	.addCommand(new SlashCommandBuilder().setName("moderate-orders").setDescription("Откроет меню для модерации заказов."), moderateOrders, [config.roleIds.moderator]);

export default slashCommands;
