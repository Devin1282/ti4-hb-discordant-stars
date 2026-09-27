import {
  CombatRoll,
  UnitAttrs,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";

export const Justicar: UnitModifierSchemaType = {
  name: "Justicar",
  description: "This unit cannot lose its PLANETARY SHIELD",
  triggers: [
    {
      cardClass: "mech",
      nsidName: "justicar",
    },
  ],
  owner: "self",
  priority: "mutate-late",
  applies: (combatRoll: CombatRoll): boolean => {
    return (
      combatRoll.getRollType() === "bombardment" &&
      combatRoll.opponent.hasUnit("mech")
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    combatRoll.self.unitAttrsSet
        .getAll()
        .forEach((unitAttr: UnitAttrs): void => {
          unitAttr.setDisablePlanetaryShield(false);
        });
  },
};