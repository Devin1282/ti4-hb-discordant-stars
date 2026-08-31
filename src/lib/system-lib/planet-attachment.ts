import { PlanetAttachmentSchemaType } from "ti4-ttpg-ts";

export const SOURCE_TO_SYSTEM_ATTACHMENT_DATA: Record<
  string,
  Array<PlanetAttachmentSchemaType>
> = {
    ["discordant-stars"]: [
    {
      name: "Trap: Account Siphon",
      nsidName: "trap-account-siphon-token",
      doNotAttach: true,
    },
    {
      name: "Trap: Feint",
      nsidName: "trap-feint-token",
      doNotAttach: true,
    },
    {
      name: "Trap: Gravitic Inhibitors",
      nsidName: "trap-gravitic-inhibitors-token",
      doNotAttach: true,
    },
    {
      name: "Trap: Interference Grid",
      nsidName: "trap-interference-grid-token",
      doNotAttach: true,
    },
    {
      name: "Trap: Minefield",
      nsidName: "trap-minefield-token",
      doNotAttach: true,
    },
    {
      name: "Trap: Saboteurs",
      nsidName: "trap-saboteurs-token",
      doNotAttach: true,
    },
    {
      name: "GLEdge Base",
      nsidName: "gledge-base-token",
      resources: 2,
    },
    {
      name: "Automatons",
      nsidName: "automatons-token",
      doNotAttach: true,
    },
    {
      name: "Branch Office Broadcast Hub",
      nsidName: "branch-office-broadcast-hub",
      influence: 1,
    },
    {
      name: "Branch Office Orbital Shipyard",
      nsidName: "branch-office-orbital-shipyard",
      resources: 1,
    },
    {
      name: "Branch Office Reserve Bank",
      nsidName: "branch-office-reserve-bank",
      resources: 1,
    },
    {
      name: "Branch Office Tax Haven",
      nsidName: "branch-office-tax-haven",
      influence: 1,
    },
    {
      name: "Encryption Key",
      nsidName: "encryption-key-token",
      techs: ["blue","green","red","yellow"],
    },
    {
      name: "Edyn Sigil",
      nsidName: "edyn-sigil-token",
      doNotAttach: true,
    },
    ]
};