import {
  CombatRoll,
  CombatRollType,
  UnitAttrs,
  CombatAttrs,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";
import { CardHolder } from "@tabletop-playground/api";
import { NSID, Find } from "ttpg-darrell";

export const Nemsys: UnitModifierSchemaType = {
  name: "Nemsys",
  description: "1 additional combat die for each secret objective you have scored",
  triggers: [{ cardClass: "unit", nsidName: "nemsys" }],
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
        let secretCount = 0;
        const playerSlot = combatRoll.self.playerSlot;
        const skipContained: boolean = true;
        const nsid: string = `card-holder:base/player-scoring`;

        const cardHolder: CardHolder | undefined = new Find().findCardHolder(
          nsid,
          playerSlot,
          skipContained
        );

        if (cardHolder) {
          for (const card of cardHolder.getCards()) {
            const nsid: string = NSID.get(card);
            if (nsid.startsWith("card.objective.secret")) {
              secretCount++;
            }
          }
        }

        if (secretCount > 0) {
          spaceCombat.addDice(secretCount);
        }
      }
    }
  },
};