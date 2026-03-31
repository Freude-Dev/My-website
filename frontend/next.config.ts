import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    
  },
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
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
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