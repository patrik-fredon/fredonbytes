"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React from "react";

import { Currency } from "../PricingClient";

interface CurrencyToggleProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

export default function CurrencyToggle({ currency, onCurrencyChange }: CurrencyToggleProps) {
  const t = useTranslations('pricing');

  return (
    <div className="flex justify-center items-center gap-2 mb-8">
      <span className="text-sm text-slate-600 dark:text-slate-400 mr-3">
        {t('currency.label')}
      </span>
      <div className="relative bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
        <motion.div
          className="absolute top-1 bottom-1 bg-white dark:bg-slate-600 rounded-md shadow-sm"
          initial={false}
          animate={{
            left: currency === 'EUR' ? '4px' : '50%',
            width: currency === 'EUR' ? '48%' : '48%',
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        <div className="relative flex">
          <button
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
              currency === 'EUR'
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            onClick={() => onCurrencyChange('EUR')}
          >
            EUR (€)
          </button>
          <button
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
              currency === 'CZK'
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            onClick={() => onCurrencyChange('CZK')}
          >
            CZK (Kč)
          </button>
        </div>
      </div>
    </div>
  );
}