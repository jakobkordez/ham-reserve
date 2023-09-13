const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3001'

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',

    rewrites: async () => [{
        source: '/api/:path*',
        destination: `${apiBaseUrl}/:path*`
    }]
}

module.exports = nextConfig
