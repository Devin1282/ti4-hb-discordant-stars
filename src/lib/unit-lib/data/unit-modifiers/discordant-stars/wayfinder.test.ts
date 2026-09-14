import { CombatRoll, UnitAttrs } from "ti4-ttpg-ts";
import { placeGameObjects, SELF, OPPONENT } from "./abstract.test";
import { _countFragmentTokens, Wayfinder } from "./wayfinder";

beforeEach(() => {
  TI4.unitModifierRegistry.load("discordant-stars", [Wayfinder]);
});

const WAYFINDER_NSID = "unit:discordant-stars/wayfinder";

it("registry", () => {
  expect(TI4.unitModifierRegistry.getByNsid(WAYFINDER_NSID)?.getName()).toBe(
    "Wayfinder"
  );
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

it("modifier (0 fragment tokens)", () => {
  placeGameObjects({
    self: [WAYFINDER_NSID],
    selfUnits: new Map([["flagship", 1]]),
  });
  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Wayfinder"]);

  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  const spaceCombat = flagshipAttrs.getSpaceCombatOrThrow();
  expect(spaceCombat.getHit()).toBe(7);
});

it("modifier (2 fragment tokens - applies hit bonus to all abilities)", () => {
  placeGameObjects({
    self: [
      WAYFINDER_NSID,
      "token.other:discordant-stars/cultural-fragment-token",
      "token.other:discordant-stars/hazardous-fragment-token",
    ],
    selfUnits: new Map([["flagship", 1]]),
  });

  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Wayfinder"]);

  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");

  // Base hit (7) minus bonus (2) equals effective hit threshold (5)
  const spaceCombat = flagshipAttrs.getSpaceCombatOrThrow();
  expect(spaceCombat.getHit()).toBe(5);
});

it("_countFragmentTokens", () => {
  placeGameObjects({
    self: [
      "token.other:discordant-stars/cultural-fragment-token",
      "token.other:discordant-stars/hazardous-fragment-token",
      "token.other:discordant-stars/industrial-fragment-token",
    ],
  });
  const count: number = _countFragmentTokens(SELF);
  expect(count).toBe(3);
});

it("_countFragmentTokens (no tokens)", () => {
  placeGameObjects({
    self: [WAYFINDER_NSID],
  });
  const count: number = _countFragmentTokens(SELF);
  expect(count).toBe(0);
});

it("_countFragmentTokens (opponent tokens)", () => {
  placeGameObjects({
    opponent: [
      "token.other:discordant-stars/cultural-fragment-token",
      "token.other:discordant-stars/hazardous-fragment-token",
    ],
  });
  const count: number = _countFragmentTokens(SELF);
  expect(count).toBe(0);
});