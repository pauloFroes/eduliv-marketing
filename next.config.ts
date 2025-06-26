import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'

import type { NextConfig } from 'next'

const myEnv = dotenv.config()
dotenvExpand.expand(myEnv)

const nextConfig: NextConfig = {
  reactStrictMode: false,
}

export default nextConfig
