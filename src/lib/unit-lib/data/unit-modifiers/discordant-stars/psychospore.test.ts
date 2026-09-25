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

it("modifier (applies reroll misses to face-up dreadnought)", () => {
  placeGameObjects({
    self: [PSYCHOSPORE_NSID],
    selfUnits: new Map([["dreadnought", 1]]),
  });
  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Psychospore"]);

  const dreadnoughtAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const dreadSpace: CombatAttrs = dreadnoughtAttrs.getSpaceCombatOrThrow();
  expect(dreadSpace.getRerollMisses()).toBe(true);
});

it("modifier (does not apply reroll misses to damaged dreadnought)", () => {
  placeGameObjects({
    self: [PSYCHOSPORE_NSID],
    selfUnits: new Map([["dreadnought", 1]]),
  });

  // Damage the dreadnought by flipping it face-down (rolling 180 degrees)
  const unitPlastics: Array<UnitPlastic> = UnitPlastic.getAll();
  for (const plastic of unitPlastics) {
    if (plastic.getOwningPlayerSlot() === SELF) {
      if (plastic.getUnit() === "dreadnought") {
        const rot: Rotator = plastic.getObj().getRotation();
        rot.roll += 180;
        plastic.getObj().setRotation(rot);
      }
    }
  }

  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Psychospore"]);

  const dreadnoughtAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const dreadSpace: CombatAttrs = dreadnoughtAttrs.getSpaceCombatOrThrow();
  expect(dreadSpace.getRerollMisses()).toBe(false);
});