import config from "../config";
import { safeReply } from "../utils/reply-utils";
import rulesEmbed from "../views/embeds/rules";
import { CommandsBuilder } from "./commands-builder";
import {
	Interaction,
	SlashCommandChannelOption,
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	ChannelType,
	TextChannel,
	NewsChannel
} from "discord.js";
import { SlashCommand } from "./types/commands.types";
import errorMessages from "../views/messages/error-messages";
import messages from "../views/messages/messages";

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
		async interaction => {
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
					.setName("target-channel")
					.setDescription("Канал, в который будут отправлены правила.")
					.setRequired(true)
			),
		async interaction => {
			const channel = interaction.options.getChannel("target-channel");

			console.log(
				"typeof channel:",
				typeof channel,
				"| channel instanceof TextChannel:",
				channel instanceof TextChannel,
				"| channel instanceof NewsChannel:",
				channel instanceof NewsChannel,
				"| channel?.constructor.name:",
				channel?.constructor?.name,
				"| channel?.type:",
				channel?.type
			);
			if (!(channel instanceof TextChannel) && !(channel instanceof NewsChannel))
				return safeReply(interaction, errorMessages.notTextChannel);

			try {
				await channel.send({ embeds: [rulesEmbed] });
			} catch (error) {
				console.error(`[slash-commands] Error while sending message: ${error}`);
			}

			return safeReply(interaction, messages.rulesSent(channel.id));
		},
		[]
	);

export default slashCommands;
