import {NextRequest} from "next/server";

export const GET = async (request: NextRequest) => {

    console.log("Cron Job: Check ETH TXs triggered");

    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response("Unauthorized", {
        status: 401,
        });
    }

    console.log("Cron job triggered: Retry failed transactions.");
}