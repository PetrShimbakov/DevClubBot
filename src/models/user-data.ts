import { Collection } from "mongodb";
import { IUserData, RoleData } from "./types/user-types";
import { getDataBase } from "../database/mongo";

export class UserData {
	private _collection?: Collection<IUserData>;

	private async getCollection() {
		return this._collection ?? (this._collection = (await getDataBase()).collection<IUserData>("users"));
	}

	public async addUser(discordId: string, firstRole: RoleData): Promise<void> {
		const usersCollection = await this.getCollection();
		await usersCollection.insertOne({
			discordId,
			createdAt: new Date(),
			rolesData: [firstRole]
		});
	}

	public async removeUser(discordId: string): Promise<void> {
		const usersCollection = await this.getCollection();
		await usersCollection.deleteOne({ discordId });
	}

	public async getUser(discordId: string): Promise<IUserData | null> {
		const usersCollection = await this.getCollection();
		return usersCollection.findOne({ discordId });
	}

	public async addRole(discordId: string, roleData: RoleData): Promise<void> {
		const usersCollection = await this.getCollection();
		await usersCollection.updateOne({ discordId }, { $push: { rolesData: roleData } });
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

const userData = new UserData();
export default userData;
