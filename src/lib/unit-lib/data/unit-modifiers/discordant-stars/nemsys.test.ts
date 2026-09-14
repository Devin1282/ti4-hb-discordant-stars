// TODO fix dice count because base spaceCombat dice is 1

import { CombatRoll, UnitAttrs } from "ti4-ttpg-ts";
import { OPPONENT, SELF, placeGameObjects } from "./abstract.test";
import { Nemsys, _countSecrets } from "./nemsys";
import { unitAttrs } from "../../../unit-attrs";

beforeEach(() => {
  TI4.unitModifierRegistry.load("discordant-stars", [Nemsys]);
  TI4.unitAttrsRegistry.load("discordant-stars", unitAttrs);
});

const NEMSYS_NSID: string = "unit:discordant-stars/nemsys";
const SECRET_OBJECTIVE_1: string = "card.objective.secret:base/secret-objective-1";
const SECRET_OBJECTIVE_2: string = "card.objective.secret:base/secret-objective-2";
const NON_SECRET_CARD: string = "card.promissory:base/support-for-the-throne";

it("registry", () => {
  expect(TI4.unitModifierRegistry.getByNsid(NEMSYS_NSID)?.getName()).toBe("Nemsys");
  expect(Nemsys.name).toBe("Nemsys");
});

it("default", () => {
  placeGameObjects({
    selfUnits: new Map([["flagship", 1]]),
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual([]);

  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  const spaceCombat = flagshipAttrs.getSpaceCombatOrThrow();
  expect(typeof spaceCombat.getDice()).toBe("number");
});

it("_countSecrets", () => {
  placeGameObjects({
    self: [
      SECRET_OBJECTIVE_1,
      SECRET_OBJECTIVE_2,
    ],
  });
  const count: number = _countSecrets(SELF);
  expect(count).toBe(2);
});

it("modifier (no nemsys card, flagship, secret objective)", () => {
  placeGameObjects({
    self: [SECRET_OBJECTIVE_1],
    selfUnits: new Map([["flagship", 1]]),
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual([]);
});

it("modifier (spaceCombat, flagship, 1 secret objective)", () => {
  placeGameObjects({
    self: [NEMSYS_NSID, SECRET_OBJECTIVE_1],
    selfUnits: new Map([["flagship", 1]]),
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Nemsys"]);

  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  const spaceCombat = flagshipAttrs.getSpaceCombatOrThrow();

  expect(spaceCombat.getDice()).toBe(2);
});

it("modifier (spaceCombat, flagship, 2 secret objectives)", () => {
  placeGameObjects({
    self: [NEMSYS_NSID, SECRET_OBJECTIVE_1, SECRET_OBJECTIVE_2],
    selfUnits: new Map([["flagship", 1]]),
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Nemsys"]);

  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  const spaceCombat = flagshipAttrs.getSpaceCombatOrThrow();

  expect(spaceCombat.getDice()).toBe(3);
});

it("modifier (spaceCombat, flagship, mixed self and opponent secret objectives)", () => {
  placeGameObjects({
    self: [NEMSYS_NSID, SECRET_OBJECTIVE_1],
    opponent: [SECRET_OBJECTIVE_2],
    selfUnits: new Map([["flagship", 1]]),
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Nemsys"]);

  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  const spaceCombat = flagshipAttrs.getSpaceCombatOrThrow();

  expect(spaceCombat.getDice()).toBe(2);
});