import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "militiabunker.mypinata.cloud",
      },
    ],
  },
};

export default nextConfig;
