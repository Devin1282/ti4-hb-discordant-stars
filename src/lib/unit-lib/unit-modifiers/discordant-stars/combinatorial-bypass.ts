import {
  CombatRoll,
  CombatRollType,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";

export const CombinatorialBypass: UnitModifierSchemaType = {
  name: "Combinatorial Bypass",
  description: "enemy units lose SPACE CANNON and PLANETARY SHIELD.",
  owner: "self",
  priority: "adjust", // need to be after adjust, so crit matches hit
triggers: [{ cardClass: "promissory", nsidName: "combinatorial-bypass" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "bombardment" || rollType === "spaceCannonDefense";
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.opponent.unitAttrsSet.getAll()) {
      unitAttrs.setDisablePlanetaryShield(true);
      unitAttrs.setDisableSpaceCannonDefense(true);
    }
  },
};
