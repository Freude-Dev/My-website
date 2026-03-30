import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force webpack to avoid Turbopack warning
  webpack: (config, { isServer }) => {
    // Prevent jspdf/fflate from being bundled on the server
    if (isServer) {
      config.externals = [...(config.externals || []), 'jspdf', 'fflate'];
    } else {
      // Handle fflate browser issues
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
      // Fix Worker issues in browser
      config.module.rules.push({
        test: /node\.cjs$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      });
    }
    return config;
  },
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
};

export default nextConfig;