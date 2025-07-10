import { NewsChannel, TextChannel } from "discord.js";

export const isNewsOrTextChannel = (channel: any): channel is NewsChannel | TextChannel =>
	channel instanceof TextChannel || channel instanceof NewsChannel;
