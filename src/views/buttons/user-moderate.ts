import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { DISABLE_PERMISSION_BUTTON, ENABLE_PERMISSION_BUTTON } from "../../constants/component-ids";
import { IUserData } from "../../types/user-data";

function userModerateButtons(permissions: IUserData["permissions"]) {
	return new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setLabel(permissions.canCreateOrders ? "Запретить заказывать" : "Разрешить заказывать")
			.setEmoji("📦")
			.setCustomId(`${permissions.canCreateOrders ? DISABLE_PERMISSION_BUTTON : ENABLE_PERMISSION_BUTTON}canCreateOrders`)
			.setStyle(permissions.canCreateOrders ? ButtonStyle.Danger : ButtonStyle.Success),
		new ButtonBuilder()
			.setLabel(permissions.canTakeOrders ? "Запретить брать заказы" : "Разрешить брать заказы")
			.setEmoji("🛠️")
			.setCustomId(`${permissions.canTakeOrders ? DISABLE_PERMISSION_BUTTON : ENABLE_PERMISSION_BUTTON}canTakeOrders`)
			.setStyle(permissions.canTakeOrders ? ButtonStyle.Danger : ButtonStyle.Success),
		new ButtonBuilder()
			.setLabel(permissions.canWriteSupport ? "Запретить писать в поддержку" : "Разрешить писать в поддержку")
			.setEmoji("🎧")
			.setCustomId(`${permissions.canWriteSupport ? DISABLE_PERMISSION_BUTTON : ENABLE_PERMISSION_BUTTON}canWriteSupport`)
			.setStyle(permissions.canWriteSupport ? ButtonStyle.Danger : ButtonStyle.Success)
	);
}

export default userModerateButtons;
