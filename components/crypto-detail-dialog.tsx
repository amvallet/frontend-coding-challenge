"use client"

import {
  Box,
  Dialog,
  Heading,
  HStack,
  IconButton,
  Portal,
  Table,
  Text,
} from "@chakra-ui/react"
import { LuX, LuTrendingUp, LuTrendingDown } from "react-icons/lu"
import { useCryptoById } from "../hooks/useCryptoById"
import { formatNumber, formatPercent, formatUSD } from "../lib/format"

export default function CryptoDetailDialog(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
  cryptoId?: number
}) {
  const { open, onOpenChange, cryptoId } = props
  const { data: crypto } = useCryptoById(cryptoId)
  const usd = crypto?.quote?.USD

  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <Table.Row>
      <Table.Cell bg="var(--background)" color="var(--foreground)" borderColor="var(--border)">
        {label}
      </Table.Cell>
      <Table.Cell
        bg="var(--background)"
        color="var(--foreground)"
        borderColor="var(--border)"
        textAlign="end"
      >
        {value}
      </Table.Cell>
    </Table.Row>
  )

  const TrendValue = ({ value }: { value?: number }) => {
    if (typeof value !== "number" || Number.isNaN(value)) return <Text>—</Text>
    const positive = value > 0
    const negative = value < 0
    const color = positive ? "green.500" : negative ? "red.500" : "var(--foreground)"
    const Icon = positive ? LuTrendingUp : negative ? LuTrendingDown : null
    return (
      <HStack justify="end" gap={2} color={color}>
        {Icon ? <Icon aria-hidden /> : null}
        <Text color="currentColor">{formatPercent(value)}</Text>
      </HStack>
    )
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => onOpenChange(e.open)}>
      <Dialog.Backdrop style={{ background: "color-mix(in srgb, var(--foreground) 35%, transparent)" }} />
      <Portal>
        <Dialog.Positioner>
          <Dialog.Content
            borderWidth="1px"
            borderColor="var(--border)"
            bg="var(--background)"
            color="var(--foreground)"
            boxShadow="lg"
            rounded="lg"
            maxW="720px"
            width="100%"
          >
            <Dialog.Header>
              <HStack justify="space-between" align="center">
                <Box>
                  <Heading size="md" color="var(--foreground)">
                    {crypto ? `${crypto.name} (${crypto.symbol})` : "Details"}
                  </Heading>
                  <Text mt={1} fontSize="sm" opacity={0.75} color="var(--foreground)">
                    Snapshot metrics (USD)
                  </Text>
                </Box>
                <Dialog.CloseTrigger asChild>
                  <IconButton aria-label="Close" size="sm" variant="ghost">
                    <LuX />
                  </IconButton>
                </Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>
            <Dialog.Body>
              <Box borderWidth="1px" borderColor="var(--border)" rounded="md" overflow="hidden">
                <Table.Root size="sm" bg="var(--background)" color="var(--foreground)" borderColor="var(--border)">
                  <Table.Body>
                    <Row label="Price" value={formatUSD(usd?.price)} />
                    <Row label="Volume (24h)" value={formatNumber(usd?.volume_24h)} />
                    <Row label="Volume change (24h)" value={<TrendValue value={usd?.volume_change_24h} />} />
                    <Row label="Change (1h)" value={<TrendValue value={usd?.percent_change_1h} />} />
                    <Row label="Change (24h)" value={<TrendValue value={usd?.percent_change_24h} />} />
                    <Row label="Change (7d)" value={<TrendValue value={usd?.percent_change_7d} />} />
                    <Row label="Change (30d)" value={<TrendValue value={usd?.percent_change_30d} />} />
                    <Row label="Change (60d)" value={<TrendValue value={usd?.percent_change_60d} />} />
                    <Row label="Change (90d)" value={<TrendValue value={usd?.percent_change_90d} />} />
                    <Row label="Market cap" value={formatUSD(usd?.market_cap)} />
                    <Row label="Dominance" value={formatPercent(usd?.market_cap_dominance)} />
                    <Row label="Fully diluted mkt cap" value={formatUSD(usd?.fully_diluted_market_cap)} />
                    <Row label="TVL" value={usd?.tvl == null ? "—" : formatNumber(usd?.tvl)} />
                  </Table.Body>
                </Table.Root>
              </Box>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
