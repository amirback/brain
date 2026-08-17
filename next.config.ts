import type { NextConfig } from "next";

// GitHub Pages serves the project from /<repo>, so every asset and route
// needs that prefix. Locally (and on any host serving from root) BASE_PATH
// is empty and the app behaves normally.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
