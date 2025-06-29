import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import config from "../../config";
import { IUserData } from "../../types/user-data";
import { ROLE_SELECT_MENU_ID } from "../../constants/component-ids";

function getDescription(userData: IUserData | null, roleKey: keyof typeof config.devRoleIds): string {
	return userData && userData.rolesData.some(role => role.roleId === config.devRoleIds[roleKey])
		? "❌ Убрать роль"
		: "✔️ Получить роль";
}

const roles: { key: keyof typeof config.devRoleIds; label: string }[] = [
	{ key: "client", label: "Client (Заказчик)" },
	{ key: "builder", label: "Builder (Строитель)" },
	{ key: "modeler", label: "Modeler (Моделлер)" },
	{ key: "scripter", label: "Scripter (Скриптер)" },
	{ key: "audioSpecialist", label: "Audio Specialist (Аудио специалист)" },
	{ key: "designer", label: "Designer (Дизайнер)" },
	{ key: "animator", label: "Animator (Аниматор)" },
	{ key: "rigger", label: "Rigger (Риггер)" },
	{ key: "vfxArtist", label: "VFX Artist (VFX-художник)" }
];

export default function getRoleSelectMenu(userData?: IUserData) {
	const roleOptions = roles.map(role => {
		const emojiId = config.emojiIds[role.key];
		if (!emojiId) throw new Error(`Emoji ID not found for role key: ${role.key}`);

		return new StringSelectMenuOptionBuilder()
			.setLabel(role.label)
			.setValue(config.devRoleIds[role.key])
			.setEmoji({ id: emojiId })
			.setDescription(getDescription(userData ?? null, role.key));
	});

	return new StringSelectMenuBuilder()
		.setCustomId(ROLE_SELECT_MENU_ID)
		.setPlaceholder("Выбери свою роль")
		.setMinValues(1)
		.setMaxValues(1)
		.addOptions(roleOptions);
}
