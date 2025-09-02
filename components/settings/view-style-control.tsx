"use client"

import { HStack, Text, SegmentGroup } from "@chakra-ui/react"
import { useViewStyle, type ViewStyle } from "../../hooks/useViewStyle"

export default function ViewStyleControl() {
  const { viewStyle, setViewStyle } = useViewStyle()
  const value = viewStyle

  return (
    <HStack gap={4} align="center">
      <Text w="120px" textAlign="right" fontSize="sm" color="var(--foreground)" opacity={0.8}>
        View Style
      </Text>
      <SegmentGroup.Root
        size="sm"
        value={value}
        onValueChange={({ value }) => setViewStyle((value as ViewStyle) ?? "grid")}
        bg="var(--background)"
        color="var(--foreground)"
        borderWidth="1px"
        borderColor="var(--border)"
        rounded="md"
      >
        <SegmentGroup.Item
          value="grid"
          px="3"
          py="1.5"
          color="var(--foreground)"
          _checked={{ color: "var(--background)", bg: "var(--foreground)" }}
        >
          <SegmentGroup.ItemText color="currentColor">Grid</SegmentGroup.ItemText>
          <SegmentGroup.ItemHiddenInput />
        </SegmentGroup.Item>
        <SegmentGroup.Item
          value="list"
          px="3"
          py="1.5"
          color="var(--foreground)"
          _checked={{ color: "var(--background)", bg: "var(--foreground)" }}
        >
          <SegmentGroup.ItemText color="currentColor">List</SegmentGroup.ItemText>
          <SegmentGroup.ItemHiddenInput />
        </SegmentGroup.Item>
      </SegmentGroup.Root>
    </HStack>
  )
}
