"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { Button } from "@/components/common/Button";
import { PricingTier, LocalizedString } from "@/lib/supabase";

import { Currency } from "../PricingClient";

interface PricingTiersProps {
  tiers: PricingTier[];
  currency: Currency;
  locale: string;
}

const getLocalizedText = (text: LocalizedString, locale: string): string => {
  return text[locale as keyof LocalizedString] || text.en || '';
};

const formatPrice = (price: number | null, currency: Currency): string => {
  if (price === null) return '';

  if (currency === 'CZK') {
    return `${price.toLocaleString()} Kč`;
  } else {
    return `€${price.toLocaleString()}`;
  }
};

export default function PricingTiers({ tiers, currency, locale }: PricingTiersProps) {
  const t = useTranslations('pricing');

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

  const handleGetStarted = () => {
    // Scroll to contact section or redirect to contact page
    const contactElement = document.getElementById('contact');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If no contact section on page, redirect to contact page
      window.location.href = `/${locale}/contact`;
    }
  };

  if (tiers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-terminal-light/80 font-mono">
          {t('noTiersAvailable')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {tiers.map((tier) => {
        const price = currency === 'CZK' ? tier.price_czk : tier.price_eur;

        return (
          <motion.div
            key={tier.id}
            variants={itemVariants}
            whileHover={{ 
              y: -4, 
              scale: tier.popular ? 1.05 : 1.02,
              transition: { duration: 0.2, ease: "easeOut" } 
            }}
            className={`relative bg-glass-bg backdrop-blur-glass rounded-2xl p-8 border-2 ${
              tier.popular 
                ? "border-neon-purple shadow-glow-purple-strong scale-105" 
                : "border-neon-cyan/40 shadow-glow-cyan-subtle hover:border-neon-cyan/50 hover:shadow-glow-cyan"
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-neon-purple/20 border-2 border-neon-purple rounded-xl px-4 py-2 shadow-glow-purple text-sm font-semibold flex items-center gap-2 font-mono text-neon-purple">
                  <Star className="w-4 h-4 fill-current" />
                  {t('mostPopular')}
                </div>
              </div>
            )}

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-terminal-light mb-2 font-mono">
                {getLocalizedText(tier.name, locale)}
              </h3>
              <div className="mb-4">
                {price !== null ? (
                  <span className="text-4xl font-bold text-neon-cyan font-mono">
                    {formatPrice(price, currency)}
                  </span>
                ) : (
                  <span className="text-4xl font-bold text-neon-cyan font-mono">
                    {t('customPricing')}
                  </span>
                )}
              </div>
              <p className="text-terminal-light/80 text-sm">
                {getLocalizedText(tier.description, locale)}
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {tier.features.map((feature, featureIndex) => (
                <li
                  key={featureIndex}
                  className="flex items-center space-x-3"
                >
                  <Check className="w-5 h-5 text-neon-cyan flex-shrink-0" />
                  <span className="text-terminal-light/80 text-sm">
                    {t(`features.${feature}`)}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              variant={tier.popular ? "gradient" : "secondary"}
              size="lg"
              className="w-full font-mono"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={handleGetStarted}
            >
              $ {getLocalizedText(tier.cta_text, locale)}
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}