import { InteractionReplyOptions } from "discord.js";

export const getDiscordDate = (date: Date) => `<t:${Math.floor(new Date(date).getTime() / 1000)}:D>`;

export const deleteMsgFlags = ({ flags, ...rest }: InteractionReplyOptions) => rest;
