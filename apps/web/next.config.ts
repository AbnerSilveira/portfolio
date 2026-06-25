import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer2";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@portfolio/ui",
    "@portfolio/types",
    "@projects/rsa-visualizer",
    "@projects/sniffer-web",
  ],
};

export default withContentlayer(nextConfig);
