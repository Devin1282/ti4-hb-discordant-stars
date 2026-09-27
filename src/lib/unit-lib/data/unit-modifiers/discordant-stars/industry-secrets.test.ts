import { CombatRoll, CombatRollType } from "ti4-ttpg-ts";
import { IndustrySecrets } from "./industry-secrets";

const createCombatRoll = (rollType: CombatRollType): CombatRoll => {
  return {
    getRollType: () => rollType,
  } as unknown as CombatRoll;
};

it("registry", () => {
  expect(IndustrySecrets.name).toBe("Industry Secrets");
  expect(IndustrySecrets.owner).toBe("self");
  expect(IndustrySecrets.priority).toBe("adjust");
  expect(IndustrySecrets.triggers).toEqual([
    { cardClass: "promissory", nsidName: "industry-secrets" },
  ]);
});

it("modifier", () => {
  const combatRoll = createCombatRoll(
    "production" as unknown as CombatRollType
  );
  expect(IndustrySecrets.applies(combatRoll)).toBe(true);
  expect(() => IndustrySecrets.apply(combatRoll)).not.toThrow();
});

it("modifier non-production", () => {
  const combatRoll = createCombatRoll(
    "combat" as unknown as CombatRollType
  );
  expect(IndustrySecrets.applies(combatRoll)).toBe(false);
});

it("applies production", () => {
  const combatRoll = createCombatRoll(
    "production" as unknown as CombatRollType
  );
  expect(IndustrySecrets.applies(combatRoll)).toBe(true);
});

it("applies non-production", () => {
  const combatRoll = createCombatRoll(
    "combat" as unknown as CombatRollType
  );
  expect(IndustrySecrets.applies(combatRoll)).toBe(false);
});
