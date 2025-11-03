import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { generateLocalizedMetadata } from "@/config/metadata";
import "../globals.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/600.css";
import "@fontsource/jetbrains-mono/700.css";

import ClientLayoutWrapper from "../../components/ClientLayoutWrapper";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";
import GridBackground from "@/components/dev-ui/GridBackground";

// Dynamic imports for heavy components
const AnimatedBackground = dynamic(
  () => import("../../components/common/AnimatedBackground"),
  {
    loading: () => (
      <div className="fixed inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900" />
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
  return <head>
    <meta name="apple-mobile-web-app-title" content="FredonBytes" />
    <script
      dangerouslySetInnerHTML={{
        __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
      }} />
  </head>;
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
    <html lang={locale} className="scroll-smooth" suppressHydrationWarning={true}>
      {configureHeadForTheme()}
      <body
        className="antialiased min-h-screen flex flex-col relative"
        style={{
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        }}
      >
        <NextIntlClientProvider messages={messages}>
          <ClientLayoutWrapper>
            <AnimatedBackground />
            <GridBackground />
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
