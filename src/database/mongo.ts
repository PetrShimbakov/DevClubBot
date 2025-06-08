import { MongoClient } from "mongodb";
import config from "../config";

const mongoClient = new MongoClient(config.database.url);

export async function getDataBase() {
	const client = await mongoClient.connect();
	return client.db(config.database.name);
}
