import { CombatAttrs, CombatRoll, UnitAttrs } from "ti4-ttpg-ts";
import { placeGameObjects, SELF, OPPONENT } from "./abstract.test";
import { _getLordHex, TheLord } from "./lord";
import { MockGameObject } from "ttpg-mock";

beforeEach(() => {
  TI4.unitModifierRegistry.load("discordant-stars", [TheLord]);
});

const LORD_TOKEN_NSID = "token.lord:discordant-stars/the-lord";

it("registry", () => {
  const nsid = "faction-ability:discordant-stars/the-lady-and-the-lord";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "The Lord"
  );
});

it("modifier (Lord token missing - modifier does not apply)", () => {
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
  expect(combatRoll.self.unitAttrsSet.get("lord" as any)).toBeUndefined();
});

it("modifier (Lord token present - adds synthetic Lord unit with 2 dice hit on 7)", () => {
  placeGameObjects({
    self: ["faction-ability:discordant-stars/the-lady-and-the-lord"],
    selfUnits: new Map([["dreadnought", 1]]),
  });
  MockGameObject.simple(LORD_TOKEN_NSID);

  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["The Lord"]);

  const lordAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("lord" as any);
  const spaceCombat: CombatAttrs = lordAttrs.getSpaceCombatOrThrow();
  expect(spaceCombat.getDice()).toBe(2);
  expect(spaceCombat.getHit()).toBe(7);
});

it("_getLordHex", () => {
  MockGameObject.simple(LORD_TOKEN_NSID);
  const lordHexes = _getLordHex();
  expect(lordHexes.size).toBeGreaterThan(0);
});