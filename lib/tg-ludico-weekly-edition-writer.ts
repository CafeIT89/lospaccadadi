import "server-only";

import OpenAI from "openai";

import type {
  TgLudicoItem,
  TgLudicoWeeklyArticle,
} from "@/lib/tg-ludico-types";

type GeneratedArticle = {
  originalUrl: string;
  title: string;
  subtitle: string;
  summary: string;
  article: string;
  keyPoints: string[];
};

type GeneratedEditionResponse = {
  articles: GeneratedArticle[];
};

const RESPONSE_FORMAT = {
  type: "json_schema" as const,
  json_schema: {
    name: "tg_ludico_weekly_edition",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        articles: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              originalUrl: {
                type: "string",
              },
              title: {
                type: "string",
              },
              subtitle: {
                type: "string",
              },
              summary: {
                type: "string",
              },
              article: {
                type: "string",
              },
              keyPoints: {
                type: "array",
                minItems: 3,
                maxItems: 5,
                items: {
                  type: "string",
                },
              },
            },
            required: [
              "originalUrl",
              "title",
              "subtitle",
              "summary",
              "article",
              "keyPoints",
            ],
          },
        },
      },
      required: ["articles"],
    },
  },
};

function cleanText(
  value: string,
  maxLength: number
): string {
  return value
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function createFallbackArticle(
  source: TgLudicoItem
): TgLudicoWeeklyArticle {
  return {
    title: source.title,
    subtitle: "",
    summary: source.description,
    article: "",
    keyPoints: [],
    category: source.category,
    source: source.source,
    originalUrl: source.link,
    originalTitle: source.title,
    image: source.image,
    publishedAt: source.date,
  };
}

function parseGeneratedArticle(
  value: unknown
): GeneratedArticle | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate =
    value as Record<string, unknown>;

  if (
    typeof candidate.originalUrl !== "string" ||
    typeof candidate.title !== "string" ||
    typeof candidate.subtitle !== "string" ||
    typeof candidate.summary !== "string" ||
    typeof candidate.article !== "string" ||
    !Array.isArray(candidate.keyPoints)
  ) {
    return null;
  }

  const originalUrl =
    candidate.originalUrl.trim();

  const title = cleanText(
    candidate.title,
    220
  );

  const subtitle = cleanText(
    candidate.subtitle,
    400
  );

  const summary = cleanText(
    candidate.summary,
    1_000
  );

  const article =
    candidate.article.trim().slice(0, 12_000);

  const keyPoints = candidate.keyPoints
    .filter(
      (point): point is string =>
        typeof point === "string"
    )
    .map((point) =>
      cleanText(point, 300)
    )
    .filter(Boolean)
    .slice(0, 5);

  if (
    !originalUrl ||
    !title ||
    !subtitle ||
    !summary ||
    !article ||
    keyPoints.length < 3
  ) {
    return null;
  }

  return {
    originalUrl,
    title,
    subtitle,
    summary,
    article,
    keyPoints,
  };
}

function parseGeneratedEdition(
  value: unknown
): GeneratedEditionResponse | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate =
    value as Record<string, unknown>;

  if (!Array.isArray(candidate.articles)) {
    return null;
  }

  const articles = candidate.articles
    .map(parseGeneratedArticle)
    .filter(
      (
        article
      ): article is GeneratedArticle =>
        article !== null
    );

  if (articles.length === 0) {
    return null;
  }

  return {
    articles,
  };
}

function buildPromptArticles(
  sources: TgLudicoItem[]
): Array<{
  originalUrl: string;
  originalTitle: string;
  source: string;
  category: string;
  publishedAt: string;
  description: string;
  sourceText: string;
}> {
  return sources.map((source) => ({
    originalUrl: source.link,
    originalTitle: source.title,
    source: source.source,
    category: source.category,
    publishedAt: source.date,
    description: source.description,
    sourceText:
      source.sourceText
        ?.trim()
        .slice(0, 5_000) ||
      source.description
        .trim()
        .slice(0, 5_000),
  }));
}

function buildSystemPrompt(
  expectedCount: number
): string {
  return [
    "Sei il redattore di un magazine italiano dedicato ai giochi da tavolo.",
    "Devi scrivere articoli giornalistici originali usando esclusivamente le informazioni fornite.",
    "Non tradurre letteralmente i testi sorgente.",
    "Non inventare fatti, dichiarazioni, prezzi, date, caratteristiche, nomi o dettagli.",
    "Mantieni invariati i nomi ufficiali di giochi, aziende, persone, prodotti ed eventi.",
    "Usa un tono giornalistico neutrale, chiaro e professionale.",
    "Ogni articolo deve essere autonomo e comprensibile senza consultare la fonte.",
    "Non ripetere continuamente le stesse formule tra un articolo e l'altro.",
    "Non aggiungere opinioni personali o giudizi non presenti nelle fonti.",
    `Devi produrre esattamente ${expectedCount} articoli, uno per ciascuna notizia ricevuta.`,
    "Non saltare nessuna notizia.",
    "Mantieni in ogni articolo esattamente lo stesso originalUrl ricevuto nell'input.",
    "title deve essere un titolo editoriale completo.",
    "subtitle deve aggiungere contesto senza ripetere il titolo.",
    "summary deve essere un breve riassunto editoriale.",
    "article deve essere il testo completo dell'articolo, composto da più paragrafi.",
    "Ogni articolo deve terminare con una frase completa.",
    "keyPoints deve contenere da 3 a 5 punti.",
  ].join(" ");
}

async function requestGeneratedArticles(
  openai: OpenAI,
  sources: TgLudicoItem[],
  requestLabel: string
): Promise<GeneratedArticle[]> {
  if (sources.length === 0) {
    return [];
  }

  console.log(
    `[TG Ludico Weekly] ${requestLabel}: invio di ${sources.length} notizie a OpenAI...`
  );

  const response =
    await openai.chat.completions.create({
      model: "gpt-5-mini",

      messages: [
        {
          role: "system",
          content: buildSystemPrompt(
            sources.length
          ),
        },
        {
          role: "user",
          content: JSON.stringify({
            articles:
              buildPromptArticles(sources),
          }),
        },
      ],

      response_format: RESPONSE_FORMAT,

      max_completion_tokens: 20_000,
    });

  const choice = response.choices[0];

  if (!choice) {
    throw new Error(
      "OpenAI non ha restituito alcuna scelta."
    );
  }

  if (
    choice.finish_reason &&
    choice.finish_reason !== "stop"
  ) {
    console.warn(
      `[TG Ludico Weekly] ${requestLabel}: finish_reason=${choice.finish_reason}`
    );
  }

  const content =
    choice.message?.content;

  if (!content) {
    throw new Error(
      "OpenAI non ha restituito alcun contenuto."
    );
  }

  const parsedValue: unknown =
    JSON.parse(content);

  const generatedEdition =
    parseGeneratedEdition(parsedValue);

  if (!generatedEdition) {
    console.error(
      `[TG Ludico Weekly] ${requestLabel}: risposta JSON non valida.`
    );

    console.dir(parsedValue, {
      depth: null,
    });

    throw new Error(
      "La risposta OpenAI non rispetta il formato richiesto."
    );
  }

  return generatedEdition.articles;
}

function mergeGeneratedArticles(
  target: Map<string, GeneratedArticle>,
  articles: GeneratedArticle[],
  allowedUrls: Set<string>
): void {
  for (const article of articles) {
    if (!allowedUrls.has(article.originalUrl)) {
      console.warn(
        `[TG Ludico Weekly] originalUrl inatteso ignorato: ${article.originalUrl}`
      );

      continue;
    }

    target.set(
      article.originalUrl,
      article
    );
  }
}

/**
 * Genera tutti gli articoli dell'edizione settimanale.
 *
 * Prima prova a generarli in una sola richiesta.
 * Se alcuni articoli mancano o non sono validi,
 * effettua una seconda richiesta soltanto per quelli mancanti.
 */
export async function writeWeeklyEditionArticles(
  sources: TgLudicoItem[]
): Promise<TgLudicoWeeklyArticle[]> {
  if (sources.length === 0) {
    return [];
  }

  const apiKey =
    process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn(
      "[TG Ludico Weekly] OPENAI_API_KEY non configurata. Uso del fallback."
    );

    return sources.map(
      createFallbackArticle
    );
  }

  const validSources = sources.filter(
    (source) => {
      const sourceText =
        source.sourceText?.trim() ||
        source.description.trim();

      return Boolean(
        source.link && sourceText
      );
    }
  );

  if (validSources.length === 0) {
    console.warn(
      "[TG Ludico Weekly] Nessuna fonte contiene testo sufficiente."
    );

    return sources.map(
      createFallbackArticle
    );
  }

  const openai = new OpenAI({
    apiKey,
  });

  const allowedUrls = new Set(
    validSources.map(
      (source) => source.link
    )
  );

  const generatedByUrl =
    new Map<
      string,
      GeneratedArticle
    >();

  try {
    const firstAttempt =
      await requestGeneratedArticles(
        openai,
        validSources,
        "Prima generazione"
      );

    mergeGeneratedArticles(
      generatedByUrl,
      firstAttempt,
      allowedUrls
    );

    const missingAfterFirstAttempt =
      validSources.filter(
        (source) =>
          !generatedByUrl.has(
            source.link
          )
      );

    if (
      missingAfterFirstAttempt.length > 0
    ) {
      console.warn(
        `[TG Ludico Weekly] Prima generazione incompleta: ${generatedByUrl.size}/${validSources.length}.`
      );

      console.log(
        `[TG Ludico Weekly] Secondo tentativo per ${missingAfterFirstAttempt.length} articoli mancanti...`
      );

      const retryArticles =
        await requestGeneratedArticles(
          openai,
          missingAfterFirstAttempt,
          "Recupero articoli mancanti"
        );

      mergeGeneratedArticles(
        generatedByUrl,
        retryArticles,
        allowedUrls
      );
    }
  } catch (error) {
    console.error(
      "[TG Ludico Weekly] Errore durante la generazione dell'edizione."
    );

    console.error(error);
  }

  const finalArticles = sources.map(
    (source) => {
      const generated =
        generatedByUrl.get(
          source.link
        );

      if (!generated) {
        console.warn(
          `[TG Ludico Weekly] Articolo non generato dopo due tentativi, uso del fallback: ${source.title}`
        );

        return createFallbackArticle(
          source
        );
      }

      return {
        title: generated.title,
        subtitle: generated.subtitle,
        summary: generated.summary,
        article: generated.article,
        keyPoints: generated.keyPoints,
        category: source.category,
        source: source.source,
        originalUrl: source.link,
        originalTitle: source.title,
        image: source.image,
        publishedAt: source.date,
      };
    }
  );

  const generatedCount =
    finalArticles.filter(
      (article) =>
        article.article.length > 0
    ).length;

  console.log(
    `[TG Ludico Weekly] Generazione completata: ${generatedCount}/${sources.length} articoli disponibili.`
  );

  if (
    generatedCount < sources.length
  ) {
    console.warn(
      `[TG Ludico Weekly] Edizione incompleta: ${sources.length - generatedCount} articoli sono ancora in fallback.`
    );
  }

  return finalArticles;
}