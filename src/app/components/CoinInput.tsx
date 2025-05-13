import {useEffect, useState} from 'react'
import {searchCoinsBySymbol} from "@/utils/coinMap";

export default function CoinInput({onSelect}: { onSelect: (coin: any) => void }) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (timeoutId) clearTimeout(timeoutId)

        const id = setTimeout(() => {
            const matches = searchCoinsBySymbol(query)
            setResults(matches)
        }, 300) // debounce delay
        setTimeoutId(id)
    }, [query])

    return (
        <div>
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter coin symbol (e.g. pepe)"
                className="border px-2 py-1 w-full"
            />
            {results.length > 0 && (
                <ul className="border mt-2 bg-white">
                    {results.map((coin) => (
                        <li
                            key={coin.id}
                            onClick={() => {
                                onSelect(coin)
                                setQuery(coin.symbol)
                                setResults([])
                            }}
                            className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                        >
                            {coin.name} ({coin.symbol}) — <code>{coin.id}</code>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}