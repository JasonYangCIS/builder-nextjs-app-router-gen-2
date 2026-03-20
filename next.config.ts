import BuilderDevTools from "@builder.io/dev-tools/next";
import type { NextConfig } from "next";

const baseConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.builder.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

// Disable Builder dev tools during testing to prevent pointer event interception
const nextConfig: NextConfig = process.env.PLAYWRIGHT_TEST === 'true'
  ? baseConfig
  : BuilderDevTools()(baseConfig);

export default nextConfig;
