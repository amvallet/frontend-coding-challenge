import { useCryptoListings } from "../hooks/useCryptoListings"

const CryptoList = () => {
    const { data, isLoading, error } = useCryptoListings()

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }
    return (
        data?.data?.map((crypto) => (
            <div key={crypto.id}>{crypto.name}</div>
        ))
    )
}

export default CryptoList