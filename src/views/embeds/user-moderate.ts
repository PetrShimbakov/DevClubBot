import { EmbedBuilder, User } from "discord.js";

export default function getUserModerateEmbed(user: User): EmbedBuilder {
	return new EmbedBuilder()
		.setTitle(`Управление ограничениями пользователя ${user.username}.`)
		.setThumbnail(user.displayAvatarURL({ extension: "png", size: 128 }))
		.setColor("#816CE0")
		.setDescription(`Ну что, выносить приговор для этого хитреца <@${user.id}>, или он опять пытался отмазаться шоколадкой?`);
}
