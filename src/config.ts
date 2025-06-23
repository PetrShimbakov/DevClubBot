import "dotenv/config";

class Config {
	private static instance: Config;
	private constructor() {}

	public static get(): Config {
		return Config.instance ?? (Config.instance = new Config());
	}

	public readonly database = {
		url: getEnvVar("DATABASE_URL"),
		name: getEnvVar("DATABASE_NAME")
	};

	public readonly bot = {
		token: getEnvVar("TOKEN"),
		id: getEnvVar("CLIENT_ID")
	};

	public readonly imageUrls = {
		logo: getEnvVar("LOGO"),
		banner: getEnvVar("BANNER")
	};

	public readonly devRoleIds = {
		client: getEnvVar("CLIENT_ROLE_ID"),
		builder: getEnvVar("BUILDER_ROLE_ID"),
		modeler: getEnvVar("MODELER_ROLE_ID"),
		scripter: getEnvVar("SCRIPTER_ROLE_ID"),
		audioSpecialist: getEnvVar("AUDIO_SPECIALIST_ROLE_ID"),
		designer: getEnvVar("DESIGNER_ROLE_ID")
	};

	public readonly devRoleLabels: { [id: string]: string } = {
		[this.devRoleIds.client]: "Client",
		[this.devRoleIds.builder]: "Builder",
		[this.devRoleIds.modeler]: "Modeler",
		[this.devRoleIds.scripter]: "Scripter",
		[this.devRoleIds.audioSpecialist]: "Audio Specialist",
		[this.devRoleIds.designer]: "Designer"
	};

	public readonly roleIds = {
		everyone: getEnvVar("EVERYONE_ROLE_ID"),
		administrator: getEnvVar("ADMINISTRATOR_ROLE_ID")
	};

	public readonly emojiIds = {
		client: getEnvVar("CLIENT_EMOJI_ID"),
		builder: getEnvVar("BUILDER_EMOJI_ID"),
		modeler: getEnvVar("MODELER_EMOJI_ID"),
		scripter: getEnvVar("SCRIPTER_EMOJI_ID"),
		audioSpecialist: getEnvVar("AUDIO_SPECIALIST_EMOJI_ID"),
		designer: getEnvVar("DESIGNER_EMOJI_ID")
	};

	public readonly guildId = getEnvVar("GUILD_ID");
}

function getEnvVar(name: keyof typeof process.env): string {
	const envVar = process.env[name];
	if (typeof envVar === "string") return envVar;
	throw new Error(`Environment variable ${name} is required but was not provided.`);
}

export default Config.get();
