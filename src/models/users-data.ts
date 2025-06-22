import { Collection, UpdateFilter } from "mongodb";
import { IUserData, RoleData } from "../types/user-data";
import { getDataBase } from "../database/mongo";
import { USERS_COLLECTION } from "../constants/db-collection-names";

class UsersData {
	private _collection?: Collection<IUserData>;

	private async getCollection() {
		return this._collection ?? (this._collection = (await getDataBase()).collection<IUserData>(USERS_COLLECTION));
	}

	public async addUser(discordId: string, name: string): Promise<void> {
		const usersCollection = await this.getCollection();
		try {
			await usersCollection.insertOne({
				name,
				discordId,
				createdAt: new Date(),
				rolesData: []
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
}

const usersData = new UsersData();
export default usersData;
