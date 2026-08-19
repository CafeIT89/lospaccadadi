export type Stampa3DProject = {
  title: string;
  description: string;
  url: string;
  platform: string;
  category: string;
};

export type Stampa3DGame = {
  name: string;
  slug: string;
  coverImage: string;
  projects: Stampa3DProject[];
};

export const STAMPE_3D_GAMES: Stampa3DGame[] = [
{
  name: "Grimcoven",
  slug: "grimcoven",
  coverImage: "/images/stampe-3d/games/grimcoven.png",

  projects: [
    {
      title: "Inserto Completo",
      description:
        "Inserto completo per organizzare i componenti di Grimcoven all'interno della scatola.",
      url:
        "https://makerworld.com/it/models/2070250-grimcoven-insert-all-in#profileId-2235986",
      platform: "MakerWorld",
      category: "Inserto",
    },
    {
      title: "Lanterna Primo Giocatore",
      description:
        "Lanterna 3D utilizzabile come segnalino del primo giocatore durante le partite.",
      url:
        "https://makerworld.com/it/models/3015876-camping-lantern#profileId-3387749",
      platform: "MakerWorld",
      category: "Accessorio",
    },
    {
      title: "Ali Duality",
      description:
        "Ali tridimensionali utilizzabili per rappresentare Duality sul tavolo da gioco.",
      url:
        "https://makerworld.com/it/models/2610926-seraphim-wings#profileId-2881259",
      platform: "MakerWorld",
      category: "Upgrade",
    },
    {
      title: "Scrigni Tesoro",
      description:
        "Scrigni tridimensionali utilizzabili come elementi scenici durante le partite.",
      url:
        "https://makerworld.com/it/models/962684-treasure-chest-table-top-game-miniature-diorama#profileId-932889",
      platform: "MakerWorld",
      category: "Terreno",
    },
    {
      title: "Tornado",
      description:
        "Elemento scenico tridimensionale a forma di tornado per arricchire il campo di gioco.",
      url:
        "https://makerworld.com/it/models/2064264-tornado-vortex-dnd-scenery-terrain#profileId-2229040",
      platform: "MakerWorld",
      category: "Terreno",
    },
    {
      title: "Catasta Teschi",
      description:
        "Catasta di teschi tridimensionale utilizzabile come elemento scenico sul tavolo.",
      url:
        "https://makerworld.com/it/models/1282786-pile-of-skulls-diorama-decor-wargame-terrain#profileId-1681196",
      platform: "MakerWorld",
      category: "Terreno",
    },
    {
      title: "Bare",
      description:
        "Set di bare tridimensionali utilizzabili come elementi scenici durante le partite.",
      url:
        "https://makerworld.com/it/models/1000395-4-spooky-vampire-coffin-minis#profileId-977711",
      platform: "MakerWorld",
      category: "Terreno",
    },
    {
      title: "Set Terreno",
      description:
        "Set di elementi scenici realizzato specificamente per Grimcoven.",
      url:
        "https://makerworld.com/it/models/2671853-grimcoven-terrain-pieces#profileId-2957368",
      platform: "MakerWorld",
      category: "Terreno",
    },
    {
      title: "Gettone Tattica Rialzato",
      description:
        "Versione tridimensionale rialzata del gettone Tattica di Grimcoven.",
      url:
        "https://makerworld.com/it/models/3152147-raised-tactic-token-grimcoven#profileId-3560810",
      platform: "MakerWorld",
      category: "Token",
    },
  ],
},
{
  name: "Cloudspire",
  slug: "cloudspire",
  coverImage: "/images/stampe-3d/games/cloudspire.png",

  projects: [
    {
      title: "Indicatori Salute e Risorse",
      description:
        "Indicatori rotanti per tenere traccia della salute e delle risorse durante le partite a Cloudspire.",
      url:
        "https://makerworld.com/it/models/2166641-cloudspire-health-and-source-counter-dials?from=search#profileId-2349374",
      platform: "MakerWorld",
      category: "Accessorio",
    },
  ],
},

{
  name: "Thunder Road Vendetta",
  slug: "thunder-road-vendetta",
  coverImage: "/images/stampe-3d/games/thunder-road-vendetta.png",

  projects: [
    {
      title: "Inserto",
      description:
        "Set di vassoi per organizzare i componenti del gioco base di Thunder Road: Vendetta.",
      url:
        "https://makerworld.com/it/models/2213404-thunder-road-vendetta-base-game-trays#profileId-2406278",
      platform: "MakerWorld",
      category: "Inserto",
    },
    {
      title: "Ostacoli Montagne",
      description:
        "Elementi tridimensionali da utilizzare come ostacoli e pericoli sul percorso di Thunder Road: Vendetta.",
      url:
        "https://makerworld.com/it/models/2435795-thunder-road-vendetta-hazzards#profileId-2672378",
      platform: "MakerWorld",
      category: "Terreno",
    },
  ],
},

{
  name: "Mage Knight",
  slug: "mage-knight",
  coverImage: "/images/stampe-3d/games/mage-knight.png",

  projects: [
    {
      title: "Inserto Ultimate per Scatola Originale",
      description:
        "Inserto pensato per organizzare i contenuti di Mage Knight Ultimate Edition utilizzando la scatola originale.",
      url:
        "https://makerworld.com/it/models/499314-ultimate-mage-knight-insert-in-the-original-box?from=search#profileId-414002",
      platform: "MakerWorld",
      category: "Inserto",
    },
    {
      title: "Inserto Scatola Ultimate",
      description:
        "Inserto per Mage Knight Ultimate Edition, progettato per organizzare il gioco nella scatola della Ultimate Edition.",
      url:
        "https://makerworld.com/it/models/1208182-mage-knight-ultimate-edition-mkue-sleeved?from=search#profileId-1222441",
      platform: "MakerWorld",
      category: "Inserto",
    },
  ],
},

{
  name: "Too Many Bones",
  slug: "too-many-bones",
  coverImage: "/images/stampe-3d/games/too-many-bones.png",

  projects: [
    {
      title: "Contatore Giorni",
      description:
        "Contatore magnetico per tenere traccia dei giorni durante le avventure di Too Many Bones.",
      url:
        "https://makerworld.com/it/models/1844666-too-many-bones-magnetic-day-counter-tracker?from=search",
      platform: "MakerWorld",
      category: "Accessorio",
    },
  ],
},

{
  name: "Eldritch Horror",
  slug: "eldritch-horror",
  coverImage: "/images/stampe-3d/games/eldritch-horror.png",

  projects: [
    {
      title: "Inserto Gioco Base + Leggende Perdute",
      description:
        "Inserto per organizzare Eldritch Horror insieme all'espansione Leggende Perdute.",
      url:
        "https://makerworld.com/it/models/724395-insert-for-eldritch-horror-forsaken-lore-remix?from=search#profileId-655506",
      platform: "MakerWorld",
      category: "Inserto",
    },
  ],
},
{
  name: "Marvel Zombies",
  slug: "marvel-zombies",
  coverImage: "/images/stampe-3d/games/marvel-zombies.png",

  projects: [
    {
      title: "Inserto Token",
      description:
        "Inserto dedicato all'organizzazione dei token di Marvel Zombies.",
      url:
        "https://makerworld.com/it/models/213023-marvel-zombicide-insert#profileId-838675",
      platform: "MakerWorld",
      category: "Inserto",
    },
    {
      title: "Tutte le miniature in una scatola",
      description:
        "Soluzione per conservare tutte le miniature di Marvel Zombies in un'unica scatola.",
      url:
        "https://makerworld.com/it/models/1296660-marvel-zombies-all-minis-one-box-solution#profileId-1328200",
      platform: "MakerWorld",
      category: "Organizer",
    },
    {
      title: "Casse obiettivo",
      description:
        "Casse tridimensionali utilizzabili come obiettivi durante le partite.",
      url:
        "https://makerworld.com/it/models/2362550-marvel-zombies-objective-crates#profileId-2585094",
      platform: "MakerWorld",
      category: "Terreno",
    },
    {
      title: "Contenitore 3D per casse",
      description:
        "Contenitore stampabile per conservare le casse obiettivo.",
      url:
        "https://makerworld.com/it/models/2766490-marvel-zombies-3d-crate-storage#profileId-3072151",
      platform: "MakerWorld",
      category: "Organizer",
    },
    {
      title: "7 Porte per Zombicide",
      description:
        "Set di sette porte stampabili compatibili con Marvel Zombies e Zombicide.",
      url:
        "https://makerworld.com/it/models/1884078-7-doors-for-zombicide-print-in-place#profileId-2017688",
      platform: "MakerWorld",
      category: "Terreno",
    },
    {
      title: "Organizer Marvel Zombies",
      description:
        "Organizer per riporre miniature e componenti di Marvel Zombies.",
      url:
        "https://makerworld.com/it/models/1417278-rangement-figurines-marvel-zombies#profileId-1472013",
      platform: "MakerWorld",
      category: "Organizer",
    },
    {
      title: "Organizer X-Men Resistance",
      description:
        "Organizer dedicato all'espansione Marvel Zombies: X-Men Resistance.",
      url:
        "https://makerworld.com/it/models/1443808-rangement-zombicide-marvel-zombies-xmen-resistance#profileId-1503179",
      platform: "MakerWorld",
      category: "Organizer",
    },
    {
      title: "Ascensore",
      description:
        "Token ascensore tridimensionale per Marvel Zombies e X-Men Resistance.",
      url:
        "https://makerworld.com/it/models/1831906-elevator-token-marvel-zombies-x-men-resistance#profileId-1956314",
      platform: "MakerWorld",
      category: "Accessorio",
    },
  ],
},
];

/**
 * Restituisce tutti i giochi ordinati alfabeticamente.
 */
export function getStampe3DGames(): Stampa3DGame[] {
  return [...STAMPE_3D_GAMES].sort((a, b) =>
    a.name.localeCompare(b.name, "it")
  );
}

/**
 * Restituisce un singolo gioco tramite slug.
 */
export function getStampe3DGame(
  slug: string
): Stampa3DGame | undefined {
  return STAMPE_3D_GAMES.find(
    (game) => game.slug === slug
  );
}

/**
 * Restituisce la lettera alfabetica di un gioco.
 */
export function getGameLetter(game: Stampa3DGame): string {
  return game.name.charAt(0).toUpperCase();
}

/**
 * Restituisce tutti i giochi appartenenti a una lettera.
 */
export function getGamesByLetter(
  letter: string
): Stampa3DGame[] {
  const normalizedLetter = letter.toUpperCase();

  return getStampe3DGames().filter(
    (game) => getGameLetter(game) === normalizedLetter
  );
}

/**
 * Restituisce le lettere che contengono almeno un gioco.
 */
export function getAvailableLetters(): string[] {
  return Array.from(
    new Set(
      STAMPE_3D_GAMES.map((game) => getGameLetter(game))
    )
  ).sort();
}
