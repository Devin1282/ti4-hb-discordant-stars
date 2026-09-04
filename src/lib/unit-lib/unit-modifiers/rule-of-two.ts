import {
  CombatRoll,
  CombatRollType,
  UnitAttrs,
  CombatAttrs,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";

export const RuleOfTwo: UnitModifierSchemaType = {
  name: "Rule of Two",
  description: "During a round of combat in a system that contains exactly 2 of your non-fighter ships, if those ships have the same unit type, apply +2 to the result of each of those unit's combat rolls.",
  triggers: [{ cardClass: "faction-ability", nsidName: "projection-of-power" }],
  owner: "self",
  priority: "adjust",
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "spaceCombat" || rollType === "groundCombat";
  },
  apply: (combatRoll: CombatRoll): void => {
    const unitAttrsList = combatRoll.self.unitAttrsSet.getAll();
    let totalNonFighters = 0;
    let targetType: string | undefined = undefined;
    let isSameType = true;
    let targetAttrs: UnitAttrs | undefined = undefined;

    for (const attrs of unitAttrsList) {
      const attrsAny = attrs as any;
      const type = attrsAny.type as string; 
      
      // Skip fighters or units where the type cannot be determined
      if (!type || type === "fighter") continue;

      const count = attrsAny.count || 0;
      
      if (count > 0) {
        totalNonFighters += count;
        
        if (targetType === undefined) {
          targetType = type;
          targetAttrs = attrs;
        } else if (targetType !== type) {
          isSameType = false;
        }
      }
    }

    if (totalNonFighters === 2 && isSameType && targetAttrs) {
      // Apply +2 to the space combat hit
      const spaceCombat = targetAttrs.getSpaceCombat();
      if (spaceCombat) {
        spaceCombat.addHit(2);
      }

      const groundCombat = targetAttrs.getGroundCombat();
      if (groundCombat) {
        groundCombat.addHit(2);
      }
    }
  },
};