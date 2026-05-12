/** @type {import('next').NextConfig} */
import path from "path";

const nextConfig = {
  outputFileTracingRoot: path.join(import.meta.dirname, "../"),
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
