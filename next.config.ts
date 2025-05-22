import type { NextConfig } from "next";

/**
 * @type {import('next').NextConfig}
 */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images-na.ssl-images-amazon.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img-b.udemycdn.com",
        pathname: "/**",
      },
      // Agrega aquí otros hostnames de imágenes externas si es necesario
    ],
  },
};

export default nextConfig;
