export enum OrderType {
	Game = "game", // Игра целиком
	Asset = "asset", // Модель Roblox, часть уровня, объект
	Model = "model", // 3D-модель (OBJ, FBX и др.)
	Script = "script", // Скрипт или программный код
	Plugin = "plugin", // Плагин для Roblox Studio
	Image = "image", // Картинка (обложка, постер)
	Icon = "icon", // Иконка (отдельно)
	UI = "ui", // UI (интерфейс: ScreenGui, SurfaceGui)
	Audio = "audio", // Аудио (музыка, звуки)
	Effect = "effect", // Визуальные эффекты (VFX, частицы)
	Animation = "animation", // Анимация (например, для персонажей или объектов)
	Rig = "rig" // Риггинг (создание скелета для персонажа или объекта)
}

export interface OrderData {
	userDiscordId: string;
	orderNumber: number; // Order's sequential number for this user (starts from 1).
	type: OrderType;
	description: string;
	budget: string;
	createdAt: Date;
	isTaken: boolean;
	takenBy?: boolean;
}
