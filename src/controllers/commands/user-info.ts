import { MessageFlags, UserContextMenuCommandInteraction } from "discord.js";
import { safeReply } from "../../utils/reply-utils";
import getUserInfoEmbed from "../../views/embeds/user-info";
import usersData from "../../models/users-data";
import errorMessages from "../../views/messages/error-messages";

export default async function sendUserInfo(interaction: UserContextMenuCommandInteraction<"cached">) {
	const userData = await usersData.getUser(interaction.targetUser.id);
	if (!userData) return safeReply(interaction, errorMessages.userNotRegistered);
	await safeReply(interaction, {
		embeds: [getUserInfoEmbed(userData, interaction.targetUser)],
		flags: MessageFlags.Ephemeral
	});
}
