let userConfig = undefined
try {
  // try to import ESM first
  userConfig = await import('./v0-user-next.config.mjs')
} catch (e) {
  try {
    // fallback to CJS import
    userConfig = await import('./v0-user-next.config')
  } catch (innerError) {
    // ignore error
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  serverExternalPackages: [
    'pino',
    'thread-stream',
    '@walletconnect/universal-provider',
    '@walletconnect/ethereum-provider',
  ],
  webpack: (config, { isServer }) => {
    // node_modules内のテストファイルや開発用ファイルを除外
    config.resolve = config.resolve || {}
    config.resolve.alias = config.resolve.alias || {}
    
    // thread-streamのテストファイルや開発用ファイルを除外
    config.resolve.alias['thread-stream/test'] = false
    config.resolve.alias['thread-stream/bench'] = false
    
    // テストファイルを無視するルールを追加
    config.module = config.module || {}
    config.module.rules = config.module.rules || []
    
    config.module.rules.push({
      test: /\.(test|spec|bench)\.(js|mjs|ts|tsx)$/,
      include: /node_modules/,
      use: {
        loader: 'null-loader',
      },
    })
    
    return config
  },
}

if (userConfig) {
  // ESM imports will have a "default" property
  const config = userConfig.default || userConfig

  for (const key in config) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...config[key],
      }
    } else {
      nextConfig[key] = config[key]
    }
  }
}

export default nextConfig
