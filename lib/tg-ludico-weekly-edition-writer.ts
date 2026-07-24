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

function cleanText(value: string, maxLength: number): string {
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

  const candidate = value as Record<string, unknown>;

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

  const originalUrl = candidate.originalUrl.trim();

  const title = cleanText(candidate.title, 220);
  const subtitle = cleanText(candidate.subtitle, 400);
  const summary = cleanText(candidate.summary, 1_000);
  const article = candidate.article.trim().slice(0, 12_000);

  const keyPoints = candidate.keyPoints
    .filter((point): point is string => typeof point === "string")
    .map((point) => cleanText(point, 300))
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

  const candidate = value as Record<string, unknown>;

  if (!Array.isArray(candidate.articles)) {
    return null;
  }

  const articles = candidate.articles
    .map(parseGeneratedArticle)
    .filter(
      (article): article is GeneratedArticle =>
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
      source.sourceText?.trim().slice(0, 5_000) ||
      source.description.trim().slice(0, 5_000),
  }));
}

/**
 * Genera tutti gli articoli dell'edizione settimanale
 * utilizzando una sola richiesta a OpenAI.
 */
export async function writeWeeklyEditionArticles(
  sources: TgLudicoItem[]
): Promise<TgLudicoWeeklyArticle[]> {
  if (sources.length === 0) {
    return [];
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn(
      "[TG Ludico Weekly] OPENAI_API_KEY non configurata. Uso del fallback."
    );

    return sources.map(createFallbackArticle);
  }

  const validSources = sources.filter((source) => {
    const sourceText =
      source.sourceText?.trim() ||
      source.description.trim();

    return Boolean(source.link && sourceText);
  });

  if (validSources.length === 0) {
    console.warn(
      "[TG Ludico Weekly] Nessuna fonte contiene testo sufficiente."
    );

    return sources.map(createFallbackArticle);
  }

  const openai = new OpenAI({
    apiKey,
  });

  try {
    console.log(
      `[TG Ludico Weekly] Invio di ${validSources.length} notizie in una sola richiesta OpenAI...`
    );

    const response =
      await openai.chat.completions.create({
        model: "gpt-5-mini",

        messages: [
          {
            role: "system",
            content: [
              "Sei il redattore di un magazine italiano dedicato ai giochi da tavolo.",
              "Devi scrivere una serie di articoli giornalistici originali usando esclusivamente le informazioni fornite.",
              "Non tradurre letteralmente i testi sorgente.",
              "Non inventare fatti, dichiarazioni, prezzi, date, caratteristiche, nomi o dettagli.",
              "Mantieni invariati i nomi ufficiali di giochi, aziende, persone, prodotti ed eventi.",
              "Usa un tono giornalistico neutrale, chiaro e professionale.",
              "Ogni articolo deve essere autonomo e comprensibile senza consultare la fonte.",
              "Non ripetere continuamente le stesse formule tra un articolo e l'altro.",
              "Non aggiungere opinioni personali o giudizi non presenti nelle fonti.",
              "Devi produrre esattamente un articolo per ciascuna notizia ricevuta.",
              "Mantieni in ogni articolo lo stesso originalUrl ricevuto nell'input.",
              "Restituisci esclusivamente un oggetto JSON.",
              "L'oggetto deve contenere la proprietà articles.",
              "articles deve essere un array di oggetti con le proprietà originalUrl, title, subtitle, summary, article e keyPoints.",
              "keyPoints deve contenere da 3 a 5 punti.",
              "summary deve essere un breve riassunto editoriale.",
              "article deve essere il testo completo dell'articolo.",
            ].join(" "),
          },

          {
            role: "user",
            content: JSON.stringify({
              articles: buildPromptArticles(validSources),
            }),
          },
        ],

        response_format: {
          type: "json_object",
        },
      });

    const content =
      response.choices[0]?.message?.content;

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
        "[TG Ludico Weekly] Risposta JSON non valida:"
      );

      console.dir(parsedValue, {
        depth: null,
      });

      throw new Error(
        "La risposta OpenAI non rispetta il formato richiesto."
      );
    }

    const generatedByUrl = new Map(
      generatedEdition.articles.map((article) => [
        article.originalUrl,
        article,
      ])
    );

    const finalArticles = sources.map((source) => {
      const generated =
        generatedByUrl.get(source.link);

      if (!generated) {
        console.warn(
          `[TG Ludico Weekly] Articolo non generato, uso del fallback: ${source.title}`
        );

        return createFallbackArticle(source);
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
    });

    const generatedCount =
      finalArticles.filter(
        (article) => article.article.length > 0
      ).length;

    console.log(
      `[TG Ludico Weekly] Generazione completata: ${generatedCount}/${sources.length} articoli prodotti con una sola richiesta.`
    );

    return finalArticles;
  } catch (error) {
    console.error(
      "[TG Ludico Weekly] Errore durante la generazione dell'edizione."
    );

    console.error(error);

    return sources.map(createFallbackArticle);
  }
}