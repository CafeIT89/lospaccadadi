import type { TgLudicoCategory } from "@/lib/tg-ludico-categories";

export type RawFeedItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  isoDate?: string;
  contentSnippet?: string;
  content?: string;
  contentEncoded?: string;
  enclosure?: {
    url?: string;
  };
  mediaContent?: {
    $?: {
      url?: string;
    };
  };
  mediaThumbnail?: {
    $?: {
      url?: string;
    };
  };
};

export type TgLudicoItem = {
  title: string;
  link: string;
  description: string;

  /**
   * Testo originale disponibile nel feed RSS.
   *
   * Verrà utilizzato dal futuro motore editoriale
   * per scrivere un articolo italiano originale,
   * senza basarsi soltanto sul titolo e sul riassunto.
   */
  sourceText?: string;

  date: string;
  source: string;
  image: string | null;
  category: TgLudicoCategory;
};

export type TranslatedArticle = {
  title: string;
  description: string;
};

/**
 * Modello di ogni articolo dell'edizione settimanale
 * del TG Ludico.
 */
export type TgLudicoWeeklyArticle = {
  title: string;
  subtitle: string;
  summary: string;
  article: string;
  keyPoints: string[];
  category: TgLudicoCategory;
  source: string;
  originalUrl: string;
  originalTitle: string;
  image: string | null;
  publishedAt: string;
};

/**
 * Rappresenta un numero settimanale completo
 * del TG Ludico.
 */
export type TgLudicoWeeklyEdition = {
  id: string;
  year: number;
  week: number;
  title: string;
  publishedAt: string;
  periodStart: string;
  periodEnd: string;
  articles: TgLudicoWeeklyArticle[];
};