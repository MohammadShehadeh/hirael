import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // The component/block routes read their source TSX off disk at build time
  // via fs.readFile(path.join(process.cwd(), ...)). Those files aren't
  // imported by the route, so Next's tracer doesn't include them in the
  // server bundle by default — which makes `fs.readFile` miss on hosts that
  // re-evaluate the route at runtime, and the page falls back to the
  // "// (unable to read source)" stub. Explicitly tracing the registry
  // source ensures the files travel with the build.
  outputFileTracingIncludes: {
    "/[component]": ["./registry/new-york/**/*.{ts,tsx}"],
    "/blocks/[block]": ["./registry/new-york/**/*.{ts,tsx}"],
  },
}

export default nextConfig
