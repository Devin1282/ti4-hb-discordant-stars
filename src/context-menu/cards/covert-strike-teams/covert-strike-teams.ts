import {
  CombatRoll,
  UnitType,
  UnitAttrs,
  CombatAttrs,
  OnSystemActivated,
  System,
  SystemAdjacency,
  Faction,
  CombatRollParams,
  UnitPlastic,
  Planet,
} from "ti4-ttpg-ts";
import {
  AbstractRightClickCard,
  Broadcast,
  Find,
  HexType,
  IGlobal,
} from "ttpg-darrell";
import {
  Color,
  GameObject,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";

const NSID_COVERT_STRIKE_TEAMS: string =
  "card.tech:discordant-stars/covert-strike-teams";
const ACTION_COVERT_STRIKE_TEAMS: string = "*Invoke Covert Stike Teams";
const TOOLTIP_COVERT_STRIKE_TEAMS: string =
  "Rolls Ground Combat for 2 Units";

/**
 * "At the start of a ground combat, you may roll 1 die for each of up to 2 of your ground forces on that planet. 
 * For each result equal to or greater than that unit's combat value, produce 1 hit; 
 * your opponent must assign it to 1 of their units on that planet."
 */
export class RightClickCovertStrikeTeams
  extends AbstractRightClickCard
  implements IGlobal
{
  constructor() {
    const customActionHandler = (
      object: GameObject,
      player: Player,
      identifier: string,
    ): void => {
      if (identifier === ACTION_COVERT_STRIKE_TEAMS) {
        this._doCovertStrikeTeams(object, player.getSlot());
      }
    };
    super(NSID_COVERT_STRIKE_TEAMS, ACTION_COVERT_STRIKE_TEAMS, customActionHandler);
    this.setTooltip(ACTION_COVERT_STRIKE_TEAMS, TOOLTIP_COVERT_STRIKE_TEAMS);
  }

  init(): void {
    super.init();
  }

  _doCovertStrikeTeams(
    covertStrikeTeamsCard: GameObject,
    clickingPlayerSlot: number,
  ): void {
    const clickingPlayerName: string =
      TI4.playerName.getBySlot(clickingPlayerSlot);

    const find: Find = new Find();
    const cardPos: Vector = covertStrikeTeamsCard.getPosition();
    const cardOwnerSlot: number = find.closestOwnedCardHolderOwner(cardPos);
    const color: Color = world.getSlotColor(cardOwnerSlot);

    const activeSystem: System | undefined =
      OnSystemActivated.getLastActivatedSystem();
    if (!activeSystem) {
      Broadcast.chatAll(
        `${clickingPlayerName} invokes Covert Stike Teams, no active system`,
        color,
      );
      return;
    }
    const activeSystemPos: Vector = activeSystem.getObj().getPosition();
    const activeSystemHex: HexType = TI4.hex.fromPosition(activeSystemPos);

    const combatParams: CombatRollParams = {
      rollType: "groundCombat",
      rollingPlayerSlot: cardOwnerSlot,
      activatingPlayerSlot: cardOwnerSlot,
      hex: activeSystemHex,
    };
    const combatRoll: CombatRoll = CombatRoll.createCooked(combatParams);

    const infantryCount: number = combatRoll.self.getCount("infantry");
    const mechCount: number = combatRoll.self.getCount("mech");

    const planetNames: Array<string> = this._getLocalPlanetNames(
      cardOwnerSlot,
      activeSystemHex,
    );

    // Favor mechs.
    const mechRolls: number = Math.min(mechCount, 2);
    const infantryRolls: number = Math.min(infantryCount, 2 - mechRolls);

    if(mechRolls < 1 && infantryRolls < 1) {
      throw new Error(
        `Covert Strike Team: No ground forces found in system ${activeSystemHex}`,
      );
    }

    const mechUnitAttrs: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("mech");
    const infantryUnitAttrs: UnitAttrs | undefined =
      combatRoll.self.unitAttrsSet.get("infantry");
    const plastics: Array<UnitPlastic> = UnitPlastic.getAll();
      UnitPlastic.assignPlanets(plastics);

    const perPlanetResults: Array<string> = planetNames.map(
      (planetName: string): string => {
        let diceCount = 0;
        let hits: number = 0;
        const diceResults: Array<string> = [];
        plastics.forEach((plastic: UnitPlastic): void => {
          const planetOfPlastic = plastic.getPlanetExact();
          if (planetName === planetOfPlastic?.getName()) {
            if (diceCount < 2) {
              //favor mechs
              if (plastic.getUnit() === "mech" && mechUnitAttrs) {
                const mechCombatAttrs: CombatAttrs | undefined =
                  mechUnitAttrs.getGroundCombat();
                if (mechCombatAttrs) {
                  diceCount++;
                  const mechHit: number = mechCombatAttrs.getHit();
                  const diceResult: number = Math.floor(Math.random() * 10) + 1;
                  if (diceResult >= mechHit) {
                    diceResults.push(`${diceResult}#`);
                    hits++;
                  } else {
                    diceResults.push(`${diceResult}`);
                  }
                }
              } else if (plastic.getUnit() === "infantry" && infantryUnitAttrs) {
                const infantryCombatAttrs: CombatAttrs | undefined =
                  infantryUnitAttrs.getGroundCombat();
                if (infantryCombatAttrs) {
                  diceCount++;
                  const infantryHit: number = infantryCombatAttrs.getHit();
                  const diceResult: number = Math.floor(Math.random() * 10) + 1;
                  if (diceResult >= infantryHit) {
                    diceResults.push(`${diceResult}#`);
                    hits++;
                  } else {
                    diceResults.push(`${diceResult}`);
                  }
                }
              }
            }
          }
        });

        return [
          ">",
          `${planetName}:`,
          `${hits}`,
          `(${diceResults.join(", ")})`,
        ].join(" ");
      },
    );
    perPlanetResults.sort();

    Broadcast.chatAll(
      `${clickingPlayerName} invokes Covert Stike Teams in system ${activeSystem.getSystemTileNumber()}:\n${perPlanetResults.join(
        "\n",
      )}`,
      color,
    );
  }

  _getLocalPlanetNames(
    playerSlot: number,
    systemHex: HexType,
  ): Array<string> {
    const faction: Faction | undefined =
      TI4.factionRegistry.getByPlayerSlot(playerSlot);

    const adjacency: SystemAdjacency = new SystemAdjacency();

    const hexToSystem: Map<HexType, System> = SystemAdjacency.getHexToSystem();
    const planetNames: Array<string> = [];
    const system: System | undefined = hexToSystem.get(systemHex);
    if (system) {
      system.getPlanets().forEach((planet: Planet): void => {
        planetNames.push(planet.getName());
      });
    }

    return planetNames;
  }
}