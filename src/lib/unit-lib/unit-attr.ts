import { UnitAttrsSchemaType } from "ti4-ttpg-ts";

export const SOURCE_TO_UNIT_ATTRS_DATA: Record<
  string,
  Array<UnitAttrsSchemaType>
> = {
  "discordant-stars": [
    // Flagship
    {
      name: "Nemsys", 
      unit: "flagship",
      nsidName: "nemsys",
      spaceCombat: { hit: 5 },
    },
    {
      name: "Wayfinder", 
      unit: "flagship",
      nsidName: "wayfinder",
      spaceCombat: { dice: 2, hit: 9 },
      bombardment: { hit: 9 },
      spaceCannon: { hit: 9 },
      antiFighterBarrage: { dice: 2, hit: 9 },
    },
    {
      name: "Supremacy", 
      unit: "flagship",
      nsidName: "supremacy",
      spaceCombat: { dice: 2, hit: 7 },
      antiFighterBarrage: { dice: 2, hit: 6 },
    },
    {
      name: "Lithodax", 
      unit: "flagship",
      nsidName: "lithodax",
      spaceCombat: { dice: 2, hit: 7 },
      antiFighterBarrage: { dice: 2, hit: 7 },
    },
    {
      name: "Lithodax", 
      unit: "flagship",
      nsidName: "lithodax",
      spaceCombat: { dice: 2, hit: 7 },
      antiFighterBarrage: { dice: 2, hit: 7 },
    },
    {
      name: "Kaliburn", 
      unit: "flagship",
      nsidName: "kaliburn",
      spaceCombat: { dice: 2, hit: 7 },
    },
    {
      name: "Man O War", 
      unit: "flagship",
      nsidName: "man-o-war",
      spaceCombat: { dice: 2, hit: 7 },
    },
    {
      name: "Vox", 
      unit: "flagship",
      nsidName: "vox",
      spaceCombat: { dice: 2, hit: 7 },
    },
    {
      name: "The Lady", 
      unit: "flagship",
      nsidName: "the-lady",
      spaceCombat: { dice: 2, hit: 7 },
      bombardment: { dice: 4, hit: 5 },
      cost: 6,
    },
    {
      name: "The Lord", 
      unit: "flagship",
      nsidName: "the-lord",
      spaceCombat: { dice: 2, hit: 7 },
      cost: 6,
    },
    {
      name: "All Mother", 
      unit: "flagship",
      nsidName: "all-mother",
      spaceCombat: { dice: 2, hit: 7 },
      cost: 6,
    },
    {
      name: "Beg Bertha", 
      unit: "flagship",
      nsidName: "beg-bertha",
      spaceCombat: { dice: 2, hit: 7 },
      bombardment: { hit: 7 },
    },
    {
      name: "Particle Sieve", 
      unit: "flagship",
      nsidName: "particle-sieve",
      spaceCombat: { dice: 2, hit: 7 },
    },
    {
      name: "Nightingale V", 
      unit: "flagship",
      nsidName: "nightingale-5",
      spaceCombat: { dice: 2, hit: 5 },
    },
    {
      name: "Magistrate", 
      unit: "flagship",
      nsidName: "magistrate",
      spaceCombat: { dice: 2, hit: 5 },
      bombardment: { hit: 3 },
    },
    {
      name: "Auriga", 
      unit: "flagship",
      nsidName: "auriga",
      spaceCombat: { dice: 2, hit: 7 },
    },
    {
      name: "Memory of Dusk", 
      unit: "flagship",
      nsidName: "memory-of-dusk",
      spaceCombat: { dice: 2, hit: 7 },
    },
    {
      name: "Silence of Stars", 
      unit: "flagship",
      nsidName: "silence-of-stars",
      spaceCombat: { dice: 2, hit: 5 },
    },
    {
      name: "Splintering Gale", 
      unit: "flagship",
      nsidName: "splintering-gale",
      spaceCombat: { dice: 2, hit: 7 },
    },
    {
      name: "The Nexus", 
      unit: "flagship",
      nsidName: "the-nexus",
      spaceCombat: { dice: 2, hit: 9 },
    },
    {
      name: "Halberd", 
      unit: "flagship",
      nsidName: "halberd",
      spaceCombat: { dice: 2, hit: 7 },
      spaceCannon: { hit: 7 },
    },
    {
      name: "Psyclobea Qubis", 
      unit: "flagship",
      nsidName: "psychlobea-qubis",
      spaceCombat: { dice: 2, hit: 7 },
    },
    {
      name: "Eradica", 
      unit: "flagship",
      nsidName: "eradica",
      spaceCombat: { dice: 2, hit: 5 },
    },
    {
      name: "Annah Regia", 
      unit: "flagship",
      nsidName: "annah-regia",
      spaceCombat: { dice: 2, hit: 9 },
    },
    {
      name: "Rallypoint", 
      unit: "flagship",
      nsidName: "rallypoint",
      spaceCombat: { dice: 2, hit: 5 },
    },
    {
      name: "Kyvir the Replicator", 
      unit: "flagship",
      nsidName: "kyvir-the-replicator",
      spaceCombat: { dice: 2, hit: 5 },
    },
    {
      name: "Reprocessor Alpha", 
      unit: "flagship",
      nsidName: "reprocessor-alpha",
      spaceCombat: { dice: 2, hit: 9 },
    },
    {
      name: "Bearer of Heavens", 
      unit: "flagship",
      nsidName: "bearer-of-heavens",
      spaceCombat: { dice: 2, hit: 7 },
    },
    {
      name: "Principia Aneris", 
      unit: "flagship",
      nsidName: "principia-aneris",
      spaceCombat: { dice: 4, hit: 9 },
    },
    {
      name: "Aurum Vadra", 
      unit: "flagship",
      nsidName: "aurum-vadra",
      spaceCombat: { dice: 2, hit: 7 },
      bombardment: { dice: 2, hit: 5 },
    },
    {
      name: "Lost Cause", 
      unit: "flagship",
      nsidName: "lost-cause",
      spaceCombat: { dice: 2, hit: 7 },
    },
    {
      name: "Richtyrian", 
      unit: "flagship",
      nsidName: "richtyrian",
      spaceCombat: { dice: 2, hit: 7 },
    },
    {
      name: "Reckoning", 
      unit: "flagship",
      nsidName: "reckoning",
      spaceCombat: { dice: 2, hit: 7 },
    },
    {
      name: "World-Cracker", 
      unit: "flagship",
      nsidName: "world-cracker",
      spaceCombat: { hit: 5 },
      bombardment: { hit: 5 },
      antiFighterBarrage: { hit: 5 },
    },
    {
      name: "Celagrom", 
      unit: "flagship",
      nsidName: "celagrom",
      spaceCombat: { hit: 5 },
      bombardment: { hit: 5 },
    },

    // Mech
    {
      name: "Voidflare Warden II",
      unit: "mech",
      nsidName: "voidflare-warden-2",
      bombardment: { hit: 4 },
    },
    {
      name: "Justicar",
      unit: "mech",
      nsidName: "dusticar",
      bombardment: { hit: 5 },
    },
    {
      name: "Rook",
      unit: "mech",
      nsidName: "rook",
      bombardment: { hit: 5 },
      spaceCannon: { dice: 2, hit: 8},
    },

    //Destroyer
    
    {
      name: "Blockade Runner I",
      unit: "destroyer",
      nsidName: "blockade-runner-1",
      antiFighterBarrage: { dice: 3, hit: 9 },
      spaceCombat: { hit: 9 },
    },
    {
      name: "Blockade Runner II",
      unit: "destroyer",
      nsidName: "blockade-runner-2",
      antiFighterBarrage: { dice: 4, hit: 6 },
      spaceCombat: { hit: 8 },
    },
    {
      name: "Sabre I",
      unit: "destroyer",
      nsidName: "sabre-1",
      antiFighterBarrage: { dice: 2, hit: 9 },
      spaceCombat: { hit: 8 },
    },
    {
      name: "Sabre II",
      unit: "destroyer",
      nsidName: "sabre-runner-2",
      antiFighterBarrage: { dice: 3, hit: 6 },
      spaceCombat: { hit: 7 },
    },

    //War sun
    {
      name: "Terrafactory I",
      unit: "war-sun",
      nsidName: "terrafactory-1",
      spaceCombat: { dice: 2, hit: 5 },
    },
    {
      name: "Terrafactory II",
      unit: "war-sun",
      nsidName: "terrafactory-2",
      spaceCombat: { dice: 3, hit: 3 },
      bombardment: { dice: 3, hit: 3 },
      cost: 12
    },
    {
      name: "Omni-Forgeworld",
      unit: "war-sun",
      nsidName: "the-prodigys-triumph",
      spaceCombat: { dice: 3, hit: 3 },
      bombardment: { dice: 3, hit: 3 },
      cost: 10
    },

    //Cruiser
    {
      name: "Shattered Sky I",
      unit: "cruiser",
      nsidName: "shattered-sky-1",
      spaceCombat: { hit: 7 },
      bombardment: { hit: 8 },
    },
    {
      name: "Shattered Sky II",
      unit: "cruiser",
      nsidName: "shattered-sky-2",
      spaceCombat: { hit: 6 },
      bombardment: { hit: 6 },
    },
    {
      name: "Raider I",
      unit: "cruiser",
      nsidName: "raider-1",
      spaceCombat: { hit: 7 },
    },
    {
      name: "Raider II",
      unit: "cruiser",
      nsidName: "raider-2",
      spaceCombat: { hit: 6 },
    },

    //Dreadnought
    {
      name: "Lancer Dreadnought I",
      unit: "dreadnought",
      nsidName: "lancer-dreadnought-1",
      spaceCombat: { hit: 5 },
      bombardment: { hit: 5 },
      spaceCannon: { hit: 8 },
    },
    {
      name: "Lancer Dreadnought II",
      unit: "dreadnought",
      nsidName: "lancer-dreadnought-2",
      spaceCombat: { hit: 5 },
      bombardment: { hit: 5 },
      spaceCannon: { hit: 5 },
    },
    {
      name: "Aegis I",
      unit: "dreadnought",
      nsidName: "aegis-1",
      spaceCombat: { hit: 5 },
      bombardment: { hit: 5 },
    },
    {
      name: "Aegis II",
      unit: "dreadnought",
      nsidName: "aegis-2",
      spaceCombat: { hit: 4 },
      bombardment: { hit: 5 },
    },
    {
      name: "Chitin Hulk I",
      unit: "dreadnought",
      nsidName: "chitin-hulk-1",
      spaceCombat: { hit: 5 },
      bombardment: { hit: 5 },
    },
    {
      name: "Chitin Hulk II",
      unit: "dreadnought",
      nsidName: "chitin-hulk-2",
      spaceCombat: { hit: 5 },
      bombardment: { hit: 5 },
    },
    {
      name: "Tribune",
      unit: "dreadnought",
      nsidName: "tribune",
      spaceCombat: { hit: 5 },
      bombardment: { hit: 5 },
    },

    //PDS
    {
      name: "Orion Platform I",
      unit: "pds",
      nsidName: "orion-platform-1",
      spaceCannon: { hit: 6 },
    },
    {
      name: "Orion Platform II",
      unit: "pds",
      nsidName: "orion-platform-2",
      spaceCannon: { hit: 5, range: 1 },
    },
    {
      name: "Gauss Cannon I",
      unit: "pds",
      nsidName: "gauss-cannon-1",
      spaceCannon: { hit: 6 },
      bombardment: { hit: 6 },
    },
    {
      name: "Gauss Cannon II",
      unit: "pds",
      nsidName: "gauss-cannon-2",
      spaceCannon: { hit: 4, range: 1 },
      bombardment: { hit: 4 },
    },

    //Carrier
    {
      name: "Star Dragon I",
      unit: "carrier",
      nsidName: "star-dragon-1",
      spaceCombat: { hit: 8 },
    },
    {
      name: "Star Dragon II",
      unit: "carrier",
      nsidName: "star-dragon-2",
      spaceCombat: { hit: 7 },
    },

    //Figher
    {
      name: "Eye of the Creator",
      unit: "fighter",
      nsidName: "eye-of-the-creator",
      spaceCombat: { hit: 8 },
    },
    {
      name: "Heavy Bomber I",
      unit: "fighter",
      nsidName: "heavy-bomber-1",
      spaceCombat: { hit: 9 },
      bombardment: { hit: 9 },
    },
    {
      name: "Heavy Bomber II",
      unit: "fighter",
      nsidName: "heavy-bomber-2",
      spaceCombat: { hit: 8 },
      bombardment: { hit: 8 },
    },
    {
      name: "Corsair I",
      unit: "fighter",
      nsidName: "corsair-1",
      spaceCombat: { hit: 9 },
      antiFighterBarrage: { hit: 9 },
    },
    {
      name: "Corsair II",
      unit: "fighter",
      nsidName: "corsair-2",
      spaceCombat: { hit: 8 },
      bombardment: { hit: 8 },
    },

    //Infantry
    {
      name: "Unholy Abomination I",
      unit: "infantry",
      nsidName: "unholy-abomination-1",
      groundCombat: { hit: 5 },
    },
    {
      name: "Unholy Abomination II",
      unit: "infantry",
      nsidName: "unholy-abomination-2",
      groundCombat: { hit: 4 },
    },
    {
      name: "Impactor I",
      unit: "infantry",
      nsidName: "impactor-1",
      bombardment: { hit: 9 },
    },
    {
      name: "Impactor II",
      unit: "infantry",
      nsidName: "impactor-2",
      groundCombat: { hit: 7 },
      bombardment: { hit: 8 },
    },

    //Space dock
    {
      name: "Trade Port I",
      unit: "space-dock",
      nsidName: "trade-port-1",
      antiFighterBarrage: { dice: 2, hit: 6},
    },
    {
      name: "Trade Port II",
      unit: "space-dock",
      nsidName: "trade-port-2",
      antiFighterBarrage: { dice: 2, hit: 6},
    },
  ]
};