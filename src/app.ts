import config from "./config";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { handleInteractions } from "./handlers/interaction-handler";
import { ensureDataBaseIndexes } from "./database/mongo";
import { name as appName } from "../package.json";

async function main() {
	console.log(`🚀 Application ${appName} is starting up...`);

	const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

	// TODO
	if (process.env.npm_lifecycle_event == "dev")
		console.log("\x1b[31m❗️ Don't forget to check types with the compiler!\x1b[0m");

	await ensureDataBaseIndexes();

	client.once(Events.ClientReady, () => {
		handleInteractions(client);
		console.log(`\x1b[32m✅ Bot ${client.user ? client.user.tag : "without a tag"} has successfully logged in!\x1b[0m`);
	});

	client.on(Events.GuildMemberRemove, member => {
		console.log(`${member.user.tag} left us.`);
	});

	client.login(config.bot.token);
}

main();
