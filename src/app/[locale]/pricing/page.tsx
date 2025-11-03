import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import PricingClient from "./PricingClient";

interface PricingPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: PricingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      type: "website",
    },
  };
}

export default async function PricingPage({ params }: PricingPageProps) {
  const { locale } = await params;
  return <PricingClient locale={locale} />;
}
