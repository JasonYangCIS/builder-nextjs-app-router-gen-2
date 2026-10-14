import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: node validate.mjs <slug>");
  process.exit(2);
}

const errors = [];
const warnings = [];
const file = join("content", "landing-pages", `${slug}.json`);

if (!existsSync(file)) {
  console.error(`ERROR: ${file} not found`);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(readFileSync(file, "utf8"));
} catch (e) {
  console.error(`ERROR: ${file} is not valid JSON (${e.message})`);
  process.exit(1);
}

const isStr = (v) => typeof v === "string" && v.trim().length > 0;
const requireStr = (path, v) => {
  if (!isStr(v)) errors.push(`${path}: required non-empty string`);
  return isStr(v);
};
const limit = (path, v, max) => {
  if (isStr(v) && v.length > max) warnings.push(`${path}: ${v.length} chars (max ${max})`);
};

if (requireStr("slug", data.slug) && data.slug !== slug) {
  errors.push(`slug: "${data.slug}" does not match filename "${slug}"`);
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) errors.push(`slug: "${slug}" must be lowercase-hyphen`);

requireStr("headline", data.headline);
limit("headline", data.headline, 70);
requireStr("subhead", data.subhead);
limit("subhead", data.subhead, 160);

if (!data.cta || typeof data.cta !== "object") {
  errors.push("cta: required object { label, href }");
} else {
  requireStr("cta.label", data.cta.label);
  limit("cta.label", data.cta.label, 24);
  if (requireStr("cta.href", data.cta.href)) {
    const href = data.cta.href;
    if (href.startsWith("/")) {
      const first = href.split(/[?#]/)[0].split("/").filter(Boolean)[0];
      const appDir = join("app", "[locale]");
      const routeExists =
        !first ||
        existsSync(join(appDir, first)) ||
        existsSync(join("content", "landing-pages", `${first}.json`));
      if (!routeExists) warnings.push(`cta.href: "${href}" does not match a known route`);
    } else if (!href.startsWith("https://")) {
      errors.push(`cta.href: "${href}" must start with "/" or "https://"`);
    }
  }
}

if (!Array.isArray(data.sections) || data.sections.length === 0) {
  errors.push("sections: required non-empty array");
} else {
  data.sections.forEach((s, i) => {
    requireStr(`sections[${i}].heading`, s?.heading);
    requireStr(`sections[${i}].body`, s?.body);
    limit(`sections[${i}].heading`, s?.heading, 40);
    limit(`sections[${i}].body`, s?.body, 280);
  });
}

if (requireStr("heroImagePath", data.heroImagePath)) {
  const imgPath = join("public", data.heroImagePath.replace(/^\//, ""));
  if (!existsSync(imgPath)) errors.push(`heroImagePath: ${imgPath} not found on disk`);
}
if (requireStr("heroImageAlt", data.heroImageAlt)) {
  if (/^(hero )?image\.?$/i.test(data.heroImageAlt.trim()) || data.heroImageAlt.trim().length < 10) {
    errors.push(`heroImageAlt: "${data.heroImageAlt}" is not a meaningful description`);
  }
}

warnings.forEach((w) => console.warn(`WARN: ${w}`));
errors.forEach((e) => console.error(`ERROR: ${e}`));
if (errors.length) process.exit(1);
console.log(`OK: ${file} (${warnings.length} warning${warnings.length === 1 ? "" : "s"})`);
