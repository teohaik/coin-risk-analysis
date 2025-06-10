import axios from "axios";
import { RecaptchaApiResponse } from "../../types/ReCaptcha";
import serverConfig from "../../config/serverConfig";
import clientConfig from "@/app/config/clientConfig";

export async function isRecaptchaValid(
  token: string,
  userAction: string,
  userAgent?: string
): Promise<boolean> {
  try {
    const API_KEY = serverConfig.RECAPTCHA_API_SECRET_KEY;
    const PROJECT_ID = serverConfig.GOOGLE_PROJECT_ID;
    const SITE_KEY = clientConfig.RECAPTCHA_SITE_KEY;

    if (!API_KEY || !PROJECT_ID || !SITE_KEY) {
      console.error("Missing required environment variables for reCAPTCHA.");
      return false;
    }

    const endpoint = `https://recaptchaenterprise.googleapis.com/v1/projects/${encodeURIComponent(
      PROJECT_ID
    )}/assessments?key=${API_KEY}`;

    const payload = {
      event: {
        token,
        siteKey: SITE_KEY,
        expectedAction: userAction,
        userAgent: userAgent || "",
      },
    };

    const redactedPayload = { ...payload, event: { ...payload.event, token: "[REDACTED]" } };
    console.log("Sending payload to reCAPTCHA Enterprise:", redactedPayload);

    const response = await axios.post(endpoint, payload);
    console.log("Received response from reCAPTCHA:", response.data);

    return evaluateGoogleAssessment(response.data, userAction);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error response data:", error.response?.data);
      console.error("Axios error response status:", error.response?.status);
      console.error("Axios error response headers:", error.response?.headers);
    } else {
      console.error("Error during reCAPTCHA validation:", error);
    }
    return false;
  }
}

function evaluateGoogleAssessment(
  response: RecaptchaApiResponse,
  userAction: string
): boolean {
  if ("tokenProperties" in response) {
    return (
      response.tokenProperties.valid &&
      response.tokenProperties.action === userAction &&
      response.riskAnalysis.score >=
        (Number(serverConfig.RECAPTCHA_MIN_SCORE_ACCEPTED) ?? 0.5)
    );
  }
  return false;
}
