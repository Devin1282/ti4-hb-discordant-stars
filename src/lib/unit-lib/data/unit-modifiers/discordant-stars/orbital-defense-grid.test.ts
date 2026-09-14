import { OrbitalDefenseGrid } from "./orbital-defense-grid";
import { CombatRoll, CombatAttrs, UnitType } from "ti4-ttpg-ts";
import { OPPONENT, placeGameObjects, SELF } from "./abstract.test";

beforeEach(() => {
  TI4.unitModifierRegistry.load("discordant-stars", [OrbitalDefenseGrid]);
});

it("registry", () => {
  const nsid = "card.technology.red:discordant-stars/orbital-defense-grid";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe("Orbital Defense Grid");
});

it("orbital defense grid", () => {
  placeGameObjects({
    self: ["card.technology.red:discordant-stars/orbital-defense-grid"],
    selfUnits: new Map([
      ["infantry", 1],
    ]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "bombardment",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Orbital Defense Grid"]);
  expect(combatRoll.self.getCount("orbital-defense-grid" as UnitType)).toBe(1);
  expect(combatRoll.self.getCount("infantry")).toBe(1);
});