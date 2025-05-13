'use client'

import { useState } from 'react'
import {RiskAnalysisResult} from "@/app/types/riskModel";
import CoinInput from "@/app/components/CoinInput";

export default function HomePage() {
  const [coin, setCoin] = useState('')
  const [result, setResult] = useState<RiskAnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeCoin = async () => {
    if (!coin) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch(`/api/analyze?coin=${coin}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Unknown error')

      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
      <main className="p-8 max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">🕵️‍♂️ Crypto Risk Analyzer</h1>

        {/*<input*/}
        {/*    className="w-full p-2 border rounded"*/}
        {/*    placeholder="Enter coin (e.g., bitcoin, eth)"*/}
        {/*    value={coin}*/}
        {/*    onChange={e => setCoin(e.target.value)}*/}
        {/*/>*/}

          <CoinInput onSelect={(coin) => setCoin(coin.id)} />

        <button
            onClick={analyzeCoin}
            disabled={loading || !coin}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>

        {error && <p className="text-red-600">❌ {error}</p>}

        {result && (
            <div className="p-4 border rounded bg-gray-50 space-y-2">
              <p><strong>Coin ID:</strong> {result.coinId}</p>
              <p><strong>Verdict:</strong> {result.verdict}</p>
              <p><strong>Risk Score:</strong> {result.riskScore.toFixed(2)}</p>
              <p><strong>Sentiment:</strong> {result.sentiment}</p>
              <p><strong>Scam Indicators:</strong> {result.scamIndicators.join(', ') || 'None'}</p>
              <p><strong>Explanation:</strong> {result.explanation}</p>
            </div>
        )}
      </main>
  )
}