"use client"

import { Box, HStack, IconButton } from "@chakra-ui/react"
import { LuArrowLeft, LuArrowRight } from "react-icons/lu"
import Controls from "./controls"
import type { SortKey } from "./types"

export default function PageFrame({
  query,
  onQueryChange,
  sortKey,
  onSortChange,
  showPrev,
  onPrev,
  onNext,
  onHoverPrev,
  onHoverNext,
  align = "stretch",
  children,
}: {
  query: string
  onQueryChange: (value: string) => void
  sortKey: SortKey
  onSortChange: (value: SortKey) => void
  showPrev: boolean
  onPrev: () => void
  onNext: () => void
  onHoverPrev?: () => void
  onHoverNext?: () => void
  align?: "center" | "stretch"
  children: React.ReactNode
}) {
  return (
    <Box px={{ base: 4, md: 8 }} py={6} bg="var(--background)" color="var(--foreground)">
      <Controls
        query={query}
        onQueryChange={onQueryChange}
        sortKey={sortKey}
        onSortChange={onSortChange}
      />
      <HStack justify="center" align={align} gap={4}>
        {showPrev ? (
          <IconButton
            my="auto"
            aria-label="Previous page"
            onMouseEnter={onHoverPrev}
            onClick={onPrev}
          >
            <LuArrowLeft />
          </IconButton>
        ) : (
          <IconButton
            my="auto"
            aria-hidden="true"
            tabIndex={-1}
            pointerEvents="none"
            visibility="hidden"
          >
            <LuArrowLeft />
          </IconButton>
        )}
        {children}
        <IconButton
          my="auto"
          aria-label="Next page"
          onMouseEnter={onHoverNext}
          onClick={onNext}
        >
          <LuArrowRight />
        </IconButton>
      </HStack>
    </Box>
  )
}
