import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY;

  console.log("[Test OpenAI] Route eseguita");
  console.log("[Test OpenAI] Chiave presente:", Boolean(apiKey));

  if (!apiKey) {
    return NextResponse.json(
      {
        success: false,
        error: "OPENAI_API_KEY non disponibile su Vercel.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }

  try {
    const openai = new OpenAI({
      apiKey,
    });

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      store: false,
      max_output_tokens: 80,
      instructions:
        "Rispondi esclusivamente in italiano con una frase molto breve.",
      input:
        "Traduci e riassumi: A new cooperative board game will launch on Gamefound next month.",
    });

    const translation = response.output_text.trim();

    return NextResponse.json(
      {
        success: true,
        translation,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("[Test OpenAI] Errore:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Errore OpenAI non identificato.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}