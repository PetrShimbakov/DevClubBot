import { ButtonBuilder, ButtonStyle } from "discord.js";
import { UPDATE_BIO_BUTTON_ID } from "../../constants/component-ids";

const bioUpdateButton = new ButtonBuilder()
	.setLabel("Написать о себе")
	.setEmoji("📝")
	.setCustomId(UPDATE_BIO_BUTTON_ID)
	.setStyle(ButtonStyle.Secondary);

export default bioUpdateButton;
