# P2: Install bundle analyzer

## Problem
No way to visualize what's in the client bundle. Performance regressions are invisible.

## Steps
1. Install: `npm install --save-dev @next/bundle-analyzer`
2. Update `next.config.ts`:
   ```ts
   import withBundleAnalyzer from "@next/bundle-analyzer";

   const analyzeBundleConfig = withBundleAnalyzer({
     enabled: process.env.ANALYZE === "true",
   });
   ```
   Wrap the final export with `analyzeBundleConfig`.
3. Add script to `package.json`:
   ```json
   "analyze": "ANALYZE=true next build --webpack"
   ```

## Expected impact
On-demand visibility into bundle composition. Run `npm run analyze` to open an interactive treemap.
