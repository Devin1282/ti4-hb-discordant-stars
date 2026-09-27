import { _getInAndAdjacentHexes, _getHexToMechs, BegBersha } from "./beg-bersha";
import { CombatRoll, UnitAttrs, CombatAttrs } from "ti4-ttpg-ts";
import { OPPONENT, SELF, placeGameObjects } from "./abstract.test";
import { unitAttrs } from "../../../unit-attrs";

beforeEach(() => {
  TI4.unitModifierRegistry.load("discordant-stars", [BegBersha]);
  TI4.unitAttrsRegistry.load("discordant-stars", unitAttrs);
});

it("registry", () => {
  const nsid = "unit:discordant-stars/beg-bersha";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Beg Bersha"
  );
});

it("schema", () => {
  expect(BegBersha.name).toBe("Beg Bersha");
  expect(BegBersha.owner).toBe("self");
  expect(BegBersha.priority).toBe("adjust");
  expect(BegBersha.triggers).toEqual([
    { cardClass: "unit", nsidName: "beg-bersha" },
  ]);
});

it("_getInAndAdjacentHexes", () => {
  placeGameObjects({});
  const hexes = _getInAndAdjacentHexes("<0,0,0>", SELF);
  expect(hexes.has("<0,0,0>")).toBe(true);
  expect(hexes.size).toBeGreaterThan(1);
});

it("_getHexToMechs (none)", () => {
  placeGameObjects({});
  const hexToMechs = _getHexToMechs();
  expect(hexToMechs.size).toBe(0);
});

it("_getHexToMechs (with mechs)", () => {
  placeGameObjects({
    selfUnits: new Map([["mech", 2]]),
  });
  const hexToMechs = _getHexToMechs();
  const mainHexMechs = hexToMechs.get("<0,0,0>");
  expect(mainHexMechs).toBeDefined();
  expect(mainHexMechs?.length).toBe(2);
});

it("applies (flagship present)", () => {
  placeGameObjects({
    selfUnits: new Map([["flagship", 1]]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(BegBersha.applies(combatRoll)).toBe(true);
});

it("applies (no flagship)", () => {
  placeGameObjects({
    selfUnits: new Map([["dreadnought", 1]]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(BegBersha.applies(combatRoll)).toBe(false);
});

it("beg-bersha (0 mechs)", () => {
  placeGameObjects({
    self: ["unit:discordant-stars/beg-bersha"],
    selfUnits: new Map([["flagship", 1]]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  const flagshipAttrsBefore: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  const initialDice = flagshipAttrsBefore.getSpaceCombat()?.getDice() ?? 0;

  expect(combatRoll.getUnitModifierNames()).toEqual(["Beg Bersha"]);
  
  const flagshipAttrsAfter: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  expect(flagshipAttrsAfter.getSpaceCombat()?.getDice()).toBe(initialDice);
});

it("beg-bersha (mechs in system)", () => {
  placeGameObjects({
    self: ["unit:discordant-stars/beg-bersha"],
    selfUnits: new Map([
      ["flagship", 1],
      ["mech", 2],
    ]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  expect(combatRoll.getUnitModifierNames()).toEqual(["Beg Bersha"]);
  const bombardment: CombatAttrs = flagshipAttrs.getBombardmentOrThrow();
  const spaceCombat: CombatAttrs = flagshipAttrs.getSpaceCombatOrThrow();
  expect(bombardment.getExtraDice()).toBe(2);
  expect(spaceCombat.getExtraDice()).toBe(2);
});

it("beg-bersha (mechs adjacent)", () => {
  placeGameObjects({
    self: ["unit:discordant-stars/beg-bersha"],
    selfUnits: new Map([["flagship", 1]]),
    selfUnitsAdj: new Map([["mech", 1]]), 
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  expect(combatRoll.getUnitModifierNames()).toEqual(["Beg Bersha"]);
  const bombardment: CombatAttrs = flagshipAttrs.getBombardmentOrThrow();
  const spaceCombat: CombatAttrs = flagshipAttrs.getSpaceCombatOrThrow();
  expect(bombardment.getExtraDice()).toBe(1);
  expect(spaceCombat.getExtraDice()).toBe(1);
});

it("beg-bersha (mechs in and adjacent)", () => {
  placeGameObjects({
    self: ["unit:discordant-stars/beg-bersha"],
    selfUnits: new Map([
      ["flagship", 1],
      ["mech", 2],
    ]),
    selfUnitsAdj: new Map([["mech", 1]]), 
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  expect(combatRoll.getUnitModifierNames()).toEqual(["Beg Bersha"]);
  const bombardment: CombatAttrs = flagshipAttrs.getBombardmentOrThrow();
  const spaceCombat: CombatAttrs = flagshipAttrs.getSpaceCombatOrThrow();
  expect(bombardment.getExtraDice()).toBe(3);
  expect(spaceCombat.getExtraDice()).toBe(3);
});