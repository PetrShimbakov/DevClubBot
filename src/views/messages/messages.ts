import { InteractionReplyOptions, MessageFlags } from "discord.js";

class Messages {
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

	public rulesSent(channel: string): InteractionReplyOptions {
		return {
			content: `Я успешно отправил правила в указанный вами канал ${channel}.`,
			flags: MessageFlags.Ephemeral
		};
	}

	public rolesSent(channel: string): InteractionReplyOptions {
		return {
			content: `Я успешно отправил авторизацию ролей в указанный вами канал ${channel}.`,
			flags: MessageFlags.Ephemeral
		};
	}
}

const messages = new Messages();
export default messages;
