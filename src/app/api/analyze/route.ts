import { NextRequest, NextResponse } from 'next/server'
import { fetchTweetsForCoin } from '@/utils/twitter';
import { fetchPriceHistory } from '@/utils/coingecko'
import { evaluateRiskWithGPT } from '@/utils/riskModel'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const coinParam= searchParams.get('coin')

    if (!coinParam) {
        return NextResponse.json({ error: 'Missing coin param' }, { status: 400 })
    }


    try {
        const [tweets, priceHistory] = await Promise.all([
            fetchTweetsForCoin(coinParam),
            fetchPriceHistory(coinParam),
        ])

        const riskAnalysis = await evaluateRiskWithGPT(coinParam, tweets, priceHistory)
        riskAnalysis.coinId = coinParam;

        return NextResponse.json(riskAnalysis)
    } catch (err) {
        console.error('Error in /api/analyze:', err)
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
    }
}