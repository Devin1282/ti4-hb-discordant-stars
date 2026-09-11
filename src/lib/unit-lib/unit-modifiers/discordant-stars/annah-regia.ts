import {
  CombatRoll,
  CombatAttrs,
  UnitPlastic,
  CombatRollType,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";

export function _countDestroyers(playerSlot: number): number {
  const allDestroyerPlastics: Array<UnitPlastic> = UnitPlastic.getAll().filter(
      (plastic: UnitPlastic): boolean => {
        return plastic.getUnit() === "destroyer" && plastic.getOwningPlayerSlot() === playerSlot;
      }
    );
  
  return allDestroyerPlastics.length;
}

export const AnnahRegia: UnitModifierSchemaType = {
  name: "Annah Regia",
  description: "Apply +1 to this units combat rolls for every 2 destroyers you control",
  triggers: [{ cardClass: "unit", nsidName: "annah-regia" }],
  owner: "self",
  priority: "adjust",
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return (rollType === "spaceCombat" || rollType === "groundCombat") && combatRoll.self.hasUnit("flagship");
  },
  apply: (combatRoll: CombatRoll): void => {
    const destroyerCount = Math.floor(_countDestroyers(combatRoll.self.playerSlot)/2);

    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      if (unitAttrs.isShip() && unitAttrs.getUnit() === "flagship") {
        const spaceCombat: CombatAttrs | undefined = unitAttrs.getSpaceCombat();
        if (spaceCombat) {
          spaceCombat.addHit(destroyerCount);
        }
        const groundCombat: CombatAttrs | undefined =
          unitAttrs.getGroundCombat();
        if (groundCombat) {
          groundCombat.addHit(destroyerCount);
        }
      }
    }
  },
};