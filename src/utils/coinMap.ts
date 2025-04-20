import coinMap from '@/data/coin-map.json'

export function getCoinGeckoIdBySymbol(symbol: string): string | null {
    const match = coinMap.find(
        (coin) => coin.symbol.toLowerCase() === symbol.toLowerCase()
    )
    return match ? match.id : null
}
