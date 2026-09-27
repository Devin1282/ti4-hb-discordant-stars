import { CombatAttrs, CombatRoll } from "ti4-ttpg-ts";
import { placeGameObjects, SELF, OPPONENT } from "./abstract.test";
import { WoundDefense } from "./wound-defense";
import { MockGameObject } from "ttpg-mock";

beforeEach(() => {
  TI4.unitModifierRegistry.load("discordant-stars", [WoundDefense]);
});

const WOUND_TOKEN_NSID = "token.system:discordant-stars/wound-token";

it("default (no wound token in system)", () => {
  placeGameObjects({
    selfUnits: new Map([["dreadnought", 1]]),
  });

  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual([]);
});

it("does not apply to attacker", () => {
  placeGameObjects({
    selfUnits: new Map([["dreadnought", 1]]),
  });

  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: SELF,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual([]);
});

it("does not apply to non-spaceCombat roll types", () => {
  placeGameObjects({
    selfUnits: new Map([["dreadnought", 1]]),
  });

  const combatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual([]);
});