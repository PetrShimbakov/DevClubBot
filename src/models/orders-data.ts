import { Collection, ObjectId } from "mongodb";
import { COUNTERS_COLLECTION, ORDERS_COLLECTION } from "../constants/db-collection-names";
import { ORDER_COUNTER_KEY } from "../constants/db-keys";
import { getDataBase } from "../database/mongo";
import { OrderData, OrderType } from "../types/order";

class OrdersData {
	private _collection?: Collection<Omit<OrderData, "id">>;
	private _countersCollection?: Collection<{ _id: string; seq: number }>;

	private async getCollection(): Promise<Collection<Omit<OrderData, "id">>> {
		if (this._collection) return this._collection;
		const collection = (this._collection = (await getDataBase()).collection<Omit<OrderData, "id">>(ORDERS_COLLECTION));
		collection.createIndex({ orderNumber: 1 }, { unique: true });
		return collection;
	}

	private async getNextOrderNumber(): Promise<number> {
		const db = await getDataBase();
		const counters = this._countersCollection ?? (this._countersCollection = db.collection<{ _id: string; seq: number }>(COUNTERS_COLLECTION));
		const result = await counters.findOneAndUpdate({ _id: ORDER_COUNTER_KEY }, { $inc: { seq: 1 } }, { upsert: true, returnDocument: "after" });
		if (!result) throw new Error("Failed to get next order number: database counter document missing or malformed.");
		return result.seq || 1;
	}

	private toOrderData(document: Omit<OrderData, "id"> & { _id: ObjectId }): OrderData {
		return {
			id: document._id,
			type: document.type,
			orderedBy: document.orderedBy,
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

	public async addOrder(type: OrderType, orderedBy: string, description: string, budget: string, orderChannelId: string): Promise<OrderData> {
		const collection = await this.getCollection();
		const nextOrderNumber = await this.getNextOrderNumber();

		try {
			const result = await collection.insertOne({
				type,
				orderedBy,
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
				const existingOrder = await collection.findOne({ orderNumber: nextOrderNumber });
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
	}

	public async removeOrders(orderedBy: string): Promise<void> {
		const collection = await this.getCollection();
		await collection.deleteMany({ orderedBy });
	}

	public async getOrders(orderedBy?: string): Promise<OrderData[]> {
		const collection = await this.getCollection();
		const filter = orderedBy ? { orderedBy } : {};
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
		const result = await collection.updateOne({ _id: orderId }, { $set: { isTaken: true, takenBy } });
		if (result.matchedCount === 0) {
			throw new Error("Order not found or already taken.");
		}
	}

	public async rejectOrder(orderId: ObjectId): Promise<void> {
		const collection = await this.getCollection();
		const result = await collection.updateOne({ _id: orderId }, { $set: { isTaken: false }, $unset: { takenBy: "" } });
		if (result.matchedCount === 0) {
			throw new Error("Order not found or not taken.");
		}
	}

	public async countTakenOrdersByUser(userId: string): Promise<number> {
		const collection = await this.getCollection();
		return collection.countDocuments({ takenBy: userId });
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
