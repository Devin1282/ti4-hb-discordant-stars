import { CombatAttrs, CombatRoll, UnitAttrs } from "ti4-ttpg-ts";
import { placeGameObjects, SELF, OPPONENT } from "./abstract.test";
import { _countFlagships, TradeProtectorate } from "./trade-protectorate";
import { MockGameObject } from "ttpg-mock";

beforeEach(() => {
  TI4.unitModifierRegistry.load("discordant-stars", [TradeProtectorate]);
});

const TRADE_PROTECTORATE_NSID =
  "card.breakthrough:discordant-stars/trade-protectorate";
const CELAGROM_TOKEN_NSID =
  "token.celagrom:discordant-stars/celagrom-token";

it("registry", () => {
  expect(
    TI4.unitModifierRegistry.getByNsid(TRADE_PROTECTORATE_NSID)?.getName()
  ).toBe("Trade Protectorate");
});

it("modifier (Celagrom token missing - modifier does not apply)", () => {
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

  expect(combatRoll.getUnitModifierNames()).toEqual([]);
  expect(combatRoll.self.unitAttrsSet.get("celagrom" as any)).toBeUndefined();
});

it("modifier (Celagrom token present, 0 flagships - adds Celagrom with 1 die)", () => {
  placeGameObjects({
    self: [TRADE_PROTECTORATE_NSID],
    selfUnits: new Map([["dreadnought", 1]]),
  });
  MockGameObject.simple("token.celagrom:discordant-stars/celagrom-token");
  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });


  expect(combatRoll.getUnitModifierNames()).toEqual(["Trade Protectorate"]);

  const celagromAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("celagrom" as any);
  const spaceCombat: CombatAttrs = celagromAttrs.getSpaceCombatOrThrow();
  expect(spaceCombat.getDice()).toBe(1);
  expect(spaceCombat.getHit()).toBe(5);
});

it("modifier (Celagrom token present, 1+ flagships - adds Celagrom with 2 dice)", () => {
  placeGameObjects({
    self: [TRADE_PROTECTORATE_NSID],
    tokens: [CELAGROM_TOKEN_NSID],
    selfUnits: new Map([["flagship", 1]]),
  });
    MockGameObject.simple("token.celagrom:discordant-stars/celagrom-token");
  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Trade Protectorate"]);

  const celagromAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("celagrom" as any);
  const spaceCombat: CombatAttrs = celagromAttrs.getSpaceCombatOrThrow();
  expect(spaceCombat.getDice()).toBe(2);
  expect(spaceCombat.getHit()).toBe(5);
});

it("modifier (bombardment roll with Celagrom token present)", () => {
  placeGameObjects({
    self: [TRADE_PROTECTORATE_NSID],
    selfUnits: new Map([["dreadnought", 1]]),
  });
    MockGameObject.simple("token.celagrom:discordant-stars/celagrom-token");
  const combatRoll = CombatRoll.createCooked({
    rollType: "bombardment",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Trade Protectorate"]);

  const celagromAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("celagrom" as any);
  const bombardment: CombatAttrs = celagromAttrs.getBombardmentOrThrow();
  expect(bombardment.getHit()).toBe(5);
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