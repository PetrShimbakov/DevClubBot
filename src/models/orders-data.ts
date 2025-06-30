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
		orderNumber: number,
		userDiscordId: string,
		description: string,
		budget: string
	): Promise<void> {
		const collection = await this.getCollection();
		try {
			await collection.insertOne({
				type,
				userDiscordId,
				description,
				budget,
				orderNumber,
				createdAt: new Date(),
				isTaken: false
			});
		} catch (error: any) {
			if (error?.code === 11000) return; // MongoDB duplicate key error code
			throw error;
		}
	}

	public async makeOrderPriority(userDiscordId: string, orderNumber: number): Promise<void> {
		const collection = await this.getCollection();
		await collection.updateOne({ userDiscordId, orderNumber }, { $set: { isPriority: true } });
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
