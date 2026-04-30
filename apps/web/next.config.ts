import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer2";

const nextConfig: NextConfig = {
  transpilePackages: ["@portfolio/ui", "@portfolio/types"],
};

export default withContentlayer(nextConfig);
