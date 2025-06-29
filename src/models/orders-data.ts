import { Collection } from "mongodb";
import { ORDERS_COLLECTION } from "../constants/db-collection-names";
import { getDataBase } from "../database/mongo";
import { OrderData, OrderType } from "../types/order";

class OrdersData {
	private _collection?: Collection<OrderData>;

	private async getCollection() {
		return this._collection ?? (this._collection = (await getDataBase()).collection<OrderData>(ORDERS_COLLECTION));
	}

	public async addOrder(type: OrderType, orderNumber: number, userDiscordId: string, description: string): Promise<void> {
		const collection = await this.getCollection();
		try {
			await collection.insertOne({
				type,
				userDiscordId,
				description,
				orderNumber,
				createdAt: new Date(),
				isPriority: false
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
	}

	public async getOrders(userDiscordId?: string): Promise<OrderData[]> {
		const collection = await this.getCollection();
		const filter = userDiscordId ? { userDiscordId } : {};
		return collection.find(filter).toArray();
	}
}

const ordersData = new OrdersData();
export default ordersData;
