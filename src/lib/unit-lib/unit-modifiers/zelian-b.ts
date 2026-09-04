import { UnitType } from "ti4-ttpg-ts";
import {
  CombatRoll,
  CombatRollType,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";

export const ZelianB: UnitModifierSchemaType = {
  name: "Zelian B",
  description: "Dreadnoughts and War Suns get ANTI-FIGHER BARRAGE 5",
  owner: "self",
  priority: "adjust",
  triggerAlways: true,
  triggers: [
    { cardClass: "commander", nsidName: "zelian-b" },
    { cardClass: "alliance", nsidName: "zelian-b" },
  ],
  applies: (combatRoll: CombatRoll): boolean => {
    const commanderNsid: string = "card.leader.commander:discordant-supports/zelian-b";
    const rollType: CombatRollType = combatRoll.getRollType();
    return (rollType === "antiFighterBarrage") &&
    combatRoll.isCommanderUnlocked(commanderNsid);
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      const unit: UnitType = unitAttrs.getUnit();

      if (
        combatRoll.self.hasUnit(unit) &&
        (unitAttrs.getUnit() === "dreadnought" || unitAttrs.getUnit() === "war-sun") &&
        unitAttrs.isShip() &&
        !unitAttrs.getAntiFighterBarrage()
      ) {
        continue;
      }
      // Found a Dreadnought or War Sun ship without AFB.
      combatRoll.self.addSyntheticUnit(
        {
          name: `Zelian B (${unit})`,
          unit: "Zelian B" as UnitType,
          antiFighterBarrage: { hit: 5 },
        },
        1
      );
    }
  },
};