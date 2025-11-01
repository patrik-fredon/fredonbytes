import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 604800; // 7 days - regulatory content

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles = {
    cs: "GDPR | Fredonbytes",
    en: "GDPR Compliance | Fredonbytes",
    de: "DSGVO-Konformität | Fredonbytes",
  };
  return { title: titles[locale as keyof typeof titles] || titles.en };
}

export default async function GDPRPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const Content = (await import(`./page.${locale}.mdx`)).default;

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      <article className="prose prose-lg dark:prose-invert max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Content />
      </article>
    </main>
  );
}
