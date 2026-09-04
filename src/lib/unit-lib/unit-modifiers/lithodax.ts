import {
  CombatRoll,
  SystemAdjacency,
  Faction,
  UnitAttrs,
  UnitPlastic,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";
import { HexType } from "ttpg-darrell";
import { Vector } from "@tabletop-playground/api";

export const Lithodax: UnitModifierSchemaType = {
  name: "Lithodax",
  description: "combat or unit ability roll, +1 die if this system is adjacent to or contains 1 of your structures",
  triggers: [{ cardClass: "unit", nsidName: "lithodax" }],
  owner: "self",
  priority: "adjust",
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.self.hasUnit("flagship") && 
    (combatRoll.self.hasUnit("space-dock") ||
        combatRoll.self.hasUnitAdj("space-dock") || (combatRoll.self.hasUnit("pds") ||
        combatRoll.self.hasUnitAdj("pds")));
  },
  apply: (combatRoll: CombatRoll): void => {
    const flagshipAttrs: UnitAttrs =
      combatRoll.self.unitAttrsSet.getOrThrow("flagship");
    flagshipAttrs.getBombardment()?.addDice(1);
    flagshipAttrs.getAntiFighterBarrage()?.addDice(1);
    flagshipAttrs.getSpaceCannon()?.addDice(1);
    flagshipAttrs.getSpaceCombat()?.addDice(1);
    flagshipAttrs.getGroundCombat()?.addDice(1);
  },
};