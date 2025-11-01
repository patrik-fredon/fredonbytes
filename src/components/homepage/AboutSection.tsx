"use client";

import { motion } from "framer-motion";
import { Users, Award, TrendingUp, CheckCircle, ArrowRight, Globe, Smartphone, Shield } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React from "react";

import { Link } from "@/i18n/navigation";

import { Button } from "../common/Button";
import GlassCard from "../dev-ui/GlassCard";

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
            <h2 className="text-3xl lg:text-5xl font-bold text-terminal-light mb-6 font-mono">
              <span className="text-neon-cyan">//</span> {t("about.title")}{" "}
              {t("about.company")}
            </h2>
            <p className="text-xl text-terminal-light/80 max-w-3xl mx-auto leading-relaxed mb-8">
              {t("about.subtitle")}
            </p>
            {/* Stats - Terminal Styled */}
            <motion.div variants={itemVariants} className="m-16">

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center group">
                      <div className="w-14 h-14 mx-auto mb-4 bg-neon-cyan/5 rounded-full flex items-center justify-center border border-neon-cyan/30 group-hover:border-neon-cyan/50 group-hover:shadow-glow-cyan-subtle transition-all">
                        <Icon className="w-8 h-8 text-neon-purple" />
                      </div>
                      <div className="text-3xl font-bold mb-2 text-terminal-light font-mono">
                        {stat.number}
                      </div>
                      <div className="text-terminal-light/70 font-mono text-sm">{stat.label}</div>
                    </div>
                  );
                })}
              </div>

            </motion.div>
            <Link href="/about">
              <Button
                variant="gradient"
                size="xl"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="font-mono"
              >
                $ {t("common.buttons.learnMore")} --about
              </Button>
            </Link>
          </motion.div>

          {/* Mission & Vision - Terminal Styled */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20"
          >
            <GlassCard className="p-8" glowColor="cyan">
              <h3 className="flex justify-center text-2xl font-bold text-terminal-light mb-4 font-mono">
                <span className="text-neon-cyan">//</span> {t("about.mission.title")}
              </h3>
              <p className="text-terminal-light/80 leading-relaxed italic">
                &ldquo;{t("about.mission.description")}&rdquo;
              </p>
            </GlassCard>
            <GlassCard className="p-8" glowColor="purple">
              <h3 className="text-2xl flex justify-center font-bold text-terminal-light mb-4 font-mono">
                <span className="text-neon-purple">//</span> {t("about.vision.title")}
              </h3>
              <p className="text-terminal-light/80 leading-relaxed italic">
                &ldquo;{t("about.vision.description")}&rdquo;
              </p>
            </GlassCard>
          </motion.div>


          {/* Core Values - Terminal Cards */}
          <motion.div variants={itemVariants} className="mb-20">
            <h3 className="text-3xl font-bold text-terminal-light text-center mb-12 font-mono">
              <span className="text-neon-cyan">//</span> {t("about.values.title")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="text-center"
                  >
                    <GlassCard className="p-6 h-full" glowColor="cyan">
                      <div className="w-16 h-16 mx-auto mb-4 bg-neon-cyan/10 border border-neon-cyan/40 rounded-xl flex items-center justify-center">
                        <Icon className="w-8 h-8 text-neon-cyan" />
                      </div>
                      <h4 className="text-lg font-semibold text-terminal-light mb-2 font-mono">
                        {value.title}
                      </h4>
                      <p className="text-terminal-light/80 text-sm">
                        {value.description}
                      </p>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
          {/* Founder Quote - Terminal Styled */}
          <motion.div variants={itemVariants} className="m-20">
            <GlassCard className="p-8 text-center" glowColor="purple" strongGlow>
              <blockquote className="text-lg font-medium text-terminal-light mb-6 leading-relaxed font-mono">
                <span className="text-neon-purple">//</span> &ldquo;{t("about.founderQuote.quote")}&rdquo;
              </blockquote>
              <cite className="text-terminal-light/70 text-sm font-mono">
                — {t("about.founderQuote.author")}
              </cite>
            </GlassCard>
          </motion.div>

          {/* Team Section - GlassCard */}
          {showTeam && (
            <motion.div variants={itemVariants}>
              <h3 className="text-3xl font-bold text-terminal-light text-center mb-12 font-mono">
                <span className="text-neon-cyan">//</span> {t("about.team.title")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="group"
                  >
                    <GlassCard className="p-6 h-full" glowColor="cyan">
                      <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-neon-cyan/50 shadow-glow-cyan group-hover:border-neon-cyan group-hover:shadow-glow-cyan-strong transition-all duration-200">
                        {member.image === "user-placeholder" ? (
                          <div className="w-full h-full bg-gradient-to-br from-terminal-dark to-slate-900 flex items-center justify-center">
                            <Users className="w-12 h-12 text-neon-cyan" />
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
                      <h4 className="text-lg font-semibold text-terminal-light text-center mb-1 font-mono">
                        {member.name}
                      </h4>
                      <p className="text-neon-cyan text-sm text-center mb-2 font-medium font-mono">
                        {member.role}
                      </p>
                      <p className="text-terminal-light/70 text-xs text-center mb-3">
                        {member.expertise}
                      </p>
                      <p className="text-terminal-light/80 text-xs text-center italic">
                        <span className="text-neon-cyan">//</span> &ldquo;{member.quote}&rdquo;
                      </p>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}



          {/* Company Mantra - Terminal Styled */}
          <motion.div variants={itemVariants} className="mt-12 text-center">
            <p className="text-2xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent font-mono">
              <span className="">//</span>{" "}
              {t("about.mantra")}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
