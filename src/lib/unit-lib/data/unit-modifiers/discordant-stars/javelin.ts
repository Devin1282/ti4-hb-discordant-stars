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
  // Use a Set to store unique nsids
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

export const Javelin: UnitModifierSchemaType = {
  name: "Javelin",
  description: "+1 to the result of this unit's combat rolls per 2 unique unit upgrade techs",
  triggers: [{ cardClass: "mech", nsidName: "javelin" }],
  owner: "self",
  priority: "adjust",
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "groundCombat" &&
      combatRoll.self.hasUnit("mech");
  },
  apply: (combatRoll: CombatRoll): void => {
    const techCount = _countUnitUpgradeTech(combatRoll.self.playerSlot);
    const mechAttrs: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("mech");

    if (mechAttrs) {
      const groundCombat: CombatAttrs | undefined = mechAttrs.getGroundCombat();
      if (groundCombat) {
        // Calculate +1 for every 2 techs (e.g., 2-3 techs = 1, 4-5 techs = 2)
        const bonus = Math.floor(techCount / 2);
        
        if (bonus > 0) {
          groundCombat.addHit(bonus);
        }
      }
    }
  },
};