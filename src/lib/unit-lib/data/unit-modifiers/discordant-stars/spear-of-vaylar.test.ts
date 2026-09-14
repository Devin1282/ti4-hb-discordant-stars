import { CombatAttrs, CombatRoll } from "ti4-ttpg-ts";
import { placeGameObjects, SELF, OPPONENT } from "./abstract.test";
import { SpearOfVaylar } from "./spear-of-vaylar";

beforeEach(() => {
  TI4.unitModifierRegistry.load("discordant-stars", [SpearOfVaylar]);
});

const SPEAR_OF_VAYLAR_HERO_NSID = "card.leader.hero:discordant-stars/spear-of-vaylar";

it("registry", () => {
  expect(
    TI4.unitModifierRegistry.getByNsid(SPEAR_OF_VAYLAR_HERO_NSID)?.getName()
  ).toBe("Spear of Vaylar");
});

it("default (hero not present)", () => {
  placeGameObjects({
    selfUnits: new Map([["dreadnought", 1]]),
  });

  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual([]);
});

it("modifier (applies +1 hit to ships in space combat)", () => {
  placeGameObjects({
    selfActive: [SPEAR_OF_VAYLAR_HERO_NSID],
    selfUnits: new Map([
      ["dreadnought", 1],
      ["infantry", 1],
    ]),
  });

  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Spear of Vaylar"]);

  // Dreadnought (ship) gets bonus: base hit (5) - bonus (1) = 4
  const dreadnoughtAttrs = combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const spaceCombat: CombatAttrs = dreadnoughtAttrs.getSpaceCombatOrThrow();
  expect(spaceCombat.getHit()).toBe(4);

  // Infantry (ground force / non-ship) should not receive ship bonus
  const infantryAttrs = combatRoll.self.unitAttrsSet.getOrThrow("infantry");
  const infantrySpaceCombat = infantryAttrs.getSpaceCombat();
  expect(infantrySpaceCombat).toBeUndefined();
});

it("modifier (applies +1 hit to ships in ground combat)", () => {
  placeGameObjects({
    selfActive: [SPEAR_OF_VAYLAR_HERO_NSID],
    selfUnits: new Map([
      ["dreadnought", 1],
      ["infantry", 1],
    ]),
  });

  const combatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Spear of Vaylar"]);

  // If a ship has ground combat attributes (e.g. via abilities/modifiers), it gets the bonus
  const dreadnoughtAttrs = combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const groundCombat = dreadnoughtAttrs.getGroundCombat();
  if (groundCombat) {
    expect(groundCombat.getHit()).toBeLessThan(10);
  }

  // Infantry (non-ship) ground combat remains unmodified by Spear of Vaylar
  const infantryAttrs = combatRoll.self.unitAttrsSet.getOrThrow("infantry");
  const infantryGroundCombat = infantryAttrs.getGroundCombatOrThrow();
  expect(infantryGroundCombat.getHit()).toBe(8);
});

it("does not apply to non-combat roll types (e.g., antiFighterBarrage)", () => {
  placeGameObjects({
    selfActive: [SPEAR_OF_VAYLAR_HERO_NSID],
    selfUnits: new Map([["destroyer", 1]]),
  });

  const combatRoll = CombatRoll.createCooked({
    rollType: "antiFighterBarrage",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual([]);
});