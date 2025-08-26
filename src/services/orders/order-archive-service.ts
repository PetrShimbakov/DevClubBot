import { AttachmentBuilder, ChannelType, GuildTextBasedChannel, Message } from "discord.js";
import client from "../../client";
import config from "../../config";
import { MAX_ATTACHMENT_SIZE } from "../../constants/discord-limits";
import { OrderData } from "../../types/order";
import messages from "../../views/messages/messages";

function buildUtf8Txt(content: string): Buffer {
	return Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from(content, "utf8")]);
}

function formatMessage(message: Message): string {
	const timestamp = message.createdAt.toISOString();
	const author = message.author.username;
	const authorId = message.author.id;
	const content = message.content;

	let formattedMessage = `[${timestamp}] ${author} (${authorId}):`;

	if (content) {
		formattedMessage +=
			"\n" +
			content
				.split("\n")
				.map(l => ` > ${l}`)
				.join("\n");
	}

	formattedMessage += `\n🔍 ID: ${message.id}`;

	if (message.reference?.messageId) formattedMessage += `\n↩️ Ответ: ${message.reference.messageId}`;

	message.attachments.forEach(attachment => {
		formattedMessage += `\n📎 Вложение: ${attachment.name} (${attachment.url})`;
	});

	if (message.stickers?.size) {
		message.stickers.forEach(st => {
			formattedMessage += `\n🏷 Стикер: ${st.name} (${st.id})`;
		});
	}

	if (message.reactions?.cache?.size) {
		const parts: string[] = [];
		message.reactions.cache.forEach(r => {
			const emoji = r.emoji?.toString?.() || r.emoji?.name || "?";
			parts.push(`${emoji} x${r.count ?? 0}`);
		});
		if (parts.length) {
			formattedMessage += `\n💬 Реакции: ${parts.join(", ")}`;
		}
	}

	if (message.editedTimestamp) {
		formattedMessage += `\n✏️ Отредактировано: ${new Date(message.editedTimestamp).toISOString()}`;
	}

	return formattedMessage;
}

async function sendArchiveChunk(initialMessage: Message<true> | undefined, order: OrderData, currentParts: string[], currentPart: number, separator: string) {
	const currentArchive = new AttachmentBuilder(buildUtf8Txt(currentParts.join(separator)), {
		name: `архив-заказа-№${order.orderNumber}_часть-${String(currentPart).padStart(3, "0")}.txt`
	});

	if (initialMessage) {
		await initialMessage.reply(messages.orderArchiveAdditionalFiles(order.orderNumber, [currentArchive]));
	} else {
		const guild = client.guilds.cache.get(config.guildId) || (await client.guilds.fetch(config.guildId));
		const forum = guild.channels.cache.get(config.channels.ordersArchive) || (await guild.channels.fetch(config.channels.ordersArchive));
		if (!forum || !forum.isThreadOnly() || forum.type !== ChannelType.GuildForum) throw new Error("order-archive-service: orders archive channel is not sendable!");

		const thread = await forum.threads.create({
			name: `Заказ номер ${order.orderNumber}`,
			message: messages.orderArchive(order.orderNumber, [currentArchive])
		});

		const starterMessage = await thread.fetchStarterMessage();
		if (!starterMessage) throw new Error("order-archive-service: Failed to fetch the starter message of the thread");
		initialMessage = starterMessage;
	}

	return initialMessage;
}

const separator = "\n\n\n\n";
const sepSize = Buffer.byteLength(separator, "utf8");
const batchSize = 100;

export async function archiveOrderChat(channel: GuildTextBasedChannel, order: OrderData): Promise<Message<true>> {
	let before: string | undefined = undefined;
	let initialMessage: Message<true> | undefined = undefined;
	let currentPart = 0;
	let currentParts: string[] = [];
	let currentSize = 0;

	while (true) {
		const batch = await channel.messages.fetch(before ? { limit: batchSize, before } : { limit: batchSize });
		if (!batch.size) break;

		const page: Message[] = Array.from(batch.values());
		page.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

		for (const msg of page) {
			const text = formatMessage(msg);
			const textSize = Buffer.byteLength(text, "utf8");

			const projectedSize = currentSize + (currentParts.length ? sepSize : 0) + textSize;
			if (projectedSize > MAX_ATTACHMENT_SIZE && currentParts.length) {
				initialMessage = await sendArchiveChunk(initialMessage, order, currentParts, ++currentPart, separator);
				currentParts = [];
				currentSize = 0;
			}

			const addSize = (currentParts.length ? sepSize : 0) + textSize;
			currentParts.push(text);
			currentSize += addSize;
		}
		const oldest = page[0];
		before = oldest?.id;
		if (batch.size < batchSize) break;
	}
	if (currentParts.length > 0) initialMessage = await sendArchiveChunk(initialMessage, order, currentParts, ++currentPart, separator);

	if (!initialMessage) {
		const emptyArchive = new AttachmentBuilder(buildUtf8Txt("Нет сообщений в этом канале."), {
			name: `архив-заказа-№${order.orderNumber}_часть-001.txt`
		});

		const guild = client.guilds.cache.get(config.guildId) || (await client.guilds.fetch(config.guildId));
		const forum = guild.channels.cache.get(config.channels.ordersArchive) || (await guild.channels.fetch(config.channels.ordersArchive));
		if (!forum || !forum.isThreadOnly() || forum.type !== ChannelType.GuildForum) throw new Error("order-archive-service: orders archive channel is not sendable!");

		const thread = await forum.threads.create({
			name: `Заказ номер ${order.orderNumber} (нет сообщений)`,
			message: messages.orderArchive(order.orderNumber, [emptyArchive])
		});

		const starterMessage = await thread.fetchStarterMessage();
		if (!starterMessage) throw new Error("order-archive-service: Failed to fetch the starter message of the thread");
		initialMessage = starterMessage;
	}
	return initialMessage;
}
