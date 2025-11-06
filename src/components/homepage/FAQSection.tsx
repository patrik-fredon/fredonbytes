"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQSection() {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-terminal-light font-mono">
            {t("title")}
          </h2>
          <p className="text-lg sm:text-xl text-terminal-light/80 max-w-3xl mx-auto font-mono">
            {t("subtitle")}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-terminal-light/20 rounded-lg overflow-hidden bg-slate-900/50 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors duration-200"
                aria-expanded={openIndex === index}
              >
                <h3 className="text-lg sm:text-xl font-semibold text-terminal-light font-mono pr-4">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`flex-shrink-0 w-6 h-6 text-cyan-400 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-4 text-terminal-light/80 font-mono leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-terminal-light/80 font-mono mb-4">
            {t("cta.question")}
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-cyan-400 text-slate-900 font-bold rounded-lg hover:bg-cyan-300 transition-colors duration-200 font-mono"
          >
            {t("cta.button")}
          </a>
        </div>
      </div>
    </section>
  );
}
