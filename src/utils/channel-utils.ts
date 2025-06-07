import { NewsChannel, TextChannel } from "discord.js";

const isNewsOrTextChannel = (channel: any): channel is NewsChannel | TextChannel =>
	channel instanceof TextChannel || channel instanceof NewsChannel;

export { isNewsOrTextChannel };
