import { cacheLife } from "next/cache";
import { fetchEntries, fetchOneEntry } from "@builder.io/sdk-react";
import { config } from "@/config";

// Cached Builder reads for Cache Components (`cacheComponents: true`). These
// replace the old `export const revalidate = 5` route config, which is not
// allowed with cacheComponents. Only use them for DEFAULT (untargeted) entries:
// cached output is shared across all visitors. Anything that depends on the
// visitor (targeting attributes from cookies) must stay uncached.
//
const BUILDER_CACHE_LIFE = { stale: 5, revalidate: 5, expire: 86400 };

export async function getPageEntry(urlPath: string, locale: string) {
  "use cache";
  cacheLife(BUILDER_CACHE_LIFE);
  return fetchOneEntry({
    apiKey: config.envs.builderApiKey,
    model: config.models.page,
    userAttributes: { urlPath, locale },
    locale,
  });
}

export async function getAnnouncementBar(locale: string) {
  "use cache";
  cacheLife(BUILDER_CACHE_LIFE);
  return fetchOneEntry({
    model: config.models.announcementBar,
    apiKey: config.envs.builderApiKey,
    userAttributes: { locale },
    locale,
  });
}

export async function getEntries(model: string) {
  "use cache";
  cacheLife(BUILDER_CACHE_LIFE);
  return fetchEntries({
    model,
    apiKey: config.envs.builderApiKey,
    limit: 100,
  });
}

export async function getHeaderNavEntries(locale: string) {
  "use cache";
  cacheLife(BUILDER_CACHE_LIFE);
  return fetchEntries({
    apiKey: config.envs.builderApiKey,
    model: config.models.headerNavMenu,
    limit: 5,
    fields: "id,data",
    locale,
  });
}
