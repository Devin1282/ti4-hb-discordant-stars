import { OPPONENT, placeGameObjects, SELF } from "./abstract.test";
import { ZelianB } from "./zelian-b";
import { CombatRoll, UnitType, CombatAttrs } from "ti4-ttpg-ts";

beforeEach(() => {
  TI4.unitModifierRegistry.load("discordant-stars", [ZelianB]);
});

it("registry", () => {
  const nsid = "card.leader.commander:discordant-stars/zelian-b";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe(
    "Zelian B"
  );
});

it("modifier - one dreadnought", () => {
  placeGameObjects({
    self: ["card.leader.commander:discordant-stars/zelian-b"],
    selfUnits: new Map([["dreadnought", 1]]),
  });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "antiFighterBarrage",
    hex: "<0,0,0>",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.getUnitModifierNames()).toEqual(["Zelian B"]);

  expect(
    combatRoll.isCommanderUnlocked("card.leader.commander:discordant-stars/zelian-b")
  ).toBe(true);

  const dreadnought =
    combatRoll.self.unitAttrsSet.getOrThrow(
      "zelian-b-dreadnought" as UnitType
    );
  const combatAttrs = dreadnought.getAntiFighterBarrageOrThrow();
  expect(combatAttrs.getHit()).toBe(5);
});