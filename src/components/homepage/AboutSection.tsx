"use client";

import { motion } from "framer-motion";
import { Users, Award, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React from "react";

import { Link } from "@/i18n/navigation";

import { Button } from "../common/Button";

export default function AboutSection({ showTeam = true }: { showTeam?: boolean }) {
  const t = useTranslations();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
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

  const values = [
    {
      icon: Award,
      title: t("about.values.unifiedExcellence.title"),
      description: t("about.values.unifiedExcellence.description"),
      color: "text-blue-500",
    },
    {
      icon: Users,
      title: t("about.values.clientCentric.title"),
      description: t("about.values.clientCentric.description"),
      color: "text-purple-500",
    },
    {
      icon: TrendingUp,
      title: t("about.values.innovation.title"),
      description: t("about.values.innovation.description"),
      color: "text-cyan-500",
    },
    {
      icon: CheckCircle,
      title: t("about.values.transparency.title"),
      description: t("about.values.transparency.description"),
      color: "text-pink-500",
    },
  ];

  const teamMembers = [
    {
      name: t("about.team.members.patrik.name"),
      role: t("about.team.members.patrik.role"),
      expertise: t("about.team.members.patrik.expertise"),
      quote: t("about.team.members.patrik.quote"),
      image:
        "https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/fullstack-developer-fredon-ceo-co-founder-fredonbytes.avif",
    },
    {
      name: t("about.team.members.jana.name"),
      role: t("about.team.members.jana.role"),
      expertise: t("about.team.members.jana.expertise"),
      quote: t("about.team.members.jana.quote"),
      image:
        "https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/devsecops-engineer-fredonbytes-zoe.avif",
    },
    {
      name: t("about.team.members.lucie.name"),
      role: t("about.team.members.lucie.role"),
      expertise: t("about.team.members.lucie.expertise"),
      quote: t("about.team.members.lucie.quote"),
      image:
        "https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/agile-coach-fredonbytes-violet.avif",
    },
    {
      name: t("about.team.members.tomas.name"),
      role: t("about.team.members.tomas.role"),
      expertise: t("about.team.members.tomas.expertise"),
      quote: t("about.team.members.tomas.quote"),
      image:
        "https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/database-architect-fredonbytes-tony.avif",
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-24">
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
              {t("about.title")}{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("about.company")}
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              {t("about.subtitle")}
            </p>
            <Link href="/about">
              <Button
                variant="gradient"
                size="xl"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                {t("common.buttons.learnMore")}
              </Button>
            </Link>
          </motion.div>

          {/* Mission & Vision */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20"
          >
            <div className="bg-slate-900 border border-purple-500/20 inset-shadow-sm inset-shadow-slate-950/50 rounded-xl p-8">
              <h3 className="flex justify-center text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t("about.mission.title")}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                &ldquo;{t("about.mission.description")}&rdquo;
              </p>
            </div>
            <div className="bg-slate-900 border border-purple-500/20 inset-shadow-sm inset-shadow-slate-950/50 rounded-xl p-8">
              <h3 className="text-2xl flex justify-center font-bold text-slate-900 dark:text-white mb-4">
                {t("about.vision.title")}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                &ldquo;{t("about.vision.description")}&rdquo;
              </p>
            </div>
          </motion.div>


          {/* Core Values */}
          <motion.div variants={itemVariants} className="mb-20">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">
              {t("about.values.title")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="text-center group"
                  >
                    <div className="bg-slate-950/10 border-2 border-slate-950/40 rounded-xl p-6 inset-shadow-2xs inset-shadow-slate-950/50 hover:shadow-xl hover:shadow-purple-950/50 transition-all duration-300 group-hover:-translate-y-2">
                      <div
                        className={`w-16 h-16 mx-auto mb-4 bg-slate-900/80 border border-purple-500/20 inset-shadow-2xs inset-shadow-slate-950/50 rounded-xl flex items-center justify-center ${value.color}`}
                      >
                        <Icon className="w-8 h-8" />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {value.title}
                      </h4>
                      <p className="text-slate-400 text-sm">
                        {value.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
          {/* Founder Quote */}
          <motion.div variants={itemVariants} className="m-20">
            <div className="bg-slate-900 border border-purple-950/20 inset-shadow-sm inset-shadow-slate-950/50 rounded-xl  p-4 text-center">
              <blockquote className="text-md  font-medium text-slate-900 dark:text-white mb-6 leading-relaxed">
                &ldquo;{t("about.founderQuote.quote")}&rdquo;
              </blockquote>
              <cite className="text-slate-600 dark:text-slate-400 text-sm">
                — {t("about.founderQuote.author")}
              </cite>
            </div>
          </motion.div>

          {/* Team Section */}
          {showTeam && (
            <motion.div variants={itemVariants}>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">
                {t("about.team.title")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
                  >
                    <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                      {member.image === "user-placeholder" ? (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center">
                          <Users className="w-12 h-12 text-slate-500 dark:text-slate-400" />
                        </div>
                      ) : (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                          quality={80}
                          sizes="(max-width: 768px) 96px, (max-width: 1024px) 96px, 96px"
                        />
                      )}
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white text-center mb-1">
                      {member.name}
                    </h4>
                    <p className="text-blue-600 dark:text-blue-400 text-sm text-center mb-2 font-medium">
                      {member.role}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-xs text-center mb-3">
                      {member.expertise}
                    </p>
                    <p className="text-slate-700 dark:text-slate-300 text-xs text-center italic">
                      &ldquo;{member.quote}&rdquo;
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}



          {/* Company Mantra */}
          <motion.div variants={itemVariants} className="mt-12 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("about.mantra")}
              </span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
