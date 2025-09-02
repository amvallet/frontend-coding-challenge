"use client"

import { Box, Table, Skeleton, SimpleGrid, Card } from "@chakra-ui/react"

export function ListPlaceholder({ count = 10 }: { count?: number }) {
  return (
    <Box borderWidth="1px" borderColor="var(--border)" rounded="lg" boxShadow="sm" overflow="hidden" maxW="720px">
      <Table.Root size="sm" bg="var(--background)" color="var(--foreground)" borderColor="var(--border)">
        <Table.Header bg="var(--background)" color="var(--foreground)">
          <Table.Row>
            <Table.ColumnHeader bg="var(--background)" color="var(--foreground)" borderColor="var(--border)" fontSize="md" fontWeight="semibold">Name</Table.ColumnHeader>
            <Table.ColumnHeader bg="var(--background)" color="var(--foreground)" borderColor="var(--border)" fontSize="md" fontWeight="semibold">Symbol</Table.ColumnHeader>
            <Table.ColumnHeader bg="var(--background)" color="var(--foreground)" borderColor="var(--border)" fontSize="md" fontWeight="semibold" textAlign="end">Price</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body bg="var(--background)" color="var(--foreground)">
          {Array.from({ length: count }).map((_, i) => (
            <Table.Row key={`sk-row-${i}`}>
              <Table.Cell bg="var(--background)" color="var(--foreground)" borderColor="var(--border)"><Skeleton height="18px" width="140px" /></Table.Cell>
              <Table.Cell bg="var(--background)" color="var(--foreground)" borderColor="var(--border)"><Skeleton height="18px" width="64px" /></Table.Cell>
              <Table.Cell bg="var(--background)" color="var(--foreground)" borderColor="var(--border)" textAlign="end"><Skeleton height="18px" width="96px" ml="auto" /></Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  )
}

export function GridPlaceholder({ count = 10 }: { count?: number }) {
  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} width="full">
      {Array.from({ length: count }).map((_, i) => (
        <Card.Root
          key={`sk-${i}`}
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="sm"
          borderColor="var(--border)"
          bg="var(--background)"
          color="var(--foreground)"
          justifySelf={{ base: "center", md: i % 2 === 0 ? "end" : "start" }}
          width="300px"
        >
          <Card.Body>
            <Skeleton height="24px" mb={2} />
            <Skeleton height="18px" width="50%" />
          </Card.Body>
        </Card.Root>
      ))}
    </SimpleGrid>
  )
}
