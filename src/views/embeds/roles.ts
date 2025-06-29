import { EmbedBuilder } from "discord.js";
import config from "../../config";
import { detailedRoleLabels } from "../../constants/role-labels";

function getRoleHeading(role: keyof typeof config.devRoleIds): string {
	const emojiId = config.emojiIds[role];
	const label = detailedRoleLabels[role];

	if (!emojiId || !label) {
		const missing = [!emojiId ? "emoji ID (config.emojiIds)" : null, !label ? "role label (detailedRoleLabels)" : null]
			.filter(Boolean)
			.join(" and ");
		throw new Error(`[config] Missing ${missing} for role '${role}'. Please check your configuration.`);
	}

	return `<:emoji:${emojiId}> ${label}`;
}

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
			name: getRoleHeading("client"),
			value:
				"Есть идея для игры? Закажи её разработку у нас. Заказчик формулирует требования и работает с командой для реализации проекта."
		},
		{
			name: getRoleHeading("builder"),
			value: "Создаёт уровни и локации в Roblox Studio, проектируя карты и размещая объекты для увлекательной игры."
		},
		{
			name: getRoleHeading("modeler"),
			value: "Создаёт 3D-объекты и текстуры в Blender или 3ds Max, создает персонажей, предметы и другие игровые элементы."
		},
		{
			name: getRoleHeading("scripter"),
			value: "Программирует функциональность игры, создавая код для управления действиями и взаимодействиями в игре."
		},
		{
			name: getRoleHeading("audioSpecialist"),
			value: "Создаёт музыку и/или разрабатывает звуковые эффекты."
		},
		{
			name: getRoleHeading("designer"),
			value:
				"Разрабатывает визуальные элементы интерфейса, иконки и общее оформление игры, обеспечивая привлекательный и удобный пользовательский опыт."
		},
		{
			name: getRoleHeading("animator"),
			value: "Создаёт анимации персонажей, объектов и интерфейса для воплощения движения и жизни в игре."
		},
		{
			name: getRoleHeading("vfxArtist"),
			value: "Разрабатывает визуальные эффекты — от магии и взрывов до погодных явлений и спецэффектов интерфейса."
		},
		{
			name: getRoleHeading("rigger"),
			value:
				"Настраивает 3D-модели персонажей и объектов для анимаций — добавляет кости, риг и обеспечивает правильный импорт в Roblox Studio."
		}
	);

export default rolesEmbed;
