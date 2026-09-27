import { CombatAttrs, CombatRoll, UnitAttrs, UnitPlastic } from "ti4-ttpg-ts";
import { placeGameObjects, SELF, OPPONENT } from "./abstract.test";
import { Psychospore } from "./psychospore";
import { Rotator } from "@tabletop-playground/api";

beforeEach(() => {
  TI4.unitModifierRegistry.load("discordant-stars", [Psychospore]);
});

const PSYCHOSPORE_NSID = "card.breakthrough:discordant-stars/psychospore";

it("registry", () => {
  expect(
    TI4.unitModifierRegistry.getByNsid(PSYCHOSPORE_NSID)?.getName()
  ).toBe("Psychospore");
});

it("modifier (wrong roll type - ground combat)", () => {
  placeGameObjects({
    self: [PSYCHOSPORE_NSID],
    selfUnits: new Map([["dreadnought", 1]]),
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

it("modifier (splits face-up and face-down dreadnoughts into synthetic units)", () => {
  placeGameObjects({
    self: [PSYCHOSPORE_NSID],
    selfUnits: new Map([["dreadnought", 2]]),
  });

  // Damage 1 dreadnought by rotating 180 degrees
  const unitPlastics: Array<UnitPlastic> = UnitPlastic.getAll();
  const dreadnoughts = unitPlastics.filter(
    (plastic) =>
      plastic.getOwningPlayerSlot() === SELF &&
      plastic.getUnit() === "dreadnought"
  );

  if (dreadnoughts.length >= 2) {
    const rot: Rotator = dreadnoughts[1].getObj().getRotation();
    rot.roll += 180;
    dreadnoughts[1].getObj().setRotation(rot);
  }

  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Psychospore"]);

  // Standard dreadnought count should be overridden to just 1 (the damaged one) with no rerolls
  expect(combatRoll.self.overrideUnitCountHex.get("dreadnought")).toBe(1);
  const standardDread: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const standardSpace: CombatAttrs = standardDread.getSpaceCombatOrThrow();
  expect(standardSpace.getRerollMisses()).toBe(false);

  // Synthetic Psychospore dreadnought should exist with count 1 and rerollMisses = true
  const psychosporeDread: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought-psychospore" as any);
  const psychosporeSpace: CombatAttrs = psychosporeDread.getSpaceCombatOrThrow();
  expect(psychosporeSpace.getRerollMisses()).toBe(true);
});