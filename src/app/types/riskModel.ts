
export type RiskAnalysisResult = {
    sentiment: 'Positive' | 'Neutral' | 'Negative'
    scamIndicators: string[]
    riskScore: number
    verdict: 'Low Risk' | 'Medium Risk' | 'High Risk'
    explanation: string
    coinId: string
}
