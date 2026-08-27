import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GAMEFOUND_BASE_URL = "https://gamefound.com";

// Labyrinth
const TEST_PROJECT_ID = 5354;

export async function GET() {
  const endpoint =
    `${GAMEFOUND_BASE_URL}/api/projectUpdates/searchProjectUpdates`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",

      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        Origin: GAMEFOUND_BASE_URL,
        Referer:
          "https://gamefound.com/en/projects/awaken-realms/labyrinth/updates",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
      },

      body: JSON.stringify({
        dateFrom: null,
        dateTo: null,
        lowestFetchedSequenceNumber: null,
        onlyUserRelevant: false,
        projectID: TEST_PROJECT_ID,
        projectUpdateUserContext: 1,
        searchTerm: "",
      }),

      cache: "no-store",
    });

    const contentType =
      response.headers.get("content-type") ?? "";

    const rawBody = await response.text();

    let body: unknown = rawBody;

    if (contentType.includes("application/json")) {
      try {
        body = JSON.parse(rawBody);
      } catch {
        body = rawBody;
      }
    }

    console.log(
      `[Gamefound Debug] API status: ${response.status}`
    );

    return NextResponse.json({
      success: response.ok,
      projectId: TEST_PROJECT_ID,
      status: response.status,
      statusText: response.statusText,
      contentType,
      body,
    });
  } catch (error) {
    console.error(
      "[Gamefound Debug] Fetch fallita:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        projectId: TEST_PROJECT_ID,
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}