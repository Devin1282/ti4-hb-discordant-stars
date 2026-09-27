import { _countDestroyers, AnnahRegia } from "./annah-regia";
import { CombatRoll, UnitAttrs } from "ti4-ttpg-ts";
import { OPPONENT, SELF, placeGameObjects } from "./abstract.test";
import { unitAttrs } from "../../../unit-attrs";

beforeEach(() => {
  TI4.unitModifierRegistry.load("discordant-stars", [AnnahRegia]);
  TI4.unitAttrsRegistry.load("discordant-stars", unitAttrs);
});

it("registry", () => {
  const nsid = "unit:discordant-stars/annah-regia";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Annah Regia"
  );
});

it("schema", () => {
  expect(AnnahRegia.name).toBe("Annah Regia");
  expect(AnnahRegia.owner).toBe("self");
  expect(AnnahRegia.priority).toBe("adjust");
  expect(AnnahRegia.triggers).toEqual([
    { cardClass: "unit", nsidName: "annah-regia" },
  ]);
});

it("_countDestroyers (none)", () => {
  placeGameObjects({});
  expect(_countDestroyers(SELF)).toBe(0);
  expect(_countDestroyers(OPPONENT)).toBe(0);
});

it("_countDestroyers (self units)", () => {
  placeGameObjects({
    selfUnits: new Map([
      ["destroyer", 2],
      ["frigate", 3],
    ]),
  });
  expect(_countDestroyers(SELF)).toBe(2);
  expect(_countDestroyers(OPPONENT)).toBe(0);
});

it("_countDestroyers (off-planet)", () => {
  placeGameObjects({
    selfUnits: new Map([["destroyer", 1]]),
    selfUnitsOffPlanet: new Map([["destroyer", 2]]),
  });
  expect(_countDestroyers(SELF)).toBe(3);
  expect(_countDestroyers(OPPONENT)).toBe(0);
});

it("applies (flagship)", () => {
  placeGameObjects({
    selfUnits: new Map([["flagship", 1]]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(AnnahRegia.applies(combatRoll)).toBe(true);
});

it("no modifier", () => {
  placeGameObjects({
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);
});

it("annah-regia (0 destroyers)", () => {
  placeGameObjects({
    self: ["unit:discordant-stars/annah-regia"],
    selfUnits: new Map([["flagship", 1]]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Annah Regia"]);
  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  expect(flagshipAttrs.getSpaceCombat()?.getHit()).toBe(9);
});

it("annah-regia (1 destroyer)", () => {
  placeGameObjects({
    self: ["unit:discordant-stars/annah-regia"],
    selfUnits: new Map([
      ["flagship", 1],
      ["destroyer", 1],
    ]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Annah Regia"]);
  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  expect(flagshipAttrs.getSpaceCombat()?.getHit()).toBe(9);
});

it("annah-regia (2 destroyers)", () => {
  placeGameObjects({
    self: ["unit:discordant-stars/annah-regia"],
    selfUnits: new Map([
      ["flagship", 1],
      ["destroyer", 2],
    ]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Annah Regia"]);
  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  expect(flagshipAttrs.getSpaceCombat()?.getHit()).toBe(8);
});

it("annah-regia (3 destroyers)", () => {
  placeGameObjects({
    self: ["unit:discordant-stars/annah-regia"],
    selfUnits: new Map([
      ["flagship", 1],
      ["destroyer", 3],
    ]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Annah Regia"]);
  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  expect(flagshipAttrs.getSpaceCombat()?.getHit()).toBe(8);
});

it("annah-regia (4 destroyers)", () => {
  placeGameObjects({
    self: ["unit:discordant-stars/annah-regia"],
    selfUnits: new Map([
      ["flagship", 1],
      ["destroyer", 4],
    ]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Annah Regia"]);
  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  expect(flagshipAttrs.getSpaceCombat()?.getHit()).toBe(7);
});

it("annah-regia (off-planet destroyers)", () => {
  placeGameObjects({
    self: ["unit:discordant-stars/annah-regia"],
    selfUnits: new Map([
      ["flagship", 1],
      ["destroyer", 1],
    ]),
    selfUnitsOffPlanet: new Map([["destroyer", 1]]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Annah Regia"]);
  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  expect(flagshipAttrs.getSpaceCombat()?.getHit()).toBe(8);
});