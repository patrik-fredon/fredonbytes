"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "../common/Button";
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
import { useTranslations } from "@/app/hooks/useTranslations";

export default function ServicesSection() {
  const { t } = useTranslations();
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
      iconBg: "bg-blue-100 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
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
      iconBg: "bg-purple-100 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
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
      iconBg: "bg-green-100 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400",
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
      iconBg: "bg-orange-100 dark:bg-orange-900/20",
      iconColor: "text-orange-600 dark:text-orange-400",
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
      iconBg: "bg-slate-100 dark:bg-slate-900/20",
      iconColor: "text-slate-600 dark:text-slate-400",
    },
  ];

  const stats = [
    {
      number: t("services.stats.satisfaction.number"),
      label: t("services.stats.satisfaction.label"),
      icon: CheckCircle,
    },
    {
      number: t("services.stats.coreServices.number"),
      label: t("services.stats.coreServices.label"),
      icon: Zap,
    },
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

          {/* Services Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20"
          >
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`flex-shrink-0 w-16 h-16 rounded-xl ${service.iconBg} flex items-center justify-center`}
                    >
                      <Icon className={`w-8 h-8 ${service.iconColor}`} />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
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

          {/* Why Choose Us */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-white">
              <div className="text-center mb-8">
                <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                  Why Choose Fredonbytes?
                </h3>
                <p className="text-xl opacity-90 max-w-3xl mx-auto">
                  We&apos;re not just another IT company. We&apos;re your
                  unified digital army, delivering seamless solutions under one
                  roof.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                        <Icon className="w-8 h-8" />
                      </div>
                      <div className="text-3xl lg:text-4xl font-bold mb-2">
                        {stat.number}
                      </div>
                      <div className="text-white/80">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div variants={itemVariants} className="text-center">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Ready to Transform Your Digital Presence?
            </h3>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss how our unified approach can streamline your IT
              needs and accelerate your business growth.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="gradient"
                size="xl"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                onClick={() => {
                  const element = document.getElementById("contact");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Start Your Project
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={() => {
                  const element = document.getElementById("pricing");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
              >
                View Pricing
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
