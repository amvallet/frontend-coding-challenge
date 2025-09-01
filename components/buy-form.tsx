"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Box,
  Button,
  Field,
  HStack,
  Input,
  InputGroup,
  NativeSelect,
  Text,
} from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { useCryptoListings, type CryptoListingsResponse } from "../hooks/useCryptoListings"

type BuyPayload = {
  amountUSD: number
  symbol: string
}

async function postBuy(payload: BuyPayload) {
  const res = await fetch("/api/crypto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Failed to submit buy (${res.status}): ${text}`)
  }
  return res.json() as Promise<BuyPayload>
}

export default function BuyForm() {
  const { data, isLoading } = useCryptoListings({ limit: 10 })
  const options = useMemo<CryptoListingsResponse["data"]>(() => data?.data ?? [], [data])

  const [amount, setAmount] = useState<string>("")
  const [symbol, setSymbol] = useState<string>("")

  // Initialize selected symbol when data arrives
  useEffect(() => {
    if (!symbol && options.length) {
      setSymbol(options[0].symbol)
    }
  }, [options, symbol])

  const amountNum = useMemo(() => Number(amount), [amount])
  const hasAmount = amount.trim() !== ""
  const isAmountValid = hasAmount && !Number.isNaN(amountNum) && amountNum > 0 && amountNum <= 5000

  const mutation = useMutation({
    mutationFn: postBuy,
    onSuccess: (_, vars) => {
      // Log to browser console per requirements
      console.log("Buy submitted", vars)
    },
  })

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isAmountValid || !symbol) return
    const payload: BuyPayload = {
      amountUSD: Math.round(amountNum * 100) / 100,
      symbol,
    }
    mutation.mutate(payload)
  }

  return (
    <Box px={{ base: 4, md: 8 }} py={4}>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        p={4}
        borderColor="var(--border)"
        bg="var(--background)"
        color="var(--foreground)"
        w={{ base: "full", md: "fit-content" }}
        maxW="100%"
        mx="auto"
        shadow="sm"
      >        <form onSubmit={onSubmit}>
          <HStack gap={3} justify="center" align="center" wrap="wrap">
          <Text color="var(--foreground)">Buy</Text>

          <Field.Root invalid={hasAmount && !isAmountValid} w={{ base: "full", md: "200px" }}>
            <InputGroup startElement="$" endElement="USD">
              <Input
                type="number"
                inputMode="decimal"
                step="0.01"
                min={0}
                max={5000}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                aria-label="USD amount"
                bg="var(--background)"
                color="var(--foreground)"
                borderColor="var(--border)"
              />
            </InputGroup>
            <Field.ErrorText>Enter an amount between 0 and 5000 USD</Field.ErrorText>
          </Field.Root>

          <Text color="var(--foreground)">of</Text>

          <NativeSelect.Root w={{ base: "full", md: "240px" }}>
            <NativeSelect.Field
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              aria-label="Select asset"
              bg="var(--background)"
              color="var(--foreground)"
              borderColor="var(--border)"
            >
              {options.length === 0 ? (
                <option value="">{isLoading ? "Loading…" : "No assets"}</option>
              ) : (
                options.map((c) => (
                  <option key={c.symbol} value={c.symbol}>
                    {c.name} ({c.symbol})
                  </option>
                ))
              )}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>

          <Button
            type="submit"
            disabled={!isAmountValid || !symbol || mutation.isPending}
            bg="var(--background)"
            color="var(--foreground)"
            borderWidth="1px"
            borderColor="var(--border)"
          >
            {mutation.isPending ? "Buying…" : "Buy"}
          </Button>
          </HStack>
        </form>
      </Box>
    </Box>
  )
}
