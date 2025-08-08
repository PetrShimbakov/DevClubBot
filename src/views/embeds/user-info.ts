import { EmbedBuilder, User } from "discord.js";
import { IUserData } from "../../types/user-data";
import { getUserInfoString } from "../../utils/message-utils";

export default function getUserInfoEmbed(userData: IUserData, user: User): EmbedBuilder {
	const embed = new EmbedBuilder()
		.setTitle(`Вот что известно о пользователе ${user.username}`)
		.setThumbnail(user.displayAvatarURL({ extension: "png", size: 128 }))
		.setColor("#816CE0")
		.setTimestamp()
		.setDescription(getUserInfoString(userData));

	if (userData.bio) embed.addFields({ name: "Биография:", value: userData.bio });

	return embed;
}
