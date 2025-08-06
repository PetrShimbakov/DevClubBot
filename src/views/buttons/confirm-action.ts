import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { CONFIRM_ACTION_FALSE_BUTTON, CONFIRM_ACTION_TRUE_BUTTON } from "../../constants/component-ids";

function confirmActionButtons(interactionId: string) {
	return new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setLabel("Я уверен")
			.setEmoji("✅")
			.setCustomId(CONFIRM_ACTION_TRUE_BUTTON + interactionId)
			.setStyle(ButtonStyle.Danger),
		new ButtonBuilder()
			.setLabel("Отменить действие")
			.setEmoji("❌")
			.setCustomId(CONFIRM_ACTION_FALSE_BUTTON + interactionId)
			.setStyle(ButtonStyle.Secondary)
	);
}

export default confirmActionButtons;
