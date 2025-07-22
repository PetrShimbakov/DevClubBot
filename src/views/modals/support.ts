import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { SUPPORT_MESSAGE_INPUT_ID, SUPPORT_MODAL_ID } from "../../constants/component-ids";

const supportModal = new ModalBuilder()
	.setCustomId(SUPPORT_MODAL_ID)
	.setTitle("Поддержка")
	.addComponents(
		new ActionRowBuilder<TextInputBuilder>().addComponents(
			new TextInputBuilder().setCustomId(SUPPORT_MESSAGE_INPUT_ID).setLabel("Что случилось?").setStyle(TextInputStyle.Paragraph).setMaxLength(500).setRequired(true)
		)
	);

export default supportModal;
