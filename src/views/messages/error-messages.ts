import { InteractionReplyOptions, MessageFlags } from "discord.js";
import config from "../../config";
import { roleTakenOrdersLimits } from "../../constants/orders/order-limits";

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
		content: "Эта функция для тебя временно недоступна. Нарушения имеют последствия — считай это паузой для раздумий ⏸️",
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
	public orderSystemOverloaded: InteractionReplyOptions = {
		content: "Как бы странно ни звучало, но заказов стало слишком много для системы заказов. Попробуй позже 🤷‍♂️",
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
		return {
			content: `У тебя уже открыто максимальное количество заказов — ${limit}. Хочешь увеличить лимит? Подробнее — в канале <#1397626251694313554>.`,
			flags: MessageFlags.Ephemeral
		};
	}

	public takenOrdersLimitReached(limit: number): InteractionReplyOptions {
		const boosterLimit = roleTakenOrdersLimits[config.roleIds.booster];
		const superDevLimit = roleTakenOrdersLimits[config.roleIds.superDev];

		return {
			content: `Ты уже взял максимальное количество заказов — ${limit}. Хочешь увеличить лимит? Подробнее — в канале <#1397626251694313554>.`,
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

	public orderCooldownLimit(timeLeft: number): InteractionReplyOptions {
		const minutes = Math.max(1, Math.ceil(timeLeft));
		const n = minutes % 100;
		const n1 = minutes % 10;
		const minWord = n > 10 && n < 20 ? "минут" : n1 === 1 ? "минуту" : n1 > 1 && n1 < 5 ? "минуты" : "минут";

		return {
			content: `Не спеши, шустрик — таймер ещё тикает. Новый заказ можно оформить через ${minutes} ${minWord}. За это время я остужу кулеры, подумаю о вечном... и напомню: если хочешь сократить ожидание, приобрети донатную роль. Подробнее — в канале <#1397626251694313554> 💎🔥🧊`,
			flags: MessageFlags.Ephemeral
		};
	}
}

const errorMessages = new ErrorMessages();
export default errorMessages;
