import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import "./globals.css";

import ClientLayoutWrapper from "./components/ClientLayoutWrapper";
import Footer from "./components/common/Footer";
import Header from "./components/common/Header";

// Dynamic imports for heavy components
const AnimatedBackground = dynamic(
  () => import("./components/common/AnimatedBackground"),
  {
    loading: () => <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
  }
);

const CookieConsentBanner = dynamic(
  () => import("./components/common/CookieConsentBanner"),
  {
    loading: () => null
  }
);

const ConditionalAnalytics = dynamic(
  () => import("./components/common/ConditionalAnalytics"),
  {
    loading: () => null
  }
);

const WebVitals = dynamic(
  () => import("./components/WebVitals").then(mod => ({ default: mod.WebVitals })),
  {
    loading: () => null
  }
);

const inter = Inter({
  subsets: ["latin", "latin-ext"], // latin-ext for Czech characters
  display: "swap", // Prevent FOIT (Flash of Invisible Text)
  preload: true,
  variable: "--font-inter",
  fallback: ["system-ui", "arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Fredonbytes - Your All-in-One IT Powerhouse",
  description: "From code to clicks, we deliver complete digital dominance. Full-spectrum IT solutions including software development, graphic design, SEO, and social media marketing.",
  keywords: "web development, software development, IT solutions, graphic design, SEO, social media marketing, Brno, Czech Republic",
  authors: [{ name: "Fredonbytes", url: "https://fredonbytes.cloud" }],
  creator: "Fredonbytes",
  publisher: "Fredonbytes",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fredonbytes.cloud",
    siteName: "Fredonbytes",
    title: "Fredonbytes - Your All-in-One IT Powerhouse",
    description: "From code to clicks, we deliver complete digital dominance. Full-spectrum IT solutions including software development, graphic design, SEO, and social media marketing.",
    images: [
      {
        url: "/FredonBytes_GraphicLogo.png",
        width: 1200,
        height: 630,
        alt: "Fredonbytes Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Fredonbytes",
    creator: "@FredonBytes",
    title: "Fredonbytes - Your All-in-One IT Powerhouse",
    description: "From code to clicks, we deliver complete digital dominance. Full-spectrum IT solutions including software development, graphic design, SEO, and social media marketing.",
    images: ["/FredonBytes_GraphicLogo.png"],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fredonbytes.cloud'),
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Parallel data fetching for locale and messages
  const [locale, messages] = await Promise.all([
    getLocale(),
    getMessages(),
  ]);

  return (
    <html lang={locale} className="scroll-smooth">
      <body
        className={`${inter.variable} antialiased min-h-screen flex flex-col relative`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ClientLayoutWrapper>
            <AnimatedBackground />
            <Header />
            <main className="flex-1 pt-16 lg:pt-20 relative z-10">
              {children}
            </main>
            <Footer />
            <CookieConsentBanner />
            <ConditionalAnalytics />
            <WebVitals />
          </ClientLayoutWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
