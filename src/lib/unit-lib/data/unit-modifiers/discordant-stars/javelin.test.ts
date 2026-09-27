import { CombatRoll, UnitAttrs } from "ti4-ttpg-ts";
import { placeGameObjects, SELF, OPPONENT } from "./abstract.test";
import { _countUnitUpgradeTech, Javelin } from "./javelin";

beforeEach(() => {
  TI4.unitModifierRegistry.load("discordant-stars", [Javelin]);
});

it("registry", () => {
  const nsid = "card.leader.mech:discordant-stars/javelin";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe("Javelin");
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
    self: ["card.leader.mech:discordant-stars/javelin"],
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
    self: ["card.leader.mech:discordant-stars/javelin"],
    selfUnits: new Map([["fighter", 1]]),
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

it("modifier (0 techs)", () => {
  placeGameObjects({
    self: ["card.leader.mech:discordant-stars/javelin"],
    selfUnits: new Map([["mech", 1]]),
  });
  const combatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Javelin"]);
  const mechAttrs: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("mech");
  const groundCombat = mechAttrs.getGroundCombatOrThrow();
  expect(groundCombat.getHit()).toBe(6);
});

it("modifier (1 tech)", () => {
  placeGameObjects({
    self: [
      "card.leader.mech:discordant-stars/javelin",
      "card.technology.unit-upgrade:base/augmentation",
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
  expect(combatRoll.getUnitModifierNames()).toEqual(["Javelin"]);
  const mechAttrs: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("mech");
  const groundCombat = mechAttrs.getGroundCombatOrThrow();
  expect(groundCombat.getHit()).toBe(6);
});

it("modifier (2 techs)", () => {
  placeGameObjects({
    self: [
      "card.leader.mech:discordant-stars/javelin",
      "card.technology.unit-upgrade:base/augmentation",
      "card.technology.unit-upgrade:base/scope",
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
  expect(combatRoll.getUnitModifierNames()).toEqual(["Javelin"]);
  const mechAttrs: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("mech");
  const groundCombat = mechAttrs.getGroundCombatOrThrow();
  expect(groundCombat.getHit()).toBe(5);
});

it("modifier (3 techs)", () => {
  placeGameObjects({
    self: [
      "card.leader.mech:discordant-stars/javelin",
      "card.technology.unit-upgrade:base/augmentation",
      "card.technology.unit-upgrade:base/scope",
      "card.technology.unit-upgrade:base/weapon-mount",
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
  expect(combatRoll.getUnitModifierNames()).toEqual(["Javelin"]);
  const mechAttrs: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("mech");
  const groundCombat = mechAttrs.getGroundCombatOrThrow();
  expect(groundCombat.getHit()).toBe(5);
});

it("modifier (4 techs)", () => {
  placeGameObjects({
    self: [
      "card.leader.mech:discordant-stars/javelin",
      "card.technology.unit-upgrade:base/augmentation",
      "card.technology.unit-upgrade:base/scope",
      "card.technology.unit-upgrade:base/weapon-mount",
      "card.technology.unit-upgrade:base/armor-plating",
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
  expect(combatRoll.getUnitModifierNames()).toEqual(["Javelin"]);
  const mechAttrs: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("mech");
  const groundCombat = mechAttrs.getGroundCombatOrThrow();
  expect(groundCombat.getHit()).toBe(4);
});

it("modifier (5 techs)", () => {
  placeGameObjects({
    self: [
      "card.leader.mech:discordant-stars/javelin",
      "card.technology.unit-upgrade:base/augmentation",
      "card.technology.unit-upgrade:base/scope",
      "card.technology.unit-upgrade:base/weapon-mount",
      "card.technology.unit-upgrade:base/armor-plating",
      "card.technology.unit-upgrade:base/engine-upgrade",
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
  expect(combatRoll.getUnitModifierNames()).toEqual(["Javelin"]);
  const mechAttrs: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("mech");
  const groundCombat = mechAttrs.getGroundCombatOrThrow();
  expect(groundCombat.getHit()).toBe(4);
});

it("modifier (opponent techs)", () => {
  placeGameObjects({
    self: ["card.leader.mech:discordant-stars/javelin"],
    selfUnits: new Map([["mech", 1]]),
    opponent: [
      "card.technology.unit-upgrade:base/augmentation",
      "card.technology.unit-upgrade:base/scope",
    ],
  });
  const combatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Javelin"]);
  const mechAttrs: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("mech");
  const groundCombat = mechAttrs.getGroundCombatOrThrow();
  expect(groundCombat.getHit()).toBe(6);
});

it("_countUnitUpgradeTech", () => {
  placeGameObjects({
    self: [
      "card.technology.unit-upgrade:base/augmentation",
      "card.technology.unit-upgrade:base/scope",
    ],
  });
  const count: number = _countUnitUpgradeTech(SELF);
  expect(count).toBe(2);
});

it("_countUnitUpgradeTech (no techs)", () => {
  placeGameObjects({
    self: ["card.leader.mech:discordant-stars/javelin"],
  });
  const count: number = _countUnitUpgradeTech(SELF);
  expect(count).toBe(0);
});

it("_countUnitUpgradeTech (opponent techs)", () => {
  placeGameObjects({
    opponent: [
      "card.technology.unit-upgrade:base/augmentation",
      "card.technology.unit-upgrade:base/scope",
    ],
  });
  const count: number = _countUnitUpgradeTech(SELF);
  expect(count).toBe(0);
});
