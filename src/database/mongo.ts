import { Db, MongoClient } from "mongodb";
import config from "../config";

const mongoClient = new MongoClient(config.database.url);

let dataBase: Db;

export async function getDataBase() {
	if (dataBase) return dataBase;
	const client = await mongoClient.connect();
	return (dataBase = client.db(config.database.name));
}
