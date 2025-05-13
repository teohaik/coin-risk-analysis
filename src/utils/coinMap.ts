import coinMap from '@/data/coin-map.json'

export function getCoinGeckoIdBySymbol(symbol: string): string | null {
    const match = coinMap.find(
        (coin) => coin.symbol.toLowerCase() === symbol.toLowerCase()
    )
    return match ? match.id : null
}

export function searchCoinsBySymbol(input: string) {
    if (!input) return []
    return coinMap
        .filter((coin) => coin.symbol.toLowerCase() === input.toLowerCase())
        .sort((a, b) => a.name.localeCompare(b.name)) // optional: sort alphabetically
}
