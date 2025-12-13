import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  // Disable turbopack to avoid build issues
  turbopack: false,
};

export default nextConfig;
