import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  reactCompiler: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    // `pnpm typecheck` runs in CI, so the build skips it.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
