import { MockGameObject } from "ttpg-mock";
import { OPPONENT, placeGameObjects, SELF } from "./abstract.test";
import { ProjectionOfPower } from "./projection-of-power";
import { CombatRoll, UnitType } from "ti4-ttpg-ts";

beforeEach(() => {
  TI4.unitModifierRegistry.load("discordant-stars", [ProjectionOfPower]);
});

it("registry", () => {
  const nsid = "faction-ability:discordant-stars/projection-of-power";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Projection Of Power"
  );
});

it("default", () => {
  placeGameObjects({ selfUnitsAdj: new Map([["space-dock", 1]]) });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "antiFighterBarrage",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual([]);
  expect(
    combatRoll.self.unitAttrsSet.get("projection-of-power" as UnitType)
  ).toBeUndefined();
});

it("default (no dock)", () => {
  placeGameObjects({
    self: ["faction-ability:discordant-stars/projection-of-power"],
    selfUnits: new Map([["fighter", 1]]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "antiFighterBarrage",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual([]);
  expect(
    combatRoll.self.unitAttrsSet.get("projection-of-power" as UnitType)
  ).toBeUndefined();
});

it("default (wrong roll type)", () => {
  placeGameObjects({
    self: ["faction-ability:discordant-stars/projection-of-power"],
    selfUnits: new Map([["space-dock", 1]]),
  });
  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual([]);
  expect(
    combatRoll.self.unitAttrsSet.get("projection-of-power" as UnitType)
  ).toBeUndefined();
});

it("modifier (center)", () => {
  placeGameObjects({
    self: ["faction-ability:discordant-stars/projection-of-power"],
    selfUnits: new Map([["space-dock", 1],["cruiser",1]]),
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "antiFighterBarrage",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.self.getCount("space-dock")).toBe(1);
  expect(combatRoll.self.getCountAdj("space-dock")).toBe(0);

  expect(combatRoll.getUnitModifierNames()).toEqual(["Projection Of Power"]);

  const cruiser =
    combatRoll.self.unitAttrsSet.getOrThrow(
      "projection-of-power" as UnitType
    );
  const combatAttrs = cruiser.getAntiFighterBarrageOrThrow();
  expect(combatAttrs.getHit()).toBe(6);
  expect(combatAttrs.getRange()).toBe(1);
  expect(combatAttrs.getExtraDice()).toBe(0);
});

it("modifier (adj)", () => {
  placeGameObjects({
    self: ["faction-ability:discordant-stars/projection-of-power"],
    selfUnitsAdj: new Map([["space-dock", 1],["cruiser",1]]),
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "antiFighterBarrage",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.self.getCount("space-dock")).toBe(0);
  expect(combatRoll.self.getCountAdj("space-dock")).toBe(1);

  expect(combatRoll.getUnitModifierNames()).toEqual(["Projection Of Power"]);

  const cruiser =
    combatRoll.self.unitAttrsSet.getOrThrow(
      "projection-of-power" as UnitType
    );
  const combatAttrs = cruiser.getAntiFighterBarrageOrThrow();
  expect(combatAttrs.getHit()).toBe(6);
  expect(combatAttrs.getRange()).toBe(1);
  expect(combatAttrs.getExtraDice()).toBe(0);
});