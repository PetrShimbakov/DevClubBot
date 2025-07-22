import { EmbedBuilder } from "discord.js";
import { getDiscordDate } from "../../utils/message-utils";

export function getSupportRequestEmbed(userId: string, message: string) {
	return new EmbedBuilder()
		.setTitle("Новое обращение в поддержку")
		.setColor("#816CE0")
		.addFields({ name: "Пользователь:", value: `<@${userId}>`, inline: true }, { name: "Время:", value: getDiscordDate(new Date()), inline: true }, { name: "Сообщение:", value: message });
}
