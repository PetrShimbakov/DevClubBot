import { InteractionReplyOptions, MessageFlags } from "discord.js";
import config from "../../config";
import { roleOrderLimits, roleTakenOrdersLimits } from "../../constants/orders/order-limits";

class ErrorMessages {
	public readonly inDev: InteractionReplyOptions = {
		content: "Прости, данная функция ещё разрабатывается. 🛠",
		flags: MessageFlags.Ephemeral
	};

	public readonly unknown: InteractionReplyOptions = {
		content: "К сожалению, где-то произошла ошибка. Пожалуйста, сообщите об этом моему создателю. 😔",
		flags: MessageFlags.Ephemeral
	};

	public readonly notTextChannel: InteractionReplyOptions = {
		content: "Пожалуйста, выберите текстовый канал.",
		flags: MessageFlags.Ephemeral
	};

	public readonly noRights: InteractionReplyOptions = {
		content: "Прости, мой друг, но у тебя нет доступа к таким функциям.",
		flags: MessageFlags.Ephemeral
	};

	public readonly blockedFeature: InteractionReplyOptions = {
		content: "Эта функция тебе больше не доступна. Плохое поведение имеет последствия — теперь посиди, подумай о своём. 😈",
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

	public readonly badExperienceData: InteractionReplyOptions = {
		content: "Ты некорректно указал, являешься ли ты новичком. Напиши просто: 'да' или 'нет'.",
		flags: MessageFlags.Ephemeral
	};

	public readonly unrealName: InteractionReplyOptions = {
		content: "Похоже, ты указал нереалистичное имя. Пожалуйста, введи своё настоящее имя — без шуток и случайных символов.",
		flags: MessageFlags.Ephemeral
	};

	public readonly notRegistered: InteractionReplyOptions = {
		content: "Сперва надо зарегистрироваться, эта функция доступна только зарегистрированным пользователям.",
		flags: MessageFlags.Ephemeral
	};

	public readonly myOrdersNotFound: InteractionReplyOptions = {
		content: "Ты пока ничего не заказывал.",
		flags: MessageFlags.Ephemeral
	};
	public readonly ordersNotFound: InteractionReplyOptions = {
		content: "Никто пока ничего не заказывал.",
		flags: MessageFlags.Ephemeral
	};

	public readonly availableOrdersNotFound: InteractionReplyOptions = {
		content: "Увы, сейчас для твоих ролей нет свободных заказов. Попробуй зайти позже.",
		flags: MessageFlags.Ephemeral
	};

	public readonly orderNotFound: InteractionReplyOptions = {
		content: "К сожалению, я не смог найти этот заказ в базе данных. Возможно, твое меню устарело — попробуй открыть его снова. 😔",
		flags: MessageFlags.Ephemeral
	};

	public readonly orderIsDeleted: InteractionReplyOptions = {
		content: "К сожалению, я не смог найти этот заказ в базе данных. Или произошел временный сбой или этот заказ был удален.",
		flags: MessageFlags.Ephemeral
	};

	public readonly orderIsAlreadyTaken: InteractionReplyOptions = {
		content: "Опоздал, кто-то уже ухватил этот заказ раньше тебя! В следующий раз будь расторопнее — попробуй обновить меню. 😏",
		flags: MessageFlags.Ephemeral
	};

	public readonly thisIsYourOrder: InteractionReplyOptions = {
		content: "😅 Ого, решил сам себя нанять? Поверь, ты хорош, но брать собственные заказы — это уже перебор.",
		flags: MessageFlags.Ephemeral
	};

	public tooLongBio(maxValue: number): InteractionReplyOptions {
		return {
			content: `Ты написал слишком длинную биографию, допускается не больше ${maxValue} символов.`,
			flags: MessageFlags.Ephemeral
		};
	}

	public tooSupportRequest(maxValue: number): InteractionReplyOptions {
		return {
			content: `Ты написал слишком длинное обращение к администрации, допускается не больше ${maxValue} символов.`,
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

	public takenOrdersLimitReached(limit: number): InteractionReplyOptions {
		const boosterLimit = roleTakenOrdersLimits[config.roleIds.booster];
		const superDevLimit = roleTakenOrdersLimits[config.roleIds.superDev];

		return {
			content: `Ты уже взял максимальное количество заказов — ${limit}. Если хочешь расширить свои возможности, приобрети пасс у владельца сервера <@1058787941364797490> — лимит станет ${superDevLimit}. Или просто забусти сервер, и тогда лимит вырастет до ${boosterLimit} на всё время действия буста!`,
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

	public rateLimit(timeLeft: number): InteractionReplyOptions {
		const n = Math.abs(timeLeft) % 100;
		const n1 = n % 10;
		const secWord = n > 10 && n < 20 ? "секунд" : n1 === 1 ? "секунду" : n1 > 1 && n1 < 5 ? "секунды" : "секунд";
		return {
			content: `Ого, не так быстро! Дай отдышаться еще ${timeLeft} ${secWord}, у меня чуть не расплавился сервер. 🔥`,
			flags: MessageFlags.Ephemeral
		};
	}
}

const errorMessages = new ErrorMessages();
export default errorMessages;
