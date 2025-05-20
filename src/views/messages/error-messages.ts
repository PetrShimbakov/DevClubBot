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
		content: "Время на заполнение анкеты истекло. В следующий раз попробуйте завершить её чуть быстрее.",
		flags: MessageFlags.Ephemeral
	};

	public readonly userNotRegistered: InteractionReplyOptions = {
		content: "Данный пользователь не зарегистрирован как разработчик.",
		flags: MessageFlags.Ephemeral
	};
}

const errorMessages = new ErrorMessages();
export default errorMessages;
