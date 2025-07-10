import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import config from "../../config";
import { ROLE_SELECT_MENU_ID } from "../../constants/component-ids";
import { detailedRoleLabels } from "../../constants/role-labels";
import { IUserData } from "../../types/user-data";

function getDescription(userData: IUserData | null, roleKey: keyof typeof config.devRoleIds): string {
	return userData && userData.rolesData.some(role => role.roleId === config.devRoleIds[roleKey])
		? "❌ Убрать роль"
		: "✔️ Получить роль";
}

const roleKeys = Object.keys(config.devRoleIds) as (keyof typeof config.devRoleIds)[];
export default function getRoleSelectMenu(userData?: IUserData) {
	const roleOptions = roleKeys.map(roleKey => {
		const emojiId = config.emojiIds[roleKey];
		if (!emojiId) throw new Error(`Emoji ID not found for role key: ${roleKey}`);

		return new StringSelectMenuOptionBuilder()
			.setLabel(detailedRoleLabels[roleKey])
			.setValue(config.devRoleIds[roleKey])
			.setEmoji({ id: emojiId })
			.setDescription(getDescription(userData ?? null, roleKey));
	});

	return new StringSelectMenuBuilder()
		.setCustomId(ROLE_SELECT_MENU_ID)
		.setPlaceholder("Выбери свою роль")
		.setMinValues(1)
		.setMaxValues(1)
		.addOptions(roleOptions);
}
