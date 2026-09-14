import {
  CombatRoll,
  CombatRollType,
  UnitAttrs,
  CombatAttrs,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";
import { Vector, world } from "@tabletop-playground/api";
import { CardUtil, Find, NSID } from "ttpg-darrell";

export function _countUnitUpgradeTech(playerSlot: number): number {
  const uniqueTechs = new Set<string>();
  const cardUtil: CardUtil = new CardUtil();
  const find: Find = new Find();
  const skipContained: boolean = true;

  for (const obj of world.getAllObjects(skipContained)) {
    const nsid: string = NSID.get(obj);

    // Check if it is a loose card and matches the technology pattern
    if (
      nsid.startsWith("card.technology.unit-upgrade") &&
      cardUtil.isLooseCard(obj)
    ) {
      const pos: Vector = obj.getPosition();
      const owner: number = find.closestOwnedCardHolderOwner(pos);

      // If the card belongs to the player, add the nsid to our Set
      if (owner === playerSlot) {
        uniqueTechs.add(nsid);
      }
    }
  }
  
  // The size of the set represents the number of unique occurrences
  return uniqueTechs.size;
}

export const Reckoning: UnitModifierSchemaType = {
  name: "Reckoning",
  description: "+1 to the result of this unit's combat rolls per enemy unit upgrade tech",
  triggers: [{ cardClass: "unit", nsidName: "reckoning" }],
  owner: "self",
  priority: "adjust",
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return (
      rollType === "spaceCombat" &&
      combatRoll.self.hasUnit("flagship")
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    const techCount = _countUnitUpgradeTech(combatRoll.opponent.playerSlot);
    const flagshipAttrs: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("flagship");

    if (flagshipAttrs) {
      const spaceCombat: CombatAttrs | undefined = flagshipAttrs.getSpaceCombat();
      if (spaceCombat) {
          spaceCombat.addHit(techCount);
      }
    }
  },
};