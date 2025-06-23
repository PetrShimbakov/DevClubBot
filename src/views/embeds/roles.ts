import { EmbedBuilder } from "discord.js";
import config from "../../config";

const rolesEmbed = new EmbedBuilder()

	.setTitle("Приветствуем тебя на нашем сервере!")
	.setColor("#816CE0")
	.setImage(config.imageUrls.banner)
	.setDescription(
		"Чтобы быстро войти в наши ряды, выбери один или несколько из следующих пунктов в зависимости от твоих интересов и навыков. Не переживай, изменения можно будет внести в любой момент."
	)
	.setFooter({
		text: "Добавляйте роли повторным открытием меню. Снять роль — повторный клик.",
		iconURL: config.imageUrls.logo
	})
	.addFields(
		{
			name: `<:Client:${config.emojiIds.client}> Client (Заказчик)`,
			value:
				"Есть идея для игры? Закажи её разработку у нас. Заказчик формулирует требования и работает с командой для реализации проекта."
		},
		{
			name: `<:Builder:${config.emojiIds.builder}> Builder (Строитель)`,
			value: "Создаёт уровни и локации в Roblox Studio, проектируя карты и размещая объекты для увлекательной игры."
		},
		{
			name: `<:Modeler:${config.emojiIds.modeler}> Modeler (Моделлер)`,
			value: "Создаёт 3D-объекты и текстуры в Blender или 3ds Max, создает персонажей, предметы и другие игровые элементы."
		},
		{
			name: `<:Scripter:${config.emojiIds.scripter}> Scripter (Скриптер)`,
			value: "Программирует функциональность игры, создавая код для управления действиями и взаимодействиями в игре."
		},
		{
			name: `<:AudioSpecialist:${config.emojiIds.audioSpecialist}> Audio Specialist (Аудио специалист)`,
			value: "Создаёт музыку и/или разрабатывает звуковые эффекты."
		},
		{
			name: `<:Designer:${config.emojiIds.designer}> Designer (Дизайнер)`,
			value:
				"Разрабатывает визуальные элементы интерфейса, иконки и общее оформление игры, обеспечивая привлекательный и удобный пользовательский опыт."
		}
	);

export default rolesEmbed;
