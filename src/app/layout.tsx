import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import CookieConsentBanner from "./components/common/CookieConsentBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#0f172a",
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1 pt-16 lg:pt-20">
          {children}
        </main>
        <Footer />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
