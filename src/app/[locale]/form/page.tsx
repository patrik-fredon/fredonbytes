import { setRequestLocale } from "next-intl/server";

import FormLanding from "./FormLanding";

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Form landing page with IT-themed animations and Start button.
 * Displays animated welcome screen before user begins the form.
 */
export default async function FormPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <FormLanding />;
}
