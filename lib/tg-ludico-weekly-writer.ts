import "server-only";

import OpenAI from "openai";

import type {
  TgLudicoItem,
  TgLudicoWeeklyArticle,
} from "@/lib/tg-ludico-types";

type GeneratedWeeklyArticle = {
  title: string;
  subtitle: string;
  summary: string;
  article: string;
  keyPoints: string[];
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

function parseGeneratedArticle(
  value: unknown
): GeneratedWeeklyArticle | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Record<string, unknown>;

  if (
    typeof candidate.title !== "string" ||
    typeof candidate.subtitle !== "string" ||
    typeof candidate.summary !== "string" ||
    typeof candidate.article !== "string" ||
    !Array.isArray(candidate.keyPoints)
  ) {
    return null;
  }

  const keyPoints = candidate.keyPoints
    .filter(
      (item): item is string =>
        typeof item === "string"
    )
    .map((item) => cleanText(item, 240))
    .filter(Boolean)
    .slice(0, 5);

  const generatedArticle: GeneratedWeeklyArticle = {
    title: cleanText(candidate.title, 220),
    subtitle: cleanText(candidate.subtitle, 320),
    summary: cleanText(candidate.summary, 900),
    article: candidate.article.trim().slice(0, 12000),
    keyPoints,
  };

  if (
    !generatedArticle.title ||
    !generatedArticle.subtitle ||
    !generatedArticle.summary ||
    !generatedArticle.article ||
    generatedArticle.keyPoints.length === 0
  ) {
    return null;
  }

  return generatedArticle;
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

/**
 * Scrive un articolo giornalistico originale in italiano
 * basandosi esclusivamente sul contenuto disponibile nel feed.
 *
 * Questa funzione non viene ancora utilizzata dalla pagina preview.
 */
export async function writeWeeklyArticle(
  source: TgLudicoItem
): Promise<TgLudicoWeeklyArticle> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn(
      "[TG Ludico Weekly] OPENAI_API_KEY non configurata."
    );

    return createFallbackArticle(source);
  }

  const sourceText =
    source.sourceText?.trim() ||
    source.description.trim();

  if (!sourceText) {
    console.warn(
      `[TG Ludico Weekly] Testo sorgente assente: ${source.link}`
    );

    return createFallbackArticle(source);
  }

  const openai = new OpenAI({
    apiKey,
  });

  try {
    const response =
      await openai.chat.completions.create({
        model: "gpt-5-mini",
        messages: [
          {
            role: "system",
            content: [
              "Sei un giornalista italiano specializzato in giochi da tavolo.",
              "Scrivi un articolo originale in italiano basandoti esclusivamente sulle informazioni fornite.",
              "Non tradurre letteralmente il testo sorgente.",
              "Non aggiungere fatti, dichiarazioni, date, prezzi, nomi o dettagli non presenti nel materiale.",
              "Mantieni invariati i nomi ufficiali di giochi, persone, aziende, eventi e prodotti.",
              "Usa un tono giornalistico neutrale, chiaro e professionale.",
              "Non esprimere opinioni personali e non inserire giudizi editoriali.",
              "L'articolo deve essere autonomo e comprensibile anche senza leggere la fonte originale.",
              "Restituisci esclusivamente un oggetto JSON con le proprietà title, subtitle, summary, article e keyPoints.",
              "keyPoints deve essere un array contenente da 3 a 5 punti.",
            ].join(" "),
          },
          {
            role: "user",
            content: JSON.stringify({
              originalTitle: source.title,
              source: source.source,
              category: source.category,
              publishedAt: source.date,
              description: source.description,
              sourceText,
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

    const parsedValue: unknown = JSON.parse(content);

    const generatedArticle =
  parseGeneratedArticle(parsedValue);

console.log("[TG Ludico Weekly] JSON ricevuto:");
console.dir(parsedValue, { depth: null });

    if (!generatedArticle) {
      throw new Error(
        "La risposta di OpenAI non rispetta il formato richiesto."
      );
    }

    return {
      ...generatedArticle,
      category: source.category,
      source: source.source,
      originalUrl: source.link,
      originalTitle: source.title,
      image: source.image,
      publishedAt: source.date,
    };
    } catch (error) {
    console.error(
      `[TG Ludico Weekly] Errore nella scrittura dell'articolo: ${source.title}`
    );

    console.error(error);

    return createFallbackArticle(source);
  }
}