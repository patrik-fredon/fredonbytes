/**
 * CompanyStory Component
 *
 * Displays the emotional, inspiring story about Fredon's developer journey
 * and the "All-in-One digital army" concept.
 *
 * Features:
 * - Dev-themed GlassCard design with terminal aesthetic
 * - 2-column responsive layout (content + mission)
 * - Framer Motion entrance animations with stagger effects
 * - AAA WCAG accessibility compliance
 * - Responsive typography and spacing
 *
 * @module components/about/CompanyStory
 */

"use client";

import { motion, cubicBezier } from "framer-motion";
import { useTranslations } from "next-intl";

import GlassCard from "@/components/dev-ui/GlassCard";

export default function CompanyStory() {
  const t = useTranslations("aboutPage.companyStory");

  // Get content array from translations
  const contentParagraphs = [
    t("content.0"),
    t("content.1"),
    t("content.2"),
    t("content.3"),
    t("content.4"),
    t("content.5"),
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: cubicBezier(0.22, 1, 0.36, 1),
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: cubicBezier(0.25, 0.46, 0.45, 0.94),
        delay: 0.3,
      },
    },
  };

  return (
    <section
      className="mb-16 sm:mb-20 lg:mb-24"
      aria-labelledby="company-story-title"
      id="company-story"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-0">
        <motion.h2
          id="company-story-title"
          className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 sm:mb-12 text-center leading-tight font-mono"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-neon-cyan">//</span> {t("title")}
        </motion.h2>

        {/* 2-Column Layout: Story Content + Mission Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Story Content - Left Column (2/3 width on desktop) */}
          <motion.div
            className="lg:col-span-2"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <GlassCard variant="window" glowColor="normal" className="h-full">
              <motion.div
                className="space-y-4 sm:space-y-5"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                {contentParagraphs.map((paragraph, index) => (
                  <motion.p
                    key={index}
                    variants={itemVariants}
                    className="text-sm sm:text-base text-slate-300 leading-relaxed font-mono"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </motion.div>
            </GlassCard>
          </motion.div>

          {/* Mission Statement - Right Column (1/3 width on desktop) */}
          <motion.div
            className="lg:col-span-1"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <GlassCard
              variant="card"
              glowColor="normal"
              className="h-full sticky top-24"
            >
              <div className="space-y-6">
                {/* Mission Header */}
                <div className="border-b border-neon-purple/20 pb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-neon-purple font-mono flex items-center gap-2">
                    <span className="text-neon-purple">$</span> Our Mission
                  </h3>
                </div>

                {/* Mission Content */}
                <div className="space-y-4">
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-mono italic">
                    &ldquo;{t("mission")}&rdquo;
                  </p>

                  {/* Founder Attribution */}
                  <div className="pt-4 border-t border-neon-purple/10">
                    <p className="text-xs sm:text-sm text-neon-cyan font-mono">
                      <span className="text-slate-500">//</span> {t("founder")}
                    </p>
                    <p className="text-xs text-slate-400 font-mono mt-1">
                      Founder & CEO
                    </p>
                  </div>
                </div>

                {/* Decorative Code Element */}
                <div className="mt-6 p-3 bg-terminal-darker/50 rounded border border-neon-purple/10">
                  <code className="text-xs text-neon-purple font-mono">
                    <span className="text-slate-500">{"{"}</span> status:{" "}
                    <span className="text-neon-cyan">
                      &quot;building_future&quot;
                    </span>{" "}
                    <span className="text-slate-500">{"}"}</span>
                  </code>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
