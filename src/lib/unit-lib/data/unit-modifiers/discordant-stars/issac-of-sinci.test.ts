import { CombatRoll, CombatAttrs, UnitAttrs } from "ti4-ttpg-ts";
import { placeGameObjects, SELF, OPPONENT } from "./abstract.test";
import { IssacOfSinci } from "./issac-of-sinci";

beforeEach(() => {
  TI4.unitModifierRegistry.load("discordant-stars", [IssacOfSinci]);
});

it("registry (commander)", () => {
  const nsid: string = "card.leader.commander:discordant-stars/issac-of-sinci";
  expect(TI4.unitModifierRegistry.getByNsid(nsid)?.getName()).toBe("Issac of Sinci");
});

it("groundCombat (commander)", () => {
  const nsid: string = "card.leader.commander:discordant-stars/issac-of-sinci";
  placeGameObjects({ selfActive: [nsid] });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "groundCombat",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.isCommanderUnlocked(nsid)).toBe(true);
  expect(IssacOfSinci.applies(combatRoll)).toBe(false);
  expect(combatRoll.getUnitModifierNames()).toEqual([]);

  const destroyer: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("destroyer");
  const antiFighterBarrage: CombatAttrs =
    destroyer.getAntiFighterBarrageOrThrow();
  expect(antiFighterBarrage.getHit()).toBe(9);

  const dreadnought: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const bombardment: CombatAttrs = dreadnought.getBombardmentOrThrow();
  expect(bombardment.getHit()).toBe(5);

  const pds: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("pds");
  const spaceCannon: CombatAttrs = pds.getSpaceCannonOrThrow();
  expect(spaceCannon.getHit()).toBe(6);
});

it("modifier (antiFighterBarrage)", () => {
  const nsid: string = "card.leader.commander:discordant-stars/issac-of-sinci";
  placeGameObjects({ selfActive: [nsid] });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "antiFighterBarrage",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.isCommanderUnlocked(nsid)).toBe(true);
  expect(IssacOfSinci.applies(combatRoll)).toBe(true);
  expect(combatRoll.getUnitModifierNames()).toEqual(["Issac of Sinci"]);

  const destroyer: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("destroyer");
  const antiFighterBarrage: CombatAttrs =
    destroyer.getAntiFighterBarrageOrThrow();
  expect(antiFighterBarrage.getHit()).toBe(8);
});

it("modifier (bombardment)", () => {
  const nsid: string = "card.leader.commander:discordant-stars/issac-of-sinci";
  placeGameObjects({ selfActive: [nsid] });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "bombardment",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.isCommanderUnlocked(nsid)).toBe(true);
  expect(IssacOfSinci.applies(combatRoll)).toBe(true);
  expect(combatRoll.getUnitModifierNames()).toEqual(["Issac of Sinci"]);

  const dreadnought: UnitAttrs =
    combatRoll.self.unitAttrsSet.getOrThrow("dreadnought");
  const bombardment: CombatAttrs = dreadnought.getBombardmentOrThrow();
  expect(bombardment.getHit()).toBe(4);
});

it("modifier (spaceCannonDefense)", () => {
  const nsid: string = "card.leader.commander:discordant-stars/issac-of-sinci";
  placeGameObjects({ selfActive: [nsid] });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonDefense",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.isCommanderUnlocked(nsid)).toBe(true);
  expect(IssacOfSinci.applies(combatRoll)).toBe(true);
  expect(combatRoll.getUnitModifierNames()).toEqual(["Issac of Sinci"]);


  const pds: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("pds");
  const spaceCannon: CombatAttrs = pds.getSpaceCannonOrThrow();
  expect(spaceCannon.getHit()).toBe(5);
});

it("modifier (spaceCannonOffense)", () => {
  const nsid: string = "card.leader.commander:discordant-stars/issac-of-sinci";
  placeGameObjects({ selfActive: [nsid] });

  const combatRoll: CombatRoll = CombatRoll.createCooked({
    rollType: "spaceCannonOffense",
    hex: "<0,0,0>",
    planetName: "Jord",
    activatingPlayerSlot: OPPONENT,
    rollingPlayerSlot: SELF,
  });

  expect(combatRoll.isCommanderUnlocked(nsid)).toBe(true);
  expect(IssacOfSinci.applies(combatRoll)).toBe(true);
  expect(combatRoll.getUnitModifierNames()).toEqual(["Issac of Sinci"]);

  const pds: UnitAttrs = combatRoll.self.unitAttrsSet.getOrThrow("pds");
  const spaceCannon: CombatAttrs = pds.getSpaceCannonOrThrow();
  expect(spaceCannon.getHit()).toBe(5);
});
