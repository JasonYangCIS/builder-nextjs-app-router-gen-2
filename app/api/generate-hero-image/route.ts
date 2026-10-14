import { NextResponse } from "next/server";
import { generateHeroImage } from "@/utils/generateHeroImage.server";

// Dev-time tooling for the landing-page-generator skill; writes into public/.
export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production." }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as {
    prompt?: string;
    slug?: string;
    overwrite?: boolean;
  } | null;
  if (!body?.prompt || !body.slug) {
    return NextResponse.json({ error: "`prompt` and `slug` are required." }, { status: 400 });
  }

  const result = await generateHeroImage(body.prompt, { slug: body.slug, overwrite: body.overwrite });
  return NextResponse.json(result);
}
