import type { NextConfig } from "next";
import { imageUrl } from "./lib/config";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      new URL(imageUrl + "/images/**"),
      new URL("https://gocamping.or.kr/upload/**"),
      new URL("http://localhost:8888/**"),
    ],
  },
};

export default nextConfig;
