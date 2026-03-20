import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  assetPrefix: "/dashboard-app/",
  trailingSlash: true,
};

export default nextConfig;
