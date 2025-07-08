import config from "../../config";
import { OrderType } from "../../types/order";

export const orderRoles: Record<OrderType, string[]> = {
	[OrderType.Game]: Object.values(config.devRoleIds),
	[OrderType.Asset]: [config.devRoleIds.builder],
	[OrderType.Model]: [config.devRoleIds.modeler],
	[OrderType.Script]: [config.devRoleIds.scripter],
	[OrderType.Plugin]: [config.devRoleIds.scripter],
	[OrderType.Image]: [config.devRoleIds.designer],
	[OrderType.Icon]: [config.devRoleIds.designer],
	[OrderType.UI]: [config.devRoleIds.designer],
	[OrderType.Audio]: [config.devRoleIds.audioSpecialist],
	[OrderType.Effect]: [config.devRoleIds.vfxArtist],
	[OrderType.Animation]: [config.devRoleIds.animator],
	[OrderType.Rig]: [config.devRoleIds.rigger]
};
