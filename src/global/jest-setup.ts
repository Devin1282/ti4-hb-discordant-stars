import { SetupPlayerSlotColors } from "../setup/setup-player-slot-colors";
import { addObjectTemplatesToMockWorld } from "../nsid/nsid-to-template-id.test";
import { resetGlobalThisTI4 } from "ti4-ttpg-ts";

beforeEach(() => {
  addObjectTemplatesToMockWorld();
  resetGlobalThisTI4();
  new SetupPlayerSlotColors().setup();
});