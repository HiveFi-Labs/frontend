'use client' // This component needs to be a Client Component

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Default query options can be set here, e.g., staleTime
        staleTime: 60 * 1000, // 1 minute
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient()
  }
  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // NOTE: Avoid useState when initializing the query client if you are
  //       rendering this componentCLIENT SIDE ONLY.
  //       OTHERWISE SINGLETON RECOMMENDED FOR SERVERSIDE RENDERING.
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Optionally add React Query DevTools */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
