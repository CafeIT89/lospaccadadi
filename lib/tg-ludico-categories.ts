export type TgLudicoCategory =
  | "Crowdfunding"
  | "Espansione"
  | "Designer Diary"
  | "Premi"
  | "Eventi"
  | "Industria"
  | "Nuovo gioco"
  | "Approfondimento";

type ClassificationPattern = {
  phrase: string;
  score: number;
};

export type TgLudicoCategoryConfig = {
  label: TgLudicoCategory;
  weight: number;
  titlePatterns: readonly ClassificationPattern[];
  contentPatterns: readonly ClassificationPattern[];
};

export const TG_LUDICO_CATEGORY_CONFIG = {
  Crowdfunding: {
    label: "Crowdfunding",
    weight: 10,

    titlePatterns: [
      { phrase: "kickstarter", score: 6 },
      { phrase: "gamefound", score: 6 },
      { phrase: "backerkit", score: 6 },
      { phrase: "crowdfunding", score: 6 },
      { phrase: "crowdfund", score: 6 },
      { phrase: "now live on kickstarter", score: 8 },
      { phrase: "now live on gamefound", score: 8 },
      { phrase: "coming to kickstarter", score: 7 },
      { phrase: "coming to gamefound", score: 7 },
      { phrase: "launching on kickstarter", score: 7 },
      { phrase: "launching on gamefound", score: 7 },
      { phrase: "funding campaign", score: 6 },
      { phrase: "crowdfunding campaign", score: 7 },
      { phrase: "kickstarter campaign", score: 7 },
      { phrase: "gamefound campaign", score: 7 },
      { phrase: "stretch goals", score: 5 },
    ],

    contentPatterns: [
      { phrase: "kickstarter", score: 3 },
      { phrase: "gamefound", score: 3 },
      { phrase: "backerkit", score: 3 },
      { phrase: "crowdfunding", score: 3 },
      { phrase: "crowdfund", score: 3 },
      { phrase: "kickstarter campaign", score: 4 },
      { phrase: "gamefound campaign", score: 4 },
      { phrase: "crowdfunding campaign", score: 4 },
      { phrase: "now live on kickstarter", score: 5 },
      { phrase: "now live on gamefound", score: 5 },
      { phrase: "stretch goals", score: 3 },
      { phrase: "pledge level", score: 3 },
      { phrase: "funding goal", score: 3 },
    ],
  },

  Espansione: {
    label: "Espansione",
    weight: 5,

    titlePatterns: [
      { phrase: "new expansion", score: 7 },
      { phrase: "upcoming expansion", score: 7 },
      { phrase: "expansion announced", score: 7 },
      { phrase: "announces expansion", score: 7 },
      { phrase: "reveals expansion", score: 7 },
      { phrase: "expansion preview", score: 6 },
      { phrase: "expansion review", score: 5 },
      { phrase: "expansion", score: 4 },
      { phrase: "add-on", score: 4 },
      { phrase: "addon", score: 4 },
    ],

    contentPatterns: [
      { phrase: "new expansion", score: 4 },
      { phrase: "upcoming expansion", score: 4 },
      { phrase: "expansion announced", score: 4 },
      { phrase: "announces expansion", score: 4 },
      { phrase: "reveals expansion", score: 4 },
      { phrase: "expansion", score: 2 },
      { phrase: "add-on", score: 2 },
      { phrase: "addon", score: 2 },
    ],
  },

  "Designer Diary": {
    label: "Designer Diary",
    weight: 4,

    titlePatterns: [
      { phrase: "designer diary", score: 10 },
      { phrase: "design diary", score: 10 },
      { phrase: "designer's diary", score: 10 },
      { phrase: "development diary", score: 9 },
      { phrase: "behind the design", score: 8 },
      { phrase: "designing ", score: 5 },
    ],

    contentPatterns: [
      { phrase: "designer diary", score: 6 },
      { phrase: "design diary", score: 6 },
      { phrase: "designer's diary", score: 6 },
      { phrase: "development diary", score: 5 },
      { phrase: "behind the design", score: 5 },
    ],
  },

  Premi: {
    label: "Premi",
    weight: 6,

    titlePatterns: [
      { phrase: "spiel des jahres", score: 9 },
      { phrase: "kennerspiel des jahres", score: 9 },
      { phrase: "kinderspiel des jahres", score: 9 },
      { phrase: "golden geek", score: 9 },
      { phrase: "award winners", score: 7 },
      { phrase: "award winner", score: 7 },
      { phrase: "award nominees", score: 7 },
      { phrase: "award nominee", score: 7 },
      { phrase: "award nominations", score: 7 },
      { phrase: "wins award", score: 7 },
      { phrase: "wins the award", score: 7 },
    ],

    contentPatterns: [
      { phrase: "spiel des jahres", score: 6 },
      { phrase: "kennerspiel des jahres", score: 6 },
      { phrase: "kinderspiel des jahres", score: 6 },
      { phrase: "golden geek", score: 6 },
      { phrase: "award winner", score: 4 },
      { phrase: "award nominee", score: 4 },
      { phrase: "award nominations", score: 4 },
    ],
  },

  Eventi: {
    label: "Eventi",
    weight: 7,

    titlePatterns: [
      { phrase: "gen con", score: 9 },
      { phrase: "spiel essen", score: 9 },
      { phrase: "essen spiel", score: 9 },
      { phrase: "uk games expo", score: 9 },
      { phrase: "pax unplugged", score: 9 },
      { phrase: "origins game fair", score: 9 },
      { phrase: "game convention", score: 7 },
      { phrase: "gaming convention", score: 7 },
      { phrase: "board game convention", score: 8 },
      { phrase: "trade show", score: 6 },
      { phrase: "game fair", score: 6 },
    ],

    contentPatterns: [
      { phrase: "gen con", score: 5 },
      { phrase: "spiel essen", score: 5 },
      { phrase: "essen spiel", score: 5 },
      { phrase: "uk games expo", score: 5 },
      { phrase: "pax unplugged", score: 5 },
      { phrase: "origins game fair", score: 5 },
      { phrase: "board game convention", score: 4 },
      { phrase: "gaming convention", score: 4 },
      { phrase: "trade show", score: 3 },
      { phrase: "game fair", score: 3 },
    ],
  },

  Industria: {
    label: "Industria",
    weight: 8,

    titlePatterns: [
      { phrase: "publisher", score: 5 },
      { phrase: "publishing", score: 5 },
      { phrase: "publishing company", score: 7 },
      { phrase: "publishing studio", score: 7 },
      { phrase: "distribution deal", score: 7 },
      { phrase: "distribution agreement", score: 7 },
      { phrase: "acquisition", score: 8 },
      { phrase: "acquires", score: 8 },
      { phrase: "acquired", score: 8 },
      { phrase: "merger", score: 8 },
      { phrase: "partnership", score: 6 },
      { phrase: "licensing deal", score: 7 },
      { phrase: "license agreement", score: 7 },
      { phrase: "release bottleneck", score: 7 },
      { phrase: "launches platform", score: 8 },
      { phrase: "new platform", score: 6 },
      { phrase: "layoffs", score: 8 },
      { phrase: "revenue", score: 6 },
      { phrase: "sales figures", score: 6 },
      { phrase: "appoints ceo", score: 8 },
      { phrase: "new ceo", score: 8 },
    ],

    contentPatterns: [
      { phrase: "publisher", score: 3 },
      { phrase: "publishing company", score: 4 },
      { phrase: "publishing studio", score: 4 },
      { phrase: "distribution deal", score: 5 },
      { phrase: "distribution agreement", score: 5 },
      { phrase: "acquisition", score: 5 },
      { phrase: "acquires", score: 5 },
      { phrase: "acquired", score: 5 },
      { phrase: "merger", score: 5 },
      { phrase: "partnership", score: 3 },
      { phrase: "licensing deal", score: 4 },
      { phrase: "license agreement", score: 4 },
      { phrase: "release bottleneck", score: 5 },
      { phrase: "launches platform", score: 5 },
      { phrase: "new platform", score: 4 },
      { phrase: "layoffs", score: 5 },
      { phrase: "revenue", score: 3 },
      { phrase: "sales figures", score: 3 },
      { phrase: "new ceo", score: 5 },
    ],
  },

  "Nuovo gioco": {
    label: "Nuovo gioco",
    weight: 9,

    titlePatterns: [
      { phrase: "new board game", score: 8 },
      { phrase: "new tabletop game", score: 8 },
      { phrase: "new game announced", score: 8 },
      { phrase: "announces new game", score: 8 },
      { phrase: "announces a new game", score: 8 },
      { phrase: "reveals new game", score: 8 },
      { phrase: "reveals a new game", score: 8 },
      { phrase: "unveils new game", score: 8 },
      { phrase: "unveils a new game", score: 8 },
      { phrase: "new title announced", score: 7 },
      { phrase: "announces new title", score: 7 },
      { phrase: "first look at", score: 6 },
      { phrase: "coming to retail", score: 6 },
      { phrase: "retail release announced", score: 6 },
      { phrase: "set for release", score: 5 },
      { phrase: "will be released", score: 5 },
      { phrase: "debut board game", score: 7 },
    ],

    contentPatterns: [
      { phrase: "new board game", score: 5 },
      { phrase: "new tabletop game", score: 5 },
      { phrase: "new game announced", score: 5 },
      { phrase: "announces new game", score: 5 },
      { phrase: "announces a new game", score: 5 },
      { phrase: "reveals new game", score: 5 },
      { phrase: "reveals a new game", score: 5 },
      { phrase: "unveils new game", score: 5 },
      { phrase: "unveils a new game", score: 5 },
      { phrase: "new title announced", score: 4 },
      { phrase: "announces new title", score: 4 },
      { phrase: "coming to retail", score: 4 },
      { phrase: "retail release announced", score: 4 },
      { phrase: "set for release", score: 3 },
      { phrase: "will be released", score: 3 },
    ],
  },

  Approfondimento: {
    label: "Approfondimento",
    weight: 1,
    titlePatterns: [],
    contentPatterns: [],
  },
} as const satisfies Record<
  TgLudicoCategory,
  TgLudicoCategoryConfig
>;

const CLASSIFIABLE_CATEGORIES = [
  "Designer Diary",
  "Premi",
  "Eventi",
  "Crowdfunding",
  "Espansione",
  "Industria",
  "Nuovo gioco",
] as const satisfies readonly TgLudicoCategory[];

const MINIMUM_TITLE_SCORE = 6;
const MINIMUM_COMBINED_SCORE = 6;

type ClassifiableCategory =
  (typeof CLASSIFIABLE_CATEGORIES)[number];

type ClassificationResult = {
  category: ClassifiableCategory;
  score: number;
};

function getPatternScore(
  text: string,
  patterns: readonly ClassificationPattern[]
) {
  return patterns.reduce((totalScore, pattern) => {
    if (!text.includes(pattern.phrase)) {
      return totalScore;
    }

    return totalScore + pattern.score;
  }, 0);
}

function findHighestScoringCategory(
  getScore: (category: ClassifiableCategory) => number
): ClassificationResult {
  let selectedCategory: ClassifiableCategory =
    CLASSIFIABLE_CATEGORIES[0];

  let highestScore = 0;

  for (const category of CLASSIFIABLE_CATEGORIES) {
    const score = getScore(category);

    if (score > highestScore) {
      selectedCategory = category;
      highestScore = score;
    }
  }

  return {
    category: selectedCategory,
    score: highestScore,
  };
}

export function getTgLudicoCategory(
  title: string,
  description: string
): TgLudicoCategory {
  const normalizedTitle = title.toLowerCase();
  const normalizedDescription = description.toLowerCase();

  /*
   * Prima fase:
   * il titolo viene valutato da solo.
   *
   * Se contiene indizi sufficientemente forti, la descrizione
   * non può alterare la categoria principale dell'articolo.
   */
  const titleResult = findHighestScoringCategory((category) => {
    const config = TG_LUDICO_CATEGORY_CONFIG[category];

    return getPatternScore(
      normalizedTitle,
      config.titlePatterns
    );
  });

  if (titleResult.score >= MINIMUM_TITLE_SCORE) {
    return titleResult.category;
  }

  /*
   * Seconda fase:
   * la descrizione viene usata soltanto quando il titolo
   * non contiene indizi sufficienti.
   *
   * Il punteggio debole eventualmente presente nel titolo
   * viene sommato al punteggio della descrizione.
   */
  const combinedResult = findHighestScoringCategory(
    (category) => {
      const config = TG_LUDICO_CATEGORY_CONFIG[category];

      const titleScore = getPatternScore(
        normalizedTitle,
        config.titlePatterns
      );

      const descriptionScore = getPatternScore(
        normalizedDescription,
        config.contentPatterns
      );

      return titleScore + descriptionScore;
    }
  );

  if (combinedResult.score < MINIMUM_COMBINED_SCORE) {
    return "Approfondimento";
  }

  return combinedResult.category;
}

export function getTgLudicoCategoryWeight(
  category: TgLudicoCategory
) {
  return TG_LUDICO_CATEGORY_CONFIG[category].weight;
}