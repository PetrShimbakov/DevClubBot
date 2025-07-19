import { Collection, ObjectId } from "mongodb";
import { ORDERS_COLLECTION } from "../constants/db-collection-names";
import { getDataBase } from "../database/mongo";
import { OrderData, OrderType } from "../types/order";

class OrdersData {
	private _collection?: Collection<Omit<OrderData, "id">>;

	private async getCollection(): Promise<Collection<Omit<OrderData, "id">>> {
		return (
			this._collection ?? (this._collection = (await getDataBase()).collection<Omit<OrderData, "id">>(ORDERS_COLLECTION))
		);
	}

	private toOrderData(document: Omit<OrderData, "id"> & { _id: ObjectId }): OrderData {
		return {
			id: document._id,
			type: document.type,
			userDiscordId: document.userDiscordId,
			description: document.description,
			budget: document.budget,
			orderChannelId: document.orderChannelId,
			orderNumber: document.orderNumber,
			createdAt: document.createdAt,
			isTaken: document.isTaken,
			takenBy: document.takenBy,
			orderTakenMessageId: document.orderTakenMessageId
		};
	}

	public async addOrder(
		type: OrderType,
		userDiscordId: string,
		description: string,
		budget: string,
		orderChannelId: string
	): Promise<OrderData> {
		const collection = await this.getCollection();

		const lastOrder = await collection.find({ userDiscordId }).sort({ orderNumber: -1 }).limit(1).next();
		const nextOrderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1;

		try {
			const result = await collection.insertOne({
				type,
				userDiscordId,
				description,
				budget,
				orderChannelId,
				orderNumber: nextOrderNumber,
				createdAt: new Date(),
				isTaken: false
			});
			const order = await collection.findOne({ _id: result.insertedId });
			if (!order) throw new Error("Order not found after insertion.");
			return this.toOrderData(order);
		} catch (error: any) {
			if (error?.code === 11000) {
				// MongoDB duplicate key error code
				const existingOrder = await collection.findOne({ userDiscordId, orderNumber: nextOrderNumber });
				if (!existingOrder) throw new Error("Order not found after duplicate key error.");
				return this.toOrderData(existingOrder);
			}
			throw error;
		}
	}

	public async removeOrder(orderId: ObjectId): Promise<void> {
		const collection = await this.getCollection();
		const order = await collection.findOne({ _id: orderId });
		if (!order) return;
		await collection.deleteOne({ _id: orderId });
		await collection.updateMany(
			{ userDiscordId: order.userDiscordId, orderNumber: { $gt: order.orderNumber } },
			{ $inc: { orderNumber: -1 } }
		);
	}

	public async removeOrders(userDiscordId: string): Promise<void> {
		const collection = await this.getCollection();
		await collection.deleteMany({ userDiscordId });
	}

	public async getOrders(userDiscordId?: string): Promise<OrderData[]> {
		const collection = await this.getCollection();
		const filter = userDiscordId ? { userDiscordId } : {};
		return (await collection.find(filter).toArray()).map(document => this.toOrderData(document));
	}

	public async getOrder(orderId: ObjectId): Promise<OrderData | null> {
		const collection = await this.getCollection();
		const document = await collection.findOne({ _id: orderId });
		if (!document) return null;
		return this.toOrderData(document);
	}

	public async takeOrder(orderId: ObjectId, takenBy: string): Promise<void> {
		const collection = await this.getCollection();
		const result = await collection.updateOne({ _id: orderId, isTaken: false }, { $set: { isTaken: true, takenBy } });
		if (result.matchedCount === 0) {
			throw new Error("Order not found or already taken.");
		}
	}

	public async rejectOrder(orderId: ObjectId): Promise<void> {
		const collection = await this.getCollection();
		const result = await collection.updateOne(
			{ _id: orderId, isTaken: true },
			{ $set: { isTaken: false }, $unset: { takenBy: "" } }
		);
		if (result.matchedCount === 0) {
			throw new Error("Order not found or not taken.");
		}
	}

	public async countTakenOrdersByUser(userDiscordId: string): Promise<number> {
		const collection = await this.getCollection();
		return collection.countDocuments({ takenBy: userDiscordId });
	}

	public async setOrderTakenMessageId(orderId: ObjectId, messageId: string): Promise<void> {
		const collection = await this.getCollection();
		await collection.updateOne({ _id: orderId }, { $set: { orderTakenMessageId: messageId } });
	}

	public async unsetOrderTakenMessageId(orderId: ObjectId): Promise<void> {
		const collection = await this.getCollection();
		await collection.updateOne({ _id: orderId }, { $unset: { orderTakenMessageId: "" } });
	}
}

const ordersData = new OrdersData();
export default ordersData;
