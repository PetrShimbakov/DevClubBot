import { ComponentType, Interaction } from "discord.js";
import { CONFIRM_ACTION_FALSE_BUTTON, CONFIRM_ACTION_TRUE_BUTTON } from "../constants/component-ids";
import { confirmActionDescriptions } from "../constants/confirm-action-descriptions";
import { CONFIRM_ACTION_TIMEOUT } from "../constants/timeouts";
import errorMessages from "../views/messages/error-messages";
import messages from "../views/messages/messages";
import { AbortControllerMap, awaitWithAbort } from "./abort-utils";
import { safeDeleteReply, safeReply } from "./reply-utils";

const confirmActionSessions = new AbortControllerMap();
export async function confirmAction(interaction: Interaction<"cached">, description: keyof typeof confirmActionDescriptions): Promise<boolean> {
	const userId = interaction.user.id;
	const abortController = confirmActionSessions.start(userId);
	try {
		if (!interaction.isRepliable()) throw new Error("confirmAction: Interaction is not repliable!");

		await interaction.reply(messages.confirmAction(interaction.id, description));

		const reply = await interaction.fetchReply();

		const confirmActionInteraction = await awaitWithAbort(
			reply.awaitMessageComponent({
				filter: i =>
					i.user.id === userId &&
					(i.customId.startsWith(CONFIRM_ACTION_TRUE_BUTTON) || i.customId.startsWith(CONFIRM_ACTION_FALSE_BUTTON)) &&
					(i.customId.replace(CONFIRM_ACTION_TRUE_BUTTON, "") === interaction.id || i.customId.replace(CONFIRM_ACTION_FALSE_BUTTON, "") === interaction.id),
				componentType: ComponentType.Button,
				time: CONFIRM_ACTION_TIMEOUT
			}),
			abortController
		);

		await safeDeleteReply(interaction);

		return confirmActionInteraction.customId.startsWith(CONFIRM_ACTION_TRUE_BUTTON);
	} catch (error) {
		await safeDeleteReply(interaction);
		if (error instanceof Error && "code" in error && error.code === "InteractionCollectorError") return false;
		if (error instanceof Error && error.message === "abort") return false;
		console.error(`[confirm-action] Error for user ${userId}:`, error);
		safeReply(interaction, errorMessages.unknown);
		return false;
	} finally {
		confirmActionSessions.finish(userId, abortController);
	}
}
