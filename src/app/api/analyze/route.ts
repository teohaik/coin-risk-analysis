import { NextRequest, NextResponse } from 'next/server'
import { fetchTweetsForCoin } from '@/utils/twitter';
import { fetchPriceHistory } from '@/utils/coingecko'
import { evaluateRiskWithGPT } from '@/utils/riskModel'
import {isRecaptchaValid} from "@/app/api/recaptcha/verifyRecaptcha";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { coin, token, userAction } = body;

    if (!coin) {
        return NextResponse.json({ error: 'Missing coin param' }, { status: 400 })
    }

    // Validate reCAPTCHA
    const isValidHuman = await isRecaptchaValid(
        token,
        userAction,
        req.headers.get("user-agent") || undefined
    );

    if (!isValidHuman) {
        return NextResponse.json(
            { success: false, reason: "reCAPTCHA validation failed." },
            { status: 403 }
        );
    }

    try {
        const [tweets, priceHistory] = await Promise.all([
            fetchTweetsForCoin(coin),
            fetchPriceHistory(coin),
        ])

        const riskAnalysis = await evaluateRiskWithGPT(coin, tweets, priceHistory)
        riskAnalysis.coinId = coin;

        return NextResponse.json(riskAnalysis)
    } catch (err) {
        console.error('Error in /api/analyze:', err)
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
    }
}