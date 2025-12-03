"use client";

import { ArrowRight, Calculator, Check, Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/common/Button";
import { getIconComponent } from "@/lib/icon-mapper";
import type { LocalizedString, PricingItem } from "@/lib/supabase";

import type { Currency } from "../PricingClient";

interface PricingCalculatorProps {
  items: PricingItem[];
  currency: Currency;
  locale: string;
}

interface CalculatorState {
  [key: string]: {
    selected: boolean;
    quantity: number;
  };
}

const getLocalizedText = (text: LocalizedString, locale: string): string => {
  return text[locale as keyof LocalizedString] || text.en || "";
};

const formatPrice = (price: number, currency: Currency): string => {
  if (currency === "CZK") {
    return `${price.toLocaleString()} Kč`;
  } else {
    return `€${price.toLocaleString()}`;
  }
};

export default function PricingCalculator({
  items,
  currency,
  locale,
}: PricingCalculatorProps) {
  const t = useTranslations("pricing");
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [calculatorState, setCalculatorState] = useState<CalculatorState>({});
  const [totalCost, setTotalCost] = useState(0);

  // Group items by category
  const itemsByCategory = items.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, PricingItem[]>,
  );

  useEffect(() => {
    const initialState: CalculatorState = {};
    items.forEach((item) => {
      initialState[item.id] = { selected: false, quantity: 1 };
    });
    setCalculatorState(initialState);
  }, [items]);

  useEffect(() => {
    let total = 0;
    Object.keys(calculatorState).forEach((itemId) => {
      const state = calculatorState[itemId];
      if (state.selected) {
        const item = items.find((i) => i.id === itemId);
        if (item) {
          const price =
            currency === "CZK" ? item.base_price_czk : item.base_price_eur;
          total += price * state.quantity;
        }
      }
    });
    setTotalCost(total);
  }, [calculatorState, items, currency]);

  const toggleItem = (itemId: string) => {
    setCalculatorState((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        selected: !prev[itemId]?.selected,
      },
    }));
  };

  const updateQuantity = (itemId: string, change: number) => {
    setCalculatorState((prev) => {
      const current = prev[itemId]?.quantity || 1;
      const newQuantity = Math.max(1, current + change);
      return {
        ...prev,
        [itemId]: {
          ...prev[itemId],
          quantity: newQuantity,
        },
      };
    });
  };

  const handleGetQuote = () => {
    // Scroll to contact section or redirect to contact page
    const contactElement = document.getElementById("contact");
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: "smooth" });
    } else {
      // If no contact section on page, redirect to contact page
      window.location.href = `/${locale}/contact`;
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-terminal-dark rounded-2xl p-8 shadow-lg">
        <div className="text-center">
          <Calculator className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-300">
            {t("calculator.noItemsAvailable")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-terminal-dark rounded-2xl p-8 shadow-lg">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Calculator className="w-8 h-8 text-blue-600" />
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
            {t("calculator.title")}
          </h3>
        </div>
        <p className="text-slate-600 dark:text-slate-300">
          {t("calculator.description")}
        </p>
      </div>

      {!calculatorOpen ? (
        <div className="text-center">
          <Button
            variant="gradient"
            size="xl"
            onClick={() => setCalculatorOpen(true)}
            rightIcon={<Calculator className="w-5 h-5" />}
          >
            {t("calculator.openButton")}
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
            <div key={category} className="space-y-4">
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white capitalize">
                {t(`calculator.categories.${category}`)}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryItems.map((item) => {
                  const state = calculatorState[item.id] ?? {
                    selected: false,
                    quantity: 1,
                  };
                  const price =
                    currency === "CZK"
                      ? item.base_price_czk
                      : item.base_price_eur;

                  // Get the icon component based on the string stored in database
                  const IconComponent = getIconComponent(item.icon);

                  return (
                    <div
                      key={item.id}
                      className={`border-2 rounded-xl p-6 transition-all duration-300 cursor-pointer ${
                        state.selected
                          ? "border-purple-600 bg-purple-950/50 "
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                      onClick={() => toggleItem(item.id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              state.selected
                                ? "bg-purple-600 text-white"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="text-lg font-semibold text-slate-900 dark:text-white">
                              {getLocalizedText(item.name, locale)}
                            </h5>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {getLocalizedText(item.description, locale)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-slate-900 dark:text-white">
                            {formatPrice(price, currency)}
                          </div>
                          {state.selected && (
                            <div className="flex items-center space-x-2 mt-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateQuantity(item.id, -1);
                                }}
                                className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">
                                {state.quantity}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateQuantity(item.id, 1);
                                }}
                                className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        {item.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400"
                          >
                            <Check className="w-3 h-3 text-green-500" />
                            <span>{t(`calculator.features.${feature}`)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Total Cost Display */}
          <div className="bg-purple-950/50 border-2 border-purple-950/20 rounded-xl p-6 inset-shadow-2xs inset-shadow-slate-950/50  text-white">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-bold mb-2">
                  {t("calculator.estimatedTotal")}
                </h4>
                <p className="opacity-90 text-sm">
                  {t("calculator.basedOnSelection")}
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">
                  {formatPrice(totalCost, currency)}
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Button
                    variant="gradient"
                    size="sm"
                    onClick={handleGetQuote}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    {t("calculator.getQuote")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
