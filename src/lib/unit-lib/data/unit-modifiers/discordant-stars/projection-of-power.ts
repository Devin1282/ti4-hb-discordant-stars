import { UnitPlastic } from "ti4-ttpg-ts";
import {
  CombatRoll,
  CombatRollType,
} from "ti4-ttpg-ts";
import {
  UnitAttrsSchemaType,
  UnitType,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";

export const ProjectionOfPower: UnitModifierSchemaType = {
  name: "Projection Of Power",
  description: "At the start of any space combat in a system that is adjacent to or contains 1 or more of your space docks, choose up to 1 ship in that system to gain ANTI-FIGHTER BARRAGE 6 during that combat",
  triggers: [{ cardClass: "faction-ability", nsidName: "projection-of-power" }],
  owner: "self",
  priority: "mutate",
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return (
        rollType === "antiFighterBarrage") &&
        (combatRoll.self.hasUnit("space-dock") ||
        combatRoll.self.hasUnitAdj("space-dock"));
  },
  apply: (combatRoll: CombatRoll): void => {
    // A galvanized unit adds an extra dice.
    // Look for one and use a synthetic unit. 
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      if (unitAttrs.isShip()) {
        const schema: UnitAttrsSchemaType = {
          unit: "projection-of-power" as UnitType,
          name: "Projection of Power",
          antiFighterBarrage: { hit: 6, range: 1, },
        };
        combatRoll.self.addSyntheticUnit(schema, 1);
        break;
      }
    }
  },
};