import { AwakenedPlanetoids } from "./awakened-planetoids";
import { CombatRoll, UnitType } from "ti4-ttpg-ts";

type SyntheticUnit = {
  name: string;
  unit: UnitType;
  spaceCombat: { hit: number };
};

type AddedUnit = {
  unit: SyntheticUnit;
  count: number;
};

it("applies", () => {
  const groundRoll = { getRollType: () => "groundCombat" } as unknown as CombatRoll;
  expect(AwakenedPlanetoids.applies(groundRoll)).toBe(true);

  const spaceRoll = { getRollType: () => "spaceCombat" } as unknown as CombatRoll;
  expect(AwakenedPlanetoids.applies(spaceRoll)).toBe(true);

  const bombardmentRoll = { getRollType: () => "bombardment" } as unknown as CombatRoll;
  expect(AwakenedPlanetoids.applies(bombardmentRoll)).toBe(false);
});

it("ground combat adds synthetic unit for planet resources", () => {
  const added: AddedUnit[] = [];
  const roll = {
    getRollType: () => "groundCombat",
    planet: {
      getName: () => "Quann",
      getResources: () => 4,
    },
    self: {
      unitAttrsSet: {
        getAll: () => [{ isGround: () => true }],
      },
      addSyntheticUnit: (unit: SyntheticUnit, count: number): void => {
        added.push({ unit, count });
      },
    },
  } as unknown as CombatRoll;

  expect(AwakenedPlanetoids.applies(roll)).toBe(true);
  AwakenedPlanetoids.apply(roll);

  expect(added.length).toBe(1);
  expect(added[0]!.count).toBe(1);
  expect(added[0]!.unit.name).toBe("Awakened Planetoids (Quann)");
  expect(added[0]!.unit.unit).toBe("awakened-planetoids-Quann");
  expect(added[0]!.unit.spaceCombat).toEqual({ hit: 6 });
});

it("ground combat boundary with maximum resources", () => {
  const added: AddedUnit[] = [];
  const roll = {
    getRollType: () => "groundCombat",
    planet: {
      getName: () => "Quann",
      getResources: () => 10,
    },
    self: {
      unitAttrsSet: {
        getAll: () => [{ isGround: () => true }],
      },
      addSyntheticUnit: (unit: SyntheticUnit, count: number): void => {
        added.push({ unit, count });
      },
    },
  } as unknown as CombatRoll;

  AwakenedPlanetoids.apply(roll);

  expect(added.length).toBe(1);
  expect(added[0]!.unit.spaceCombat).toEqual({ hit: 0 });
});

it("ground combat does not add synthetic unit without ground force", () => {
  const added: AddedUnit[] = [];
  const roll = {
    getRollType: () => "groundCombat",
    planet: {
      getName: () => "Quann",
      getResources: () => 4,
    },
    self: {
      unitAttrsSet: {
        getAll: () => [{ isGround: () => false }],
      },
      addSyntheticUnit: (unit: SyntheticUnit, count: number): void => {
        added.push({ unit, count });
      },
    },
  } as unknown as CombatRoll;

  AwakenedPlanetoids.apply(roll);

  expect(added.length).toBe(0);
});

// POSSIBLE SOURCE BUG: hasGroundForce is overwritten on each iteration, so only the final unit's isGround value is used.
it("ground combat does not add synthetic unit when final unit is not ground", () => {
  const added: AddedUnit[] = [];
  const roll = {
    getRollType: () => "groundCombat",
    planet: {
      getName: () => "Quann",
      getResources: () => 4,
    },
    self: {
      unitAttrsSet: {
        getAll: () => [
          { isGround: () => true },
          { isGround: () => false },
        ],
      },
      addSyntheticUnit: (unit: SyntheticUnit, count: number): void => {
        added.push({ unit, count });
      },
    },
  } as unknown as CombatRoll;

  AwakenedPlanetoids.apply(roll);

  expect(added.length).toBe(0);
});

it("ground combat does not add synthetic unit without resources", () => {
  const added: AddedUnit[] = [];
  const roll = {
    getRollType: () => "groundCombat",
    planet: {
      getName: () => "Quann",
      getResources: () => 0,
    },
    self: {
      unitAttrsSet: {
        getAll: () => [{ isGround: () => true }],
      },
      addSyntheticUnit: (unit: SyntheticUnit, count: number): void => {
        added.push({ unit, count });
      },
    },
  } as unknown as CombatRoll;

  AwakenedPlanetoids.apply(roll);

  expect(added.length).toBe(0);
});

it("ground combat does not add synthetic unit without planet", () => {
  const added: AddedUnit[] = [];
  const roll = {
    getRollType: () => "groundCombat",
    planet: undefined,
    self: {
      unitAttrsSet: {
        getAll: () => [{ isGround: () => true }],
      },
      addSyntheticUnit: (unit: SyntheticUnit, count: number): void => {
        added.push({ unit, count });
      },
    },
  } as unknown as CombatRoll;

  AwakenedPlanetoids.apply(roll);

  expect(added.length).toBe(0);
});

it("space combat adds synthetic units for planets with resources", () => {
  const added: AddedUnit[] = [];
  const roll = {
    getRollType: () => "spaceCombat",
    system: {
      getPlanets: () => [
        { getName: () => "Quann", getResources: () => 3 },
        { getName: () => "Khyber", getResources: () => 5 },
      ],
    },
    self: {
      unitAttrsSet: {
        getAll: () => [{ isShip: () => true }],
      },
      addSyntheticUnit: (unit: SyntheticUnit, count: number): void => {
        added.push({ unit, count });
      },
    },
  } as unknown as CombatRoll;

  expect(AwakenedPlanetoids.applies(roll)).toBe(true);
  AwakenedPlanetoids.apply(roll);

  expect(added.length).toBe(2);
  expect(added[0]!.unit.name).toBe("Awakened Planetoids (Quann)");
  expect(added[0]!.unit.unit).toBe("awakened-planetoids-Quann");
  expect(added[0]!.unit.spaceCombat).toEqual({ hit: 7 });

  expect(added[1]!.unit.name).toBe("Awakened Planetoids (Khyber)");
  expect(added[1]!.unit.unit).toBe("awakened-planetoids-Khyber");
  expect(added[1]!.unit.spaceCombat).toEqual({ hit: 5 });
});

it("space combat boundary with maximum resources", () => {
  const added: AddedUnit[] = [];
  const roll = {
    getRollType: () => "spaceCombat",
    system: {
      getPlanets: () => [
        { getName: () => "Quann", getResources: () => 10 },
      ],
    },
    self: {
      unitAttrsSet: {
        getAll: () => [{ isShip: () => true }],
      },
      addSyntheticUnit: (unit: SyntheticUnit, count: number): void => {
        added.push({ unit, count });
      },
    },
  } as unknown as CombatRoll;

  AwakenedPlanetoids.apply(roll);

  expect(added.length).toBe(1);
  expect(added[0]!.unit.spaceCombat).toEqual({ hit: 0 });
});

it("space combat does not add synthetic unit without ship", () => {
  const added: AddedUnit[] = [];
  const roll = {
    getRollType: () => "spaceCombat",
    system: {
      getPlanets: () => [
        { getName: () => "Quann", getResources: () => 3 },
      ],
    },
    self: {
      unitAttrsSet: {
        getAll: () => [{ isShip: () => false }],
      },
      addSyntheticUnit: (unit: SyntheticUnit, count: number): void => {
        added.push({ unit, count });
      },
    },
  } as unknown as CombatRoll;

  AwakenedPlanetoids.apply(roll);

  expect(added.length).toBe(0);
});

// POSSIBLE SOURCE BUG: hasShip is overwritten on each iteration, so only the final unit's isShip value is used.
it("space combat does not add synthetic unit when final unit is not ship", () => {
  const added: AddedUnit[] = [];
  const roll = {
    getRollType: () => "spaceCombat",
    system: {
      getPlanets: () => [
        { getName: () => "Quann", getResources: () => 3 },
      ],
    },
    self: {
      unitAttrsSet: {
        getAll: () => [
          { isShip: () => true },
          { isShip: () => false },
        ],
      },
      addSyntheticUnit: (unit: SyntheticUnit, count: number): void => {
        added.push({ unit, count });
      },
    },
  } as unknown as CombatRoll;

  AwakenedPlanetoids.apply(roll);

  expect(added.length).toBe(0);
});

it("space combat skips planets without resources", () => {
  const added: AddedUnit[] = [];
  const roll = {
    getRollType: () => "spaceCombat",
    system: {
      getPlanets: () => [
        { getName: () => "Quann", getResources: () => 0 },
        { getName: () => "Khyber", getResources: () => undefined },
      ],
    },
    self: {
      unitAttrsSet: {
        getAll: () => [{ isShip: () => true }],
      },
      addSyntheticUnit: (unit: SyntheticUnit, count: number): void => {
        added.push({ unit, count });
      },
    },
  } as unknown as CombatRoll;

  AwakenedPlanetoids.apply(roll);

  expect(added.length).toBe(0);
});

it("space combat does not add synthetic unit without system", () => {
  const added: AddedUnit[] = [];
  const roll = {
    getRollType: () => "spaceCombat",
    system: undefined,
    self: {
      unitAttrsSet: {
        getAll: () => [{ isShip: () => true }],
      },
      addSyntheticUnit: (unit: SyntheticUnit, count: number): void => {
        added.push({ unit, count });
      },
    },
  } as unknown as CombatRoll;

  AwakenedPlanetoids.apply(roll);

  expect(added.length).toBe(0);
});

it("space combat does not add synthetic unit with empty planet list", () => {
  const added: AddedUnit[] = [];
  const roll = {
    getRollType: () => "spaceCombat",
    system: {
      getPlanets: () => [],
    },
    self: {
      unitAttrsSet: {
        getAll: () => [{ isShip: () => true }],
      },
      addSyntheticUnit: (unit: SyntheticUnit, count: number): void => {
        added.push({ unit, count });
      },
    },
  } as unknown as CombatRoll;

  AwakenedPlanetoids.apply(roll);

  expect(added.length).toBe(0);
});
