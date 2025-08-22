import { ComponentType, UserContextMenuCommandInteraction } from "discord.js";
import config from "../../config";
import { DISABLE_PERMISSION_BUTTON, ENABLE_PERMISSION_BUTTON } from "../../constants/component-ids";
import { USER_MODERATE_TIMEOUT } from "../../constants/timeouts";
import usersData from "../../models/users-data";
import { sendModLog } from "../../services/mod-log-service";
import { IUserData } from "../../types/user-data";
import { AbortControllerMap, awaitWithAbort } from "../../utils/abort-utils";
import { deleteMsgFlags } from "../../utils/message-utils";
import { safeDeleteReply, safeReply } from "../../utils/reply-utils";
import errorMessages from "../../views/messages/error-messages";
import messages from "../../views/messages/messages";

const userModerateSessions = new AbortControllerMap();
export default async function moderateUser(initialInteraction: UserContextMenuCommandInteraction<"cached">) {
	const userId = initialInteraction.user.id;
	const targetUserData = await usersData.getUser(initialInteraction.targetUser.id);
	if (!targetUserData) return safeReply(initialInteraction, errorMessages.userNotRegistered);
	if (!initialInteraction.member.roles.cache.has(config.roleIds.moderator)) return safeReply(initialInteraction, errorMessages.noRights);

	const abortController = userModerateSessions.start(userId);

	try {
		await initialInteraction.reply(messages.userModerate(initialInteraction.targetUser, targetUserData.permissions));

		const message = await initialInteraction.fetchReply();

		while (true) {
			const buttonInteraction = await awaitWithAbort(
				message.awaitMessageComponent({
					filter: i => i.user.id === userId && (i.customId.startsWith(ENABLE_PERMISSION_BUTTON) || i.customId.startsWith(DISABLE_PERMISSION_BUTTON)),
					componentType: ComponentType.Button,
					time: USER_MODERATE_TIMEOUT
				}),
				abortController
			).catch(error => {
				if (error.code === "InteractionCollectorError") {
					safeDeleteReply(initialInteraction);
					return safeReply(initialInteraction, errorMessages.orderListInactivity);
				}
				if (error.message === "abort") return safeDeleteReply(initialInteraction);
				throw error;
			});

			if (!buttonInteraction) return;

			if (buttonInteraction.customId.startsWith(ENABLE_PERMISSION_BUTTON)) {
				const permission = buttonInteraction.customId.replace(ENABLE_PERMISSION_BUTTON, "") as keyof IUserData["permissions"];
				if (!Object.prototype.hasOwnProperty.call(targetUserData.permissions, permission)) return safeReply(buttonInteraction, errorMessages.inDev);
				await usersData.enablePermission(targetUserData.discordId, permission);
				await sendModLog(messages.userModLog(initialInteraction.targetUser, initialInteraction.user, permission, false));
			} else if (buttonInteraction.customId.startsWith(DISABLE_PERMISSION_BUTTON)) {
				const permission = buttonInteraction.customId.replace(DISABLE_PERMISSION_BUTTON, "") as keyof IUserData["permissions"];
				if (!Object.prototype.hasOwnProperty.call(targetUserData.permissions, permission)) return safeReply(buttonInteraction, errorMessages.inDev);
				await usersData.disablePermission(targetUserData.discordId, permission);
				await sendModLog(messages.userModLog(initialInteraction.targetUser, initialInteraction.user, permission, true));
			}

			const updatedUserData = await usersData.getUser(targetUserData.discordId);

			if (!updatedUserData) return safeReply(initialInteraction, errorMessages.userNotRegistered);

			buttonInteraction.update(deleteMsgFlags(messages.userModerate(initialInteraction.targetUser, updatedUserData.permissions)));
		}
	} catch (error) {
		if (error instanceof Error && error.message === "abort") {
			safeDeleteReply(initialInteraction);
			return;
		}
		console.error(`[roles-controller] Unknown error for user ${userId}:`, error);
		return safeReply(initialInteraction, errorMessages.unknown);
	} finally {
	}
}
