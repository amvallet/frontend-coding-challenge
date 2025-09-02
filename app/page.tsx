"use client"

import { Box, Heading } from "@chakra-ui/react"
import RefreshTimer from "../components/refresh-timer"
import CryptoList from "../components/crypto-list"
import BuyForm from "../components/buy-form"
import SettingsPopover from "../components/settings/settings-popover"

export default function Home() {
  return (
    <>
      <Box px={{ base: 4, md: 8 }} py={6} bg="var(--background)" color="var(--foreground)" position="relative">
        <Box position="absolute" top={4} right={{ base: 4, md: 8 }}>
          <SettingsPopover />
        </Box>
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
