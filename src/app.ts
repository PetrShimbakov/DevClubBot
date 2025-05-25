import config from "./config";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { initializeCommandsController } from "./controllers/commands-controller";

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

// TODO
if (process.env.npm_lifecycle_event == "dev") console.log("\x1b[31mНе забыть проверить типы через компилятор!\x1b[0m");

client.once(Events.ClientReady, () => {
	initializeCommandsController(client);
	console.log(`Бот ${client.user ? client.user.tag : "без тега"} успешно авторизовался!`);
});

client.on(Events.GuildMemberRemove, member => {
	console.log(`${member.user.tag} нас кинул.`);
});

client.login(config.bot.token);
