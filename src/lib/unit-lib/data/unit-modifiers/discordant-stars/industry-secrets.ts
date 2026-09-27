// TODO: need to add -IS in build area and return card logic for status phase
import {
  CombatRoll,
  CombatRollType,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";

export const IndustrySecrets: UnitModifierSchemaType = {
  name: "Industry Secrets",
  description: "+4 production, -1 to production cost",
  triggers: [
    {
      cardClass: "promissory",
      nsidName: "industry-secrets",
    },
  ],
  owner: "self",
  priority: "adjust",
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "production";
  },
  apply: (_combatRoll: CombatRoll): void => {},
};
