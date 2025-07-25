import { Events } from "discord.js";
import { name as appName } from "../package.json";
import client from "./client";
import config from "./config";
import handleInteractions from "./handlers/interaction-handler";
import handleMemberRemove from "./handlers/member-removed-handler";

async function main() {
	console.log(`🚀 Application ${appName} is starting up...`);

	if (process.env.npm_lifecycle_event == "dev") console.log("\x1b[31m❗️ Don't forget to check types with the compiler!\x1b[0m");

	client.once(Events.ClientReady, () => {
		handleInteractions();
		handleMemberRemove();
		console.log(`\x1b[32m✅ Bot ${client.user ? client.user.tag : "without a tag"} has successfully logged in!\x1b[0m`);
	});

	client.login(config.bot.token);
}

main();
