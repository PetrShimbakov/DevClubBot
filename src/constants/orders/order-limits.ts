import config from "../../config";

export const roleOrderLimits: Record<string, number> = {
	[config.roleIds.administrator]: 10,
	[config.roleIds.superClient]: 3,
	[config.roleIds.booster]: 6
};
