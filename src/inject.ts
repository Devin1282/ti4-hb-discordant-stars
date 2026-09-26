import { homebrew } from "./homebrew";
import { NSID_TO_TEMPLATE_ID } from "./nsid-to-template-id"; // generated
import { RightClickCovertStrikeTeams } from "./context-menu/cards/covert-strike-teams/covert-strike-teams";
import { RightClickSingularityCradle } from "./context-menu/cards/heroes/singularity-cradle/singularity-cradle";
import { OnCardBecameSingletonOrDeck } from "ttpg-darrell";

NSID_TO_TEMPLATE_ID["dice:base/d10"] = "9065AC5141F87F8ADE1F5AB6390BBEE4";
homebrew.nsidToTemplateId = NSID_TO_TEMPLATE_ID;
TI4.homebrewRegistry.load(homebrew);

new OnCardBecameSingletonOrDeck().init(); // YUCK, static not shared with main TI4 mod context, create our own
new RightClickCovertStrikeTeams().init();
new RightClickSingularityCradle().init();
