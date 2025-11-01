import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: 'Terms of Service - Fredonbytes',
  description: 'Terms and conditions for using Fredonbytes IT services and software development solutions',
  robots: 'index, follow',
};

export const revalidate = 604800; // 7 days

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const Content = (await import(`./page.${locale}.mdx`)).default;
  
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <Content />
          </div>
        </div>
      </div>
    </div>
  );
}
