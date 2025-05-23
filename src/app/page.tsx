'use client'

import {useState} from 'react'
import {RiskAnalysisResult} from "@/app/types/riskModel";
import CoinInput from "@/app/components/CoinInput";
import { useReCaptcha } from "next-recaptcha-v3";

export default function HomePage() {
    const [coin, setCoin] = useState('')
    const [result, setResult] = useState<RiskAnalysisResult | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { executeRecaptcha } = useReCaptcha();

    const userAction = "analyze_coin";

    const analyzeCoin = async () => {
        if (!coin) return
        setLoading(true)
        setError(null)
        setResult(null)

        try {
            const token = await executeRecaptcha(userAction);

           const res= await fetch("/api/analyze", {
                method: "POST",
                body: JSON.stringify({
                    coin,
                    token,
                    userAction
                }),
            });

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || 'Unknown error')

            setResult(data)
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('An unknown error occurred')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="p-8 max-w-xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">🧙‍♂️ Sophron: Risk Analyzer</h1>
            <p className="text-gray-700 italic">
                <strong>Sophron (Σώφρων)</strong> is an ancient Greek adjective that means:
                “of sound mind,” “self-controlled,” “prudent,” or “moderate.”
            </p>

            <CoinInput onSelect={(coin) => setCoin(coin.id)}/>

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
