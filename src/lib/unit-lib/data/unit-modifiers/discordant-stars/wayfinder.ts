import {
  CombatRoll,
  CombatRollType,
  UnitAttrs,
  CombatAttrs,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";
import { Vector, world } from "@tabletop-playground/api";
import { Find, NSID } from "ttpg-darrell";

export function _countFragmentTokens(playerSlot: number): number {
  let countFragmentTokens = 0;
  const find: Find = new Find();
  const skipContained: boolean = true;

  for (const obj of world.getAllObjects(skipContained)) {
    const nsid: string = NSID.get(obj);
    if (
      nsid.includes("-fragment-token") 
    ) {
      const pos: Vector = obj.getPosition();
      const owner: number = find.closestOwnedCardHolderOwner(pos);
      if (owner === playerSlot) {
        countFragmentTokens++;
      }
    }
  }
  
  // The size of the set represents the number of unique occurrences
  return countFragmentTokens;
}

export const Wayfinder: UnitModifierSchemaType = {
  name: "Wayfinder",
  description: "+1 combat and ability rolls for each Fragment token on your faction sheet",
  triggers: [{ cardClass: "unit", nsidName: "wayfinder" }],
  owner: "self",
  priority: "adjust",
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return combatRoll.self.hasUnit("flagship");
  },
  apply: (combatRoll: CombatRoll): void => {
    const fragmentCount = _countFragmentTokens(combatRoll.self.playerSlot);
    const flagshipAttrs: UnitAttrs =
      combatRoll.self.unitAttrsSet.getOrThrow("flagship");
    flagshipAttrs.getBombardment()?.addHit(fragmentCount);
    flagshipAttrs.getAntiFighterBarrage()?.addHit(fragmentCount);
    flagshipAttrs.getSpaceCannon()?.addHit(fragmentCount);
    flagshipAttrs.getSpaceCombat()?.addHit(fragmentCount);
    flagshipAttrs.getGroundCombat()?.addHit(fragmentCount);
  },
};