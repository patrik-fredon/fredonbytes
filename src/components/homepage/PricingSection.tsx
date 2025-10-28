"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";


import { Link } from "@/i18n/navigation";


interface ServiceOption {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  basePrice: number;
  description: string;
  included: string[];
}

interface CalculatorState {
  [key: string]: {
    selected: boolean;
    quantity: number;
  };
}

export default function PricingSection() {
  const t = useTranslations();


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };




  return (
    <section id="pricing" className="py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="bg-background/50 border-2 border-accent rounded-2xl px-8 py-16">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 justify-center items-center gap-12">
              <div className="text-center md:text-left">
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 !leading-tight">{t("homepage.pricingSection.title")}</h2>
                <p className="text-lg lg:text-xl text-slate-300 leading-relaxed">{t("homepage.pricingSection.description")}</p>

                <Link href="/pricing" className="mt-12 bg-linear-to-r from-blue-600 to-purple-600  hover:bg-opacity-80 text-white py-3 px-6 rounded-full text-lg lg:text-xl font-medium transition transform hover:scale-105 hover:shadow-xl inline-block">
                  {t("homepage.pricingSection.cta")}
                </Link>
              </div>
              <div className="text-center">
                <img src="https://readymadeui.com/management-img.webp" alt="Premium Benefits" className="w-full mx-auto" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
