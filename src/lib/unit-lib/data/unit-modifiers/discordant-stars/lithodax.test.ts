import { CombatRoll, UnitAttrs } from "ti4-ttpg-ts";
import { OPPONENT, SELF, placeGameObjects } from "./abstract.test";
import { Lithodax } from "./lithodax";
import { unitAttrs } from "../../../unit-attrs";

beforeEach(() => {
  TI4.unitModifierRegistry.load("discordant-stars", [Lithodax]);
  TI4.unitAttrsRegistry.load("discordant-stars", unitAttrs);
});

it("registry", () => {
  const nsid = "unit:discordant-stars/lithodax";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe("Lithodax");
  expect(Lithodax.name).toBe("Lithodax");
});

it("no modifier", () => {
  placeGameObjects({
    self: ["unit:discordant-stars/lithodax"],
    selfUnits: new Map([
      ["flagship", 1],
    ]),
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual([]);

  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");

  const antiFighterBarrage = flagshipAttrs.getAntiFighterBarrageOrThrow();
  expect(antiFighterBarrage.getDice()).toBe(2);

  const spaceCombat = flagshipAttrs.getSpaceCombatOrThrow();
  expect(spaceCombat.getDice()).toBe(2);
});

it("no flagship", () => {
  placeGameObjects({
    self: ["unit:discordant-stars/lithodax"],
    selfUnits: new Map([
      ["space-dock", 1],
      ["pds", 1],
    ]),
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual([]);
  expect(combatRoll.self.hasUnit("flagship")).toBe(false);
});

it("lithodax (space-dock)", () => {
  placeGameObjects({
    self: ["unit:discordant-stars/lithodax"],
    selfUnits: new Map([
      ["flagship", 1],
      ["space-dock", 1],
    ]),
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Lithodax"]);

  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");

  const antiFighterBarrage = flagshipAttrs.getAntiFighterBarrageOrThrow();
  expect(antiFighterBarrage.getDice()).toBe(3);

  const spaceCombat = flagshipAttrs.getSpaceCombatOrThrow();
  expect(spaceCombat.getDice()).toBe(3);
});

it("lithodax (pds adj)", () => {
  placeGameObjects({
    self: ["unit:discordant-stars/lithodax"],
    selfUnits: new Map([
      ["flagship", 1],
    ]),
    selfUnitsAdj: new Map([
      ["pds", 1],
    ]),
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Lithodax"]);

  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");

  const antiFighterBarrage = flagshipAttrs.getAntiFighterBarrageOrThrow();
  expect(antiFighterBarrage.getDice()).toBe(3);

  const spaceCombat = flagshipAttrs.getSpaceCombatOrThrow();
  expect(spaceCombat.getDice()).toBe(3);
});

it("lithodax (pds)", () => {
  placeGameObjects({
    self: ["unit:discordant-stars/lithodax"],
    selfUnits: new Map([
      ["flagship", 1],
      ["pds", 1],
    ]),
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Lithodax"]);

  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");

  const antiFighterBarrage = flagshipAttrs.getAntiFighterBarrageOrThrow();
  expect(antiFighterBarrage.getDice()).toBe(3);

  const spaceCombat = flagshipAttrs.getSpaceCombatOrThrow();
  expect(spaceCombat.getDice()).toBe(3);
});

it("lithodax (space-dock and pds)", () => {
  placeGameObjects({
    self: ["unit:discordant-stars/lithodax"],
    selfUnits: new Map([
      ["flagship", 1],
      ["space-dock", 1],
      ["pds", 1],
    ]),
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Lithodax"]);

  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");

  const antiFighterBarrage = flagshipAttrs.getAntiFighterBarrageOrThrow();
  expect(antiFighterBarrage.getDice()).toBe(3);

  const spaceCombat = flagshipAttrs.getSpaceCombatOrThrow();
  expect(spaceCombat.getDice()).toBe(3);
});
