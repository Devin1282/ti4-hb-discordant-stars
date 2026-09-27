import { SystemAttachmentSchemaType } from "ti4-ttpg-ts";

export const systemAttachments: Array<SystemAttachmentSchemaType> = [
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
    {
      name: "Wound Token",
      nsidName: "wound-token",
      doNotAttach: true,
      anomalies: ["gravity-rift", "nebula"],
    },
];