import { UnitType, UnitAttrsSchemaType, UnitPlastic } from "ti4-ttpg-ts";
import {
  CombatRoll,
  CombatRollType,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";
import { HexType } from "ttpg-darrell";
import { GameObject, Vector } from "@tabletop-playground/api";

export function _countFlagships(playerSlot: number): number {
  const allFlagshipPlastics: Array<UnitPlastic> = UnitPlastic.getAll().filter(
      (plastic: UnitPlastic): boolean => {
        return plastic.getUnit() === "flagship" && plastic.getOwningPlayerSlot() === playerSlot;
      }
    );
  
  return allFlagshipPlastics.length;
}

export function _getCelagromHex(): Set<HexType> {
  const celagromHexes: Set<HexType> = new Set();

  TI4.findTracking.trackNsid(
    "token.celagrom:discordant-stars/celagrom-token"
  );
  const celagromObjs: Array<GameObject> = TI4.findTracking.find(
    "token.celagrom:discordant-stars/celagrom-token"
  );

  celagromObjs.forEach((celagromObj: GameObject): void => {
    if (!celagromObj.getContainer()) {
      const pos: Vector = celagromObj.getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);
      celagromHexes.add(hex);
    }
  });
  return celagromHexes;
}

export const TradeProtectorate: UnitModifierSchemaType = {
  name: "Trade Protectorate",
  description: "While you control another flagship, this unit rolls 1 additional combat die.",
  owner: "self",
  priority: "mutate",
  triggers: [{ cardClass: "breakthrough", nsidName: "trade-protectorate" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    const celagromHexes: Set<HexType> = _getCelagromHex();
    const celagromPresent: boolean = Array.from(celagromHexes).some((hex) =>
      combatRoll.getHex() === (hex)
    );
    return (rollType === "spaceCombat" || rollType === "bombardment") && celagromPresent; //and the celagrom token is present in the system
  },
  apply: (combatRoll: CombatRoll): void => {
    //Make sure the player has another flagship
    const flagShipCount = _countFlagships(combatRoll.self.playerSlot);

    if (flagShipCount > 0) {
      const celagrom : UnitAttrsSchemaType = {
      name: "Celagrom",
      unit: "celagrom" as UnitType,
      spaceCombat: {
        hit: 5,
        dice: 2,
        },
      bombardment: {
        hit: 5,
      },
      }

      combatRoll.self.addSyntheticUnit(celagrom, 1);
    } else {
      const celagrom : UnitAttrsSchemaType = {
      name: "Celagrom",
      unit: "celagrom" as UnitType,
      spaceCombat: {
        hit: 5,
        dice: 1,
        },
      bombardment: {
        hit: 5,
      },
      }

      combatRoll.self.addSyntheticUnit(celagrom, 1);
    }
  
  },

}
