"use client"

import { Card, Heading, SimpleGrid, Text } from "@chakra-ui/react"
import { formatUSD } from "../../lib/format"
import type { CryptoItem } from "./types"

export default function GridView({
  items,
  onOpenDetails,
}: {
  items: CryptoItem[]
  onOpenDetails: (id: number) => void
}) {
  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} width="full">
      {items.map((crypto, i) => {
        const price = crypto.quote?.USD?.price
        return (
          <Card.Root
            key={crypto.id}
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="sm"
            width="300px"
            borderColor="var(--border)"
            bg="var(--background)"
            color="var(--foreground)"
            justifySelf={{ base: "center", md: i % 2 === 0 ? "end" : "start" }}
            role="button"
            cursor="pointer"
            _hover={{ boxShadow: "md", borderColor: "color-mix(in srgb, var(--foreground) 45%, transparent)" }}
            onClick={() => onOpenDetails(crypto.id)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onOpenDetails(crypto.id)
              }
            }}
          >
            <Card.Body>
              <Heading size="sm" mb={1} color="var(--foreground)">
                {crypto.name} ({crypto.symbol})
              </Heading>
              <Text color="var(--foreground)">Price: {formatUSD(price)}</Text>
            </Card.Body>
          </Card.Root>
        )
      })}
    </SimpleGrid>
  )
}
