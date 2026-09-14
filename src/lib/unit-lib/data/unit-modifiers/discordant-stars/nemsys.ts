import {
  CombatRoll,
  CombatRollType,
  UnitAttrs,
  CombatAttrs,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";
import { CardHolder, Vector, world } from "@tabletop-playground/api";
import { NSID, CardUtil, Find } from "ttpg-darrell";

export function _countSecrets(playerSlot: number): number {
let count: number = 0;
  const cardUtil: CardUtil = new CardUtil();
  const find: Find = new Find();
  const skipContained: boolean = true;
  for (const obj of world.getAllObjects(skipContained)) {
    const nsid: string = NSID.get(obj);

    // Cards in player area.
    if (
      nsid.startsWith("card.objective.secret") &&
      cardUtil.isLooseCard(obj)
    ) {
      const pos: Vector = obj.getPosition();
      const owner: number = find.closestOwnedCardHolderOwner(pos);
      if (owner === playerSlot) {
        count++;
      }
    }

    // Cards in scoring hands.
    if (
      nsid === "card-holder:base/player-scoring" &&
      obj instanceof CardHolder &&
      obj.getOwningPlayerSlot() === playerSlot
    ) {
      for (const card of obj.getCards()) {
        const cardNsid: string = NSID.get(card);
        if (
          cardNsid.startsWith("card.objective.secret")
        ) {
          count++;
        }
      }
    }
  }
  return count;

}

export const Nemsys: UnitModifierSchemaType = {
  name: "Nemsys",
  description: "1 additional combat die for each secret objective you have scored",
  triggers: [{ cardClass: "unit", nsidName: "nemsys" }],
  owner: "self",
  priority: "adjust",
  applies: (combatRoll: CombatRoll): boolean => {
    return (
      (combatRoll.getRollType() === "spaceCombat" ) &&
      _countSecrets(combatRoll.self.playerSlot) > 0 &&
      combatRoll.self.hasUnit("flagship")
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    const unitAttrs: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("flagship");
    if (unitAttrs) {
      const secretCount = _countSecrets(combatRoll.self.playerSlot);
      const spaceCombat: CombatAttrs | undefined = unitAttrs.getSpaceCombat();
      if (spaceCombat) {
        if (secretCount > 0) {
          spaceCombat.addDice(secretCount);
        }
      }
    }
  },
};