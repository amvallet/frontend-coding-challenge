"use client"

import { Box, HStack, SegmentGroup } from "@chakra-ui/react"
import SearchInput from "./search-input"
import type { SortKey } from "./types"

export default function Controls({
  query,
  onQueryChange,
  sortKey,
  onSortChange,
}: {
  query: string
  onQueryChange: (value: string) => void
  sortKey: SortKey
  onSortChange: (value: SortKey) => void
}) {
  return (
    <HStack
      gap={3}
      align="center"
      maxW="720px"
      mx="auto"
      mb={4}
      bg="transparent"
      color="var(--foreground)"
    >
      <Box flex="1">
        <SearchInput value={query} onChange={onQueryChange} />
      </Box>
      <SegmentGroup.Root
        size="sm"
        value={sortKey}
        onValueChange={({ value }) => onSortChange((value as SortKey) ?? "name")}
        bg="var(--background)"
        color="var(--foreground)"
        borderWidth="1px"
        borderColor="var(--border)"
        rounded="md"
      >
        <SegmentGroup.Item value="name" px="3" py="1.5" color="var(--foreground)" _checked={{ color: "var(--background)", bg: "var(--foreground)" }}>
          <SegmentGroup.ItemText color="currentColor">Name</SegmentGroup.ItemText>
          <SegmentGroup.ItemHiddenInput />
        </SegmentGroup.Item>
        <SegmentGroup.Item value="symbol" px="3" py="1.5" color="var(--foreground)" _checked={{ color: "var(--background)", bg: "var(--foreground)" }}>
          <SegmentGroup.ItemText color="currentColor">Symbol</SegmentGroup.ItemText>
          <SegmentGroup.ItemHiddenInput />
        </SegmentGroup.Item>
        <SegmentGroup.Item value="price" px="3" py="1.5" color="var(--foreground)" _checked={{ color: "var(--background)", bg: "var(--foreground)" }}>
          <SegmentGroup.ItemText color="currentColor">Price</SegmentGroup.ItemText>
          <SegmentGroup.ItemHiddenInput />
        </SegmentGroup.Item>
      </SegmentGroup.Root>
    </HStack>
  )
}
