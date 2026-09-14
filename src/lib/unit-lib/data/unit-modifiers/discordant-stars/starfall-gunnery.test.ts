import { CombatAttrs, CombatRoll, UnitAttrs } from "ti4-ttpg-ts";
import { OPPONENT, SELF, placeGameObjects } from "./abstract.test";
import { StarFallGunnery } from "./starfall-gunnery";

beforeEach(() => {
  TI4.unitModifierRegistry.load("discordant-stars", [StarFallGunnery]);
});

const STARFALL_GUNNERY_NSID: string =
  "faction-ability:discordant-stars/starfall-gunnery";

it("registry", () => {
  expect(
    TI4.unitModifierRegistry.getByNsid(STARFALL_GUNNERY_NSID)?.getName()
  ).toBe("Starfall Gunnery");
});

it("default (no ability card)", () => {
  placeGameObjects({
    selfUnits: new Map([["cruiser", 1]]),
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual([]);
});

it("default (wrong roll type)", () => {
  placeGameObjects({
    self: [STARFALL_GUNNERY_NSID],
    selfUnits: new Map([["cruiser", 1]]),
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual([]);
});

it("modifier (applies SPACE CANNON 8 to non-fighter ships up to limit of 3)", () => {
  placeGameObjects({
    self: [STARFALL_GUNNERY_NSID],
    selfUnits: new Map([
      ["cruiser", 2],
      ["destroyer", 2],
      ["fighter", 3],
    ]),
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Starfall Gunnery"]);

  const cruiser: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("cruiser");
  const cruiserSpaceCannon: CombatAttrs = cruiser.getSpaceCannonOrThrow();
  expect(cruiserSpaceCannon.getHit()).toBe(8);

  const fighter: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("fighter");
  expect(fighter.getSpaceCannon()).toBeUndefined();
});