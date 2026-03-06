import BuilderDevTools from "@builder.io/dev-tools/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = BuilderDevTools()(
  BuilderDevTools()({
    /* config options here */
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'cdn.builder.io',
        },
      ],
    },
  }),
);

export default nextConfig;
