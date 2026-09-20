import type { NextConfig } from "next";

// GitHub Pages serves plain static files under /<repo-name>/ for a project
// site (unless a custom domain is configured, in which case BASE_PATH is
// left unset). The deploy workflow sets BASE_PATH to the repo name.
const basePath = process.env.BASE_PATH ?? "";

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
