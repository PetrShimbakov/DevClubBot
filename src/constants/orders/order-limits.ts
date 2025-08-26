import config from "../../config";

export const roleOrderLimits: Record<string, number> = {
	[config.roleIds.administrator]: 10,
	[config.roleIds.superClient]: 3,
	[config.roleIds.booster]: 6
};
export const DEFAULT_ORDER_LIMIT = 1;

export const roleTakenOrdersLimits: Record<string, number> = {
	[config.roleIds.administrator]: 3,
	[config.roleIds.superDev]: 2,
	[config.roleIds.booster]: 3
};
export const DEFAULT_TAKEN_ORDERS_LIMIT = 1;

// Cooldown in minutes
export const roleOrderCooldownLimits: Record<string, number> = {
	[config.roleIds.superClient]: 30,
	[config.roleIds.booster]: 20
};
export const DEFAULT_ORDER_COOLDOWN_LIMIT = 90 - 87;
