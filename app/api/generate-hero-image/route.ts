import { NextResponse } from "next/server";
import { generateHeroImage } from "@/utils/generateHeroImage.server";

const MAX_PROMPT_LENGTH = 1000;

// Dev-time tooling for the landing-page-generator skill; writes into public/.
export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production." }, { status: 404 });
  }

  // Requiring JSON forces a CORS preflight for cross-origin pages, which this route never approves.
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Content-Type must be application/json." }, { status: 415 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const { prompt, slug, overwrite } = body ?? {};
  if (
    typeof prompt !== "string" ||
    typeof slug !== "string" ||
    !prompt.trim() ||
    !slug ||
    (overwrite !== undefined && typeof overwrite !== "boolean")
  ) {
    return NextResponse.json(
      { error: "`prompt` and `slug` (strings) are required; `overwrite` must be a boolean." },
      { status: 400 },
    );
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return NextResponse.json(
      { error: `\`prompt\` must be at most ${MAX_PROMPT_LENGTH} characters.` },
      { status: 400 },
    );
  }

  const result = await generateHeroImage(prompt, { slug, overwrite });
  return NextResponse.json(result);
}
