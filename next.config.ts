import type { NextConfig } from "next";

// GitHub Pages serves the project from /<repo>, so every asset and route
// needs that prefix. Locally (and on Vercel, which serves from the root)
// BASE_PATH is empty and the app behaves normally.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * GitHub Pages can only serve pre-built files, so that build is a static export.
 * Vercel runs a server, which is what the mentor's API route needs — a POST
 * route handler and `output: "export"` are mutually exclusive.
 *
 * The Pages workflow sets STATIC_EXPORT and deletes `src/app/api` before
 * building; the app falls back to its rule-based mentor when the route is
 * absent, so the exported site stays fully functional.
 */
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(staticExport ? { output: "export" as const } : {}),
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
