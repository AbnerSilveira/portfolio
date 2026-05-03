import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@portfolio/ui", "@portfolio/types"],
};

export default nextConfig;
