import { UnitPlastic } from "ti4-ttpg-ts";
import {
  CombatRoll,
  CombatRollType,
} from "ti4-ttpg-ts";
import {
  UnitAttrsSchemaType,
  UnitType,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";

export const ProjectionOfPower: UnitModifierSchemaType = {
  name: "Projection Of Power",
  description: "At the start of any space combat in a system that is adjacent to or contains 1 or more of your space docks, choose up to 1 ship in that system to gain ANTI-FIGHTER BARRAGE 6 during that combat",
  triggers: [{ cardClass: "faction-ability", nsidName: "projection-of-power" }],
  owner: "self",
  priority: "mutate",
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return (
        rollType === "antiFighterBarrage" || rollType === "spaceCombat") &&
        (combatRoll.self.hasUnit("space-dock") ||
        combatRoll.self.hasUnitAdj("space-dock"));
  },
  apply: (combatRoll: CombatRoll): void => {
    // A galvanized space dock adds an extra dice.
    // Look for one and use a synthetic unit.  Do not modify
    // the existing space dock and override the count, let a
    // faction have space docks with anti-fighter barrage.
    const isGalvanizedSpaceDock = (unitPlastic: UnitPlastic): boolean => {
      const linkedPlastic: UnitPlastic | undefined =
        unitPlastic.getLinkedPlastic();
      return (
        unitPlastic.getUnit() === "galvanize-token" &&
        linkedPlastic !== undefined &&
        linkedPlastic.getUnit() === "space-dock"
      );
    };
    const hasGalvanizedSpaceDock: boolean =
      combatRoll.self.unitPlasticHex.some(isGalvanizedSpaceDock) ||
      combatRoll.self.unitPlasticAdj.some(isGalvanizedSpaceDock);
    const extraDice: number = hasGalvanizedSpaceDock ? 1 : 0;

    const schema: UnitAttrsSchemaType = {
      unit: "experimental-battlestation" as UnitType,
      name: "Experimental Battlestation",
      antiFighterBarrage: { hit: 6, range: 1, extraDice },
    };
    combatRoll.self.addSyntheticUnit(schema, 1);
  },
};