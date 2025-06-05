"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../common/Button";
import {
  Check,
  ArrowRight,
  Calculator,
  Code,
  Palette,
  Search,
  Share2,
  Shield,
  Plus,
  Minus,
} from "lucide-react";
import { useTranslations } from "@/app/hooks/useTranslations";

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
  const { t } = useTranslations();
  const [isAnnual, setIsAnnual] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [calculatorState, setCalculatorState] = useState<CalculatorState>({});
  const [totalCost, setTotalCost] = useState(0);

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
        ease: "easeOut",
      },
    },
  };

  const pricingPlans = [
    {
      name: t("pricing.plans.starter.name"),
      price: isAnnual ? 1499 : 149,
      period: isAnnual ? "/year" : "/month",
      description: t("pricing.plans.starter.description"),
      features: [
        t("pricing.plans.starter.features.0"),
        t("pricing.plans.starter.features.1"),
        t("pricing.plans.starter.features.2"),
        t("pricing.plans.starter.features.3"),
        t("pricing.plans.starter.features.4"),
        t("pricing.plans.starter.features.5"),
      ],
      popular: false,
      cta: t("pricing.plans.starter.cta"),
    },
    {
      name: t("pricing.plans.professional.name"),
      price: isAnnual ? 3999 : 399,
      period: isAnnual ? "/year" : "/month",
      description: t("pricing.plans.professional.description"),
      features: [
        t("pricing.plans.professional.features.0"),
        t("pricing.plans.professional.features.1"),
        t("pricing.plans.professional.features.2"),
        t("pricing.plans.professional.features.3"),
        t("pricing.plans.professional.features.4"),
        t("pricing.plans.professional.features.5"),
        t("pricing.plans.professional.features.6"),
        t("pricing.plans.professional.features.7"),
      ],
      popular: true,
      cta: t("pricing.plans.professional.cta"),
    },
    {
      name: t("pricing.plans.enterprise.name"),
      price: t("pricing.plans.enterprise.price"),
      period: "",
      description: t("pricing.plans.enterprise.description"),
      features: [
        t("pricing.plans.enterprise.features.0"),
        t("pricing.plans.enterprise.features.1"),
        t("pricing.plans.enterprise.features.2"),
        t("pricing.plans.enterprise.features.3"),
        t("pricing.plans.enterprise.features.4"),
        t("pricing.plans.enterprise.features.5"),
        t("pricing.plans.enterprise.features.6"),
        t("pricing.plans.enterprise.features.7"),
      ],
      popular: false,
      cta: t("pricing.plans.enterprise.cta"),
    },
  ];

  const serviceOptions: ServiceOption[] = [
    {
      id: "web-dev",
      name: "Web Development",
      icon: Code,
      basePrice: 2500,
      description: "Custom website or web application",
      included: ["Responsive Design", "SEO Basic", "Contact Forms"],
    },
    {
      id: "mobile-app",
      name: "Mobile App",
      icon: Code,
      basePrice: 5000,
      description: "iOS/Android mobile application",
      included: ["Cross-platform", "App Store Submission", "Basic Analytics"],
    },
    {
      id: "design",
      name: "Brand & Design",
      icon: Palette,
      basePrice: 1500,
      description: "Complete brand identity and design system",
      included: ["Logo Design", "Brand Guidelines", "Marketing Materials"],
    },
    {
      id: "seo",
      name: "SEO & Marketing",
      icon: Search,
      basePrice: 800,
      description: "Monthly SEO and digital marketing services",
      included: ["Keyword Research", "Content Strategy", "Analytics"],
    },
    {
      id: "social",
      name: "Social Media",
      icon: Share2,
      basePrice: 600,
      description: "Monthly social media management",
      included: [
        "Content Creation",
        "Posting Schedule",
        "Community Management",
      ],
    },
    {
      id: "consulting",
      name: "IT Consulting",
      icon: Shield,
      basePrice: 150,
      description: "Hourly consulting and strategy sessions",
      included: ["Strategic Planning", "Technical Guidance", "Security Review"],
    },
  ];

  useEffect(() => {
    const initialState: CalculatorState = {};
    serviceOptions.forEach((service) => {
      initialState[service.id] = { selected: false, quantity: 1 };
    });
    setCalculatorState(initialState);
  }, []);

  useEffect(() => {
    let total = 0;
    Object.keys(calculatorState).forEach((serviceId) => {
      const state = calculatorState[serviceId];
      if (state.selected) {
        const service = serviceOptions.find((s) => s.id === serviceId);
        if (service) {
          total += service.basePrice * state.quantity;
        }
      }
    });
    setTotalCost(total);
  }, [calculatorState]);

  const toggleService = (serviceId: string) => {
    setCalculatorState((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        selected: !prev[serviceId]?.selected,
      },
    }));
  };

  const updateQuantity = (serviceId: string, change: number) => {
    setCalculatorState((prev) => {
      const current = prev[serviceId]?.quantity || 1;
      const newQuantity = Math.max(1, current + change);
      return {
        ...prev,
        [serviceId]: {
          ...prev[serviceId],
          quantity: newQuantity,
        },
      };
    });
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
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("pricing.title")}
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {t("pricing.subtitle")}
            </p>
          </motion.div>

          {/* Pricing Plans */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
          >
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`relative bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  plan.popular ? "ring-2 ring-blue-600 scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    {typeof plan.price === "string" ? (
                      <span className="text-4xl font-bold text-slate-900 dark:text-white">
                        {plan.price}
                      </span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-slate-900 dark:text-white">
                          ${plan.price}
                        </span>
                        <span className="text-slate-600 dark:text-slate-400">
                          {plan.period}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center space-x-3"
                    >
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300 text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? "gradient" : "outline"}
                  size="lg"
                  className="w-full"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => {
                    const element = document.getElementById("contact");
                    if (element) element.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </motion.div>

          {/* Interactive Calculator */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg"
          >
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Calculator className="w-8 h-8 text-blue-600" />
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Custom Quote Calculator
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Mix and match services to get a personalized quote for your
                project.
              </p>
            </div>

            {/* Pricing Plan Toggle */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <button
                className={`px-4 py-2 rounded-lg font-semibold ${!isAnnual ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white"}`}
                onClick={() => setIsAnnual(false)}
              >
                {t("pricing.toggle.monthly")}
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-semibold ${isAnnual ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white"}`}
                onClick={() => setIsAnnual(true)}
              >
                {t("pricing.toggle.annual")}
              </button>
              <span className="ml-2 text-green-600 font-semibold">
                {t("pricing.toggle.savings", { percent: "20" })}
              </span>
            </div>

            {!calculatorOpen ? (
              <div className="text-center">
                <Button
                  variant="gradient"
                  size="xl"
                  onClick={() => setCalculatorOpen(true)}
                  rightIcon={<Calculator className="w-5 h-5" />}
                >
                  Open Price Calculator
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {serviceOptions.map((service) => {
                    const Icon = service.icon;
                    const state = calculatorState[service.id] || {
                      selected: false,
                      quantity: 1,
                    };

                    return (
                      <div
                        key={service.id}
                        className={`border-2 rounded-xl p-6 transition-all duration-300 cursor-pointer ${
                          state.selected
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                        }`}
                        onClick={() => toggleService(service.id)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                state.selected
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                                {service.name}
                              </h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {service.description}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-slate-900 dark:text-white">
                              ${service.basePrice}
                            </div>
                            {state.selected && service.id !== "consulting" && (
                              <div className="flex items-center space-x-2 mt-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateQuantity(service.id, -1);
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
                                    updateQuantity(service.id, 1);
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
                          {service.included.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400"
                            >
                              <Check className="w-3 h-3 text-green-500" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total Cost Display */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-bold mb-2">
                        Estimated Total
                      </h4>
                      <p className="opacity-90 text-sm">
                        Based on your selected services
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold">
                        ${totalCost.toLocaleString()}
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            const element = document.getElementById("contact");
                            if (element)
                              element.scrollIntoView({ behavior: "smooth" });
                          }}
                          rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                          Get Quote
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
