# P3: Add Web Vitals reporting

## Problem
No client-side monitoring of CLS, LCP, INP, FCP, or TTFB. Production performance regressions go undetected.

## Options

### Option A: Next.js instrumentation (minimal)
Create `app/instrumentation.ts` with `onRequestError` or use the `useReportWebVitals` hook in a client component inside the root layout.

### Option B: `web-vitals` library
1. Install: `npm install web-vitals`
2. Create a `components/WebVitalsReporter.tsx` client component:
   ```tsx
   "use client";
   import { useReportWebVitals } from "next/web-vitals";

   export function WebVitalsReporter() {
     useReportWebVitals((metric) => {
       // Send to analytics endpoint, console.log for dev
       console.log(metric);
     });
     return null;
   }
   ```
3. Add to `app/[locale]/layout.tsx`.

## Expected impact
Visibility into real-user Core Web Vitals. Connect to your analytics provider (Vercel Analytics, Datadog, etc.) for dashboards and alerting.
