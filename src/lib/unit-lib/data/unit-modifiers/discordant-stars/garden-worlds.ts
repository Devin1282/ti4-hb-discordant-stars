// TODO Apply +1 to the resource values of your planets that do not contain 1 or more ground forces.
import {
  CombatRoll,
  CombatRollType,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";

export const GardenWorlds: UnitModifierSchemaType = {
  name: "GardenWorlds",
  description: "+1 to the resource to planets without ground forces.",
  triggers: [
    {
      cardClass: "faction-ability",
      nsidName: "garden-worlds",
    },
  ],
  owner: "self",
  priority: "adjust",
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "production";
  },
  apply: (_combatRoll: CombatRoll): void => {},
};
