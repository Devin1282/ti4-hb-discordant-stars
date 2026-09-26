import {
  UnitAttrs,
  UnitAttrsSet,
  UnitPlastic,
} from "ti4-ttpg-ts";
import {
  AbstractRightClickCard,
  Broadcast,
  Facing,
} from "ttpg-darrell";
import {
  Color,
  GameObject,
  Player,
  world,
  Rotator,
} from "@tabletop-playground/api";

/**
 * "ACTION: Each unit on the game board with SUSTAIN DAMAGE, other than your mechs, becomes damaged, if able. 
 * Place this card near the game board; you may treat each unit you control as adjacent to the system that contains the Wound token until the end of this game round. 
 * At the end of this game round, purge this card."
 */
export class RightClickSingularityCradle extends AbstractRightClickCard {
  constructor() {
    const cardNsidPrefix: string = "card.leader.hero:discordant-stars/singularity-cradle";
    const customActionName: string = "*Dimensional Anchor";
    const customActionHandler = (
      object: GameObject,
      player: Player,
      identifier: string
    ): void => {
      if (identifier === customActionName) {
        this._singularityCradle(object, player.getSlot());
      }
    };
    super(cardNsidPrefix, customActionName, customActionHandler);
  }

  _singularityCradle(object: GameObject, playerSlot: number): void {
    const playerName: string = TI4.playerName.getBySlot(playerSlot);
    const color: Color = world.getSlotColor(playerSlot);
    const msg: string = `${playerName} executing Singularity Cradle!`;
    Broadcast.chatAll(msg, color);

    //Get all plastic objects on the board that have sustain damage except own mechs.
    const unitPlastics: Array<UnitPlastic> = UnitPlastic.getAll();
    const nonOwnMechs = unitPlastics.filter(
        (plastic) =>
        !(plastic.getOwningPlayerSlot() === playerSlot &&
        plastic.getUnit() === "mech")
    );

    const unitAttrsSet: UnitAttrsSet =
      TI4.unitAttrsRegistry.defaultUnitAttrsSet();
    for (const unitPlastic of nonOwnMechs) {
      const unitAttrs: UnitAttrs | undefined = unitAttrsSet.get(
        unitPlastic.getUnit()
      );
      if (unitAttrs && unitAttrs.hasSustainDamage() ) {
        if (Facing.isFaceUp(unitPlastic.getObj())) {
            const rot: Rotator = unitPlastic.getObj().getRotation();
            rot.roll += 180;
            unitPlastic.getObj().setRotation(rot);
        } 
      }
    }
  }
}