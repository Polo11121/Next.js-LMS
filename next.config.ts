import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        port: "",
        hostname: "michael-lms.t3.storage.dev",
        protocol: "https",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
