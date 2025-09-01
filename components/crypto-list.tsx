import { Alert, Box, Card, Heading, SimpleGrid, Skeleton, Text } from "@chakra-ui/react"
import { useCryptoListings } from "../hooks/useCryptoListings"

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

  if (isLoading) {
    const skeletonCount = 10
    return (
      <Box px={{ base: 4, md: 8 }} py={6} bg="var(--background)" color="var(--foreground)">
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
    </Box>
  )
}

export default CryptoList