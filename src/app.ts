import config from "./config";
import { Client, Events, GatewayIntentBits } from "discord.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.once(Events.ClientReady, () => {
	console.log(`Бот ${client.user ? client.user.tag : "без тега"} успешно авторизовался!`);
});

client.on(Events.GuildMemberRemove, member => {
	console.log(`${member.user.tag} нас кинул.`);
});

client.login(config.bot.token);
