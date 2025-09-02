"use client"

import { HStack, Text, SegmentGroup } from "@chakra-ui/react"
import { useUiTheme, type UiTheme } from "../../hooks/useUiTheme"

export default function ThemeControl() {
  const { theme, setTheme } = useUiTheme()
  const value = theme

  return (
    <HStack gap={4} align="center">
      <Text w="120px" textAlign="right" fontSize="sm" color="var(--foreground)" opacity={0.8}>
        Theme
      </Text>
      <SegmentGroup.Root
        size="sm"
        value={value}
        onValueChange={({ value }) => setTheme((value as UiTheme) ?? "light")}
        bg="var(--background)"
        color="var(--foreground)"
        borderWidth="1px"
        borderColor="var(--border)"
        rounded="md"
      >
        <SegmentGroup.Item
          value="light"
          px="3"
          py="1.5"
          color="var(--foreground)"
          _checked={{ color: "var(--background)", bg: "var(--foreground)" }}
        >
          <SegmentGroup.ItemText color="currentColor">Light</SegmentGroup.ItemText>
          <SegmentGroup.ItemHiddenInput />
        </SegmentGroup.Item>
        <SegmentGroup.Item
          value="dark"
          px="3"
          py="1.5"
          color="var(--foreground)"
          _checked={{ color: "var(--background)", bg: "var(--foreground)" }}
        >
          <SegmentGroup.ItemText color="currentColor">Dark</SegmentGroup.ItemText>
          <SegmentGroup.ItemHiddenInput />
        </SegmentGroup.Item>
      </SegmentGroup.Root>
    </HStack>
  )
}
