import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import config from "../../config";

const roleOptions = [
	new StringSelectMenuOptionBuilder()
		.setLabel("Client (Заказчик)")
		.setValue(config.roleIds.client)
		.setEmoji({ id: config.emojiIds.client, name: "Client" })
		.setDescription("Ты идею — мы панику и кофе."),

	new StringSelectMenuOptionBuilder()
		.setLabel("Builder (Строитель)")
		.setValue(config.roleIds.builder)
		.setEmoji({ id: config.emojiIds.builder, name: "Builder" })
		.setDescription("Гравитация — это только рекомендация."),

	new StringSelectMenuOptionBuilder()
		.setLabel("Modeler (Моделлер)")
		.setValue(config.roleIds.modeler)
		.setEmoji({ id: config.emojiIds.modeler, name: "Modeler" })
		.setDescription("Если красиво не вышло, скажи, что артхаус."),

	new StringSelectMenuOptionBuilder()
		.setLabel("Scripter (Скриптер)")
		.setValue(config.roleIds.scripter)
		.setEmoji({ id: config.emojiIds.scripter, name: "Scripter" })
		.setDescription("Код работает? Значит, ты ещё не закончил."),

	new StringSelectMenuOptionBuilder()
		.setLabel("Audio Specialist (Аудио специалист)")
		.setValue(config.roleIds.audioSpecialist)
		.setEmoji({ id: config.emojiIds.audioSpecialist, name: "AudioSpecialist" })
		.setDescription("Тише не надо. Врубим погромче."),

	new StringSelectMenuOptionBuilder()
		.setLabel("Designer (Дизайнер)")
		.setValue(config.roleIds.designer)
		.setEmoji({ id: config.emojiIds.designer, name: "Designer" })
		.setDescription("Не баг, а фича дизайна.")
];

const roleSelectMenu = new StringSelectMenuBuilder()
	.setCustomId("roles-select-menu")
	.setPlaceholder("Выбери свою роль.")
	.setMinValues(1)
	.setMaxValues(1)
	.addOptions(roleOptions);

export default roleSelectMenu;
