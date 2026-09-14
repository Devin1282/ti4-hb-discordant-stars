import { CombatAttrs, CombatRoll, UnitAttrs } from "ti4-ttpg-ts";
import { placeGameObjects, SELF, OPPONENT } from "./abstract.test";
import { Vox } from "./vox";

beforeEach(() => {
  TI4.unitModifierRegistry.load("discordant-stars", [Vox]);
});

const VOX_NSID = "unit:discordant-stars/vox";

it("registry", () => {
  expect(TI4.unitModifierRegistry.getByNsid(VOX_NSID)?.getName()).toBe("Vox");
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

it("modifier (ground combat - wrong roll type)", () => {
  placeGameObjects({
    self: [VOX_NSID],
    selfUnits: new Map([["flagship", 1]]),
  });
  const combatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);
});

it("modifier (system with no planet traits matching - 0 extra dice)", () => {
  // Tile 18 is Mecatol Rex (no planet trait)
  placeGameObjects({
    systemNsid: "tile.system:base/18",
    self: [VOX_NSID],
    selfUnits: new Map([["flagship", 1]]),
  });

  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Vox"]);

  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  const spaceCombat: CombatAttrs = flagshipAttrs.getSpaceCombatOrThrow();
  expect(spaceCombat.getDice()).toBe(2);
});

it("modifier (system with 1 planet trait match - +1 die)", () => {
  // Tile 25 (Quann) has 1 cultural planet
  placeGameObjects({
    systemNsid: "tile.system:base/25",
    self: [VOX_NSID],
    selfUnits: new Map([["flagship", 1]]),
  });

  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Vox"]);

  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  const spaceCombat: CombatAttrs = flagshipAttrs.getSpaceCombatOrThrow();
  expect(spaceCombat.getDice()).toBe(3);
});

it("modifier (system with multiple planets sharing a trait - +2 dice)", () => {
  // Tile 36 (Arnor and Lor) has 2 industrial planets
  placeGameObjects({
    systemNsid: "tile.system:base/36",
    self: [VOX_NSID],
    selfUnits: new Map([["flagship", 1]]),
  });

  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Vox"]);

  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  const spaceCombat: CombatAttrs = flagshipAttrs.getSpaceCombatOrThrow();
  expect(spaceCombat.getDice()).toBe(4);
});