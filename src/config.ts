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
		designer: getEnvVar("DESIGNER_ROLE_ID"),
		animator: getEnvVar("ANIMATOR_ROLE_ID"),
		rigger: getEnvVar("RIGGER_ROLE_ID"),
		vfxArtist: getEnvVar("VFX_ARTIST_ROLE_ID")
	};

	public readonly roleIds = {
		everyone: getEnvVar("EVERYONE_ROLE_ID"),
		administrator: getEnvVar("ADMINISTRATOR_ROLE_ID"),
		booster: getEnvVar("BOOSTER_ROLE_ID"),
		superClient: getEnvVar("SUPER_CLIENT_ROLE_ID")
	};

	public readonly emojiIds = {
		client: getEnvVar("CLIENT_EMOJI_ID"),
		builder: getEnvVar("BUILDER_EMOJI_ID"),
		modeler: getEnvVar("MODELER_EMOJI_ID"),
		scripter: getEnvVar("SCRIPTER_EMOJI_ID"),
		audioSpecialist: getEnvVar("AUDIO_SPECIALIST_EMOJI_ID"),
		designer: getEnvVar("DESIGNER_EMOJI_ID"),
		animator: getEnvVar("ANIMATOR_EMOJI_ID"),
		rigger: getEnvVar("RIGGER_EMOJI_ID"),
		vfxArtist: getEnvVar("VFX_ARTIST_EMOJI_ID")
	};

	public readonly guildId = getEnvVar("GUILD_ID");
}

function getEnvVar(name: keyof typeof process.env): string {
	const envVar = process.env[name];
	if (typeof envVar === "string") return envVar;
	throw new Error(`Environment variable ${name} is required but was not provided.`);
}

export default Config.get();
