import { CombatRoll } from "ti4-ttpg-ts";
import { MockCard, MockGameObject } from "ttpg-mock";
import { world } from "@tabletop-playground/api";
import { Kaliburn } from "./kaliburn";

beforeEach(() => {
  TI4.unitModifierRegistry.load("discordant-stars", [Kaliburn]);
});

const LAW_NSID_A: string = "card.agenda:base/law-alpha";
const LAW_NSID_B: string = "card.agenda:base/law-beta";
const NON_CARD_AGENDA_NSID: string = "card.agenda:base/not-a-card";

function clearWorld(): void {
  const worldLike = world as unknown as {
    clearAllObjects?: (skipContained?: boolean) => void;
    removeAllObjects?: (skipContained?: boolean) => void;
    getAllObjects?: (skipContained?: boolean) => Array<object>;
    removeObject?: (obj: object) => void;
  };

  if (typeof worldLike.clearAllObjects === "function") {
    worldLike.clearAllObjects(true);
    return;
  }

  if (typeof worldLike.removeAllObjects === "function") {
    worldLike.removeAllObjects(true);
    return;
  }

  const objects: Array<object> = worldLike.getAllObjects
    ? worldLike.getAllObjects(true)
    : [];
  for (const obj of objects) {
    if (typeof worldLike.removeObject === "function") {
      worldLike.removeObject(obj);
    }
  }
}

beforeEach(() => {
  clearWorld();
});

function createLawCard(nsid: string, name: string): void {
  const card = MockCard.simple(nsid);
  const cardLike = card as unknown as {
    getCardDetails?: () => Record<string, unknown> | undefined;
    setCardDetails?: (details: Record<string, unknown>) => void;
  };

  const existingDetails: Record<string, unknown> =
    cardLike.getCardDetails ? cardLike.getCardDetails() ?? {} : {};

  if (typeof cardLike.setCardDetails === "function") {
    try {
      cardLike.setCardDetails({ ...existingDetails, name });
    } catch {
      // Fall back to patching getCardDetails below if the mock setter is incompatible.
    }
  }

  const currentDetails: Record<string, unknown> | undefined =
    cardLike.getCardDetails
      ? cardLike.getCardDetails() ?? undefined
      : undefined;

  if (!currentDetails || (currentDetails as { name?: string }).name !== name) {
    Object.defineProperty(card, "getCardDetails", {
      value: () => ({ ...existingDetails, name }),
      writable: true,
      configurable: true,
    });
  }
}

function createFlagshipApplyRoll(): {
  roll: CombatRoll;
  added: Array<number>;
} {
  const added: Array<number> = [];
  const roll: CombatRoll = {
    getRollType: () => "spaceCombat",
    self: {
      hasUnit: (unit: string) => unit === "flagship",
      unitAttrsSet: {
        get: (unit: string) =>
          unit === "flagship"
            ? {
                getSpaceCombat: () => ({
                  addHit: (hit: number) => {
                    added.push(hit);
                  },
                }),
              }
            : undefined,
      },
    },
  } as unknown as CombatRoll;

  return { roll, added };
}

function createAppliesRoll(
  rollType: "spaceCombat" | "groundCombat",
  hasFlagship: boolean
): CombatRoll {
  return {
    getRollType: () => rollType,
    self: {
      hasUnit: (unit: string) => hasFlagship && unit === "flagship",
    },
  } as unknown as CombatRoll;
}

it("registry", () => {
  expect(Kaliburn.name).toBe("Kaliburn");
  expect(Kaliburn.owner).toBe("self");
  expect(Kaliburn.priority).toBe("adjust");
  expect(Kaliburn.triggers).toEqual([
    { cardClass: "unit", nsidName: "kaliburn" },
  ]);
});

it("applies", () => {
  expect(Kaliburn.applies(createAppliesRoll("groundCombat", true))).toBe(false);
  expect(
    Kaliburn.applies(createAppliesRoll("spaceCombat", false))
  ).toBe(false);
  expect(
    Kaliburn.applies(createAppliesRoll("spaceCombat", true))
  ).toBe(true);
});

it("apply ignores non-card agenda objects", () => {
  MockGameObject.simple(NON_CARD_AGENDA_NSID);

  const { roll, added } = createFlagshipApplyRoll();
  Kaliburn.apply(roll);

  expect(added).toEqual([]);
});

it("apply", () => {
  const { roll, added } = createFlagshipApplyRoll();

  Kaliburn.apply(roll);
  expect(added).toEqual([]);

  createLawCard(LAW_NSID_A, "Law Alpha");
  Kaliburn.apply(roll);
  expect(added).toEqual([1]);

  createLawCard(LAW_NSID_B, "Law Beta");
  Kaliburn.apply(roll);
  expect(added).toEqual([1, 2]);

  createLawCard(LAW_NSID_A, "Law Alpha");
  Kaliburn.apply(roll);
  expect(added).toEqual([1, 2, 2]);
});

it("apply without unit attrs", () => {
  MockCard.simple(LAW_NSID_A);

  let unitGetCalled: boolean = false;
  const roll: CombatRoll = {
    self: {
      unitAttrsSet: {
        get: () => {
          unitGetCalled = true;
          return undefined;
        },
      },
    },
  } as unknown as CombatRoll;

  Kaliburn.apply(roll);
  expect(unitGetCalled).toBe(true);
});

it("apply without space combat", () => {
  MockCard.simple(LAW_NSID_A);

  let spaceCombatRequested: boolean = false;
  const added: Array<number> = [];
  const roll: CombatRoll = {
    self: {
      unitAttrsSet: {
        get: () => ({
          getSpaceCombat: () => {
            spaceCombatRequested = true;
            return undefined;
          },
        }),
      },
    },
  } as unknown as CombatRoll;

  Kaliburn.apply(roll);
  expect(spaceCombatRequested).toBe(true);
  expect(added).toEqual([]);
});

it("modifier", () => {
  const { roll, added } = createFlagshipApplyRoll();
  expect(Kaliburn.applies(roll)).toBe(true);

  Kaliburn.apply(roll);
  expect(added).toEqual([]);

  createLawCard(LAW_NSID_A, "Law Alpha");
  Kaliburn.apply(roll);
  expect(added).toEqual([1]);

  createLawCard(LAW_NSID_B, "Law Beta");
  Kaliburn.apply(roll);
  expect(added).toEqual([1, 2]);

  createLawCard(LAW_NSID_A, "Law Alpha");
  Kaliburn.apply(roll);
  expect(added).toEqual([1, 2, 2]);
});
