import { ButtonInteraction, ComponentType, StringSelectMenuInteraction } from "discord.js";
import { safeReply } from "../utils/reply-utils";
import errorMessages from "../views/messages/error-messages";
import messages from "../views/messages/messages";
import getRoleRegistrationModal from "../views/modals/registration";
import config from "../config";
import usersData from "../models/users-data";
import successMessages from "../views/messages/success-messages";
import {
	ROLE_REG_BEGINNER_INPUT_ID,
	ROLE_REG_NAME_INPUT_ID,
	ROLE_REGISTRATION_MODAL_ID,
	ROLE_SELECT_MENU_ID
} from "../constants/component-ids";

const activeRegistrations = new Set<string>();
const INTERACTION_TIMEOUT = 30_000;

export async function handleRoleSelectButton(initialInteraction: ButtonInteraction<"cached">) {
	const userId = initialInteraction.user.id;
	const member = initialInteraction.member;
	const userData = await usersData.getUser(userId);

	if (!member) return; // recommendation from community
	if (activeRegistrations.has(userId)) return safeReply(initialInteraction, errorMessages.tooManyRequests);
	activeRegistrations.add(userId);

	try {
		let roleSelectInteraction;
		try {
			await initialInteraction.reply(messages.roleSelection(userId, userData));
			const message = await initialInteraction.fetchReply();
			roleSelectInteraction = await message.awaitMessageComponent({
				filter: i => i.user.id === userId && i.customId === ROLE_SELECT_MENU_ID,
				componentType: ComponentType.StringSelect,
				time: INTERACTION_TIMEOUT
			});
		} catch (error) {
			if (error instanceof Error && "code" in error && error.code === "InteractionCollectorError") {
				return safeReply(initialInteraction, errorMessages.timeLimit);
			}
			throw error;
		}

		if (!roleSelectInteraction) return;
		const selectedRoleId = roleSelectInteraction.values[0];

		if (!Object.values(config.devRoleIds).includes(selectedRoleId)) {
			throw new Error(`Unsupported roleId "${selectedRoleId}" selected by user "${userId}".`);
		}

		if (userData && userData.rolesData.some(role => role.roleId === selectedRoleId)) {
			await usersData.removeRole(userId, selectedRoleId);
			await member.roles.remove(selectedRoleId);
			await initialInteraction.deleteReply();
			return safeReply(roleSelectInteraction, successMessages.roleRemoved(selectedRoleId));
		}

		let modalInteraction;
		try {
			await roleSelectInteraction.showModal(getRoleRegistrationModal(roleSelectInteraction.values[0], userData?.name));
			initialInteraction.deleteReply();
			modalInteraction = await roleSelectInteraction.awaitModalSubmit({
				filter: i => i.user.id === userId && i.customId === ROLE_REGISTRATION_MODAL_ID,
				time: INTERACTION_TIMEOUT
			});
		} catch (error) {
			if (error instanceof Error && "code" in error && error.code === "InteractionCollectorError") {
				return safeReply(modalInteraction ?? roleSelectInteraction, errorMessages.timeLimit);
			}
			throw error;
		}

		if (!modalInteraction) return;
		const selectedName = modalInteraction.fields.getTextInputValue(ROLE_REG_NAME_INPUT_ID);

		if (!selectedName.trim() || selectedName.length >= 50) return safeReply(modalInteraction, errorMessages.unrealName);

		if (!userData) await usersData.addUser(userId, selectedName);

		if (selectedRoleId === config.devRoleIds.client)
			await usersData.addRole(userId, { roleId: selectedRoleId }, selectedName);
		else {
			const normalizedInput = modalInteraction.fields.getTextInputValue(ROLE_REG_BEGINNER_INPUT_ID).trim().toLowerCase();
			const isBeginner = ["да", "yes", "true"].includes(normalizedInput)
				? true
				: ["нет", "no", "false"].includes(normalizedInput)
				? false
				: null;

			if (isBeginner === null) return safeReply(modalInteraction, errorMessages.badExperienceData);

			await usersData.addRole(
				userId,
				{
					roleId: selectedRoleId,
					beginner: isBeginner
				},
				selectedName
			);
		}

		await member.roles.add(selectedRoleId);
		return safeReply(modalInteraction, successMessages.roleAdded(selectedRoleId));
	} catch (error) {
		console.error(`[roles-controller] Unknown error for user ${userId}:`, error);
		return safeReply(initialInteraction, errorMessages.unknown);
	} finally {
		activeRegistrations.delete(userId);
	}
}
