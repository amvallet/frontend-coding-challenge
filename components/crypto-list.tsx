import { Alert, Box, Card, Heading, SimpleGrid, Skeleton, Text, Table } from "@chakra-ui/react"
import { useCryptoListings } from "../hooks/useCryptoListings"
import { useViewStyle } from "../hooks/useViewStyle"

function formatUSD(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return "—"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const CryptoList = () => {
  const { data, isLoading, error } = useCryptoListings({ limit: 10 })
  const { viewStyle } = useViewStyle()

  if (isLoading) {
    const skeletonCount = 10
    return (
      <Box px={{ base: 4, md: 8 }} py={6} bg="var(--background)" color="var(--foreground)">
        {viewStyle === "list" ? (
          <Box borderWidth="1px" borderColor="var(--border)" rounded="lg" boxShadow="sm" overflow="hidden" maxW="720px" mx="auto">
            <Table.Root
              size="sm"
              bg="var(--background)"
              color="var(--foreground)"
              borderColor="var(--border)"
              sx={{
                "thead, tbody, tr, th, td": {
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--border)",
                },
              }}
            >
              <Table.Header bg="var(--background)" color="var(--foreground)">
                <Table.Row>
                  <Table.ColumnHeader bg="var(--background)" color="var(--foreground)" borderColor="var(--border)" fontSize="md" fontWeight="semibold">Name</Table.ColumnHeader>
                  <Table.ColumnHeader bg="var(--background)" color="var(--foreground)" borderColor="var(--border)" fontSize="md" fontWeight="semibold">Symbol</Table.ColumnHeader>
                  <Table.ColumnHeader bg="var(--background)" color="var(--foreground)" borderColor="var(--border)" fontSize="md" fontWeight="semibold" textAlign="end">Price</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body bg="var(--background)" color="var(--foreground)">
                {Array.from({ length: skeletonCount }).map((_, i) => (
                  <Table.Row key={`sk-row-${i}`}>
                    <Table.Cell bg="var(--background)" color="var(--foreground)" borderColor="var(--border)"><Skeleton height="18px" width="140px" /></Table.Cell>
                    <Table.Cell bg="var(--background)" color="var(--foreground)" borderColor="var(--border)"><Skeleton height="18px" width="64px" /></Table.Cell>
                    <Table.Cell bg="var(--background)" color="var(--foreground)" borderColor="var(--border)" textAlign="end"><Skeleton height="18px" width="96px" ml="auto" /></Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} width="full">
            {Array.from({ length: skeletonCount }).map((_, i) => (
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
        )}
      </Box>
    )
  }

  if (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return (
      <Box px={{ base: 4, md: 8 }} py={6} bg="var(--background)" color="var(--foreground)">
        <Alert.Root status="error" borderRadius="md">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Request failed</Alert.Title>
            <Alert.Description>{message}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      </Box>
    )
  }

  const items = data?.data ?? []

  return (
    <Box px={{ base: 4, md: 8 }} py={6} bg="var(--background)" color="var(--foreground)">
      {viewStyle === "list" ? (
        <Box borderWidth="1px" borderColor="var(--border)" rounded="lg" boxShadow="sm" overflow="hidden" maxW="720px" mx="auto">
          <Table.Root
            size="sm"
            bg="var(--background)"
            color="var(--foreground)"
            borderColor="var(--border)"
            sx={{
              "thead, tbody, tr, th, td": {
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                borderColor: "var(--border)",
              },
            }}
          >
            <Table.Header bg="var(--background)" color="var(--foreground)">
              <Table.Row>
                <Table.ColumnHeader bg="var(--background)" color="var(--foreground)" borderColor="var(--border)" fontSize="md" fontWeight="semibold">Name</Table.ColumnHeader>
                <Table.ColumnHeader bg="var(--background)" color="var(--foreground)" borderColor="var(--border)" fontSize="md" fontWeight="semibold">Symbol</Table.ColumnHeader>
                <Table.ColumnHeader bg="var(--background)" color="var(--foreground)" borderColor="var(--border)" fontSize="md" fontWeight="semibold" textAlign="end">Price</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body bg="var(--background)" color="var(--foreground)">
              {items.map((crypto) => {
                const price = crypto.quote?.USD?.price
                return (
                  <Table.Row key={crypto.id}>
                    <Table.Cell bg="var(--background)" color="var(--foreground)" borderColor="var(--border)">{crypto.name}</Table.Cell>
                    <Table.Cell bg="var(--background)" color="var(--foreground)" borderColor="var(--border)">{crypto.symbol}</Table.Cell>
                    <Table.Cell bg="var(--background)" color="var(--foreground)" borderColor="var(--border)" textAlign="end">{formatUSD(price)}</Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table.Root>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} width="full">
          {items.map((crypto, i) => {
            const price = crypto.quote?.USD?.price
            return (
              <Card.Root
                key={crypto.id}
                borderWidth="1px"
                borderRadius="lg"
                boxShadow="sm"
                width="300px"
                borderColor="var(--border)"
                bg="var(--background)"
                color="var(--foreground)"
                justifySelf={{ base: "center", md: i % 2 === 0 ? "end" : "start" }}
              >
                <Card.Body>
                  <Heading size="sm" mb={1} color="var(--foreground)">
                    {crypto.name} ({crypto.symbol})
                  </Heading>
                  <Text color="var(--foreground)">Price: {formatUSD(price)}</Text>
                </Card.Body>
              </Card.Root>
            )
          })}
        </SimpleGrid>
      )}
    </Box>
  )
}

export default CryptoList