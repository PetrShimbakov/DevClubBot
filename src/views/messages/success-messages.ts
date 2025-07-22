import { InteractionReplyOptions, MessageFlags } from "discord.js";
import { roleLabels } from "../../constants/role-labels";

class SuccessMessages {
	public roleAdded(roleId: string): InteractionReplyOptions {
		return {
			content: `Поздравляю, ты получил новую роль "${roleLabels[roleId]}"!`,
			flags: MessageFlags.Ephemeral
		};
	}

	public roleRemoved(roleId: string): InteractionReplyOptions {
		return {
			content: `Ваша роль "${roleLabels[roleId]}" была удалена.`,
			flags: MessageFlags.Ephemeral
		};
	}

	public rulesSent(channelId: string): InteractionReplyOptions {
		return {
			content: `Я успешно отправил правила в указанный вами канал <#${channelId}>.`,
			flags: MessageFlags.Ephemeral
		};
	}
	public supportSent(channelId: string): InteractionReplyOptions {
		return {
			content: `Я успешно отправил меню для обращения в поддержку в указанный вами канал <#${channelId}>.`,
			flags: MessageFlags.Ephemeral
		};
	}

	public rolesSent(channelId: string): InteractionReplyOptions {
		return {
			content: `Я успешно отправил авторизацию ролей в указанный вами канал <#${channelId}>.`,
			flags: MessageFlags.Ephemeral
		};
	}

	public orderMenuSent(channelId: string): InteractionReplyOptions {
		return {
			content: `Я успешно отправил меню для заказа контента в указанный вами канал <#${channelId}>.`,
			flags: MessageFlags.Ephemeral
		};
	}

	public orderRemoved(orderNumber: number): InteractionReplyOptions {
		return {
			content: `Я успешно отменил ваш заказ под номером ${orderNumber}.`,
			flags: MessageFlags.Ephemeral
		};
	}

	public messagesCleared(amount: number): InteractionReplyOptions {
		return {
			content: `Я успешно удалил ${amount} последних сообщений в этом канале.`,
			flags: MessageFlags.Ephemeral
		};
	}

	public orderTaken(channelId: string): InteractionReplyOptions {
		return {
			content: `Вы успешно взяли заказ, обсудить детали заказа можно в канале <#${channelId}>`,
			flags: MessageFlags.Ephemeral
		};
	}

	public readonly bioUpdated: InteractionReplyOptions = {
		content: "Ваша биография была успешно обновлена.",
		flags: MessageFlags.Ephemeral
	};

	public readonly ordered: InteractionReplyOptions = {
		content: "Ваш заказ принят, ожидайте дальнейших уведомлений.",
		flags: MessageFlags.Ephemeral
	};

	public readonly orderRejected: InteractionReplyOptions = {
		content: "Ваш заказ был освобожден, это значит что он опять попал в список активных заказов и в ближайшее время заказ возьмет другой разработчик."
	};

	public readonly supportRequestSent: InteractionReplyOptions = {
		content: "Ваше сообщение успешно отправлено в поддержку. Спасибо за обращение!",
		flags: MessageFlags.Ephemeral
	};
}

const successMessages = new SuccessMessages();
export default successMessages;
