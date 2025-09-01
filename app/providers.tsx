"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { ViewStyleProvider } from "../hooks/useViewStyle"

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
      <ChakraProvider value={defaultSystem}>
        <QueryClientProvider client={queryClient}>
          <ViewStyleProvider>
            {children}
            {process.env.NODE_ENV === "development" ? (
              <ReactQueryDevtools initialIsOpen={false} />
            ) : null}
          </ViewStyleProvider>
        </QueryClientProvider>
      </ChakraProvider>
  )
}
