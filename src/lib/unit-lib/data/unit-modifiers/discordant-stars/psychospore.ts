import {
  CombatAttrs,
  CombatRoll,
  UnitAttrsSchemaType,
  UnitModifierSchemaType,
  UnitPlastic,
  UnitType,
} from "ti4-ttpg-ts";
import { Facing } from "ttpg-darrell";

export const Psychospore: UnitModifierSchemaType = {
  name: "Psychospore",
  description: "While this unit is not damaged, you may reroll its combat roll.",
  owner: "self",
  priority: "adjust-late",
  triggers: [{ cardClass: "breakthrough", nsidName: "psychospore" }],
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.getRollType() === "spaceCombat";
  },
  apply: (combatRoll: CombatRoll): void => {
    const playerSlot = combatRoll.self.playerSlot;

    let undamagedCount = 0;
    let damagedCount = 0;

    const allPlastics: Array<UnitPlastic> = [
      ...combatRoll.self.unitPlasticHex,
    ];

    for (const plastic of allPlastics) {
      if (plastic.getOwningPlayerSlot() === playerSlot && plastic.getUnit() === "dreadnought") {
        if (Facing.isFaceUp(plastic.getObj())) {
          undamagedCount++;
        } else {
          damagedCount++;
        }
      }
    }

    // Only split and inject synthetic units if there are undamaged dreadnoughts to gain the reroll
    if (undamagedCount > 0) {
      const dreadCombat: CombatAttrs | undefined =
        combatRoll.getUnitCombatAttrs("dreadnought");

      if (dreadCombat) {
        // Restrict standard dreadnoughts in this roll to only the damaged ones
        combatRoll.self.overrideUnitCountHex.set("dreadnought", damagedCount);

        // Define synthetic unit copy with rerollMisses set to true
        const psychosporeDread: UnitAttrsSchemaType = {
          name: "Dreadnought (psychospore)",
          unit: "dreadnought-psychospore" as UnitType,
          spaceCombat: {
            hit: dreadCombat.getHit(),
            dice: dreadCombat.getDice(),
            rerollMisses: true,
          },
        };

        // Add synthetic units representing the undamaged dreadnoughts
        combatRoll.self.addSyntheticUnit(psychosporeDread, undamagedCount);
      }
    }
  },
};