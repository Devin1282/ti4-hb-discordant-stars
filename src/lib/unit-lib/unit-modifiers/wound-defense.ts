import { CombatAttrs } from "ti4-ttpg-ts";
import {
  CombatRoll,
  CombatRollType,
} from "ti4-ttpg-ts";
import { UnitModifierSchemaType } from "ti4-ttpg-ts";

export const WoundDefense: UnitModifierSchemaType = {
  name: "Wound Defense",
  description: "+1 to defender SPACE COMBAT rolls in system with wound token",
  owner: "self",
  priority: "adjust",
  triggerAlways: true,
  triggers: [],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    const isDefender: boolean =
      combatRoll.getActivatingPlayerSlot() !== combatRoll.self.playerSlot;
    let isNebula: boolean = false;
    if (combatRoll.system) {
    isNebula = combatRoll.system.getAttachments().some(
        (attachment) => attachment.getNsidName() === "token.system:discordant-stars/wound-token"
    );
  }
    return rollType === "spaceCombat" && isNebula && isDefender;
  },
  apply: (combatRoll: CombatRoll): void => {
    for (const unitAttrs of combatRoll.self.unitAttrsSet.getAll()) {
      const spaceCombat: CombatAttrs | undefined = unitAttrs.getSpaceCombat();
      if (spaceCombat) {
        spaceCombat.addHit(1);
      }
    }
  },
};
