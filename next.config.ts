import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: every route is pre-rendered to plain HTML at build
  // time (`out/`), so any static host can serve it and client navigation
  // never waits on a server render. The component/block routes read their
  // source TSX off disk via fs.readFile, which is fine here because with
  // `output: "export"` those reads only ever happen during the build.
  output: "export",
  images: {
    // The image optimization endpoint needs a server, which a static
    // export doesn't have — serve image sources as-is.
    unoptimized: true,
  },
};

export default nextConfig;
