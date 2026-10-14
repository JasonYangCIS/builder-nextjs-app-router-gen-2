import "server-only";
import { access, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

export const PLACEHOLDER_IMAGE_PATH = "/generated/placeholder.svg";

const IMAGE_EXTENSIONS = ["webp", "png", "jpg"];
const OUTPUT_DIR = path.join(process.cwd(), "public", "generated");

export interface GenerateHeroImageOptions {
  slug: string;
  width?: number;
  height?: number;
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

async function generateWithPollinations(
  prompt: string,
  width: number,
  height: number,
  timeoutMs: number,
): Promise<Buffer> {
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true`;
  const res = await fetchWithTimeout(url, {}, timeoutMs);
  if (res.status === 429) throw new ImageProviderError("Pollinations rate limit exceeded.");
  if (!res.ok) throw new ImageProviderError(`Pollinations request failed (${res.status}).`);
  const type = res.headers.get("content-type") ?? "";
  if (!type.startsWith("image/")) {
    throw new ImageProviderError(`Pollinations returned a non-image response (${type || "unknown"}).`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function toWebFriendly(buffer: Buffer): Promise<{ buffer: Buffer; ext: string }> {
  // sharp ships with Next.js; only fall back to raw bytes if it cannot be loaded.
  let sharp: typeof import("sharp");
  try {
    sharp = (await import("sharp")).default;
  } catch {
    const isPng = buffer.subarray(0, 4).toString("hex") === "89504e47";
    return { buffer, ext: isPng ? "png" : "jpg" };
  }
  // Decode errors (corrupt image) propagate to the caller's placeholder fallback.
  return { buffer: await sharp(buffer).webp({ quality: 82 }).toBuffer(), ext: "webp" };
}

export async function generateHeroImage(
  prompt: string,
  options: GenerateHeroImageOptions,
): Promise<GenerateHeroImageResult> {
  const {
    slug,
    width = 1280,
    height = 720,
    timeoutMs = 60_000,
    overwrite = false,
  } = options;

  const provider = "pollinations";
  const fallback = (error: string): GenerateHeroImageResult => ({
    path: PLACEHOLDER_IMAGE_PATH,
    provider,
    placeholder: true,
    error,
  });

  if (typeof slug !== "string" || !/^[a-z0-9-]+$/.test(slug)) return fallback("Invalid slug: use lowercase letters, numbers, hyphens.");
  if (typeof prompt !== "string" || !prompt.trim()) return fallback("Image prompt is empty.");

  const baseName = `${slug}-hero`;
  if (!overwrite) {
    for (const ext of IMAGE_EXTENSIONS) {
      const existing = path.join(OUTPUT_DIR, `${baseName}.${ext}`);
      try {
        await access(existing);
        return { path: `/generated/${baseName}.${ext}`, provider, placeholder: false };
      } catch {}
    }
  }

  try {
    const raw = await generateWithPollinations(prompt, width, height, timeoutMs);
    const { buffer, ext } = await toWebFriendly(raw);
    await mkdir(OUTPUT_DIR, { recursive: true });
    const target = path.join(OUTPUT_DIR, `${baseName}.${ext}`);
    if (overwrite) {
      await Promise.all(
        IMAGE_EXTENSIONS.filter((e) => e !== ext).map((e) =>
          rm(path.join(OUTPUT_DIR, `${baseName}.${e}`), { force: true }),
        ),
      );
      await writeFile(target, buffer);
    } else {
      try {
        await writeFile(target, buffer, { flag: "wx" });
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code !== "EEXIST") throw err;
      }
    }
    return { path: `/generated/${baseName}.${ext}`, provider, placeholder: false };
  } catch (err) {
    return fallback(err instanceof Error ? err.message : "Unknown image generation error.");
  }
}
