import { ActionRowBuilder, InteractionReplyOptions, MessageFlags } from "discord.js";
import { IUserData } from "../../types/user-data";
import getRoleSelectMenu from "../select-menus/roles";

class Messages {
	public roleSelection(userId: string, userData?: IUserData): InteractionReplyOptions {
		return {
			content: `<@${userId}>, выберите свою роль.`,
			components: [new ActionRowBuilder().addComponents(getRoleSelectMenu(userData)).toJSON()],
			flags: MessageFlags.Ephemeral,
			withResponse: true
		};
	}
}

const messages = new Messages();
export default messages;
