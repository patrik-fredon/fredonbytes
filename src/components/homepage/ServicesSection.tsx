"use client";

import { motion } from "framer-motion";
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
import React from "react";
import { Link } from "@/i18n/navigation";



export default function ServicesSection() {
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
      iconColor: "text-blue-400",
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
      iconColor: "text-purple-400",
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
      iconColor: "text-green-400",
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
      iconColor: "text-orange-400",
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
      iconColor: "text-teal-400",
    },
  ];


  return (
    <section id="services" className="py-20 lg:py-24">
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
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("services.title")}
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {t("services.subtitle")}
            </p>
          </motion.div>

          {/* Why Choose Us */}
          <motion.div variants={itemVariants} className="m-16">
            <div className="bg-slate-900 border border-purple-500/20 inset-shadow-sm inset-shadow-slate-950/50 rounded-xl p-8">


              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="w-14 h-14 mx-auto mb-4 bg-slate-950/50  rounded-full flex items-center justify-center">
                        <Icon className="w-8 h-8" />
                      </div>
                      <div className="text-2xl font-bold mb-2 ">
                        {stat.number}
                      </div>
                      <div className="text-white/50">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
          {/* Services Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10"
          >
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-slate-950/20 border-2 border-slate-950/40 rounded-xl p-6 inset-shadow-2xs inset-shadow-slate-950/50 hover:shadow-xl hover:shadow-purple-950/50 transition-all duration-300 group hover:-translate-y-2"
                >
                  <div className="flex items-start space-x-2">
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-xl ${service.iconBg} flex items-center justify-center`}
                    >
                      <Icon className={`w-8 h-8 ${service.iconColor}`} />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-3">
                        {service.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                        {service.description}
                      </p>

                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
