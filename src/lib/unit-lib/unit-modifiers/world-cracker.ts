import {
  CombatRoll,
  SystemAdjacency,
  Faction,
  UnitAttrs,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";
import { HexType } from "ttpg-darrell";
import { Vector } from "@tabletop-playground/api";

export const WorldCracker: UnitModifierSchemaType = {
  name: "World Cracker",
  description: "combat or unit ability roll, +1 die for each asteroid field adjacent to this unit",
  triggers: [{ cardClass: "unit", nsidName: "world-cracker" }],
  owner: "self",
  priority: "adjust",
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.self.hasUnit("flagship");
  },
  apply: (combatRoll: CombatRoll): void => {
    let adjAsteroidFields: number = 0;

    const hex: HexType = combatRoll.getHex();
    const faction: Faction | undefined = combatRoll.self.faction;
    const adjHexes: Set<HexType> = new SystemAdjacency().getAdjHexes(
      hex,
      faction
    );
    for (const adjHex of adjHexes) {
      const pos: Vector = TI4.hex.toPosition(adjHex);
      const system = TI4.systemRegistry.getByPosition(pos);
      if (system && system.getAnomalies().includes("asteroid-field")) {
        adjAsteroidFields++;
      }
    }
    const worldCrackerAttrs: UnitAttrs =
      combatRoll.self.unitAttrsSet.getOrThrow("flagship");
    worldCrackerAttrs.getBombardment()?.addDice(adjAsteroidFields);
    worldCrackerAttrs.getAntiFighterBarrage()?.addDice(adjAsteroidFields);
    worldCrackerAttrs.getSpaceCannon()?.addDice(adjAsteroidFields);
    worldCrackerAttrs.getSpaceCombat()?.addDice(adjAsteroidFields);
    worldCrackerAttrs.getGroundCombat()?.addDice(adjAsteroidFields);
  },
};