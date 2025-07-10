import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { UPDATE_BIO_INPUT_ID, UPDATE_BIO_MODAL_ID } from "../../constants/component-ids";

export default function getBioUpdateModal(oldBio?: string): ModalBuilder {
	return new ModalBuilder()
		.setCustomId(UPDATE_BIO_MODAL_ID)
		.setTitle(`Биография`)
		.addComponents(
			new ActionRowBuilder<TextInputBuilder>().addComponents(
				new TextInputBuilder()
					.setCustomId(UPDATE_BIO_INPUT_ID)
					.setLabel("Что ты можешь нам о себе рассказать?")
					.setStyle(TextInputStyle.Paragraph)
					.setMaxLength(300)
					.setRequired(true)
					.setValue(oldBio ?? "")
			)
		);
}
