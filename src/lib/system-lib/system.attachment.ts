import { SystemAttachmentSchemaType } from "ti4-ttpg-ts";

export const SOURCE_TO_SYSTEM_ATTACHMENT_DATA: Record<
  string,
  Array<SystemAttachmentSchemaType>
> = {
  ["discordant-stars"]: [
    {
      name: "Edyn Sigil",
      nsidName: "edyn-sigil-token",
      doNotLock: true,
    },
    {
      name: "Kjalengard Glory Token",
      nsidName: "glory-token",
      doNotAttach: true,
    },
  ]
};