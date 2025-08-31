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
      <Box px={{ base: 4, md: 8 }} py={6} className="bg-background text-foreground">
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} width="full">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <Card.Root
              key={`sk-${i}`}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="sm"
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900"
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
      <Box px={{ base: 4, md: 8 }} py={6} className="bg-background text-foreground">
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
    <Box px={{ base: 4, md: 8 }} py={6} className="bg-background text-foreground">
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} width="full">
        {items.map((crypto) => {
          const price = crypto.quote?.USD?.price
          return (
            <Card.Root
              key={crypto.id}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="sm"
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900"
            >
              <Card.Body>
                <Heading size="sm" mb={1} className="text-gray-900 dark:text-gray-100">
                  {crypto.name} ({crypto.symbol})
                </Heading>
                <Text className="text-gray-600 dark:text-gray-300">Price: {formatUSD(price)}</Text>
              </Card.Body>
            </Card.Root>
          )
        })}
      </SimpleGrid>
    </Box>
  )
}

export default CryptoList