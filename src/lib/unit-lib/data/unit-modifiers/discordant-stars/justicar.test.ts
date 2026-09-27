import { OPPONENT, placeGameObjects, SELF } from "./abstract.test";
import { CombatRoll, UnitAttrs } from "ti4-ttpg-ts";
import { Justicar } from "./justicar";

beforeEach(() => {
  TI4.unitModifierRegistry.load("discordant-stars", [Justicar]);
});

it("registry", () => {
  const nsid = "card.leader.mech:discordant-stars/justicar";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Justicar"
  );
  expect(Justicar.name).toBe("Justicar");
});

it("default", () => {
  placeGameObjects({});
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(Justicar.applies(combatRoll)).toBe(false);
  expect(combatRoll.getUnitModifierNames()).toEqual([]);

  const dreadnought: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  expect(dreadnought.getDisablePlanetaryShield()).toBe(false);
});

it("modifier", () => {
  placeGameObjects({
    self: ["card.leader.mech:discordant-stars/justicar"],
    selfUnits: new Map([["mech", 1]]),
    opponentUnits: new Map([["mech", 1]]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "bombardment",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(Justicar.applies(combatRoll)).toBe(true);
  expect(combatRoll.getUnitModifierNames()).toEqual(["Justicar"]);

  const mech: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("mech");
  expect(combatRoll.getUnitModifierNames()).toEqual(["Justicar"]);
  expect(mech.getDisablePlanetaryShield()).toBe(false);
});
