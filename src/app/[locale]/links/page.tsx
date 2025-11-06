import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";

import GridBackground from "@/components/dev-ui/GridBackground";

type Props = {
  params: Promise<{ locale: string }>;
};

// Dynamic imports for Framer Motion components
const ProfileHeader = dynamic(
  () => import("@/components/linktree/ProfileHeader"),
  {
    loading: () => (
      <div className="text-center mb-12">
        <div className="w-32 h-32 mx-auto mb-6 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
        <div className="h-8 w-48 mx-auto mb-2 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="h-6 w-64 mx-auto mb-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="h-20 max-w-2xl mx-auto mb-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
      </div>
    ),
  },
);

const LinkList = dynamic(() => import("@/components/linktree/LinkList"), {
  loading: () => (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"
          />
        ))}
      </div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: "Links - Fredonbytes",
  description:
    "All important links for Fredonbytes - Your All-in-One IT Powerhouse. Find our portfolio, gallery, support portal, and social media.",
  openGraph: {
    title: "Links - Fredonbytes",
    description:
      "All important links for Fredonbytes - Your All-in-One IT Powerhouse.",
    url: "https://fredonbytes.cz/links",
  },
  twitter: {
    title: "Links - Fredonbytes",
    description:
      "All important links for Fredonbytes - Your All-in-One IT Powerhouse.",
  },
};

export default async function LinksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="min-h-screen bg-terminal-dark relative">
      {/* Grid Background */}
      <div className="absolute inset-0">
        <GridBackground />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <ProfileHeader />
        <LinkList />
      </div>
    </div>
  );
}
