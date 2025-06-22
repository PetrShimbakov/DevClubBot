import { InteractionReplyOptions, MessageFlags } from "discord.js";

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
}

const errorMessages = new ErrorMessages();
export default errorMessages;
