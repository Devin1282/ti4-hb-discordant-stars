import {
  CombatRoll,
  UnitAttrs,
  SystemAdjacency,
  Faction,
  UnitPlastic,
  UnitAttrsSet,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";
import {
  HexType,
  PlayerSlot,
} from "ttpg-darrell";

  /**
   * Get hexes adjacent to the given hexes (including the source hexes).
   *
   * @param hex
   * @param playerSlot
   * @returns
   */
 export function _getInAndAdjacentHexes(
    hex: HexType,
    playerSlot: PlayerSlot
  ): Set<HexType> {
    const allAdjHexes: Set<HexType> = new Set(); // include original hexes
    const systemAdjacency: SystemAdjacency = new SystemAdjacency();
    const faction: Faction | undefined =
      TI4.factionRegistry.getByPlayerSlot(playerSlot);
    const adjHexes: Set<HexType> = systemAdjacency.getAdjHexes(hex, faction);
    for (const adjHex of adjHexes) {
        allAdjHexes.add(adjHex);
    }
    allAdjHexes.add(hex);
    return allAdjHexes;
  }

    /**
   * Get hexes and mechs (get plastics).
   *
   * @returns
   */
export function _getHexToMechs(): Map<HexType, Array<UnitPlastic>> {
    const hexToMechs: Map<HexType, Array<UnitPlastic>> = new Map();
    const unitAttrsSet: UnitAttrsSet =
      TI4.unitAttrsRegistry.defaultUnitAttrsSet();
    const unitPlastics: Array<UnitPlastic> = UnitPlastic.getAll();
    for (const unitPlastic of unitPlastics) {
      const unitAttrs: UnitAttrs | undefined = unitAttrsSet.get(
        unitPlastic.getUnit()
      );
      if (unitAttrs && unitAttrs.getUnit() === "mech") {
        const hex: HexType = unitPlastic.getHex();
        let mechs: Array<UnitPlastic> | undefined = hexToMechs.get(hex);
        if (!mechs) {
          mechs = [];
          hexToMechs.set(hex, mechs);
        }
        mechs.push(unitPlastic);
      }
    }
    return hexToMechs;
  }

export const BegBersha: UnitModifierSchemaType = {
  name: "Beg Bersha",
  description: "combat or unit ability roll, +1 die for each mech in or adjacent to this system",
  triggers: [{ cardClass: "unit", nsidName: "beg-bersha" }],
  owner: "self",
  priority: "adjust",
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.self.hasUnit("flagship");
  },
  apply: (combatRoll: CombatRoll): void => {
    let totalMechCount: number = 0;
    
    // Get all hexes
    const inAndAdjacentHexes: Set<HexType> = _getInAndAdjacentHexes(
      combatRoll.getHex(),
      combatRoll.self.playerSlot
    );

    // Get all mechs is hexes
    const hexToMechs: Map<
      HexType,
      Array<UnitPlastic>
    > = _getHexToMechs();

    for (const hex of inAndAdjacentHexes) {
      const mechs: Array<UnitPlastic> | undefined =
        hexToMechs.get(hex);
      if (mechs) {
        totalMechCount+=mechs.length;
      }
    }


    const flagshipAttrs: UnitAttrs =
      combatRoll.self.unitAttrsSet.getOrThrow("flagship");
    flagshipAttrs.getBombardment()?.addDice(totalMechCount);
    flagshipAttrs.getAntiFighterBarrage()?.addDice(totalMechCount);
    flagshipAttrs.getSpaceCannon()?.addDice(totalMechCount);
    flagshipAttrs.getSpaceCombat()?.addDice(totalMechCount);
    flagshipAttrs.getGroundCombat()?.addDice(totalMechCount);
  },
};