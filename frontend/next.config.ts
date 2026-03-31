import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'suqlrlsdhsjwcqurkvhs.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        // Allow any Supabase project (useful if you change projects)
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        // Unsplash images used in testimonials/about
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Handle external dependencies for Turbopack
  transpilePackages: ['jspdf', 'fflate'],
};

export default nextConfig;