import { ObjectId } from "mongodb";
import config from "../../config";

export interface RoleData {
	roleId: (typeof config.devRoleIds)[keyof typeof config.devRoleIds];
	experienced?: boolean;
}

export interface IUserData {
	_id?: ObjectId;
	discordId: string;
	bio?: string;
	createdAt: Date;
	rolesData: RoleData[];
}
