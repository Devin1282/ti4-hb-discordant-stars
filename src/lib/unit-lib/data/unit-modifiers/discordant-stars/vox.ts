import {
  CombatRoll,
  CombatRollType,
  UnitAttrs,
  CombatAttrs,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";

export const Vox: UnitModifierSchemaType = {
  name: "Vox",
  description: "1 additional die for each planet in this system of any single trait",
  triggers: [{ cardClass: "unit", nsidName: "vox" }],
  owner: "self",
  priority: "mutate",
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "spaceCombat";
  },
  apply: (combatRoll: CombatRoll): void => {
    const flagship: UnitAttrs | undefined = combatRoll.self.unitAttrsSet.get("flagship");
    if (flagship) {
      const planets = combatRoll.system?.getPlanets() ?? [];
      
      const traitCounts: Record<string, number> = {};
      let maxFrequency = 0;

      for (const planet of planets) {
        for (const trait of planet.getTraits()) {
          traitCounts[trait] = (traitCounts[trait] || 0) + 1;
          
          if (traitCounts[trait] > maxFrequency) {
            maxFrequency = traitCounts[trait];
          }
        }
      }

      const planetCount = maxFrequency;

      const spaceCombat: CombatAttrs | undefined = flagship.getSpaceCombat();
      if (spaceCombat) {
        spaceCombat.addDice(planetCount);
      }
    }
  },
};