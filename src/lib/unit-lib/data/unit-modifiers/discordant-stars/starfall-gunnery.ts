import {
  CombatRoll,
  CombatRollType,
  UnitType,
  CombatAttrs,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";

export const StarFallGunnery: UnitModifierSchemaType = {
  name: "Starfall Gunnery",
  description: "During each of your actions, up to 3 of your non-fighter ships gain SPACE CANNON 8",
  triggers: [
    {
      cardClass: "faction-ability",
      nsidName: "starfall-gunnery",
    },
  ],
  owner: "self",
  priority: "adjust",
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "spaceCannonOffense";
  },
  apply: (combatRoll: CombatRoll): void => {
    let countNonFighter = 0;
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      const unit: UnitType = unitAttrs.getUnit();
      if (unitAttrs.isShip() && unit !== "fighter" && countNonFighter < 3) {
        unitAttrs.setSpaceCannon(new CombatAttrs({ hit: 8 }));
        countNonFighter++;
      }
    }
  },
};