import { InteractionReplyOptions, MessageFlags } from "discord.js";
import { roleOrderLimits } from "../../constants/orders/order-limits";
import config from "../../config";

class ErrorMessages {
	public readonly unknown: InteractionReplyOptions = {
		content: "К сожалению, где-то произошла ошибка. Пожалуйста, сообщите об этом моему создателю. 😔",
		flags: MessageFlags.Ephemeral
	};

	public readonly notTextChannel: InteractionReplyOptions = {
		content: "Пожалуйста, выберите текстовый канал.",
		flags: MessageFlags.Ephemeral
	};

	public readonly inDev: InteractionReplyOptions = {
		content: "Прости, данная функция ещё разрабатывается. 🛠",
		flags: MessageFlags.Ephemeral
	};

	public readonly noRights: InteractionReplyOptions = {
		content: "Прости, мой друг, но у тебя нет доступа к таким функциям.",
		flags: MessageFlags.Ephemeral
	};

	public readonly timeLimit: InteractionReplyOptions = {
		content: "Время на заполнение анкеты истекло. Пока ты думал, мой процессор успел остынуть. 🥶",
		flags: MessageFlags.Ephemeral
	};

	public readonly orderListInactivity: InteractionReplyOptions = {
		content: "Ты долго не был активен, поэтому я закрыл меню заказов. Но не переживай — всегда можешь открыть его снова! 🥶",
		flags: MessageFlags.Ephemeral
	};

	public readonly userNotRegistered: InteractionReplyOptions = {
		content: "Кто это вообще такой? 🤔 Пользователь не зарегистрирован как разработчик.",
		flags: MessageFlags.Ephemeral
	};

	public readonly commandNotFound: InteractionReplyOptions = {
		content: "Такой команды у меня нет... Или ты что-то выдумал? 🤨",
		flags: MessageFlags.Ephemeral
	};

	public readonly tooManyRequests: InteractionReplyOptions = {
		content: "Ого, не так быстро! Дай отдышаться, у меня чуть не расплавился сервер. 🔥",
		flags: MessageFlags.Ephemeral
	};

	public readonly badExperienceData: InteractionReplyOptions = {
		content: "Ты некорректно указал, являешься ли ты новичком. Напиши просто: 'да' или 'нет'.",
		flags: MessageFlags.Ephemeral
	};

	public readonly unrealName: InteractionReplyOptions = {
		content: "Похоже, ты указал нереалистичное имя. Пожалуйста, введи своё настоящее имя — без шуток и случайных символов.",
		flags: MessageFlags.Ephemeral
	};

	public readonly notRegistered: InteractionReplyOptions = {
		content: "Сперва надо зарегистрироваться - нажми кнопку '🏷️ Выбрать свою роль'.",
		flags: MessageFlags.Ephemeral
	};

	public readonly myOrdersNotFound: InteractionReplyOptions = {
		content: "Ты пока ничего не заказывал.",
		flags: MessageFlags.Ephemeral
	};

	public readonly availableOrdersNotFound: InteractionReplyOptions = {
		content: "Увы, сейчас для твоих ролей нет свободных заказов. Попробуй зайти позже.",
		flags: MessageFlags.Ephemeral
	};

	public tooLongBio(maxValue: number): InteractionReplyOptions {
		return {
			content: `Ты написал слишком длинную биографию, допускается не больше ${maxValue} символов.`,
			flags: MessageFlags.Ephemeral
		};
	}

	public ordersLimitReached(limit: number): InteractionReplyOptions {
		const boosterLimit = roleOrderLimits[config.roleIds.booster];
		const superClientLimit = roleOrderLimits[config.roleIds.superClient];

		return {
			content: `У тебя уже открыто максимальное количество заказов — ${limit}. Если хочешь расширить свои возможности, приобрети пасс у владельца сервера <@1058787941364797490> — лимит станет ${superClientLimit}. Или просто забусти сервер, и тогда лимит вырастет до ${boosterLimit} на всё время действия буста!`,
			flags: MessageFlags.Ephemeral
		};
	}

	public tooLongOrderDescription(limit: number): InteractionReplyOptions {
		return {
			content: `Описание заказа получилось слишком длинным. Пожалуйста, сократи его до ${limit} символов.`,
			flags: MessageFlags.Ephemeral
		};
	}

	public tooLongOrderBudget(limit: number): InteractionReplyOptions {
		return {
			content: `Описание бюджета слишком длинное. Постарайся уместить его в ${limit} символов.`,
			flags: MessageFlags.Ephemeral
		};
	}
}

const errorMessages = new ErrorMessages();
export default errorMessages;
