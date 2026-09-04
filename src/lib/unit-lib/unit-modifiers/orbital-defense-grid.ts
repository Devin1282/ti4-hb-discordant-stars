import {
  CombatRoll,
  CombatRollType,
  UnitType,
  CombatAttrs,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";

export const OrbitalDefenseGrid: UnitModifierSchemaType = {
  name: "OrbitalDefenseGrid",
  description: "1 unit gets PLANETARY SHIELD",
  triggers: [{ cardClass: "technology.red", nsidName: "orbital-defense-grid" }],
  owner: "self",
  priority: "mutate",
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "bombardment" 
  },
  apply: (combatRoll: CombatRoll): void => {
    //Any unit gets planetary shield so long as the opponent doesn't have a warsun.
     const warSun = combatRoll.opponent.unitAttrsSet.get("war-sun");
     if (warSun) {

     } else {
      for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
        const unit: UnitType = unitAttrs.getUnit();
        if (
            combatRoll.self.hasUnit(unit)
        ) {
            continue;
        }
        // Found a unit to add bombardment.
        combatRoll.self.addSyntheticUnit(
            {
            name: `Orbital Defense Grid (${unit})`,
            unit: "orbital-defense-grid" as UnitType,
            hasPlanetaryShield: true,
            },
            1
        );
        break;
      }
     }
     
  },
};