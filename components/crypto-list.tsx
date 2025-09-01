import { Alert, Box, Card, Heading, SimpleGrid, Skeleton, Text, Table, Input, InputGroup, SegmentGroup, HStack, IconButton } from "@chakra-ui/react"
import { useEffect, useMemo, useState } from "react"
import { LuSearch, LuArrowLeft, LuArrowRight } from "react-icons/lu"
import { useCryptoListings, type CryptoListingsResponse, cryptoListingsQueryOptions } from "../hooks/useCryptoListings"
import { useQueryClient } from "@tanstack/react-query"
import { useViewStyle } from "../hooks/useViewStyle"
import { cryptoByIdQueryKey } from "../hooks/useCryptoById"
import CryptoDetailDialog from "./crypto-detail-dialog"
import { formatUSD } from "../lib/format"

 

type Crypto = CryptoListingsResponse["data"][number]

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function makeFuzzyRegex(input: string) {
  const cleaned = escapeRegExp(input.trim())
  const pattern = cleaned.split("").join(".*")
  return new RegExp(pattern, "i")
}

const CryptoList = () => {
  const limit = 10
  const [page, setPage] = useState(1)
  const start = (page - 1) * limit + 1 // 1-based index per API

  const queryClient = useQueryClient()
  const prefetchPage = (targetPage: number) => {
    if (targetPage < 1) return
    const targetStart = (targetPage - 1) * limit + 1
    queryClient.prefetchQuery(cryptoListingsQueryOptions({ start: targetStart, limit }))
  }

  const { data, isLoading, error } = useCryptoListings({ limit, start })
  const { viewStyle } = useViewStyle()

  type SortKey = "name" | "symbol" | "price"
  const [query, setQuery] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("name")

  const items: Crypto[] = useMemo(() => (data?.data ?? []) as Crypto[], [data])

  const displayItems = useMemo<Crypto[]>(() => {
    const q = query.trim()
    let filtered = items
    if (q.length > 0) {
      const re = makeFuzzyRegex(q)
      filtered = items.filter((c) => re.test(c?.name ?? "") || re.test(c?.symbol ?? ""))
    }
    const sorted = [...filtered].sort((a, b) => {
      switch (sortKey) {
        case "name":
          return String(a?.name ?? "").localeCompare(String(b?.name ?? ""))
        case "symbol":
          return String(a?.symbol ?? "").localeCompare(String(b?.symbol ?? ""))
        case "price": {
          const pa = Number(a?.quote?.USD?.price ?? 0)
          const pb = Number(b?.quote?.USD?.price ?? 0)
          return pb-pa
        }
        default:
          return 0
      }
    })
    return sorted
  }, [items, query, sortKey])

  // Seed per-id cache entries so details open instantly without new requests.
  useEffect(() => {
    if (!items?.length) return
    for (const item of items) {
      if (item?.id != null) {
        queryClient.setQueryData(cryptoByIdQueryKey(item.id), item)
      }
    }
  }, [items, queryClient])

  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const openDetails = (id: number) => {
    setSelectedId(id)
    setDetailOpen(true)
  }

  const Controls = (
    <HStack
      gap={3}
      align="center"
      maxW="720px"
      mx="auto"
      mb={4}
      bg="transparent"
      color="var(--foreground)"
    >
      <Box flex="1">
        <InputGroup startElement={<LuSearch />}> 
          <Input
            size="sm"
            placeholder="Search by name or symbol"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            bg="var(--background)"
            color="var(--foreground)"
            borderColor="var(--border)"
            _placeholder={{ color: "color-mix(in srgb, var(--foreground) 55%, transparent)" }}
          />
        </InputGroup>
      </Box>
      <SegmentGroup.Root
        size="sm"
        value={sortKey}
        onValueChange={({ value }) => setSortKey((value as SortKey) ?? "name")}
        bg="var(--background)"
        color="var(--foreground)"
        borderWidth="1px"
        borderColor="var(--border)"
        rounded="md"
      >
        <SegmentGroup.Item value="name" px="3" py="1.5" color="var(--foreground)" _checked={{ color: "var(--background)", bg: "var(--foreground)" }}>
          <SegmentGroup.ItemText color="currentColor">Name</SegmentGroup.ItemText>
          <SegmentGroup.ItemHiddenInput />
        </SegmentGroup.Item>
        <SegmentGroup.Item value="symbol" px="3" py="1.5" color="var(--foreground)" _checked={{ color: "var(--background)", bg: "var(--foreground)" }}>
          <SegmentGroup.ItemText color="currentColor">Symbol</SegmentGroup.ItemText>
          <SegmentGroup.ItemHiddenInput />
        </SegmentGroup.Item>
        <SegmentGroup.Item value="price" px="3" py="1.5" color="var(--foreground)" _checked={{ color: "var(--background)", bg: "var(--foreground)" }}>
          <SegmentGroup.ItemText color="currentColor">Price</SegmentGroup.ItemText>
          <SegmentGroup.ItemHiddenInput />
        </SegmentGroup.Item>
      </SegmentGroup.Root>
    </HStack>
  )

  if (isLoading) {
    const skeletonCount = 10
    return (
      <Box px={{ base: 4, md: 8 }} py={6} bg="var(--background)" color="var(--foreground)">
        {Controls}
        <HStack justify="center" align="center" gap={4}>
          {page > 1 ? (
            <IconButton
              my="auto"
              alignSelf="center"
              aria-label="Previous page"
              onMouseEnter={() => prefetchPage(page - 1)}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <LuArrowLeft />
            </IconButton>
          ) : (
            <IconButton
              my="auto"
              alignSelf="center"
              aria-hidden="true"
              tabIndex={-1}
              pointerEvents="none"
              visibility="hidden"
            >
              <LuArrowLeft />
            </IconButton>
          )}
          {viewStyle === "list" ? (
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
          <IconButton
            my="auto"
            alignSelf="center"
            aria-label="Next page"
            onMouseEnter={() => prefetchPage(page + 1)}
            onClick={() => setPage((p) => p + 1)}
          >
            <LuArrowRight />
          </IconButton>
        </HStack>
      </Box>
    )
  }

  if (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return (
      <Box px={{ base: 4, md: 8 }} py={6} bg="var(--background)" color="var(--foreground)">
        {Controls}
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

  return (
    <Box px={{ base: 4, md: 8 }} py={6} bg="var(--background)" color="var(--foreground)">
      {Controls}
      <HStack justify="center" align="stretch" gap={4}>
        {page > 1 ? (
          <IconButton
            my="auto"
            aria-label="Previous page"
            onMouseEnter={() => prefetchPage(page - 1)}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
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
        {viewStyle === "list" ? (
          <Box borderWidth="1px" borderColor="var(--border)" rounded="lg" boxShadow="sm" overflow="hidden" maxW="720px">
            <Table.Root
              size="sm"
              bg="var(--background)"
              color="var(--foreground)"
              borderColor="var(--border)"
            >
              <Table.Header bg="var(--background)" color="var(--foreground)">
                <Table.Row>
                  <Table.ColumnHeader bg="var(--background)" color="var(--foreground)" borderColor="var(--border)" fontSize="md" fontWeight="semibold">Name</Table.ColumnHeader>
                  <Table.ColumnHeader bg="var(--background)" color="var(--foreground)" borderColor="var(--border)" fontSize="md" fontWeight="semibold">Symbol</Table.ColumnHeader>
                  <Table.ColumnHeader bg="var(--background)" color="var(--foreground)" borderColor="var(--border)" fontSize="md" fontWeight="semibold" textAlign="end">Price</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body bg="var(--background)" color="var(--foreground)">
                {displayItems.map((crypto) => {
                  const price = crypto.quote?.USD?.price
                  return (
                    <Table.Row
                      key={crypto.id}
                      cursor="pointer"
                      _hover={{ bg: "color-mix(in srgb, var(--foreground) 6%, transparent)" }}
                      onClick={() => openDetails(crypto.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          openDetails(crypto.id)
                        }
                      }}
                      aria-label={`Open details for ${crypto.name}`}
                    >
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
            {displayItems.map((crypto, i) => {
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
                  role="button"
                  cursor="pointer"
                  _hover={{ boxShadow: "md", borderColor: "color-mix(in srgb, var(--foreground) 45%, transparent)" }}
                  onClick={() => openDetails(crypto.id)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      openDetails(crypto.id)
                    }
                  }}
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
        <IconButton
          my="auto"
          aria-label="Next page"
          onMouseEnter={() => prefetchPage(page + 1)}
          onClick={() => setPage((p) => p + 1)}
        >
          <LuArrowRight />
        </IconButton>
      </HStack>
      <CryptoDetailDialog open={detailOpen} onOpenChange={setDetailOpen} cryptoId={selectedId ?? undefined} />
    </Box>
  )
}

export default CryptoList