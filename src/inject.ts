import { homebrew } from "homebrew";
import { NSID_TO_TEMPLATE_ID } from "nsid-to-template-id"; // generated

homebrew.nsidToTemplateId = NSID_TO_TEMPLATE_ID;
TI4.homebrewRegistry.load(homebrew);
