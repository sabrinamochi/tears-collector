import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/tears-collector',
  assetPrefix: '/tears-collector',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
