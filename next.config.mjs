/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Allow dev origins for network access
  allowedDevOrigins: [
    '192.168.1.121',
    'localhost',
    '127.0.0.1'
  ],
  webpack: (config, { isServer }) => {
    // Add fallback for node modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    // Improve chunk loading reliability
    config.output.chunkLoadingGlobal = 'webpackChunkTrifi'
    
    // Ignore specific warnings from Supabase realtime
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
      /node_modules\/@supabase\/realtime-js/,
    ]
    
    return config
  },
}

export default nextConfig
