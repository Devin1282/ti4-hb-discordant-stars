import { CombatAttrs } from "ti4-ttpg-ts";
import {
  CombatRoll,
  CombatRollType,
  UnitPlastic,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";
import { Facing } from "ttpg-darrell";

export const ThussadKrath: UnitModifierSchemaType = {
  name: "Thussad Krath",
  description: "+1 dice to damaged units",
  owner: "self",
  priority: "adjust",
  triggerAlways: true,
  triggers: [
    { cardClass: "commander", nsidName: "thussad-krath" },
    { cardClass: "alliance", nsidName: "thussad-krath" },
  ],
  applies: (combatRoll: CombatRoll): boolean => {
    const commanderNsid: string = "card.leader.commander:discordant-supports/thussad-krath";
    const rollType: CombatRollType = combatRoll.getRollType();
    return (rollType === "spaceCombat" || rollType === "groundCombat") &&
    combatRoll.isCommanderUnlocked(commanderNsid);
  },
  apply: (combatRoll: CombatRoll): void => {
    const playerSlot = combatRoll.self.playerSlot;
    const damagedUnitTypes: Array<string> = [];

    // Combine both hex and adjacent plastic arrays to check all potential units
    const allPlastics: Array<UnitPlastic> = [
      ...combatRoll.self.unitPlasticHex,
      ...combatRoll.self.unitPlasticAdj
    ];

    for (const plastic of allPlastics) {
      // 1. Check if the plastic belongs to the player involved in the combat roll
      if (plastic.getOwningPlayerSlot() === playerSlot) {
        
        // 2. Check if the plastic is face down (damaged)
        if (!Facing.isFaceUp(plastic.getObj())) {
          const type = plastic.getUnit();
          damagedUnitTypes.push(type);
        }
      }
    }

    // 4. Limit the selection to the first 2 damaged units found
    const targets = damagedUnitTypes.slice(0, 2);

    // 5. Apply the extra die to the combat attributes of those unit types
    for (const type of targets) {
      const combatAttrs: CombatAttrs | undefined = combatRoll.getUnitCombatAttrs(type as any);
      if (combatAttrs) {
        // Using addExtraDice as seen in the Galvanize reference material
        combatAttrs.addExtraDice(1);
      }
    }
  },
};