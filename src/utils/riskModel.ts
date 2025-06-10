import OpenAI from 'openai';
import serverConfig from "@/app/config/serverConfig";
import { RiskAnalysisResult } from "@/app/types/riskModel";

export async function evaluateRiskWithGPT(
    coin: string,
    tweets: string[],
    priceHistory: { prices: [number, number][] }
): Promise<RiskAnalysisResult> {
    const prompt = `

Coin: ${coin}

Tweets:
${tweets.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Price History (timestamp, USD):
${priceHistory.prices
        .map(([ts, price]) => `(${new Date(ts).toISOString()}, $${price.toFixed(2)})`)
        .join('\n')}

Return only a **raw JSON object**, without any markdown or formatting.
Do NOT wrap it in triple backticks or say "Here's the JSON".
Just respond with plain JSON only:

- sentiment ("Positive", "Neutral", or "Negative")
- scamIndicators (array of suspicious keywords)
- riskScore (float 0.0 to 1.0)
- verdict ("Low Risk", "Medium Risk", or "High Risk")
- explanation (a short summary)
`;

    const client = new OpenAI({ apiKey: serverConfig.OPENAI_API_KEY });

    try {
        const response = await client.responses.create({
            model: "gpt-4.1",
            instructions: 'You are a crypto risk analyst.' +
                'Your task is to assess the risk of a cryptocurrency coin based on:' +
                '1. Recent tweets mentioning the coin.' +
                '2. The coin\'s 30-day price history.',
            input: [{ role: 'user', content: prompt }],
            temperature: 0.3,
        });

        const resultText = response.output_text ?? '{}';

        if (!resultText.trim()) {
            console.error('GPT response is empty or undefined:', resultText);
            throw new Error('GPT response is empty');
        }

        const parsedResult = JSON.parse(resultText);

        if (
            typeof parsedResult.sentiment !== 'string' ||
            !Array.isArray(parsedResult.scamIndicators) ||
            typeof parsedResult.riskScore !== 'number' ||
            typeof parsedResult.verdict !== 'string' ||
            typeof parsedResult.explanation !== 'string'
        ) {
            console.error('GPT response has an unexpected structure:', parsedResult);
            throw new Error('GPT response has an invalid structure');
        }

        return parsedResult;
    } catch (err) {
        console.error('Error while processing GPT response:', err);
        throw new Error('Failed to evaluate risk with GPT');
    }
}