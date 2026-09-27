import { CombatAttrs, UnitAttrs } from "ti4-ttpg-ts";
import {
  CombatRoll,
  CombatRollType,
  UnitPlastic,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";
import { Facing } from "ttpg-darrell";

export const ThussadKrath: UnitModifierSchemaType = {
  name: "Thussad Krath",
  description: "+1 dice to up to 2 damaged units",
  owner: "self",
  priority: "adjust",
  triggers: [
    { cardClass: "commander", nsidName: "thussad-krath" },
    { cardClass: "alliance", nsidName: "thussad-krath" },
  ],
  applies: (combatRoll: CombatRoll): boolean => {
    const commanderNsid: string =
      "card.leader.commander:discordant-stars/thussad-krath";
    const rollType: CombatRollType = combatRoll.getRollType();
    return (
      (rollType === "spaceCombat" || rollType === "groundCombat") &&
      combatRoll.isCommanderUnlocked(commanderNsid)
    );
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
        if (!Facing.isFaceUp(plastic.getObj())) {
          const type = plastic.getUnit();
          damagedUnitTypes.push(type);
        }
      }
    }

    const rollType = combatRoll.getRollType();

    if (rollType === "spaceCombat") {
      damagedUnitTypes.sort((a, b) => {
        const unitA = combatRoll.self.unitAttrsSet.get(a);
        const unitB = combatRoll.self.unitAttrsSet.get(b);
        const hitA = unitA?.getSpaceCombat()?.getHit() ?? 11;
        const hitB = unitB?.getSpaceCombat()?.getHit() ?? 11;
        return hitA - hitB;
      });

      const spaceTargets = damagedUnitTypes.slice(0, 2);

      for (const type of spaceTargets) {
        const unit: UnitAttrs | undefined =
          combatRoll.self.unitAttrsSet.get(type);

        if (unit) {
          const spaceCombat: CombatAttrs | undefined = unit.getSpaceCombat();
          if (spaceCombat) {
            spaceCombat.addExtraDice(1);
          }
        }
      }
    }

    if (rollType === "groundCombat") {
      damagedUnitTypes.sort((a, b) => {
        const unitA = combatRoll.self.unitAttrsSet.get(a);
        const unitB = combatRoll.self.unitAttrsSet.get(b);
        const hitA = unitA?.getGroundCombat()?.getHit() ?? 11;
        const hitB = unitB?.getGroundCombat()?.getHit() ?? 11;
        return hitA - hitB;
      });

      const groundTargets = damagedUnitTypes.slice(0, 2);

      for (const type of groundTargets) {
        const unit: UnitAttrs | undefined =
          combatRoll.self.unitAttrsSet.get(type);

        if (unit) {
          const groundCombat: CombatAttrs | undefined = unit.getGroundCombat();
          if (groundCombat) {
            groundCombat.addExtraDice(1);
          }
        }
      }
    }
  },
};