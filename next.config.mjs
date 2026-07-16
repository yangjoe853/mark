/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Silence the Turbopack/webpack warning — no custom webpack config needed
  turbopack: {},
}

export default nextConfig
