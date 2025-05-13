# Sophron: A crypto coin risk analyzer

Lightweight AI-assisted web app for evaluating the risk of cryptocurrency coins based on Twitter sentiment and CoinGecko price data. Built with Next.js and React, using OpenAI for analysis.

    Sophron (Σώφρων) is an ancient Greek adjective that means:
    “of sound mind,” “self-controlled,” “prudent,” or “moderate.”
    It comes from the root words:
    •	σῶς (sōs) — safe, sound
    •	φρήν (phrēn) — mind, heart, or spirit

## Features

- Real-time sentiment analysis based on tweets
- Scam signal detection using GPT (e.g. rugpulls, shilling)
- Price history fetched from CoinGecko
- AI-generated risk score and verdict

## Tech Stack

- **Frontend:** React, Next.js
- **Backend:** Next.js API routes
- **AI Integration:** OpenAI API (GPT-4)
- **Data Sources:**
    - Twitter (currently mocked)
    - CoinGecko

## Project Structure

```
/pages
  /api
    analyze.ts         # Main API route for analysis

/utils
  twitter.ts           # Fetch tweets (mocked)
  sentiment.ts         # Analyze sentiment and scam risk with GPT
  coingecko.ts         # Get current and historical price
  coinMap.ts           # Map ticker symbols to CoinGecko IDs

/data
  coin-list.json       # Coin metadata from CoinGecko

/index.tsx             # UI with input form and risk display
```

## How It Works

1. User submits a coin symbol (e.g. `ADA`, `SHIB`)
2. The app looks up the CoinGecko ID from `coin-list.json`
3. Tweets are fetched (mocked)
4. 7-day price data is fetched from CoinGecko
5. GPT-4 analyzes both data sources and returns:
    - Sentiment classification
    - Scam indicators (if any)
    - Risk score (0 to 1)
    - Final verdict and explanation
6. Result is displayed in the UI

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/crypto-risk-analyzer.git
cd crypto-risk-analyzer
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key
```

### 4. Run the development server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Notes

- Twitter data is mocked due to API limitations (can be replaced with real data).
- CoinGecko's free tier is used. Be mindful of rate limits.
- Risk evaluation is based on AI analysis, not financial advice.

## Future Improvements

- Real Twitter integration with API token support
- Multi-source sentiment analysis (Reddit, Telegram)
- Risk history tracking
- Notifications for sudden risk spikes
- Admin dashboard

## License

MIT License

---

Made by **Theodore**. Contributions welcome.
