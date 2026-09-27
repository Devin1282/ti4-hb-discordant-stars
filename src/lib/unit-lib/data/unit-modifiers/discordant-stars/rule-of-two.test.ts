import { OPPONENT, placeGameObjects, SELF } from "./abstract.test";
import { CombatAttrs, CombatRoll, UnitAttrs } from "ti4-ttpg-ts";
import { RuleOfTwo } from "./rule-of-two";

beforeEach(() => {
  TI4.unitModifierRegistry.load("discordant-stars", [RuleOfTwo]);
});

it("registry", () => {
  const nsid = "faction-ability:discordant-stars/rule-of-two";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Rule of Two"
  );
});

it("default", () => {
  placeGameObjects({});
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);

  const fighter: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("fighter");
  const spaceCombat: CombatAttrs = fighter.getSpaceCombatOrThrow();
  expect(spaceCombat.getHit()).toBe(9);
});

it("modifier - 2 of same ship", () => {
  placeGameObjects({
    self: ["faction-ability:discordant-stars/rule-of-two"],
    selfUnits: new Map([["cruiser", 2]]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Rule of Two"]);

  const cruiser: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("cruiser");
  const spaceCombat: CombatAttrs = cruiser.getSpaceCombatOrThrow();
  expect(spaceCombat.getHit()).toBe(5);
});
