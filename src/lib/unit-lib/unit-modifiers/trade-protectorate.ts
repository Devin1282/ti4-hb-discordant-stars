// TODO should this be called celagrom.ts with it checking for the celagrom unit token?
// "nsid": "token.other:discordant-stars/celagrom-token"
// "nsid": "card.other:discordant-stars/celagrom-card",
import { UnitAttrs, CombatAttrs, UnitPlastic } from "ti4-ttpg-ts";
import {
  CombatRoll,
  CombatRollType,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";

export function _countFlagships(playerSlot: number): number {
  const allFlagshipPlastics: Array<UnitPlastic> = UnitPlastic.getAll().filter(
      (plastic: UnitPlastic): boolean => {
        return plastic.getUnit() === "flagship" && plastic.getOwningPlayerSlot() === playerSlot;
      }
    );
  
  return allFlagshipPlastics.length;
}

export const TradeProtectorate: UnitModifierSchemaType = {
  name: "Trade Protectorate",
  description: "While you control another flagship, this unit rolls 1 additional combat die.",
  owner: "self",
  priority: "mutate",
  triggers: [{ cardClass: "breakthrough", nsidName: "trade-protectorate" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "spaceCombat";
  },
  apply: (combatRoll: CombatRoll): void => {
    const flagship: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("flagship");
    if (flagship) {
      //Make sure the player has at least 2 flagships
      const flagShipCount = _countFlagships(combatRoll.self.playerSlot);
      
      const spaceCombat: CombatAttrs | undefined = flagship.getSpaceCombat();
      if (spaceCombat && flagShipCount > 1) {
        spaceCombat.addDice(1);
      }
    }
  },

}
