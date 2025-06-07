import { InteractionReplyOptions, MessageFlags } from "discord.js";

class SuccessMessages {
	public roleAdded(role: string): InteractionReplyOptions {
		return {
			content: `Поздравляю, ты получил новую роль "${role}"!`,
			flags: MessageFlags.Ephemeral
		};
	}

	public roleRemoved(role: string): InteractionReplyOptions {
		return {
			content: `Ваша роль "${role}" была удалена.`,
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
}

const successMessages = new SuccessMessages();
export default successMessages;
