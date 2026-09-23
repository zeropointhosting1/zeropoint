import type { NextConfig } from "next";

// GitHub Pages serves plain static files under /<repo-name>/ for a project
// site (unless a custom domain is configured, in which case BASE_PATH is
// left unset). The deploy workflow sets BASE_PATH to the repo name.
const basePath = process.env.BASE_PATH ?? "";

// next/image and any other client-side code that builds an asset path from
// a string (rather than next/link, which prefixes basePath automatically)
// needs basePath exposed as a NEXT_PUBLIC_ var so it gets inlined into the
// client bundle. Setting it here means the deploy workflow only has to set
// BASE_PATH once — see lib/base-path.ts for the consumer.
process.env.NEXT_PUBLIC_BASE_PATH = basePath;

const nextConfig: NextConfig = {
  // Fully static export — GitHub Pages has no server, so no API routes,
  // no headers()/cookies(), no on-demand rendering.
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: {
    // No server means no Image Optimization API to hit.
    unoptimized: true,
  },
};

export default nextConfig;
