/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // Excluir la carpeta docs del build principal
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configurar para que ignore la carpeta docs
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'].map(ext => `${ext}`),
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/docs/**', '**/node_modules/**']
    }
    return config
  },
}

module.exports = nextConfig
