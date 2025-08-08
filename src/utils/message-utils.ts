import { InteractionReplyOptions } from "discord.js";
import config from "../config";
import { roleLabels } from "../constants/role-labels";
import { IUserData } from "../types/user-data";

export const getDiscordDate = (date: Date) => `<t:${Math.floor(new Date(date).getTime() / 1000)}:D>`;

export const deleteMsgFlags = ({ flags, ...rest }: InteractionReplyOptions) => rest;

export function getUserInfoString(userData: IUserData) {
	const roleDescription = userData.rolesData
		.map(
			(role, index, roles) =>
				`${index === 0 ? "" : index === roles.length - 1 ? " и" : ","}${role.roleId === config.devRoleIds.client ? "" : role.beginner ? " начинающий" : " опытный"} ${
					roleLabels[role.roleId]
				}`
		)
		.join("");

	return `Зовут ${userData.name}, зарегистрирован с момента ${getDiscordDate(userData.createdAt)}. ${roleDescription ? `Это ${roleDescription}.` : "Пока без ролей."}`;
}
