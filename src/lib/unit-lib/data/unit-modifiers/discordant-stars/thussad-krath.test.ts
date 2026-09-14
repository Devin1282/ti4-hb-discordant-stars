import { CombatAttrs, CombatRoll, UnitAttrs, UnitPlastic } from "ti4-ttpg-ts";
import { placeGameObjects, SELF, OPPONENT } from "./abstract.test";
import { ThussadKrath } from "./thussad-krath";
import { Rotator } from "@tabletop-playground/api";
import { Facing } from "ttpg-darrell";

beforeEach(() => {
  TI4.unitModifierRegistry.load("discordant-stars", [ThussadKrath]);
});

const THUSSAD_KRATH_NSID =
  "card.leader.commander:discordant-stars/thussad-krath";

it("registry", () => {
  expect(
    TI4.unitModifierRegistry.getByNsid(THUSSAD_KRATH_NSID)?.getName()
  ).toBe("Thussad Krath");
});

it("modifier (space cannon - wrong roll type)", () => {
  placeGameObjects({
    self: [THUSSAD_KRATH_NSID],
    selfUnits: new Map([["dreadnought", 1]]),
  });
  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual([]);
});

it("modifier (no damaged units)", () => {
  placeGameObjects({
    self: [THUSSAD_KRATH_NSID],
    selfUnits: new Map([
      ["dreadnought", 1],
      ["cruiser", 1],
    ]),
  });
  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });
  expect(combatRoll.getUnitModifierNames()).toEqual(["Thussad Krath"]);

  const dreadnoughtAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const dreadSpace = dreadnoughtAttrs.getSpaceCombatOrThrow();
  expect(dreadSpace.getDice()).toBe(1);
});

it("modifier (adds 1 die to up to 2 damaged units, prioritizing best hit values)", () => {
  placeGameObjects({
    self: [THUSSAD_KRATH_NSID],
    selfUnits: new Map([
      ["flagship", 1],
      ["dreadnought", 1],
      ["cruiser", 1],
    ]),
  });

  const unitPlastics: Array<UnitPlastic> = UnitPlastic.getAll();
  for (const plastic of unitPlastics) {
    if (plastic.getOwningPlayerSlot() === SELF) {
      const type = plastic.getUnit();
      if (type === "flagship" || type === "dreadnought" || type === "cruiser") {
        const rot: Rotator = plastic.getObj().getRotation();
        rot.roll += 180;
        plastic.getObj().setRotation(rot);
      }
    }
  }

  const combatRoll = CombatRoll.createCooked({
    rollType: "spaceCombat",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Thussad Krath"]);

  // Flagship (best combat roll) gets +1 die
  const flagshipAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("flagship");
  const flagshipSpace: CombatAttrs = flagshipAttrs.getSpaceCombatOrThrow();
  expect(flagshipSpace.getExtraDice()).toBe(1);

  // Dreadnought (second best combat roll) gets +1 die
  const dreadnoughtAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const dreadSpace: CombatAttrs = dreadnoughtAttrs.getSpaceCombatOrThrow();
  expect(dreadSpace.getExtraDice()).toBe(1);

  // Cruiser (worst hit threshold among damaged) does NOT get extra die
  const cruiserAttrs: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("cruiser");
  const cruiserSpace: CombatAttrs = cruiserAttrs.getSpaceCombatOrThrow();
  expect(cruiserSpace.getExtraDice()).toBe(0);
});

it("modifier (ground combat with damaged mechs)", () => {
  placeGameObjects({
    self: [THUSSAD_KRATH_NSID],
    selfUnits: new Map([["mech", 2]]),
  });

  const unitPlastics: Array<UnitPlastic> = UnitPlastic.getAll();
  for (const plastic of unitPlastics) {
    if (plastic.getOwningPlayerSlot() === SELF) {
      const type = plastic.getUnit();
      if (type === "mech") {
        const rot: Rotator = plastic.getObj().getRotation();
        rot.roll += 180;
        plastic.getObj().setRotation(rot);
      }
    }
  }

  const combatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Thussad Krath"]);

  const mechAttrs: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("mech");
  const groundCombat: CombatAttrs = mechAttrs.getGroundCombatOrThrow();

  // Both damaged mechs selected (2 dice added total to the unit pool)
  expect(groundCombat.getExtraDice()).toBe(2);
});