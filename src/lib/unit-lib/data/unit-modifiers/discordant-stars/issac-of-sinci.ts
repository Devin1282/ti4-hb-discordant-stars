import {
  CombatRoll,
  CombatRollType,
  CombatAttrs,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";

export const IssacOfSinci: UnitModifierSchemaType = {
  name: "Issac of Sinci",
  description: "Apply +1 to each of your unit's ability rolls",
  owner: "self",
  priority: "adjust",
  triggers: [
    { cardClass: "commander", nsidName: "issac-of-sinci" },
    { cardClass: "alliance", nsidName: "issac-of-sinci" },
  ],
  applies: (combatRoll: CombatRoll): boolean => {
    const commanderNsid: string = "card.leader.commander:discordant-stars/issac-of-sinci";
        const rollType: CombatRollType = combatRoll.getRollType();
        return (rollType === "antiFighterBarrage" || 
            rollType === "bombardment" ||
            rollType === "spaceCannonDefense" ||
            rollType === "spaceCannonOffense") &&
        combatRoll.isCommanderUnlocked(commanderNsid);
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      const bombardment: CombatAttrs | undefined = unitAttrs.getBombardment();
      if (bombardment) {
        bombardment.addHit(1);
      }
      const antiFighterBarrage: CombatAttrs | undefined = unitAttrs.getAntiFighterBarrage();
      if (antiFighterBarrage) {
        antiFighterBarrage.addHit(1);
      }
      const spaceCannon: CombatAttrs | undefined = unitAttrs.getSpaceCannon();
      if (spaceCannon) {
        spaceCannon.addHit(1);
      }
    }
  },
};