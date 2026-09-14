import { CombatRoll, CombatAttrs, UnitType } from "ti4-ttpg-ts";
import { OPPONENT, placeGameObjects, SELF } from "./abstract.test";
import { CovertStrikeTeams } from "./covert-strike-teams";

const cardNsid: string = "card.technology.yellow:discordant-stars/covert-strike-teams";

beforeEach(() => {
  TI4.unitModifierRegistry.load("discordant-stars", [CovertStrikeTeams]);
});

it("registry", () => {
  expect(TI4.unitModifierRegistry.getByNsid(cardNsid)).toBeDefined();
});

it("applies (groundCombat)", () => {
  placeGameObjects({
    self: [cardNsid],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(CovertStrikeTeams.applies(combatRoll)).toBe(true);
  expect(combatRoll.getUnitModifierNames()).toEqual(["Covert Strike Teams"]);
});

it("applies (non-groundCombat)", () => {
  placeGameObjects({
    self: [cardNsid],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "ambush",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(CovertStrikeTeams.applies(combatRoll)).toBe(false);
  expect(combatRoll.getUnitModifierNames()).not.toContain("Covert Strike Teams");
});

it("covert strike teams (no units)", () => {
  placeGameObjects({
    self: [cardNsid],
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Covert Strike Teams"]);

  const unitToCombatAttrs: Map<UnitType, CombatAttrs> =
    combatRoll._getUnitToCombatAttrs();
  expect([...unitToCombatAttrs.keys()]).not.toContain("covert-strike-mech");
  expect([...unitToCombatAttrs.keys()]).not.toContain("covert-strike-infantry");

  expect(combatRoll.self.getCount("covert-strike-mech" as UnitType)).toBe(0);
  expect(combatRoll.self.getCount("covert-strike-infantry" as UnitType)).toBe(0);
});

it("covert strike teams (mech and infantry)", () => {
  placeGameObjects({
    self: [cardNsid],
    selfUnits: new Map<UnitType, number>([
      ["mech", 1],
      ["infantry", 1],
    ]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Covert Strike Teams"]);

  const unitToCombatAttrs: Map<UnitType, CombatAttrs> =
    combatRoll._getUnitToCombatAttrs();
  expect([...unitToCombatAttrs.keys()]).toContain("covert-strike-mech");
  expect([...unitToCombatAttrs.keys()]).toContain("covert-strike-infantry");
  expect([...unitToCombatAttrs.keys()]).toContain("mech");
  expect([...unitToCombatAttrs.keys()]).toContain("infantry");

  expect(combatRoll.self.getCount("covert-strike-mech" as UnitType)).toBe(1);
  expect(combatRoll.self.getCount("covert-strike-infantry" as UnitType)).toBe(1);
  expect(combatRoll.self.getCount("mech")).toBe(0);
  expect(combatRoll.self.getCount("infantry")).toBe(0);
});

it("covert strike teams (mechs only)", () => {
  placeGameObjects({
    self: [cardNsid],
    selfUnits: new Map<UnitType, number>([
      ["mech", 3],
    ]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Covert Strike Teams"]);

  const unitToCombatAttrs: Map<UnitType, CombatAttrs> =
    combatRoll._getUnitToCombatAttrs();
  expect([...unitToCombatAttrs.keys()]).toContain("covert-strike-mech");
  expect([...unitToCombatAttrs.keys()]).not.toContain("covert-strike-infantry");
  expect([...unitToCombatAttrs.keys()]).toContain("mech");

  expect(combatRoll.self.getCount("covert-strike-mech" as UnitType)).toBe(2);
  expect(combatRoll.self.getCount("covert-strike-infantry" as UnitType)).toBe(0);
  expect(combatRoll.self.getCount("mech")).toBe(0);
});

it("covert strike teams (infantry only)", () => {
  placeGameObjects({
    self: [cardNsid],
    selfUnits: new Map<UnitType, number>([
      ["infantry", 4],
    ]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Covert Strike Teams"]);

  const unitToCombatAttrs: Map<UnitType, CombatAttrs> =
    combatRoll._getUnitToCombatAttrs();
  expect([...unitToCombatAttrs.keys()]).not.toContain("covert-strike-mech");
  expect([...unitToCombatAttrs.keys()]).toContain("covert-strike-infantry");
  expect([...unitToCombatAttrs.keys()]).toContain("infantry");

  expect(combatRoll.self.getCount("covert-strike-mech" as UnitType)).toBe(0);
  expect(combatRoll.self.getCount("covert-strike-infantry" as UnitType)).toBe(2);
  expect(combatRoll.self.getCount("infantry")).toBe(0);
});

it("covert strike teams (mech cap excludes infantry)", () => {
  placeGameObjects({
    self: [cardNsid],
    selfUnits: new Map<UnitType, number>([
      ["mech", 3],
      ["infantry", 6],
    ]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Covert Strike Teams"]);

  const unitToCombatAttrs: Map<UnitType, CombatAttrs> =
    combatRoll._getUnitToCombatAttrs();
  expect([...unitToCombatAttrs.keys()]).toContain("covert-strike-mech");
  expect([...unitToCombatAttrs.keys()]).not.toContain("covert-strike-infantry");
  expect([...unitToCombatAttrs.keys()]).toContain("mech");
  expect([...unitToCombatAttrs.keys()]).toContain("infantry");

  expect(combatRoll.self.getCount("covert-strike-mech" as UnitType)).toBe(2);
  expect(combatRoll.self.getCount("covert-strike-infantry" as UnitType)).toBe(0);
  expect(combatRoll.self.getCount("mech")).toBe(0);
  expect(combatRoll.self.getCount("infantry")).toBe(0);
});

it("covert strike teams (one mech and two infantry)", () => {
  placeGameObjects({
    self: [cardNsid],
    selfUnits: new Map<UnitType, number>([
      ["mech", 1],
      ["infantry", 2],
    ]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Covert Strike Teams"]);

  const unitToCombatAttrs: Map<UnitType, CombatAttrs> =
    combatRoll._getUnitToCombatAttrs();
  expect([...unitToCombatAttrs.keys()]).toContain("covert-strike-mech");
  expect([...unitToCombatAttrs.keys()]).toContain("covert-strike-infantry");
  expect([...unitToCombatAttrs.keys()]).toContain("mech");
  expect([...unitToCombatAttrs.keys()]).toContain("infantry");

  expect(combatRoll.self.getCount("covert-strike-mech" as UnitType)).toBe(1);
  expect(combatRoll.self.getCount("covert-strike-infantry" as UnitType)).toBe(1);
  expect(combatRoll.self.getCount("mech")).toBe(0);
  expect(combatRoll.self.getCount("infantry")).toBe(0);
});

it("covert strike teams (two mechs and two infantry)", () => {
  placeGameObjects({
    self: [cardNsid],
    selfUnits: new Map<UnitType, number>([
      ["mech", 2],
      ["infantry", 2],
    ]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Covert Strike Teams"]);

  const unitToCombatAttrs: Map<UnitType, CombatAttrs> =
    combatRoll._getUnitToCombatAttrs();
  expect([...unitToCombatAttrs.keys()]).toContain("covert-strike-mech");
  expect([...unitToCombatAttrs.keys()]).not.toContain("covert-strike-infantry");
  expect([...unitToCombatAttrs.keys()]).toContain("mech");
  expect([...unitToCombatAttrs.keys()]).toContain("infantry");

  expect(combatRoll.self.getCount("covert-strike-mech" as UnitType)).toBe(2);
  expect(combatRoll.self.getCount("covert-strike-infantry" as UnitType)).toBe(0);
  expect(combatRoll.self.getCount("mech")).toBe(0);
  expect(combatRoll.self.getCount("infantry")).toBe(0);
});

it("covert strike teams (removes other normal units)", () => {
  placeGameObjects({
    self: [cardNsid],
    selfUnits: new Map<UnitType, number>([
      ["mech", 1],
      ["infantry", 1],
      ["cruiser", 2],
      ["destroyer", 2],
    ]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Covert Strike Teams"]);

  const unitToCombatAttrs: Map<UnitType, CombatAttrs> =
    combatRoll._getUnitToCombatAttrs();
  expect([...unitToCombatAttrs.keys()]).toContain("covert-strike-mech");
  expect([...unitToCombatAttrs.keys()]).toContain("covert-strike-infantry");
  expect([...unitToCombatAttrs.keys()]).toContain("mech");
  expect([...unitToCombatAttrs.keys()]).toContain("infantry");
  expect([...unitToCombatAttrs.keys()]).not.toContain("cruiser");
  expect([...unitToCombatAttrs.keys()]).not.toContain("destroyer");

  expect(combatRoll.self.getCount("covert-strike-mech" as UnitType)).toBe(1);
  expect(combatRoll.self.getCount("covert-strike-infantry" as UnitType)).toBe(1);
  expect(combatRoll.self.getCount("mech")).toBe(0);
  expect(combatRoll.self.getCount("infantry")).toBe(0);
  expect(combatRoll.self.getCount("cruiser")).toBe(0);
  expect(combatRoll.self.getCount("destroyer")).toBe(0);
});
