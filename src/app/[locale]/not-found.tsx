import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/common/Button";
import TerminalWindow from "@/components/dev-ui/TerminalWindow";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <TerminalWindow title="404 Not Found">
        <div className="text-center p-6">
          <h1 className="text-9xl font-bold text-neon-cyan mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-neon-purple mb-4">
            {t("notFoundHeading")}
          </h2>
          <p className="text-slate-400 mb-8 w-full max-w-md mx-auto">
            {t("notFoundDescription")}
          </p>
          <Link href="/" className="inline-block px-8 py-3 transition-colors">
            <Button variant="gradient">{t("goHomeButton")}</Button>
          </Link>
        </div>
      </TerminalWindow>
    </div>
  );
}
