import { ButtonBuilder, ButtonStyle } from "discord.js";
import { ROLE_SELECT_BUTTON_ID } from "../../constants/component-ids";

const roleSelectButton = new ButtonBuilder()
	.setLabel("Выбрать свою роль")
	.setEmoji("🏷️")
	.setCustomId(ROLE_SELECT_BUTTON_ID)
	.setStyle(ButtonStyle.Primary);

export default roleSelectButton;
