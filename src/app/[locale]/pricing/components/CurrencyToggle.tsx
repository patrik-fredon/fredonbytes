"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React from "react";

import type { Currency } from "../PricingClient";

interface CurrencyToggleProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

export default function CurrencyToggle({
  currency,
  onCurrencyChange,
}: CurrencyToggleProps) {
  const t = useTranslations("pricing");

  return (
    <div className="flex justify-center items-center gap-2 mb-8">
      <span className="text-sm text-terminal-light/70 mr-3 font-mono">
        {t("currency.label")}
      </span>
      <div className="relative bg-glass-bg backdrop-blur-glass border border-neon-cyan/30 rounded-lg p-1">
        <motion.div
          className="absolute top-1 bottom-1 bg-neon-cyan/20 border border-neon-cyan rounded-md shadow-glow-cyan-subtle"
          initial={false}
          animate={{
            left: currency === "EUR" ? "4px" : "50%",
            width: currency === "EUR" ? "48%" : "48%",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        <div className="relative flex">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 font-mono ${
              currency === "EUR"
                ? "text-neon-cyan"
                : "text-terminal-light/70 hover:text-terminal-light"
            }`}
            onClick={() => onCurrencyChange("EUR")}
          >
            EUR (€)
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 font-mono ${
              currency === "CZK"
                ? "text-neon-cyan"
                : "text-terminal-light/70 hover:text-terminal-light"
            }`}
            onClick={() => onCurrencyChange("CZK")}
          >
            CZK (Kč)
          </button>
        </div>
      </div>
    </div>
  );
}
