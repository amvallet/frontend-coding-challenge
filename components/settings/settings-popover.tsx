"use client"

import { Box, IconButton, Popover, Portal } from "@chakra-ui/react"
import { LuSettings } from "react-icons/lu"
import ThemeControl from "./theme-control"
import ViewStyleControl from "./view-style-control"

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
