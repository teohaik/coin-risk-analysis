import serverConfig from "@/app/config/serverConfig";

type Tweet = {
    id: string;
    text: string;
    lang: string;
};

type TwitterResponse = {
    data?: Tweet[];
};

export async function fetchTweetsForCoin(coin: string): Promise<string[]> {
    const bearerToken = serverConfig.TWITTER_BEARER_TOKEN;
    if (!bearerToken) throw new Error('Missing Twitter Bearer Token')

    const query = encodeURIComponent(`#${coin} OR ${coin} lang:en -is:retweet`)
    const url = `https://api.twitter.com/2/tweets/search/recent?query=${query}&max_results=200&tweet.fields=text,lang`

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${bearerToken}`,
        },
    })

    if (!res.ok) {
        const error = await res.text()
        throw new Error(`Twitter API Error: ${res.status} - ${error}`)
    }

    const twitterData: TwitterResponse = await res.json();
    const englishTweets: string[] = twitterData.data?.filter(
        (tweet: Tweet) => tweet.lang === "en"
    ).map(tweet => tweet.text) ?? [];
    console.log("English tweets count = ", englishTweets.length);
    return englishTweets
}