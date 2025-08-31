"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { CacheProvider } from "@chakra-ui/next-js"
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <CacheProvider>
      <ChakraProvider value={defaultSystem}>
        <QueryClientProvider client={queryClient}>
          {children}
          {process.env.NODE_ENV === "development" ? (
            <ReactQueryDevtools initialIsOpen={false} />
          ) : null}
        </QueryClientProvider>
      </ChakraProvider>
    </CacheProvider>
  )
}
