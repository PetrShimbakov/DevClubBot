import { ButtonBuilder, ButtonStyle } from "discord.js";
import { SUPPORT_BUTTON_ID } from "../../constants/component-ids";

const supportButton = new ButtonBuilder().setLabel("Сообщить о проблеме").setEmoji("📨").setCustomId(SUPPORT_BUTTON_ID).setStyle(ButtonStyle.Primary);

export default supportButton;
