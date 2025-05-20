import "dotenv/config";

interface IConfig {
	bot: {
		token: string;
		id: string;
	};
	imageUrls: {
		logo: string;
		banner: string;
	};
	roleIds: {
		administrator: string;
		client: string;
		builder: string;
		modeler: string;
		scripter: string;
		audioSpecialist: string;
	};
	guildId: string;
}

class Config implements IConfig {
	private static instance: Config;
	private constructor() {}

	public static get(): Config {
		return Config.instance ?? (Config.instance = new Config());
	}

	public readonly bot = {
		token: getEnvVar("TOKEN"),
		id: getEnvVar("CLIENT_ID")
	};
	public readonly imageUrls = {
		logo: getEnvVar("LOGO"),
		banner: getEnvVar("BANNER")
	};
	public readonly roleIds = {
		administrator: getEnvVar("ADMINISTRATOR_ROLE_ID"),
		client: getEnvVar("CLIENT_ROLE_ID"),
		builder: getEnvVar("BUILDER_ROLE_ID"),
		modeler: getEnvVar("MODELER_ROLE_ID"),
		scripter: getEnvVar("SCRIPTER_ROLE_ID"),
		audioSpecialist: getEnvVar("AUDIO_SPECIALIST_ROLE_ID"),
		member: getEnvVar("MEMBER_ROLE_ID")
	};
	public readonly guildId = getEnvVar("GUILD_ID");
}

function getEnvVar(name: keyof typeof process.env): string {
	const envVar = process.env[name];
	if (typeof envVar === "string") return envVar;
	throw new Error(`Environment variable ${name} is required but was not provided.`);
}

export default Config.get();
