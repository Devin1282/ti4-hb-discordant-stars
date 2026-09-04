import {
  CombatRoll,
  CombatRollType,
  UnitAttrsSchemaType,
  UnitType,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";

export const RaidLeaders: UnitModifierSchemaType = {
  name: "Raid Leaders",
  description: "1 non-fighter gets 2 capacity and BOMBARDMENT 5(x2)",
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
    return rollType === "bombardment";
  },
  apply: (combatRoll: CombatRoll): void => {
    const unitAttrsList = combatRoll.self.unitAttrsSet.getAll();
    const hasNonFighter = unitAttrsList.some((attrs) => {
      const attrsAny = attrs as any;
      const type = attrsAny.type as string;
      const count = attrsAny.count || 0;

      return type && type !== "fighter" && count > 0;
    });

    if (hasNonFighter) {
      const schema: UnitAttrsSchemaType = {
        unit: "raid-leader" as UnitType,
        name: "Raid Leader",
        bombardment: { hit: 5, dice: 2 },
      };
      combatRoll.self.addSyntheticUnit(schema, 1);
    }
  },
};