"use client"

import { Box, Heading } from "@chakra-ui/react"
import RefreshTimer from "../components/refresh-timer"
import CryptoList from "../components/crypto-list"
import BuyForm from "../components/buy-form"

export default function Home() {
  return (
    <>
      <Box px={{ base: 4, md: 8 }} py={6} bg="var(--background)" color="var(--foreground)">
        <Heading as="h1" size="lg" textAlign="center" mb={1} color="var(--foreground)">
          Crypto prices
        </Heading>
        <RefreshTimer align="center" />
      </Box>
      <BuyForm />
      <CryptoList />
    </>
  )
}
