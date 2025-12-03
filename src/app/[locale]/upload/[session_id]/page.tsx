import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";

import { redirect } from "@/i18n/navigation";

const UploadClient = dynamic(() => import("./UploadClient"), {
  loading: () => (
    <div className="container mx-auto px-4 py-12 lg:py-20">
      <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center">
        <div className="animate-pulse text-white/50">Loading...</div>
      </div>
    </div>
  ),
});

interface UploadPageProps {
  params: Promise<{
    locale: string;
    session_id: string;
  }>;
}

export const revalidate = false;

export async function generateMetadata({
  params,
}: UploadPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    cs: "Nahrát soubory | FredonBytes",
    en: "Upload Files | FredonBytes",
    de: "Dateien hochladen | FredonBytes",
  };

  const descriptions = {
    cs: "Nahrajte soubory ke svému projektu.",
    en: "Upload files to your project.",
    de: "Laden Sie Dateien zu Ihrem Projekt hoch.",
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.en,
    robots: {
      index: false,
      follow: false,
      noarchive: true,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export default async function UploadPage({ params }: UploadPageProps) {
  const { locale, session_id } = await params;
  setRequestLocale(locale);

  if (!isValidUUID(session_id)) {
    redirect({ href: "/upload", locale });
  }

  return <UploadClient sessionId={session_id} locale={locale} />;
}
