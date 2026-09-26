import { UnitType, UnitAttrsSchemaType } from "ti4-ttpg-ts";
import {
  CombatRoll,
  CombatRollType,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";
import { HexType } from "ttpg-darrell";
import { GameObject, Vector } from "@tabletop-playground/api";

export function _getLordHex(): Set<HexType> {
  const lordHexes: Set<HexType> = new Set();

  TI4.findTracking.trackNsid(
    "token.lord:discordant-stars/the-lord"
  );
  const lordObjs: Array<GameObject> = TI4.findTracking.find(
    "token.lord:discordant-stars/the-lord"
  );

  lordObjs.forEach((lordObj: GameObject): void => {
    if (!lordObj.getContainer()) {
      const pos: Vector = lordObj.getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);
      lordHexes.add(hex);
    }
  });
  return lordHexes;
}

export const TheLord: UnitModifierSchemaType = {
  name: "The Lord",
  description: "While the Lord token is present",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "faction-ability", nsidName: "the-lady-and-the-lord" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    const lordHexes: Set<HexType> = _getLordHex();
    const lordPresent: boolean = Array.from(lordHexes).some((hex) =>
      combatRoll.getHex() === (hex)
    );
    return (rollType === "spaceCombat") && lordPresent; //and the lord token is present in the system
  },
  apply: (combatRoll: CombatRoll): void => {
    const lord : UnitAttrsSchemaType = {
        name: "Lord",
        unit: "lord" as UnitType,
        spaceCombat: {
            hit: 7,
            dice: 2,
            },
      }
    combatRoll.self.addSyntheticUnit(lord, 1);
  },

}
