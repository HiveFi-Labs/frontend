'use client'

import { PrivyProvider } from '@privy-io/react-auth'

export default function Providers({ children }: { children: React.ReactNode }) {
  const app_id = process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''
  const client_id = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID || ''
  return (
    <PrivyProvider
      appId={app_id}
      clientId={client_id}
      config={{
        appearance: {
          theme: 'dark', // アプリがダークテーマを使用しているので合わせる
          accentColor: '#9333ea',
          logo: 'https://hivefi.xyz/images/hivefi-logo.png', // ロゴのURLを設定
        },
        solanaClusters: [
          { name: 'testnet', rpcUrl: 'https://api.testnet.solana.com' },
        ],
        embeddedWallets: {
          solana: {
            createOnLogin: 'users-without-wallets',
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
