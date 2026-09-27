import { CombatRoll, UnitAttrs } from "ti4-ttpg-ts";
import { placeGameObjects, SELF, OPPONENT } from "./abstract.test";
import { _countUnitUpgradeTech, Templar } from "./templar";

beforeEach(() => {
  TI4.unitModifierRegistry.load("discordant-stars", [Templar]);
});

it("registry", () => {
  const nsid = "card.leader.mech:discordant-stars/templar";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe("Templar");
});

it("default", () => {
  placeGameObjects({ selfUnits: new Map([["mech", 1]]) });
  const combatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);
  const mechAttrs: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("mech");
  const groundCombat = mechAttrs.getGroundCombatOrThrow();
  expect(groundCombat.getHit()).toBe(6);
});

it("modifier (space combat)", () => {
  placeGameObjects({
    self: ["card.leader.mech:discordant-stars/templar"],
    selfUnits: new Map([["mech", 1]]),
  });
  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);
});

it("modifier (no mech)", () => {
  placeGameObjects({
    self: ["card.leader.mech:discordant-stars/templar"],
    selfUnits: new Map([["infantry", 1]]),
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

it("modifier (0 opponent techs)", () => {
  placeGameObjects({
    self: ["card.leader.mech:discordant-stars/templar"],
    selfUnits: new Map([["mech", 1]]),
  });
  const combatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Templar"]);
  const mechAttrs: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("mech");
  const groundCombat = mechAttrs.getGroundCombatOrThrow();
  expect(groundCombat.getHit()).toBe(6);
});

it("modifier (1 opponent tech)", () => {
  placeGameObjects({
    self: ["card.leader.mech:discordant-stars/templar"],
    opponent: ["card.technology.unit-upgrade:base/dreadnought-2"],
    selfUnits: new Map([["mech", 1]]),
  });
  const combatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Templar"]);
  const mechAttrs: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("mech");
  const groundCombat = mechAttrs.getGroundCombatOrThrow();
  expect(groundCombat.getHit()).toBe(5);
});

it("modifier (2 opponent techs)", () => {
  placeGameObjects({
    self: ["card.leader.mech:discordant-stars/templar"],
    opponent: [
      "card.technology.unit-upgrade:base/dreadnought-2",
      "card.technology.unit-upgrade:base/carrier-2",
    ],
    selfUnits: new Map([["mech", 1]]),
  });
  const combatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Templar"]);
  const mechAttrs: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("mech");
  const groundCombat = mechAttrs.getGroundCombatOrThrow();
  expect(groundCombat.getHit()).toBe(4);
});

it("modifier (self techs do not count)", () => {
  placeGameObjects({
    self: [
      "card.leader.mech:discordant-stars/templar",
      "card.technology.unit-upgrade:base/dreadnought-2",
      "card.technology.unit-upgrade:base/carrier-2",
    ],
    selfUnits: new Map([["mech", 1]]),
  });
  const combatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Templar"]);
  const mechAttrs: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("mech");
  const groundCombat = mechAttrs.getGroundCombatOrThrow();
  expect(groundCombat.getHit()).toBe(6);
});

it("_countUnitUpgradeTech", () => {
  placeGameObjects({
    opponent: [
      "card.technology.unit-upgrade:base/dreadnought-2",
      "card.technology.unit-upgrade:base/carrier-2",
    ],
  });
  const count: number = _countUnitUpgradeTech(OPPONENT);
  expect(count).toBe(2);
});

it("_countUnitUpgradeTech (no techs)", () => {
  placeGameObjects({
    opponent: ["card.leader.mech:discordant-stars/templar"],
  });
  const count: number = _countUnitUpgradeTech(OPPONENT);
  expect(count).toBe(0);
});

it("_countUnitUpgradeTech (self techs)", () => {
  placeGameObjects({
    self: [
      "card.technology.unit-upgrade:base/dreadnought-2",
      "card.technology.unit-upgrade:base/carrier-2",
    ],
  });
  const count: number = _countUnitUpgradeTech(OPPONENT);
  expect(count).toBe(0);
});