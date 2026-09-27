import {
  CombatRoll,
  CombatRollType,
  UnitType,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";

export const AwakenedPlanetoids: UnitModifierSchemaType = {
  name: "Awakened Planetoids",
  description: "Planets participate in combat with present units.",
  owner: "self",
  priority: "adjust", 
  triggers: [{ cardClass: "breakthrough", nsidName: "awakened-planetoids" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return (rollType === "groundCombat") || 
    (rollType === "spaceCombat");
  },
  apply: (combatRoll: CombatRoll): void => {
    const rollType: CombatRollType = combatRoll.getRollType();
    if (rollType === "groundCombat") {
        //check that at least one ground force exists, if so, add planet as Synthetic unit
        let hasGroundForce = false;
        for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
            hasGroundForce = unitAttrs.isGround();
        }
        if (hasGroundForce) {
            const resources = combatRoll.planet?.getResources();
            let planetName = combatRoll.planet?.getName();
            if(resources) {
                combatRoll.self.addSyntheticUnit(
                    {
                    name: `Awakened Planetoids (${planetName})`,
                    unit: `awakened-planetoids-${planetName}` as UnitType,
                    spaceCombat: { hit: 10 - resources},
                    },
                    1
                );
            }
            
        }
    }

    if (rollType === "spaceCombat") {
        //Check that at least one ship still exists, if so, add all planets as synthetic units
        let hasShip = false;
        for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
            hasShip = unitAttrs.isShip();
        }
        if (hasShip) {
            const planets = combatRoll.system?.getPlanets() ?? [];

            for (const planet of planets) {
                const resources = planet.getResources();
                let planetName = planet.getName();
                if(resources) {
                    combatRoll.self.addSyntheticUnit(
                    {
                        name: `Awakened Planetoids (${planetName})`,
                        unit: `awakened-planetoids-${planetName}` as UnitType,
                        spaceCombat: { hit: 10 - resources},
                        },
                        1
                    );
                }
            }
        }
    }
  },
};
