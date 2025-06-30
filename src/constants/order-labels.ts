import { OrderType } from "../types/order";

export const orderLabels: Record<OrderType, string> = {
	[OrderType.Game]: "Игра целиком",
	[OrderType.Asset]: "Объект для Roblox",
	[OrderType.Model]: "3D-модель",
	[OrderType.Script]: "Скрипт или код",
	[OrderType.Plugin]: "Плагин для Roblox Studio",
	[OrderType.Image]: "Картинка или постер",
	[OrderType.Icon]: "Иконка",
	[OrderType.UI]: "Интерфейс (UI)",
	[OrderType.Audio]: "Музыка и звуки",
	[OrderType.Effect]: "Визуальные эффекты",
	[OrderType.Animation]: "Анимация",
	[OrderType.Rig]: "Риггинг"
};

export const orderDescriptions: Record<OrderType, string> = {
	[OrderType.Game]: "Полноценная игра, разработанная на платформе Roblox.",
	[OrderType.Asset]: "Отдельный элемент уровня или объект для игр на Roblox.",
	[OrderType.Model]: "3D-модель в форматах OBJ, FBX и других для различных задач.",
	[OrderType.Script]: "Скрипт или программный код, используемый в играх и приложениях на Roblox.",
	[OrderType.Plugin]: "Дополнительный инструмент или расширение для Roblox Studio.",
	[OrderType.Image]: "Графика, обложки, постеры и другие изображения.",
	[OrderType.Icon]: "Отдельная иконка для интерфейсов или меню.",
	[OrderType.UI]: "Элементы интерфейса пользователя (например, ScreenGui, SurfaceGui).",
	[OrderType.Audio]: "Звуковые эффекты или музыкальные композиции.",
	[OrderType.Effect]: "Различные визуальные эффекты, включая VFX и частицы.",
	[OrderType.Animation]: "Анимации персонажей, объектов и окружения.",
	[OrderType.Rig]: "Создание скелета для персонажей или объектов, настройка ригов для анимаций."
};

export const orderEmojis: Record<OrderType, string> = {
	[OrderType.Game]: "🎮",
	[OrderType.Asset]: "🧱",
	[OrderType.Model]: "🧸",
	[OrderType.Script]: "💻",
	[OrderType.Plugin]: "🔌",
	[OrderType.Image]: "🖼️",
	[OrderType.Icon]: "💠",
	[OrderType.UI]: "🖥️",
	[OrderType.Audio]: "🎵",
	[OrderType.Effect]: "✨",
	[OrderType.Animation]: "🎬",
	[OrderType.Rig]: "🤖"
};
