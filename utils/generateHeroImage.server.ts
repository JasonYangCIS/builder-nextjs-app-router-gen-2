import "server-only";
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { config } from "@/config";

export const PLACEHOLDER_IMAGE_PATH = "/generated/placeholder.svg";

const OUTPUT_DIR = path.join(process.cwd(), "public", "generated");
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";

export interface GenerateHeroImageOptions {
  slug: string;
  timeoutMs?: number;
  overwrite?: boolean;
}

export interface GenerateHeroImageResult {
  path: string;
  provider: string;
  placeholder: boolean;
  error?: string;
}

class ImageProviderError extends Error {}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  try {
    return await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
  } catch (err) {
    if (err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError")) {
      throw new ImageProviderError(`Image provider timed out after ${timeoutMs}ms.`);
    }
    throw new ImageProviderError(`Image provider request failed: ${(err as Error).message}`);
  }
}

type GeminiBlock = { type?: string; data?: string; text?: string };
type GeminiInteraction = {
  output_image?: { data?: string };
  steps?: { type?: string; content?: GeminiBlock[] }[];
};

async function generateWithGemini(prompt: string, timeoutMs: number): Promise<Buffer> {
  const { geminiApiKey, geminiImageModel } = config.envs;
  if (!geminiApiKey) {
    throw new ImageProviderError(
      "GEMINI_API_KEY is not set. Add it to .env.local.",
    );
  }

  const res = await fetchWithTimeout(
    GEMINI_ENDPOINT,
    {
      method: "POST",
      headers: { "x-goog-api-key": geminiApiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: geminiImageModel,
        input: prompt,
        // gemini-3.1-flash-lite-image supports 1K output only.
        response_format: { type: "image", aspect_ratio: "16:9", image_size: "1K" },
      }),
    },
    timeoutMs,
  );

  if (res.status === 401 || res.status === 403) {
    throw new ImageProviderError("Gemini rejected the API key (auth error). Check GEMINI_API_KEY.");
  }
  if (res.status === 429) {
    throw new ImageProviderError("Gemini rate limit or quota exceeded. Try again later.");
  }
  if (!res.ok) {
    const detail = (await res.text()).slice(0, 300);
    throw new ImageProviderError(`Gemini request failed (${res.status}): ${detail}`);
  }

  const json = (await res.json()) as GeminiInteraction;
  let data = json.output_image?.data;
  let text = "";
  for (const step of json.steps ?? []) {
    if (step.type !== "model_output") continue;
    for (const block of step.content ?? []) {
      if (block.type === "image" && block.data && !data) data = block.data;
      if (block.type === "text" && block.text) text += block.text;
    }
  }
  if (!data) {
    throw new ImageProviderError(
      `Gemini returned no image (possibly blocked by safety filters).${text ? ` Model said: ${text.slice(0, 200)}` : ""}`,
    );
  }
  return Buffer.from(data, "base64");
}

async function toWebFriendly(buffer: Buffer): Promise<{ buffer: Buffer; ext: string }> {
  // sharp ships with Next.js; fall back to the raw bytes if it is unavailable.
  try {
    const sharp = (await import("sharp")).default;
    return { buffer: await sharp(buffer).webp({ quality: 82 }).toBuffer(), ext: "webp" };
  } catch {
    const isPng = buffer.subarray(0, 4).toString("hex") === "89504e47";
    return { buffer, ext: isPng ? "png" : "jpg" };
  }
}

export async function generateHeroImage(
  prompt: string,
  options: GenerateHeroImageOptions,
): Promise<GenerateHeroImageResult> {
  const {
    slug,
    timeoutMs = 60_000,
    overwrite = false,
  } = options;

  const provider = "gemini";
  const fallback = (error: string): GenerateHeroImageResult => ({
    path: PLACEHOLDER_IMAGE_PATH,
    provider,
    placeholder: true,
    error,
  });

  if (!/^[a-z0-9-]+$/.test(slug)) return fallback("Invalid slug: use lowercase letters, numbers, hyphens.");
  if (!prompt.trim()) return fallback("Image prompt is empty.");

  const baseName = `${slug}-hero`;
  if (!overwrite) {
    for (const ext of ["webp", "png", "jpg"]) {
      const existing = path.join(OUTPUT_DIR, `${baseName}.${ext}`);
      try {
        await access(existing);
        return { path: `/generated/${baseName}.${ext}`, provider, placeholder: false };
      } catch {}
    }
  }

  try {
    const raw = await generateWithGemini(prompt, timeoutMs);
    const { buffer, ext } = await toWebFriendly(raw);
    await mkdir(OUTPUT_DIR, { recursive: true });
    await writeFile(path.join(OUTPUT_DIR, `${baseName}.${ext}`), buffer);
    return { path: `/generated/${baseName}.${ext}`, provider, placeholder: false };
  } catch (err) {
    return fallback(err instanceof Error ? err.message : "Unknown image generation error.");
  }
}
