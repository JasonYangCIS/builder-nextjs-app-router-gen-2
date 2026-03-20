/**
 * Playwright global setup — runs once before any test worker starts.
 *
 * Pre-warms pages that are slow on first access in the webpack dev server.
 * Without this, 16 parallel workers all trigger cold compilations simultaneously,
 * causing the webpack queue to back up and some navigations to exceed the 30s
 * test timeout. Fetching sequentially here ensures each page is compiled and
 * cached before tests begin.
 */
async function globalSetup() {
  const base = "http://localhost:3000";

  // Pages that trigger heavy first-compilation under concurrent load.
  // Order matters: compile the most depended-upon pages first.
  const pagesToWarm = [
    "/",
    "/test/heroes",
    "/blog",
    "/blog-article",
    "/blog-article-section",
    "/design-system",
  ];

  for (const path of pagesToWarm) {
    try {
      await fetch(`${base}${path}`);
    } catch {
      // Server might not be up yet — Playwright's webServer config handles
      // readiness; we silently skip failures here so setup never blocks tests.
    }
  }
}

export default globalSetup;
