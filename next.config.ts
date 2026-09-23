import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.16"],

  images: {
    unoptimized: true,
  },

  async redirects() {
    return [
      {
        source: "/schede-regole",
        destination: "/file-utili",
        permanent: true,
      },
      {
        source: "/schede-regole/:path*",
        destination: "/file-utili/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;