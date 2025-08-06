import { EmbedBuilder } from "discord.js";
import { confirmActionDescriptions } from "./../../constants/confirm-action-descriptions";

export function getConfirmActionEmbed(description: keyof typeof confirmActionDescriptions) {
	return new EmbedBuilder().setTitle("Подтверждение действия").setColor("#816CE0").setDescription(confirmActionDescriptions[description]);
}
