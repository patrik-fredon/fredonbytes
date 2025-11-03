import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-blue-500 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-white mb-4">
          {t('notFoundHeading')}
        </h2>
        <p className="text-slate-400 mb-8 w-full max-w-md mx-auto">
          {t('notFoundDescription')}
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('goHomeButton')}
        </Link>
      </div>
    </div>
  );
}
