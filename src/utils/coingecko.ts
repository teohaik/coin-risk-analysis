
export async function fetchPriceHistory(coin: string) {

    const url = `https://api.coingecko.com/api/v3/coins/${coin.toLowerCase()}/market_chart?vs_currency=usd&days=30`

    console.log('Fetching price history for coin ', coin, ' using ', url);
    const response = await fetch(
        url
        // {
        //     headers: {
        //         'x-cg-pro-api-key': serverConfig.COINGECKO_API_KEY
        //     }
        // }
    );

    if (!response.ok) {
        const errorMessage = await response.json();
        console.error('Failed to fetch price history from CoinGecko, Inner error: ', errorMessage);
        return [];
    }
    const data = await response.json();
    return data
}