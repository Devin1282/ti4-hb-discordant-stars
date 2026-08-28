import { FactionSchemaType } from "ti4-ttpg-ts";

export const factions: Array<FactionSchemaType> = [
    {
      nsidName: "florzen-profiteers",
      name: "Florzen Profiteers",
      abbr: "Florzen",
      abilities: ["mercenaries","data-leak","shadow-markets"],
      breakthroughs: [
        {
          breakthrough: "reverie-implants",
          techEquivalence: ["blue", "green"],
        },
      ],
      commodities: 4,
      home: 1002,
      leaders: {
        agents: ["sal-gavda"],
        commanders: ["quaxdol-junitas"],
        heroes: ["banua-gowen"],
        mechs: ["privateer"],
      },
      promissories: ["underground-market"],
      startingTechs: ["scanlink-drone-network","neural-motivator"],
      startingUnits: {
        carrier: 2,
        fighter: 4,
        infantry: 4,
        spaceDock: 1,
      },
      factionTechs: ["blackmail-programs"],
      unitOverrides: ["man-o-war", "corsair-1", "corsair-2"],
    }
];

