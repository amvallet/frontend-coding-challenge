"use client"

import { Input, InputGroup } from "@chakra-ui/react"
import { LuSearch } from "react-icons/lu"

export default function SearchInput({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <InputGroup startElement={<LuSearch />}> 
      <Input
        size="sm"
        placeholder="Search by name or symbol"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        bg="var(--background)"
        color="var(--foreground)"
        borderColor="var(--border)"
        _placeholder={{ color: "color-mix(in srgb, var(--foreground) 55%, transparent)" }}
      />
    </InputGroup>
  )
}
