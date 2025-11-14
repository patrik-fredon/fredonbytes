"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import GridBackground from "@/components/dev-ui/GridBackground";
import type { PricingItem, PricingTier } from "@/lib/supabase";

import CurrencyToggle from "./components/CurrencyToggle";
import PricingCalculator from "./components/PricingCalculator";
import PricingTiers from "./components/PricingTiers";

interface PricingClientProps {
  locale: string;
}

export type Currency = "CZK" | "EUR";

export default function PricingClient({ locale }: PricingClientProps) {
  const t = useTranslations("pricing");
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [items, setItems] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        setLoading(true);
        const FETCH_TIMEOUT_MS = parseInt(
          process.env.NEXT_PUBLIC_PRICING_FETCH_TIMEOUT_MS || "3000",
        );

        const fetchWithTimeout = (input: string) => {
          return Promise.race([
            fetch(input),
            new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error("Fetch timeout")),
                FETCH_TIMEOUT_MS,
              ),
            ),
          ]) as Promise<Response>;
        };

        // Perform both fetches in parallel and handle results individually
        const [tiersResult, itemsResult] = await Promise.allSettled([
          fetchWithTimeout(`/api/pricing/tiers?locale=${locale}`),
          fetchWithTimeout(`/api/pricing/items?locale=${locale}`),
        ]);

        // Handle results
        let fetchError = false;

        if (tiersResult.status === "fulfilled" && tiersResult.value.ok) {
          const tiersData = await tiersResult.value.json();
          setTiers(tiersData.tiers || []);
        } else {
          console.warn("Warning: failed to fetch pricing tiers", tiersResult);
          fetchError = true;
        }

        if (itemsResult.status === "fulfilled" && itemsResult.value.ok) {
          const itemsData = await itemsResult.value.json();
          setItems(itemsData.items || []);
        } else {
          console.warn("Warning: failed to fetch pricing items", itemsResult);
          fetchError = true;
        }

        if (fetchError && !tiers.length && !items.length) {
          throw new Error("Failed to fetch pricing data");
        }
      } catch (err) {
        console.error("Error fetching pricing data:", err);
        setError("Failed to load pricing information");
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
      <div className="min-h-screen relative py-20">
        <div className="absolute inset-0">
          <GridBackground />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan mx-auto mb-4 shadow-glow-cyan"></div>
            <p className="text-terminal-light/80 font-mono">{t("loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative py-20">
        <div className="absolute inset-0">
          <GridBackground />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <p className="text-error-red font-mono">// Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0">
        <GridBackground />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Page Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold text-terminal-light mb-6 font-mono">
              <span className="text-neon-cyan">//</span> {t("title")}
            </h1>
            <p className="text-xl text-terminal-light/80 max-w-3xl mx-auto leading-relaxed mb-8">
              {t("subtitle")}
            </p>

            {/* Currency Toggle */}
            <CurrencyToggle
              currency={currency}
              onCurrencyChange={setCurrency}
            />
          </motion.div>

          {/* Pricing Tiers */}
          <motion.div variants={itemVariants} className="mb-20">
            <PricingTiers tiers={tiers} currency={currency} locale={locale} />
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
