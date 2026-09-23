import type { NextConfig } from "next";

const BACKEND_ORIGIN =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  // Proxy /api/* and /ws to the backend so the browser never makes
  // a cross-origin request (avoids CORS issues with the VPS).
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_ORIGIN}/api/:path*`,
      },
      {
        source: "/ws",
        destination: `${BACKEND_ORIGIN}/ws`,
      },
    ];
  },
};

export default nextConfig;
