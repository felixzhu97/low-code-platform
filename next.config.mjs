/** @type {import('next').NextConfig} */

const nextConfig = {
  transpilePackages: ["@explore/ui"],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
