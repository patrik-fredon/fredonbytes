"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";

import { PricingTier, PricingItem } from "@/lib/supabase";

import CurrencyToggle from "./components/CurrencyToggle";
import PricingCalculator from "./components/PricingCalculator";
import PricingTiers from "./components/PricingTiers";

interface PricingClientProps {
  locale: string;
}

export type Currency = 'CZK' | 'EUR';

export default function PricingClient({ locale }: PricingClientProps) {
  const t = useTranslations('pricing');
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [items, setItems] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        setLoading(true);

        // Fetch pricing tiers and items in parallel
        const [tiersResponse, itemsResponse] = await Promise.all([
          fetch(`/api/pricing/tiers?locale=${locale}`),
          fetch(`/api/pricing/items?locale=${locale}`)
        ]);

        if (!tiersResponse.ok || !itemsResponse.ok) {
          throw new Error('Failed to fetch pricing data');
        }

        const tiersData = await tiersResponse.json();
        const itemsData = await itemsResponse.json();

        setTiers(tiersData.tiers || []);
        setItems(itemsData.items || []);
      } catch (err) {
        console.error('Error fetching pricing data:', err);
        setError('Failed to load pricing information');
      } finally {
        setLoading(false);
      }
    };

    fetchPricingData();
  }, [locale]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300">{t('loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Page Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('title')}
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              {t('subtitle')}
            </p>

            {/* Currency Toggle */}
            <CurrencyToggle
              currency={currency}
              onCurrencyChange={setCurrency}
            />
          </motion.div>

          {/* Pricing Tiers */}
          <motion.div variants={itemVariants} className="mb-20">
            <PricingTiers
              tiers={tiers}
              currency={currency}
              locale={locale}
            />
          </motion.div>

          {/* Enhanced Pricing Calculator */}
          <motion.div variants={itemVariants}>
            <PricingCalculator
              items={items}
              currency={currency}
              locale={locale}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}