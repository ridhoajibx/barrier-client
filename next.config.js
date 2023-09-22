/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    ENV: process.env.NODE_ENV || "development" || "production",
    API_ENDPOINT: process.env.API_ENDPOINT,
    GOOGLE_MAP_API: process.env.GOOGLE_MAP_API,
  },
}

module.exports = nextConfig
