"use client"

import {
  Box,
  IconButton,
  Popover,
  Portal,
  SegmentGroup,
  HStack,
  Text,
} from "@chakra-ui/react"
import { LuSettings } from "react-icons/lu"
import { useUiTheme, type UiTheme } from "../hooks/useUiTheme"
import { useViewStyle, type ViewStyle } from "../hooks/useViewStyle"

function ThemeControl() {
  const { theme, setTheme } = useUiTheme()
  const value = theme

  return (
    <HStack gap={2} align="flex-start" alignItems="center">
      <Text fontSize="sm" color="var(--foreground)" opacity={0.8}>
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

function ViewStyleControl() {
  const { viewStyle, setViewStyle } = useViewStyle()
  const value = viewStyle

  return (
    <HStack gap={2} align="flex-start" alignItems="center">
      <Text fontSize="sm" color="var(--foreground)" opacity={0.8}>
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

export default function SettingsPopover() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <IconButton
          aria-label="Open settings"
          size="sm"
          variant="ghost"
          color="var(--foreground)"
          rounded="full"
          bg="transparent"
          _hover={{ bg: 'transparent', boxShadow: '0 0 0 2px color-mix(in srgb, var(--foreground) 30%, transparent)' }}
          _active={{ bg: 'transparent', boxShadow: '0 0 0 3px color-mix(in srgb, var(--foreground) 40%, transparent)' }}
          _focusVisible={{ boxShadow: '0 0 0 2px color-mix(in srgb, var(--foreground) 35%, transparent)' }}
        >
          <LuSettings />
        </IconButton>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content
            borderWidth="1px"
            borderColor="var(--border)"
            bg="var(--background)"
            color="var(--foreground)"
            boxShadow="md"
          >
            <Popover.Arrow />
            <Popover.Body>
              <Box mt={3}>
                <ThemeControl />
              </Box>
              <Box mt={3}>
                <ViewStyleControl />
              </Box>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}
