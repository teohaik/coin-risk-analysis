interface TokenProperties {
  valid: boolean;
  hostname: string;
  action: string;
  createTime: string;
  invalidReason?: string;
}

interface RiskAnalysis {
  score: number;
  reasons: string[];
}

interface Event {
  token: string;
  siteKey: string;
  userAgent: string;
  userIpAddress: string;
  ja3: string;
  expectedAction: string;
}

export interface RecaptchaApiResponse {
  tokenProperties: TokenProperties;
  riskAnalysis: RiskAnalysis;
  event: Event;
  /**
   * A unique identifier for the reCAPTCHA response, typically used for debugging or logging purposes.
   * This value is provided by the reCAPTCHA API.
   */
  name: string;
}

export interface VerifyRecaptchaRequestBody {
  token: string;
  userAction: string;
}

export interface RecaptchaApiResponseInternal {
  success: boolean;
  reason?: string;
}
