import { Db, MongoClient } from "mongodb";
import config from "../config";
import { ORDERS_COLLECTION, USERS_COLLECTION } from "../constants/db-collection-names";

const mongoClient = new MongoClient(config.database.url);

let dataBase: Db;

export async function getDataBase() {
	if (dataBase) return dataBase;
	const client = await mongoClient.connect();
	return (dataBase = client.db(config.database.name));
}

export async function ensureDataBaseIndexes() {
	const db = await getDataBase();
	await db.collection(USERS_COLLECTION).createIndex({ discordId: 1 }, { unique: true });
	await db.collection(ORDERS_COLLECTION).createIndex({ userDiscordId: 1, orderNumber: 1 }, { unique: true });
}
