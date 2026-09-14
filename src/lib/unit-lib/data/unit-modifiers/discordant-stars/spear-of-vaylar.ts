import {
  CombatRoll,
  CombatRollType,
  CombatAttrs,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";

export const SpearOfVaylar: UnitModifierSchemaType = {
  name: "Spear of Vaylar",
  description: "+1 to Ships COMBAT rolls",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "hero", nsidName: "spear-of-vaylar" }],
  isActiveIdle: true,
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "spaceCombat" || rollType === "groundCombat";
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      if (unitAttrs.isShip()) {
        const spaceCombat: CombatAttrs | undefined = unitAttrs.getSpaceCombat();
        if (spaceCombat) {
            spaceCombat.addHit(1);
        }

        const groundCombat: CombatAttrs | undefined = unitAttrs.getGroundCombat();
        if (groundCombat) {
            groundCombat.addHit(1);
        }
      }
    }
  },
};
