import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import config from "../../config";
import {
	ROLE_REG_BEGINNER_INPUT_ID,
	ROLE_REG_NAME_INPUT_ID,
	ROLE_REGISTRATION_MODAL_ID
} from "../../constants/component-ids";

export default function getRoleRegistrationModal(roleId: string, name?: string): ModalBuilder {
	const fields: TextInputBuilder[] = [
		new TextInputBuilder()
			.setCustomId(ROLE_REG_NAME_INPUT_ID)
			.setLabel("Укажите ваше имя (ФИО - по желанию)")
			.setStyle(TextInputStyle.Short)
			.setRequired(true)
			.setValue(name ?? "")
	];

	if (roleId !== config.devRoleIds.client) {
		fields.push(
			new TextInputBuilder()
				.setCustomId(ROLE_REG_BEGINNER_INPUT_ID)
				.setLabel("Ты новичок в этой сфере? (да/нет)")
				.setStyle(TextInputStyle.Short)
				.setRequired(true)
		);
	}

	const actionRows = fields.map(field => new ActionRowBuilder<TextInputBuilder>().addComponents(field));

	return new ModalBuilder()
		.setCustomId(ROLE_REGISTRATION_MODAL_ID)
		.setTitle(`Анкета на роль ${config.devRoleLabels[roleId] ?? "?"}`)
		.addComponents(...actionRows);
}
