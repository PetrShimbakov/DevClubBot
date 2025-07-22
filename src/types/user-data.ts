import { ObjectId } from "mongodb";
import config from "../config";

export interface RoleData {
	roleId: (typeof config.devRoleIds)[keyof typeof config.devRoleIds];
	beginner?: boolean;
}

export interface IUserData {
	_id?: ObjectId;
	discordId: string;
	name: string;
	bio?: string;
	createdAt: Date;
	rolesData: RoleData[];
	permissions: {
		canCreateOrders: boolean;
		canTakeOrders: boolean;
		canWriteSupport: boolean;
	};
}
