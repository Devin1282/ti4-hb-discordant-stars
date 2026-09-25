import { CombatAttrs, CombatRoll, UnitModifierSchemaType, UnitAttrs, UnitPlastic } from "ti4-ttpg-ts";
import { Facing } from "ttpg-darrell";

export const Psychospore: UnitModifierSchemaType = {
  name: "Psychospore",
  description: "While this unit is not damaged, you may reroll its combat roll.",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "breakthrough", nsidName: "psychospore" }],
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.getRollType() === "spaceCombat";
  },
  apply: (combatRoll: CombatRoll): void => {
    const playerSlot = combatRoll.self.playerSlot;
    const damagedUnitTypes: Array<string> = [];

    const allPlastics: Array<UnitPlastic> = [
        ...combatRoll.self.unitPlasticHex,
    ];

    for (const plastic of allPlastics) {
        if (plastic.getOwningPlayerSlot() === playerSlot) {
            const type = plastic.getUnit();
            if (type === "dreadnought" && Facing.isFaceUp(plastic.getObj())) {
                const combatAttrs: CombatAttrs | undefined = 
                  combatRoll.getUnitCombatAttrs(plastic.getUnit());
                if (combatAttrs) {
                  combatAttrs.setRerollMisses(true);
                }
                const type = plastic.getUnit();
                damagedUnitTypes.push(type);
            }
        }
    }
  },
};