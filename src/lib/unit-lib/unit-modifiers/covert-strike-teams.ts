// TODO: Add Covert Stike Teams as a CombatRollType similar to Ambush
import {
  CombatRoll,
  CombatRollType,
  UnitType,
  UnitAttrs,
  CombatAttrs,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";

export const CovertStrikeTeams: UnitModifierSchemaType = {
  name: "Covert Strike Teams",
  description: "up to two gound forces attack",
  triggers: [{ cardClass: "technology.yellow", nsidName: "covert-strike-teams" }],
  owner: "self",
  priority: "mutate",
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "groundCombat";
  },
  apply: (combatRoll: CombatRoll): void => {
    const infantryCount: number = combatRoll.self.getCount("infantry");
    const mechCount: number = combatRoll.self.getCount("mech");

    // Remove all normal units from the roll.
    combatRoll.self.unitAttrsSet.getAll().forEach((unitAttrs: UnitAttrs) => {
      const unitType: UnitType = unitAttrs.getUnit();
      combatRoll.self.overrideUnitCountHex.set(unitType, 0);
    });

    // Favor mechs.
    const mechRolls: number = Math.min(mechCount, 2);
    const infantryRolls: number = Math.min(infantryCount, 2 - mechRolls);

    const mechUnitAttrs: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("mech");
    if (mechRolls > 0 && mechUnitAttrs) {
      const mechCombatAttrs: CombatAttrs | undefined =
        mechUnitAttrs.getSpaceCombat();
      if (mechCombatAttrs) {
        combatRoll.self.addSyntheticUnit(
          {
            name: "Covert Stike Mech (mech)",
            unit: "covert-strike-mech" as UnitType,
            spaceCombat: {
              dice: 1,
              hit: mechCombatAttrs.getHit(),
            },
          },
          mechRolls
        );
      }
    }

    const infantryUnitAttrs: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("infantry");
    if (infantryRolls > 0 && infantryUnitAttrs) {
      const infantryCombatAttrs: CombatAttrs | undefined =
        infantryUnitAttrs.getSpaceCombat();
      if (infantryCombatAttrs) {
        combatRoll.self.addSyntheticUnit(
          {
            name: "Covert Strike (infantry)",
            unit: "covert-strike-infantry" as UnitType,
            spaceCombat: {
              dice: 1,
              hit: infantryCombatAttrs.getHit(),
            },
          },
          infantryRolls
        );
      }
    }
  },

};