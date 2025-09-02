"use client"

import { Box, Table } from "@chakra-ui/react"
import { formatUSD } from "../../lib/format"
import type { CryptoItem } from "./types"

export default function ListView({
  items,
  onOpenDetails,
}: {
  items: CryptoItem[]
  onOpenDetails: (id: number) => void
}) {
  return (
    <Box borderWidth="1px" borderColor="var(--border)" rounded="lg" boxShadow="sm" overflow="hidden" maxW="720px">
      <Table.Root
        size="sm"
        bg="var(--background)"
        color="var(--foreground)"
        borderColor="var(--border)"
      >
        <Table.Header bg="var(--background)" color="var(--foreground)">
          <Table.Row>
            <Table.ColumnHeader bg="var(--background)" color="var(--foreground)" borderColor="var(--border)" fontSize="md" fontWeight="semibold">Name</Table.ColumnHeader>
            <Table.ColumnHeader bg="var(--background)" color="var(--foreground)" borderColor="var(--border)" fontSize="md" fontWeight="semibold">Symbol</Table.ColumnHeader>
            <Table.ColumnHeader bg="var(--background)" color="var(--foreground)" borderColor="var(--border)" fontSize="md" fontWeight="semibold" textAlign="end">Price</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body bg="var(--background)" color="var(--foreground)">
          {items.map((crypto) => {
            const price = crypto.quote?.USD?.price
            return (
              <Table.Row
                key={crypto.id}
                cursor="pointer"
                _hover={{ bg: "color-mix(in srgb, var(--foreground) 6%, transparent)" }}
                onClick={() => onOpenDetails(crypto.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    onOpenDetails(crypto.id)
                  }
                }}
                aria-label={`Open details for ${crypto.name}`}
              >
                <Table.Cell bg="var(--background)" color="var(--foreground)" borderColor="var(--border)">{crypto.name}</Table.Cell>
                <Table.Cell bg="var(--background)" color="var(--foreground)" borderColor="var(--border)">{crypto.symbol}</Table.Cell>
                <Table.Cell bg="var(--background)" color="var(--foreground)" borderColor="var(--border)" textAlign="end">{formatUSD(price)}</Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table.Root>
    </Box>
  )
}
