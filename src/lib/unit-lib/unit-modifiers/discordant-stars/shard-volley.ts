import { CombatAttrs } from "ti4-ttpg-ts";
import {
  CombatRoll,
  CombatRollType,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";

export const ShardVolley: UnitModifierSchemaType = {
  name: "Shard Volley",
  description: "+1 hits for BOMBARDMENT",
  owner: "self",
  priority: "choose", // need to be after adjust, so crit matches hit
  triggers: [{ cardClass: "technology.red", nsidName: "shard-volley" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return rollType === "bombardment";
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      const bombardment: CombatAttrs | undefined = unitAttrs.getBombardment();
      if (bombardment) {
        const bombardmentHit = bombardment.getHit();
        if(bombardmentHit > 0) {
            bombardment.addHit(1);
        }
        break;
      }
    }
  },
};
