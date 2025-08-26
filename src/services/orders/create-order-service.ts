import { ChannelType, PermissionFlagsBits, TextChannel, User } from "discord.js";
import client from "../../client";
import config from "../../config";
import ordersData from "../../models/orders-data";
import { OrderData, OrderType } from "../../types/order";
import messages from "../../views/messages/messages";
import { sendOrder } from "./send-order-service";

export async function createOrder(user: User, orderDescription: string, orderBudget: string, orderType: OrderType) {
	let orderChannel: TextChannel | undefined;
	let orderData: OrderData | undefined;
	try {
		const guild = client.guilds.cache.get(config.guildId) || (await client.guilds.fetch(config.guildId));
		const orderChannelCategory = guild.channels.cache.get(config.categories.orderChats);

		if (!orderChannelCategory || orderChannelCategory.type !== ChannelType.GuildCategory) {
			throw new Error("orderChats category not found.");
		}

		orderChannel = await guild.channels.create({
			name: "not-configured",
			type: ChannelType.GuildText,
			parent: orderChannelCategory.id,
			permissionOverwrites: [
				{
					id: guild.roles.everyone,
					deny: [PermissionFlagsBits.ViewChannel]
				}
			]
		});

		orderData = await ordersData.addOrder(orderType, user.id, orderDescription, orderBudget, orderChannel.id);
		const member = guild.members.cache.get(user.id) || (await guild.members.fetch(user.id));

		if (!member) throw new Error(`configureChannel: Order owner not found. Order: ${orderData.id}`);
		if (!orderChannel || orderChannel.type !== ChannelType.GuildText) throw new Error(`configureChannel: Order channel not found. Order: ${orderData}`);

		let channelName = `💼︱заказ-${member.displayName}︱${orderData.orderNumber}`;
		if (channelName.length > 100) channelName = channelName.slice(0, 97) + "...";

		await orderChannel.setName(channelName);

		await orderChannel.permissionOverwrites.edit(orderData.orderedBy, {
			ViewChannel: true,
			SendMessages: true,
			AttachFiles: true,
			ReadMessageHistory: true
		});

		await orderChannel.permissionOverwrites.edit(config.roleIds.moderator, {
			ViewChannel: true,
			SendMessages: true,
			AttachFiles: true,
			ReadMessageHistory: true
		});

		await orderChannel.send(messages.newOrderChannelInfo(orderData));

		await sendOrder(orderType, user.id);
	} catch (err) {
		if (orderChannel)
			await orderChannel.delete().catch(err => console.error(`[create-order-service] Failed to remove order channel during rollback (ID: ${orderData?.id ?? "unknown"}):`, err));
		if (orderData)
			await ordersData
				.removeOrder(orderData.id)
				.catch(err => console.error(`[create-order-service] Failed to remove order from database during rollback (ID: ${orderData?.id ?? "unknown"}):`, err));

		throw err;
	}
}
