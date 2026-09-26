import { homebrew } from "./homebrew";
import { NSID_TO_TEMPLATE_ID } from "./nsid-to-template-id"; // generated
import { RightClickCovertStrikeTeams } from "./context-menu/cards/covert-strike-teams/covert-strike-teams";
import { RightClickSingularityCradle } from "./context-menu/cards/heroes/singularity-cradle/singularity-cradle";

homebrew.nsidToTemplateId = NSID_TO_TEMPLATE_ID;
NSID_TO_TEMPLATE_ID['dice:base/d10'] = '9065AC5141F87F8ADE1F5AB6390BBEE4'
new RightClickCovertStrikeTeams().init();
new RightClickSingularityCradle().init();
TI4.homebrewRegistry.load(homebrew);