import { OPPONENT, placeGameObjects, SELF } from "./abstract.test";
import { CombatRoll } from "ti4-ttpg-ts";
import { UnitAttrs } from "ti4-ttpg-ts";
import {CombinatorialBypass} from "./combinatorial-bypass"

beforeEach(() => {
  TI4.unitModifierRegistry.load("discordant-stars", [CombinatorialBypass]);
});

it("registry", () => {
  const nsid = "card.promissory:discordant-stars/combinatorial-bypass";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe("Combinatorial Bypass");
});

it("default", () => {
  placeGameObjects({});
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);

  const pds: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("pds");
  expect(pds.getDisablePlanetaryShield()).toBe(false);
  expect(pds.getDisableSpaceCannonDefense()).toBe(false);
});

it("modifier (self)", () => {
  placeGameObjects({ self: ["card.promissory:discordant-stars/combinatorial-bypass"] });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonDefense",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Combinatorial Bypass"]);

  const pds: UnitAttrs = combatRoll.opponent.unitAttrsSet.getOrThrow("pds");
  expect(pds.getDisablePlanetaryShield()).toBe(true);
  expect(pds.getDisableSpaceCannonDefense()).toBe(true);
});