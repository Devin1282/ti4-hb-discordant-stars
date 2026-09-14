import { GardenWorlds } from "./garden-worlds";
import type { CombatRoll } from "ti4-ttpg-ts";

it("registry", () => {
  const nsid = "card.faction-ability:base/garden-worlds";
  const registry = {
    getByNsid: (id: string) =>
      id === nsid ? { getName: () => GardenWorlds.name } : undefined,
  };

  expect(registry.getByNsid(nsid)?.getName()).toBe("GardenWorlds");
});

it("modifier", () => {
  const combatRoll = {
    getRollType: () => "production",
    getUnitModifierNames: () => [GardenWorlds.name],
  } as unknown as CombatRoll;

  expect(GardenWorlds.applies(combatRoll)).toBe(true);
  expect(() => GardenWorlds.apply(combatRoll)).not.toThrow();
  expect(combatRoll.getUnitModifierNames()).toEqual(["GardenWorlds"]);
});

it("schema", () => {
  expect(GardenWorlds.name).toBe("GardenWorlds");
  expect(GardenWorlds.owner).toBe("self");
  expect(GardenWorlds.priority).toBe("adjust");
  expect(GardenWorlds.triggers).toEqual([
    { cardClass: "faction-ability", nsidName: "garden-worlds" },
  ]);
  expect(GardenWorlds.description).toBe(
    "+1 to the resource to planets without ground forces."
  );
});

it("applies", () => {
  const roll = {
    getRollType: () => "production",
  } as unknown as CombatRoll;

  expect(GardenWorlds.applies(roll)).toBe(true);
});

it("applies-rejects", () => {
  const roll = {
    getRollType: () => "combat",
  } as unknown as CombatRoll;

  expect(GardenWorlds.applies(roll)).toBe(false);
});

it("apply", () => {
  const roll = {} as unknown as CombatRoll;

  expect(() => GardenWorlds.apply(roll)).not.toThrow();
});
