import type { NextConfig } from 'next'

const isGithubPagesBuild = process.env.GITHUB_ACTIONS === 'true'

const nextConfig: NextConfig = {
  ...(isGithubPagesBuild
    ? {
        output: 'export',
        basePath: '/menu-builder',
        assetPrefix: '/menu-builder/',
      }
    : {}),
}

export default nextConfig
