import client from "../../client";
import config from "../../config";
import { OrderType } from "../../types/order";
import messages from "../../views/messages/messages";

export async function sendOrder(orderType: OrderType) {
	try {
		const channel = await client.channels.fetch(config.channels.ordersList);
		if (!channel) throw new Error("send-order-service: Failed to find the ordersList channel.");
		if (!channel.isSendable()) throw new Error("send-order-service: Cannot send message: ordersList channel is not sendable.");
		await channel.send(messages.newOrder(orderType));
	} catch (error) {
		console.error(`[send-order-service] Error while sending order:`, error);
	}
}
