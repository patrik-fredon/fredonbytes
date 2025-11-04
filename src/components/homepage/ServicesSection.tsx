"use client";

import {
  Code,
  Palette,
  Search,
  Share2,
  Shield,
  ArrowRight,
  CheckCircle,
  Zap,
  Globe,
  Smartphone,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { Link } from "@/i18n/navigation";
import TerminalWindow from "../dev-ui/TerminalWindow";

export default function ServicesSection() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<string>("all");
  const stats = [
    {
      number: t("services.stats.support.number"),
      label: t("services.stats.support.label"),
      icon: Globe,
    },
    {
      number: t("services.stats.team.number"),
      label: t("services.stats.team.label"),
      icon: Smartphone,
    },
    {
      number: 2023,
      label: t("hero.stats.founded"),
      icon: Shield,
    },
    {
      number: t("services.stats.satisfaction.number"),
      label: t("services.stats.satisfaction.label"),
      icon: CheckCircle,
    },
  ];
  const serviceCategories = [
    { id: "all", label: t("services.categories.all") || "All Services" },
    {
      id: "development",
      label: t("services.categories.development") || "Development",
    },
    { id: "design", label: t("services.categories.design") || "Design" },
    {
      id: "marketing",
      label: t("services.categories.marketing") || "Marketing",
    },
  ];

  const services = [
    {
      icon: Code,
      title: t("services.items.development.title"),
      description: t("services.items.development.description"),
      features: [
        t("services.items.development.features.0"),
        t("services.items.development.features.1"),
        t("services.items.development.features.2"),
        t("services.items.development.features.3"),
      ],
      color: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-900/20",
      iconColor: "text-neon-cyan",
      category: "development",
    },
    {
      icon: Palette,
      title: t("services.items.design.title"),
      description: t("services.items.design.description"),
      features: [
        t("services.items.design.features.0"),
        t("services.items.design.features.1"),
        t("services.items.design.features.2"),
        t("services.items.design.features.3"),
      ],
      color: "from-purple-500 to-pink-500",
      iconBg: "bg-purple-900/20",
      iconColor: "text-electric-purple",
      category: "design",
    },
    {
      icon: Search,
      title: t("services.items.seo.title"),
      description: t("services.items.seo.description"),
      features: [
        t("services.items.seo.features.0"),
        t("services.items.seo.features.1"),
        t("services.items.seo.features.2"),
        t("services.items.seo.features.3"),
      ],
      color: "from-green-500 to-emerald-500",
      iconBg: "bg-green-900/20",
      iconColor: "text-code-green",
      category: "marketing",
    },
    {
      icon: Share2,
      title: t("services.items.social.title"),
      description: t("services.items.social.description"),
      features: [
        t("services.items.social.features.0"),
        t("services.items.social.features.1"),
        t("services.items.social.features.2"),
        t("services.items.social.features.3"),
      ],
      color: "from-orange-500 to-red-500",
      iconBg: "bg-orange-900/20",
      iconColor: "text-warning-amber",
      category: "marketing",
    },
    {
      icon: Shield,
      title: t("services.items.consulting.title"),
      description: t("services.items.consulting.description"),
      features: [
        t("services.items.consulting.features.0"),
        t("services.items.consulting.features.1"),
        t("services.items.consulting.features.2"),
        t("services.items.consulting.features.3"),
      ],
      color: "from-slate-500 to-slate-700",
      iconBg: "bg-slate-900/20",
      iconColor: "text-slate-400",
      category: "development",
    },
    {
      icon: Globe,
      title: t("services.items.maintenance.title"),
      description: t("services.items.maintenance.description"),
      features: [
        t("services.items.maintenance.features.0"),
        t("services.items.maintenance.features.1"),
        t("services.items.maintenance.features.2"),
        t("services.items.consulting.features.3"),
      ],
      color: "from-slate-500 to-slate-700",
      iconBg: "bg-teal-900/20",
      iconColor: "text-neon-cyan",
      category: "development",
    },
  ];

  const filteredServices =
    activeTab === "all"
      ? services
      : services.filter((service) => service.category === activeTab);

  return (
    <section id="services" className="py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="section-animate">
          {/* Section Header */}
          <div className="section-animate-child text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 font-mono">
              <span className="text-neon-cyan">//</span>{" "}
              <span className="bg-linear-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                {t("services.title")}
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-mono">
              {t("services.subtitle")}
            </p>
          </div>

          {/* IDE-Style Tab Navigation */}
          <div className="section-animate-child mb-8">
            <div className="flex flex-wrap justify-center gap-2 bg-terminal-dark border border-neon-purple/20  rounded-lg p-2">
              {serviceCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`px-4 py-2 rounded-md font-mono text-sm transition-all duration-fast ${
                    activeTab === category.id
                      ? "bg-neon-cyan/20 text-neon-purple border border-neon-purple shadow-glow-purple-subtle"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid - TerminalWindow Cards */}
          <div className="section-animate-child grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {filteredServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="group">
                  <TerminalWindow title={service.title} className="h-full">
                    <div className="p-4 space-y-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-12 h-12 rounded-xl ${service.iconBg} flex items-center justify-center border border-neon-cyan/20 transition-all duration-200 hover:scale-110 hover:border-neon-cyan/50 hover:shadow-glow-cyan`}
                        >
                          <Icon
                            className={`w-8 h-8 ${service.iconColor} drop-shadow-[0_0_10px_currentColor]`}
                          />
                        </div>
                        <h3 className="text-lg font-bold text-white font-mono">
                          {service.title}
                        </h3>
                      </div>

                      <p className="text-slate-400 text-sm leading-relaxed font-mono">
                        {service.description}
                      </p>

                      <div className="space-y-2">
                        <p className="text-neon-cyan text-xs font-mono">
                          // Features:
                        </p>
                        <ul className="space-y-1">
                          {service.features.map((feature, featureIndex) => (
                            <li
                              key={featureIndex}
                              className="flex items-start space-x-2 text-xs text-slate-300 font-mono"
                            >
                              <CheckCircle className="w-3 h-3 text-code-green shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </TerminalWindow>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
