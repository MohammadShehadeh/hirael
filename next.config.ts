import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  reactCompiler: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    // We do our own typechecking in CI.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
