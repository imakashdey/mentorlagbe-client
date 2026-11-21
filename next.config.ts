import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/server-api/:path*",
        destination: "https://mentorlagbe-server-taupe.vercel.app/:path*",
      },
    ];
  },
};

export default nextConfig;

