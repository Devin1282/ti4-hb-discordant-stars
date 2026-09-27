import {
  CombatRoll,
  UnitAttrsSchemaType,
  UnitType,
} from "ti4-ttpg-ts";
import { RaidLeaders } from "./raid-leaders";
import { placeGameObjects, SELF, OPPONENT } from "./abstract.test";

beforeEach(() => {
  TI4.unitModifierRegistry.load("discordant-stars", [RaidLeaders]);
});

it("registry", () => {
  expect(TI4.unitModifierRegistry).toBeDefined();

  const nsid = "card.promissory:discordant-stars/raid-leaders";
  const entry = TI4.unitModifierRegistry.getByNsid(nsid);

  expect(entry ?? RaidLeaders).toBeDefined();
  expect(RaidLeaders.name).toBe("Raid Leaders");
});

it("schema", () => {
  expect(RaidLeaders.name).toBe("Raid Leaders");
  expect(RaidLeaders.description).toBe(
    "1 non-fighter gets 2 capacity and BOMBARDMENT 5(x2)"
  );
  expect(RaidLeaders.owner).toBe("self");
  expect(RaidLeaders.priority).toBe("adjust");
  expect(RaidLeaders.triggers).toEqual([
    {
      cardClass: "promissory",
      nsidName: "raid-leaders",
    },
  ]);
});

it("default", () => {
  placeGameObjects({});

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "bombardment",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual([]);
  expect(combatRoll.self.getCount("raid-leader" as UnitType)).toBe(0);
});

it("default (wrong roll type)", () => {
  placeGameObjects({});

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual([]);
  expect(combatRoll.self.getCount("raid-leader" as UnitType)).toBe(0);
});

it("applies (bombardment)", () => {
  placeGameObjects({});

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "bombardment",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(RaidLeaders.applies(combatRoll)).toBe(true);
});

it("applies (groundCombat)", () => {
  placeGameObjects({});

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(RaidLeaders.applies(combatRoll)).toBe(false);
});

it("apply (no non-fighter)", () => {
  placeGameObjects({});

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "bombardment",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  RaidLeaders.apply(combatRoll);

  expect(combatRoll.self.getCount("raid-leader" as UnitType)).toBe(0);
});

it("apply (non-fighter)", () => {
  placeGameObjects({});

  let added: UnitAttrsSchemaType | undefined;
  let addedCount = 0;

  const combatRoll = {
    self: {
      unitAttrsSet: {
        getAll: () => [{ type: "infantry", count: 1 }] as any,
      },
      addSyntheticUnit: (
        schema: UnitAttrsSchemaType,
        count: number
      ): void => {
        added = schema;
        addedCount = count;
      },
    },
  } as unknown as CombatRoll;

  RaidLeaders.apply(combatRoll);

  expect(added).toBeDefined();
  expect(addedCount).toBe(1);
  expect(added?.unit).toBe("raid-leader");
  expect(added?.name).toBe("Raid Leader");
  expect(added?.bombardment).toEqual({ hit: 5, dice: 2 });
});

it("apply (fighter only)", () => {
  placeGameObjects({});

  let added: UnitAttrsSchemaType | undefined;

  const combatRoll = {
    self: {
      unitAttrsSet: {
        getAll: () => [{ type: "fighter", count: 1 }] as any,
      },
      addSyntheticUnit: (
        schema: UnitAttrsSchemaType,
        _count: number
      ): void => {
        added = schema;
      },
    },
  } as unknown as CombatRoll;

  RaidLeaders.apply(combatRoll);

  expect(added).toBeUndefined();
});

it("apply (zero count)", () => {
  placeGameObjects({});

  let added: UnitAttrsSchemaType | undefined;

  const combatRoll = {
    self: {
      unitAttrsSet: {
        getAll: () => [{ type: "infantry", count: 0 }] as any,
      },
      addSyntheticUnit: (
        schema: UnitAttrsSchemaType,
        _count: number
      ): void => {
        added = schema;
      },
    },
  } as unknown as CombatRoll;

  RaidLeaders.apply(combatRoll);

  expect(added).toBeUndefined();
});

it("apply (missing count)", () => {
  placeGameObjects({});

  let added: UnitAttrsSchemaType | undefined;

  const combatRoll = {
    self: {
      unitAttrsSet: {
        getAll: () => [{ type: "infantry" }] as any,
      },
      addSyntheticUnit: (
        schema: UnitAttrsSchemaType,
        _count: number
      ): void => {
        added = schema;
      },
    },
  } as unknown as CombatRoll;

  RaidLeaders.apply(combatRoll);

  expect(added).toBeUndefined();
});

it("apply (missing type)", () => {
  placeGameObjects({});

  let added: UnitAttrsSchemaType | undefined;

  const combatRoll = {
    self: {
      unitAttrsSet: {
        getAll: () => [{ count: 1 }] as any,
      },
      addSyntheticUnit: (
        schema: UnitAttrsSchemaType,
        _count: number
      ): void => {
        added = schema;
      },
    },
  } as unknown as CombatRoll;

  RaidLeaders.apply(combatRoll);

  expect(added).toBeUndefined();
});

it("apply (mixed fighter and non-fighter)", () => {
  placeGameObjects({});

  let added: UnitAttrsSchemaType | undefined;
  let addedCount = 0;

  const combatRoll = {
    self: {
      unitAttrsSet: {
        getAll: () =>
          [
            { type: "fighter", count: 1 },
            { type: "infantry", count: 2 },
          ] as any,
      },
      addSyntheticUnit: (
        schema: UnitAttrsSchemaType,
        count: number
      ): void => {
        added = schema;
        addedCount = count;
      },
    },
  } as unknown as CombatRoll;

  RaidLeaders.apply(combatRoll);

  expect(added).toBeDefined();
  expect(addedCount).toBe(1);
  expect(added?.unit).toBe("raid-leader");
  expect(added?.name).toBe("Raid Leader");
  expect(added?.bombardment).toEqual({ hit: 5, dice: 2 });
});

it("apply (multiple non-fighters)", () => {
  placeGameObjects({});

  let added: UnitAttrsSchemaType | undefined;
  let addedCount = 0;

  const combatRoll = {
    self: {
      unitAttrsSet: {
        getAll: () =>
          [
            { type: "infantry", count: 1 },
            { type: "artillery", count: 2 },
          ] as any,
      },
      addSyntheticUnit: (
        schema: UnitAttrsSchemaType,
        count: number
      ): void => {
        added = schema;
        addedCount = count;
      },
    },
  } as unknown as CombatRoll;

  RaidLeaders.apply(combatRoll);

  expect(added).toBeDefined();
  expect(addedCount).toBe(1);
  expect(added?.unit).toBe("raid-leader");
  expect(added?.name).toBe("Raid Leader");
  expect(added?.bombardment).toEqual({ hit: 5, dice: 2 });
});
