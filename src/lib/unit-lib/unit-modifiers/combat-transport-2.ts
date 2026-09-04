import {
  CombatRoll,
  CombatRollType,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";

export const RaidLeaders: UnitModifierSchemaType = {
  name: "Raid Leaders",
  description: "Reroll 1 die in ground combat with 2 or fewer infantry",
  triggers: [
    {
      cardClass: "technology.unit-upgrade",
      nsidName: "combat-transport-2",
    },
  ],
  owner: "self",
  priority: "adjust",
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "groundCombat";
  },
  apply: (combatRoll: CombatRoll): void => {
    const unitAttrsList = combatRoll.self.unitAttrsSet.getAll();
    let totalInfantry = 0;

    // Calculate the total number of infantry participating in the combat
    for (const attrs of unitAttrsList) {
      const attrsAny = attrs as any;
      const type = attrsAny.type as string;
      const count = attrsAny.count || 0;

      if (type === "infantry") {
        totalInfantry += count;
      }
    }

    // If there are between 1 and 2 infantry, allow one extra reroll
    if (totalInfantry > 0 && totalInfantry <= 2) {
      combatRoll.self.setExtraRerolls(1);
    }
  },
};