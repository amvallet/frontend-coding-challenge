"use client"

import { Box, Heading } from "@chakra-ui/react"
import RefreshTimer from "../components/refresh-timer"
import CryptoList from "../components/crypto-list"
import BuyForm from "../components/buy-form"

export default function Home() {
  return (
    <>
      <Box px={{ base: 4, md: 8 }} py={6} className="bg-white text-gray-900 dark:bg-neutral-900 dark:text-gray-100">
        <Heading as="h1" size="lg" textAlign="center" mb={1}>
          Crypto prices
        </Heading>
        <RefreshTimer />
      </Box>
      <BuyForm />
      <CryptoList />
    </>
  )
}
