import { CombatRoll, CombatRollParams } from "ti4-ttpg-ts";
import { placeGameObjects, SELF, OPPONENT } from "./abstract.test";
import { unitAttrs } from "../../../unit-attrs";
import { _countUnitUpgradeTech, Reckoning } from "./reckoning";

beforeEach(() => {
  TI4.unitModifierRegistry.load("discordant-stars", [Reckoning]);
    TI4.unitAttrsRegistry.load("discordant-stars", unitAttrs);
});

const RECKONING_NSID: string = "unit:discordant-stars/reckoning";
const TECH_NSID_A: string = "card.technology.unit-upgrade:base/reckoning-tech-a";
const TECH_NSID_B: string = "card.technology.unit-upgrade:base/reckoning-tech-b";

const spaceCombatParams: CombatRollParams = {
  rollType: "spaceCombat",
  hex: "<0,0,0>",
  activatingPlayerSlot: OPPONENT,
  rollingPlayerSlot: SELF,
};

it("registry", () => {
  const nsid: string = RECKONING_NSID;
  expect(TI4.unitModifierRegistry.getByNsid(nsid)).toBeDefined();
});

it("default", () => {
  placeGameObjects({
    selfUnits: new Map([["flagship", 1]]),
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked(spaceCombatParams);

  expect(combatRoll.getUnitModifierNames()).toEqual([]);
  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("flagship")
      .getSpaceCombatOrThrow()
      .getHit()
  ).toBe(7);
});

it("modifier (flagship, no tech)", () => {
  placeGameObjects({
    self: [RECKONING_NSID],
    selfUnits: new Map([["flagship", 1]]),
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked(spaceCombatParams);

  expect(combatRoll.getUnitModifierNames()).toEqual(["Reckoning"]);
  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("flagship")
      .getSpaceCombatOrThrow()
      .getHit()
  ).toBe(7);
});

it("modifier (flagship, one tech)", () => {
  placeGameObjects({
    self: [RECKONING_NSID],
    selfUnits: new Map([["flagship", 1]]),
    opponent: [TECH_NSID_A],
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked(spaceCombatParams);

  expect(combatRoll.getUnitModifierNames()).toEqual(["Reckoning"]);
  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("flagship")
      .getSpaceCombatOrThrow()
      .getHit()
  ).toBe(6);
});

it("modifier (flagship, two unique techs)", () => {
  placeGameObjects({
    self: [RECKONING_NSID],
    selfUnits: new Map([["flagship", 1]]),
    opponent: [TECH_NSID_A, TECH_NSID_B],
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked(spaceCombatParams);

  expect(combatRoll.getUnitModifierNames()).toEqual(["Reckoning"]);
  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("flagship")
      .getSpaceCombatOrThrow()
      .getHit()
  ).toBe(5);
});

it("modifier (flagship, duplicate tech)", () => {
  placeGameObjects({
    self: [RECKONING_NSID],
    selfUnits: new Map([["flagship", 1]]),
    opponent: [TECH_NSID_A, TECH_NSID_A],
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked(spaceCombatParams);

  expect(combatRoll.getUnitModifierNames()).toEqual(["Reckoning"]);
  expect(
    combatRoll.self.unitAttrsSet
      .getOrThrow("flagship")
      .getSpaceCombatOrThrow()
      .getHit()
  ).toBe(6);
});

it("modifier (no flagship)", () => {
  placeGameObjects({
    self: [RECKONING_NSID],
    selfUnits: new Map([["fighter", 1]]),
    opponent: [TECH_NSID_A],
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked(spaceCombatParams);

  expect(combatRoll.getUnitModifierNames()).toEqual([]);
});

it("_countUnitUpgradeTech", () => {
  placeGameObjects({});

  expect(_countUnitUpgradeTech(OPPONENT)).toBe(0);
  expect(_countUnitUpgradeTech(SELF)).toBe(0);
});

it("_countUnitUpgradeTech (one opponent tech)", () => {
  placeGameObjects({
    opponent: [TECH_NSID_A],
  });

  expect(_countUnitUpgradeTech(OPPONENT)).toBe(1);
  expect(_countUnitUpgradeTech(SELF)).toBe(0);
});

it("_countUnitUpgradeTech (two unique opponent techs)", () => {
  placeGameObjects({
    opponent: [TECH_NSID_A, TECH_NSID_B],
  });

  expect(_countUnitUpgradeTech(OPPONENT)).toBe(2);
  expect(_countUnitUpgradeTech(SELF)).toBe(0);
});

it("_countUnitUpgradeTech (duplicate opponent tech)", () => {
  placeGameObjects({
    opponent: [TECH_NSID_A, TECH_NSID_A],
  });

  expect(_countUnitUpgradeTech(OPPONENT)).toBe(1);
  expect(_countUnitUpgradeTech(SELF)).toBe(0);
});

it("_countUnitUpgradeTech (self tech)", () => {
  placeGameObjects({
    self: [TECH_NSID_A],
  });

  expect(_countUnitUpgradeTech(SELF)).toBe(1);
  expect(_countUnitUpgradeTech(OPPONENT)).toBe(0);
});

it("_countUnitUpgradeTech (self and opponent techs)", () => {
  placeGameObjects({
    self: [TECH_NSID_A],
    opponent: [TECH_NSID_B],
  });

  expect(_countUnitUpgradeTech(SELF)).toBe(1);
  expect(_countUnitUpgradeTech(OPPONENT)).toBe(1);
});
