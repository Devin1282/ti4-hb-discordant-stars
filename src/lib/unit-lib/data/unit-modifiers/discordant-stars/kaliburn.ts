import {
  CombatRoll,
  CombatRollType,
  UnitAttrs,
  CombatAttrs,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";
import { Card, world } from "@tabletop-playground/api";
import { NSID, CardUtil } from "ttpg-darrell";

export const Kaliburn: UnitModifierSchemaType = {
  name: "Kaliburn",
  description: "Apply +1 to the results of this unit's combat rolls for each law in play.",
  triggers: [{ cardClass: "unit", nsidName: "kaliburn" }],
  owner: "self",
  priority: "adjust",
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "spaceCombat" &&
      combatRoll.self.hasUnit("flagship");
  },
  apply: (combatRoll: CombatRoll): void => {
    const unitAttrs: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("flagship");
    if (unitAttrs) {
      const spaceCombat: CombatAttrs | undefined = unitAttrs.getSpaceCombat();
      if (spaceCombat) {
        const lawCards: Array<Card> = [];
        const skipContained: boolean = true;
        const allowFaceDown: boolean = false;
        const cardUtil: CardUtil = new CardUtil();
        const rejectSnapPointTags: Array<string> = [
        "discard-agenda",
        "active-agenda",
        ];
        for (const obj of world.getAllObjects(skipContained)) {
            const nsid: string = NSID.get(obj);
            if (
                nsid.startsWith("card.agenda") &&
                obj instanceof Card &&
                cardUtil.isLooseCard(obj, allowFaceDown, rejectSnapPointTags)
            ) {
                lawCards.push(obj);
            }
        }
        const lawCount = lawCards
            .map((card: Card): string => {
                const cardName: string = card.getCardDetails().name;
                return cardName;
            })
            .filter(
                (value: string, index: number, self: Array<string>): boolean =>
                self.indexOf(value) === index // filter to unique values
            ).length;

        if (lawCount > 0) {
          spaceCombat.addHit(lawCount);
        }
      }
    }
  },
};