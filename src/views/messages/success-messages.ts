import { InteractionReplyOptions, MessageFlags } from "discord.js";
import config from "../../config";

class SuccessMessages {
	public roleAdded(roleId: string): InteractionReplyOptions {
		return {
			content: `Поздравляю, ты получил новую роль "${config.devRoleLabels[roleId]}"!`,
			flags: MessageFlags.Ephemeral
		};
	}

	public roleRemoved(roleId: string): InteractionReplyOptions {
		return {
			content: `Ваша роль "${config.devRoleLabels[roleId]}" была удалена.`,
			flags: MessageFlags.Ephemeral
		};
	}

	public rulesSent(channelId: string): InteractionReplyOptions {
		return {
			content: `Я успешно отправил правила в указанный вами канал <#${channelId}>.`,
			flags: MessageFlags.Ephemeral
		};
	}

	public rolesSent(channelId: string): InteractionReplyOptions {
		return {
			content: `Я успешно отправил авторизацию ролей в указанный вами канал <#${channelId}>.`,
			flags: MessageFlags.Ephemeral
		};
	}

	public readonly bioUpdated: InteractionReplyOptions = {
		content: "Ваша биография была успешно обновлена.",
		flags: MessageFlags.Ephemeral
	};
}

const successMessages = new SuccessMessages();
export default successMessages;
