import { NextRequest, NextResponse } from 'next/server'
import { fetchTweetsForCoin } from '@/utils/twitter';
import { fetchPriceHistory } from '@/utils/coingecko'
import { evaluateRiskWithGPT } from '@/utils/riskModel'
import {getCoinGeckoIdBySymbol} from "@/utils/coinMap";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const coinParam= searchParams.get('coin')

    if (!coinParam) {
        return NextResponse.json({ error: 'Missing coin param' }, { status: 400 })
    }

    const coinId = getCoinGeckoIdBySymbol(coinParam) || coinParam;

    try {
        const [tweets, priceHistory] = await Promise.all([
            fetchTweetsForCoin(coinParam),
            fetchPriceHistory(coinId),
        ])

        const riskAnalysis = await evaluateRiskWithGPT(coinParam, tweets, priceHistory)
        riskAnalysis.coinId = coinId;

        return NextResponse.json(riskAnalysis)
    } catch (err) {
        console.error('Error in /api/analyze:', err)
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
    }
}