import { UserContextMenuCommandInteraction } from "discord.js";
import usersData from "../../models/users-data";
import { safeReply } from "../../utils/reply-utils";
import errorMessages from "../../views/messages/error-messages";
import messages from "../../views/messages/messages";

export default async function sendUserInfo(interaction: UserContextMenuCommandInteraction<"cached">) {
	const userData = await usersData.getUser(interaction.targetUser.id);
	if (!userData) return safeReply(interaction, errorMessages.userNotRegistered);
	await safeReply(interaction, messages.userInfo(userData, interaction.targetUser));
}
