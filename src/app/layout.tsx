import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {ReCaptchaProvider} from "next-recaptcha-v3";
import clientConfig from "@/app/config/clientConfig";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sophron Risk Analyzer",
  description: "A lightweight AI-assisted web app for evaluating the risk of cryptocurrency coins based on Twitter sentiment and CoinGecko price data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <ReCaptchaProvider
          useEnterprise
          reCaptchaKey={clientConfig.RECAPTCHA_SITE_KEY || ""}
      >
        {children}
      </ReCaptchaProvider>
      </body>
    </html>
  );
}
