import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ywc20.ywc.in.th",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
