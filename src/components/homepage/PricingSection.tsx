"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "../common/Button";
import CommandButton from "../dev-ui/CommandButton";

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


  return (
    <section id="pricing" className="py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="bg-terminal-dark border border-neon-cyan/20 rounded-xl px-8 py-16 shadow-glow-cyan-subtle">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 justify-center items-center gap-12">
              <div className="text-center md:text-left">
                <h2 className="text-3xl lg:text-5xl font-extrabold mb-6 leading-tight font-mono">
                  <span className="text-neon-cyan">//</span>{" "}
                  <span className="bg-gradient-to-r from-neon-cyan to-electric-purple bg-clip-text text-transparent">
                    {t("homepage.pricingSection.title")}
                  </span>
                </h2>
                <p className="text-lg lg:text-xl text-slate-300 leading-relaxed font-mono mb-8">
                  {t("homepage.pricingSection.description")}
                </p>

                <Link href="/pricing" className="inline-block">
                  <Button
                    variant="gradient"
                  >
                    $ {t("homepage.pricingSection.cta")}
                  </Button>
                </Link>
              </div>
              <div className="text-center relative w-full aspect-[16/9] max-w-2xl mx-auto">
                <Image
                  src="https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/fredonbytes-assets/logo_bigger.avif"
                  alt="Premium Benefits - Fredonbytes Professional Services"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                  className="object-contain rounded-lg border border-neon-cyan/20 shadow-glow-cyan-subtle"
                  priority={false}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div >
    </section >
  );
}
