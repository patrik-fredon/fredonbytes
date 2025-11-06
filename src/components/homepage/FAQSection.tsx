import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/common/Button";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  locale: string;
}

export default async function FAQSection({ locale }: FAQSectionProps) {
  const t = await getTranslations({ locale, namespace: "faq" });

  const faqs: FAQItem[] = [
    {
      question: t("items.0.question"),
      answer: t("items.0.answer"),
    },
    {
      question: t("items.1.question"),
      answer: t("items.1.answer"),
    },
    {
      question: t("items.2.question"),
      answer: t("items.2.answer"),
    },
    {
      question: t("items.3.question"),
      answer: t("items.3.answer"),
    },
    {
      question: t("items.4.question"),
      answer: t("items.4.answer"),
    },
    {
      question: t("items.5.question"),
      answer: t("items.5.answer"),
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-electric-purple font-mono">
            {t("title")}
          </h2>
          <p className="text-lg sm:text-xl text-terminal-light/80 max-w-3xl mx-auto font-mono">
            {t("subtitle")}
          </p>
        </div>

        {/* FAQ Items - Native HTML details/summary for zero-JS accordion */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group border border-slate-800/50 rounded-lg overflow-hidden shadow-xl inset-shadow-sm inset-shadow-slate-950/80  bg-glass-bg backdrop-blur-glass  transition-all duration-300"
            >
              <summary className="px-6 py-4 flex items-center justify-between cursor-pointer list-none hover:bg-slate-800/50 transition-colors duration-200 [&::-webkit-details-marker]:hidden">
                <h3 className="text-lg sm:text-xl font-semibold text-terminal-light/80 font-mono pr-4">
                  <span className="text-neon-purple">{'// '}</span>{faq.question}
                </h3>
                <svg
                  className="flex-shrink-0 w-6 h-6 text-cyan-400 transition-transform duration-300 group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>

              <div className="px-6 pb-4 text-terminal-light/80 font-mono leading-relaxed animate-in fade-in duration-200">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-terminal-light/80 font-mono mb-4">
            {t("cta.question")}
          </p>
          <Button variant="gradient">
            <Link
              href="/contact"
              className="inline-block px-8 py-3  text-terminal-light/80 font-bold  transition-colors duration-200 font-mono"
            >
              {t("cta.button")}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
