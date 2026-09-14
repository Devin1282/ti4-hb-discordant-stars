import type { CombatRoll, CombatRollType } from "ti4-ttpg-ts";
import { CombatTransport2 } from "./combat-transport-2";

type UnitAttr = {
  type: string;
  count: number;
};

const getExtraRerolls = (combatRoll: CombatRoll): number => {
  const self = combatRoll.self as any;
  if (typeof self.getExtraRerolls === "function") {
    const value = self.getExtraRerolls();
    if (typeof value === "number") {
      return value;
    }
  }
  return self.extraRerolls ?? 0;
};

const makeCombatRoll = (
  rollType: CombatRollType,
  unitAttrs: UnitAttr[]
): CombatRoll => {
  const self: any = {
    unitAttrsSet: {
      getAll: (): UnitAttr[] => unitAttrs,
    },
    extraRerolls: 0,
  };

  self.setExtraRerolls = (value: number): void => {
    self.extraRerolls = value;
  };

  self.getExtraRerolls = (): number => self.extraRerolls;

  return {
    getRollType: (): CombatRollType => rollType,
    getUnitModifierNames: (): string[] => [],
    self,
  } as unknown as CombatRoll;
};

it("schema", () => {
  expect(CombatTransport2.name).toBe("Combat Transport II");
  expect(CombatTransport2.owner).toBe("self");
  expect(CombatTransport2.priority).toBe("adjust");
  expect(CombatTransport2.triggers).toEqual([
    { cardClass: "technology.unit-upgrade", nsidName: "combat-transport-2" },
  ]);
});

it("default", () => {
  const combatRoll: CombatRoll = makeCombatRoll("groundCombat", []);
  expect((combatRoll as any).getUnitModifierNames()).toEqual([]);
  expect(getExtraRerolls(combatRoll)).toBe(0);
});

it("applies (groundCombat)", () => {
  const combatRoll: CombatRoll = makeCombatRoll("groundCombat", [
    { type: "infantry", count: 1 },
  ]);
  expect(CombatTransport2.applies?.(combatRoll)).toBe(true);
});

it("applies (spaceCombat)", () => {
  const combatRoll: CombatRoll = makeCombatRoll("spaceCombat", [
    { type: "infantry", count: 1 },
  ]);
  expect(CombatTransport2.applies?.(combatRoll)).toBe(false);
});

it("modifier (0 infantry)", () => {
  const combatRoll: CombatRoll = makeCombatRoll("groundCombat", []);
  expect(CombatTransport2.applies?.(combatRoll)).toBe(true);
  CombatTransport2.apply?.(combatRoll);
  expect(getExtraRerolls(combatRoll)).toBe(0);
});

it("modifier (1 infantry)", () => {
  const combatRoll: CombatRoll = makeCombatRoll("groundCombat", [
    { type: "infantry", count: 1 },
  ]);
  expect(CombatTransport2.applies?.(combatRoll)).toBe(true);
  CombatTransport2.apply?.(combatRoll);
  expect(getExtraRerolls(combatRoll)).toBe(1);
});

it("modifier (2 infantry)", () => {
  const combatRoll: CombatRoll = makeCombatRoll("groundCombat", [
    { type: "infantry", count: 2 },
  ]);
  expect(CombatTransport2.applies?.(combatRoll)).toBe(true);
  CombatTransport2.apply?.(combatRoll);
  expect(getExtraRerolls(combatRoll)).toBe(1);
});

it("modifier (3 infantry)", () => {
  const combatRoll: CombatRoll = makeCombatRoll("groundCombat", [
    { type: "infantry", count: 3 },
  ]);
  expect(CombatTransport2.applies?.(combatRoll)).toBe(true);
  CombatTransport2.apply?.(combatRoll);
  expect(getExtraRerolls(combatRoll)).toBe(0);
});

it("modifier (non-infantry units)", () => {
  const combatRoll: CombatRoll = makeCombatRoll("groundCombat", [
    { type: "mech", count: 2 },
  ]);
  expect(CombatTransport2.applies?.(combatRoll)).toBe(true);
  CombatTransport2.apply?.(combatRoll);
  expect(getExtraRerolls(combatRoll)).toBe(0);
});

it("modifier (mixed units)", () => {
  const combatRoll: CombatRoll = makeCombatRoll("groundCombat", [
    { type: "infantry", count: 1 },
    { type: "mech", count: 2 },
  ]);
  expect(CombatTransport2.applies?.(combatRoll)).toBe(true);
  CombatTransport2.apply?.(combatRoll);
  expect(getExtraRerolls(combatRoll)).toBe(1);
});

it("modifier (idempotent)", () => {
  const combatRoll: CombatRoll = makeCombatRoll("groundCombat", [
    { type: "infantry", count: 2 },
  ]);
  expect(CombatTransport2.applies?.(combatRoll)).toBe(true);
  CombatTransport2.apply?.(combatRoll);
  CombatTransport2.apply?.(combatRoll);
  expect(getExtraRerolls(combatRoll)).toBe(1);
});
