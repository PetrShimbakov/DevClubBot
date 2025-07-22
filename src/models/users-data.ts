import { Collection, UpdateFilter } from "mongodb";
import { USERS_COLLECTION } from "../constants/db-collection-names";
import { getDataBase } from "../database/mongo";
import { IUserData, RoleData } from "../types/user-data";

class UsersData {
	private _collection?: Collection<IUserData>;

	private async getCollection() {
		if (this._collection) return this._collection;
		const collection = (this._collection = (await getDataBase()).collection<IUserData>(USERS_COLLECTION));
		collection.createIndex({ discordId: 1 }, { unique: true });
		return collection;
	}

	public async addUser(discordId: string, name: string): Promise<void> {
		const usersCollection = await this.getCollection();
		try {
			await usersCollection.insertOne({
				name,
				discordId,
				createdAt: new Date(),
				rolesData: [],
				permissions: {
					canCreateOrders: true,
					canTakeOrders: true,
					canWriteSupport: true
				}
			});
		} catch (error: any) {
			if (error?.code === 11000) return; // MongoDB duplicate key error code
			throw error;
		}
	}

	public async removeUser(discordId: string): Promise<void> {
		const usersCollection = await this.getCollection();
		await usersCollection.deleteOne({ discordId });
	}

	public async getUser(discordId: string): Promise<IUserData | undefined> {
		const usersCollection = await this.getCollection();
		return (await usersCollection.findOne({ discordId })) ?? undefined;
	}

	public async addRole(discordId: string, roleData: RoleData, newUserName: string): Promise<void> {
		const usersCollection = await this.getCollection();

		const update: UpdateFilter<IUserData> = {
			$push: { rolesData: roleData },
			...(newUserName ? { $set: { name: newUserName } } : {})
		};

		await usersCollection.updateOne({ discordId }, update);
	}

	public async removeRole(discordId: string, roleId: RoleData["roleId"]): Promise<void> {
		const usersCollection = await this.getCollection();
		await usersCollection.updateOne({ discordId }, { $pull: { rolesData: { roleId } } });
	}

	public async updateBio(discordId: string, bio: string) {
		const usersCollection = await this.getCollection();
		await usersCollection.updateOne({ discordId }, { $set: { bio } });
	}

	// TODO: Добавить проверку доступа в контроллеры
	public async disablePermission(discordId: string, permissionKey: keyof IUserData["permissions"]): Promise<void> {
		const usersCollection = await this.getCollection();
		await usersCollection.updateOne({ discordId }, { $set: { [`permissions.${permissionKey}`]: false } });
	}

	public async enablePermission(discordId: string, permissionKey: keyof IUserData["permissions"]): Promise<void> {
		const usersCollection = await this.getCollection();
		await usersCollection.updateOne({ discordId }, { $set: { [`permissions.${permissionKey}`]: true } });
	}

	public async isUserRegistered(discordId: string): Promise<boolean> {
		const usersCollection = await this.getCollection();
		const user = await usersCollection.findOne({ discordId });
		return !!user;
	}
}

const usersData = new UsersData();
export default usersData;
