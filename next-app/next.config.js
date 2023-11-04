const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3001'
const output = process.env.NEXT_OUTPUT || undefined

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: output,

    rewrites: async () => [{
        source: '/api/:path*',
        destination: `${apiBaseUrl}/:path*`
    }]
}

module.exports = nextConfig
