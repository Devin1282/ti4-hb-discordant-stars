import { CombatAttrs, CombatRoll, UnitAttrs } from "ti4-ttpg-ts";
import { placeGameObjects, SELF, OPPONENT } from "./abstract.test";
import { _countFlagships, TradeProtectorate } from "./trade-protectorate";

beforeEach(() => {
  TI4.unitModifierRegistry.load("discordant-stars", [TradeProtectorate]);
});

const TRADE_PROTECTORATE_NSID =
  "card.breakthrough:discordant-stars/trade-protectorate";

it("registry", () => {
  expect(
    TI4.unitModifierRegistry.getByNsid(TRADE_PROTECTORATE_NSID)?.getName()
  ).toBe("Trade Protectorate");
});

it("default (no breakthrough card)", () => {
  placeGameObjects({ selfUnits: new Map([["flagship", 2]]) });
  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);

  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  const spaceCombat: CombatAttrs = flagshipAttrs.getSpaceCombatOrThrow();
  expect(spaceCombat.getDice()).toBe(2);
});

it("modifier (ground combat - wrong roll type)", () => {
  placeGameObjects({
    self: [TRADE_PROTECTORATE_NSID],
    selfUnits: new Map([["flagship", 2]]),
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

it("modifier (only 1 flagship - condition not met)", () => {
  placeGameObjects({
    self: [TRADE_PROTECTORATE_NSID],
    selfUnits: new Map([["flagship", 1]]),
  });
  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Trade Protectorate"]);

  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  const spaceCombat: CombatAttrs = flagshipAttrs.getSpaceCombatOrThrow();
  expect(spaceCombat.getDice()).toBe(2);
});

it("modifier (2 flagships - condition met)", () => {
  placeGameObjects({
    self: [TRADE_PROTECTORATE_NSID],
    selfUnits: new Map([["flagship", 2]]),
  });
  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Trade Protectorate"]);

  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  const spaceCombat: CombatAttrs = flagshipAttrs.getSpaceCombatOrThrow();
  expect(spaceCombat.getDice()).toBe(3);
});

it("_countFlagships", () => {
  placeGameObjects({
    selfUnits: new Map([["flagship", 2]]),
  });
  const count: number = _countFlagships(SELF);
  expect(count).toBe(2);
});

it("_countFlagships (no flagships)", () => {
  placeGameObjects({
    selfUnits: new Map([["cruiser", 2]]),
  });
  const count: number = _countFlagships(SELF);
  expect(count).toBe(0);
});

it("_countFlagships (opponent flagships)", () => {
  placeGameObjects({
    opponentUnits: new Map([["flagship", 2]]),
  });
  const count: number = _countFlagships(SELF);
  expect(count).toBe(0);
});