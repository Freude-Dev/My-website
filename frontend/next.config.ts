import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empty turbopack config to silence warning
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'suqlrlsdhsjwcqurkvhs.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  transpilePackages: ['jspdf', 'fflate'],
  webpack: (config, { isServer }) => {

    if (isServer) {
      config.externals = [...(config.externals || []), 'jspdf', 'fflate'];
    } else {
      // Handle fflate browser issues with Worker
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
};

export default nextConfig;