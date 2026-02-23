import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for deployment (GitHub Pages, Netlify, etc.)
  // Uncomment the line below when deploying as static site:
  // output: "export",

  images: {
    // Allow unoptimized for static export; comment out for Vercel deployment
    unoptimized: true,
    // Add remote domains if you use external image URLs
    remotePatterns: [],
  },

  // Strict mode for catching potential issues
  reactStrictMode: true,
};

export default nextConfig;

