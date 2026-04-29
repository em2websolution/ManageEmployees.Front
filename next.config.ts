import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/employees',
        permanent: true,
        locale: false
      }
    ]
  }
}

export default nextConfig
