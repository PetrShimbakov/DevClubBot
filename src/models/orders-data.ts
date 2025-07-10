import { Collection } from "mongodb";
import { ORDERS_COLLECTION } from "../constants/db-collection-names";
import { getDataBase } from "../database/mongo";
import { OrderData, OrderType } from "../types/order";

class OrdersData {
	private _collection?: Collection<OrderData>;

	private async getCollection() {
		return this._collection ?? (this._collection = (await getDataBase()).collection<OrderData>(ORDERS_COLLECTION));
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

			return order;
		} catch (error: any) {
			if (error?.code === 11000) {
				// MongoDB duplicate key error code
				const existingOrder = await collection.findOne({ userDiscordId, orderNumber: nextOrderNumber });
				if (!existingOrder) throw new Error("Order not found after duplicate key error.");
				return existingOrder;
			}
			throw error;
		}
	}

	public async removeOrder(userDiscordId: string, orderNumber: number): Promise<void> {
		const collection = await this.getCollection();
		await collection.deleteOne({ userDiscordId, orderNumber });

		await collection.updateMany({ userDiscordId, orderNumber: { $gt: orderNumber } }, { $inc: { orderNumber: -1 } });
	}

	public async removeOrders(userDiscordId: string): Promise<void> {
		const collection = await this.getCollection();
		await collection.deleteMany({ userDiscordId });
	}

	public async getOrders(userDiscordId?: string): Promise<OrderData[]> {
		const collection = await this.getCollection();
		const filter = userDiscordId ? { userDiscordId } : {};
		return collection.find(filter).toArray();
	}

	public async hasOrder(userDiscordId: string, orderNumber: number): Promise<boolean> {
		const collection = await this.getCollection();
		const order = await collection.findOne({ userDiscordId, orderNumber });
		return !!order;
	}
}

const ordersData = new OrdersData();
export default ordersData;
