import { refPackageId } from "@tabletop-playground/api";
import { HomebrewModuleType } from "ti4-ttpg-ts";

import { factions } from "./lib/faction-lib/data/factions.data";
import { planetAttachments } from "./lib/system-lib/data/planet-attachment.data";
import { systems } from "./lib/system-lib/data/system.data";
import { systemAttachments } from "./lib/system-lib/data/system.attachment.data";
import { technologies } from "./lib/tech-lib/tech";
import { unitAttrs } from "./lib/unit-lib/unit-attrs";
import { unitModifiers } from "./lib/unit-lib/unit-modifiers";

const packageId: string = refPackageId;

export const homebrew: HomebrewModuleType = {
  sourceAndPackageId: {
    source: "discordant-stars",
    packageId,
  },
  factions,
  planetAttachments,
  systems,
  systemAttachments,
  technologies,
  unitAttrs,
  unitModifiers,
};

// Move most data to the main mod, only inject remaining data here.
export const homebrewInject: HomebrewModuleType = {
  sourceAndPackageId: {
    source: "discordant-stars",
    packageId,
  },
};