import { refPackageId } from "@tabletop-playground/api";
import { HomebrewModuleType } from "ti4-ttpg-ts";

import { factions } from "./lib/faction-lib/factions";

const packageId: string = refPackageId;

export const homebrew: HomebrewModuleType = {
  sourceAndPackageId: {
    source: "hb-discordant-stars",
    packageId,
  },
  factions,
};
