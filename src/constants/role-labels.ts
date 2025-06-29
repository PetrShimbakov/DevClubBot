import config from "../config";

export const roleLabels: { [id: (typeof config.devRoleIds)[keyof typeof config.devRoleIds]]: string } = {
	[config.devRoleIds.client]: "Client",
	[config.devRoleIds.builder]: "Builder",
	[config.devRoleIds.modeler]: "Modeler",
	[config.devRoleIds.scripter]: "Scripter",
	[config.devRoleIds.audioSpecialist]: "Audio Specialist",
	[config.devRoleIds.designer]: "Designer",
	[config.devRoleIds.animator]: "Animator",
	[config.devRoleIds.rigger]: "Rigger",
	[config.devRoleIds.vfxArtist]: "VFX Artist"
};

export const detailedRoleLabels: Record<keyof typeof config.devRoleIds, string> = {
	client: "Client (Заказчик)",
	builder: "Builder (Строитель)",
	modeler: "Modeler (Моделлер)",
	scripter: "Scripter (Скриптер)",
	audioSpecialist: "Audio Specialist (Аудио специалист)",
	designer: "Designer (Дизайнер)",
	animator: "Animator (Аниматор)",
	vfxArtist: "VFX Artist (VFX-художник)",
	rigger: "Rigger (Риггер)"
};
