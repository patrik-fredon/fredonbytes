import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import { JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { generateLocalizedMetadata } from "@/config/metadata";
import { routing } from "@/i18n/routing";
import "../globals.css";

import GridBackground from "@/components/dev-ui/GridBackground";
import ClientLayoutWrapper from "../../components/ClientLayoutWrapper";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
  variable: "--font-jetbrains-mono",
});

// Dynamic imports for heavy components
const AnimatedBackground = dynamic(
  () => import("../../components/common/AnimatedBackground"),
  {

    loading: () => (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
    ),
  },
);

const CookieConsentBanner = dynamic(
  () => import("../../components/common/CookieConsentBanner"),
  {

    loading: () => null,
  },
);

const ConditionalAnalytics = dynamic(
  () => import("../../components/common/ConditionalAnalytics"),
  {

    loading: () => null,
  },
);

const WebVitals = dynamic(
  () =>
    import("../../components/WebVitals").then((mod) => ({
      default: mod.WebVitals,
    })),
  {

    loading: () => null,
  },
);

// JetBrains Mono loaded via @fontsource imports above
// Variable set via CSS: --font-jetbrains-mono
// Font features: 'liga' 1, 'calt' 1 for ligatures

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generateLocalizedMetadata(locale);
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#161A1F",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};
function configureHeadForTheme() {
  return (
    <head>
      <meta name="apple-mobile-web-app-title" content="FredonBytes" />

      {/* Site Verification for Search Engines */}
      {/* Google Search Console - Add your verification code to .env as NEXT_PUBLIC_GOOGLE_VERIFICATION */}
      {process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION && (
        <meta
          name="google-site-verification"
          content={process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION}
        />
      )}
      {/* Bing Webmaster Tools - Add your verification code to .env as NEXT_PUBLIC_BING_VERIFICATION */}
      {process.env.NEXT_PUBLIC_BING_VERIFICATION && (
        <meta
          name="msvalidate.01"
          content={process.env.NEXT_PUBLIC_BING_VERIFICATION}
        />
      )}

      {/* Resource hints for performance optimization */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />

      {/* Geo-targeting for Czech Republic */}
      <meta name="geo.region" content="CZ-JM" />
      <meta name="geo.placename" content="Brno" />
      <meta name="geo.position" content="49.1951;16.6068" />
      <meta name="ICBM" content="49.1951, 16.6068" />
    </head>
  );
}
export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`scroll-smooth ${jetbrainsMono.variable}`}
      suppressHydrationWarning={true}
    >
      {configureHeadForTheme()}
      <body className="antialiased min-h-screen flex flex-col relative font-jetbrains-mono">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-slate-900 focus:text-cyan-400 focus:rounded-md focus:border focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(0,217,255,0.5)]"
        >
          Skip to main content
        </a>
        <NextIntlClientProvider messages={messages}>
          <ClientLayoutWrapper>
            <AnimatedBackground />
            <GridBackground />
            <Header />
            <main id="main" className="flex-1 pt-16 lg:pt-20 relative z-10">
              {children}
            </main>
            <Footer locale={locale} />
            <CookieConsentBanner />
            <ConditionalAnalytics />
            <WebVitals />
          </ClientLayoutWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
