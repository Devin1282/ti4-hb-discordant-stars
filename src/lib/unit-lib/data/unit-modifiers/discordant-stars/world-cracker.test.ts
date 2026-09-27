import { CombatAttrs, CombatRoll, UnitAttrs } from "ti4-ttpg-ts";
import { placeGameObjects, SELF, OPPONENT } from "./abstract.test";
import { WorldCracker } from "./world-cracker";

beforeEach(() => {
  TI4.unitModifierRegistry.load("discordant-stars", [WorldCracker]);
});

const WORLD_CRACKER_NSID = "unit:discordant-stars/world-cracker";

it("registry", () => {
  expect(
    TI4.unitModifierRegistry.getByNsid(WORLD_CRACKER_NSID)?.getName()
  ).toBe("World Cracker");
});

it("default (no flagship)", () => {
  placeGameObjects({ selfUnits: new Map([["cruiser", 1]]) });
  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);
});

it("modifier (0 adjacent asteroid fields)", () => {
  placeGameObjects({
    hex: "<0,0,0>",
    self: [WORLD_CRACKER_NSID],
    selfUnits: new Map([["flagship", 1]]),
  });

  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["World Cracker"]);

  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  const spaceCombat: CombatAttrs = flagshipAttrs.getSpaceCombatOrThrow();
  expect(spaceCombat.getDice()).toBe(2);
});

it("modifier (1 adjacent asteroid field - adds +1 die to abilities/combat)", () => {
  // Tile 45 is an asteroid field
  placeGameObjects({
    systemNsidAdj: "tile.system:base/45",
    self: [WORLD_CRACKER_NSID],
    selfUnits: new Map([["flagship", 1]]),
  });

  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["World Cracker"]);

  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  const spaceCombat: CombatAttrs = flagshipAttrs.getSpaceCombatOrThrow();
  expect(spaceCombat.getDice()).toBe(3);
});