import { EmbedBuilder, User } from "discord.js";
import config from "../../config";
import { IUserData } from "../../types/user-data";
import { roleLabels } from "../../constants/role-labels";

export default function getUserInfoEmbed(userData: IUserData, user: User): EmbedBuilder {
	const roleDescription = userData.rolesData
		.map(
			(role, index, roles) =>
				`${index === 0 ? "" : index === roles.length - 1 ? " и" : ","}${
					role.roleId === config.devRoleIds.client ? "" : role.beginner ? " начинающий" : " опытный"
				} ${roleLabels[role.roleId]}`
		)
		.join("");

	const embed = new EmbedBuilder()
		.setTitle(`Вот что известно о пользователе ${user.username}`)
		.setThumbnail(user.displayAvatarURL({ extension: "png", size: 128 }))
		.setColor("#816CE0")
		.setTimestamp()
		.setDescription(
			`Зовут ${userData.name}, зарегистрирован с момента <t:${Math.floor(
				new Date(userData.createdAt).getTime() / 1000
			)}:D>. ${roleDescription ? `Это ${roleDescription}.` : "Пока без ролей."}`
		);

	if (userData.bio) embed.addFields({ name: "Биография:", value: userData.bio });

	return embed;
}
