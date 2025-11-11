"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import LinkCard from "../common/LinkCard";

export default function LinkList() {
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
  const t = useTranslations("linktree");
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  const mainLinks = [
    {
      title: t("personalPortfolioTitle"),
      description: t("personalPortfolioDescription"),
      url: "https://me.fredonbytes.cz",
      icon: "portfolio",
    },
    {
      title: t("projectGalleryTitle"),
      description: t("projectGalleryDescription"),
      url: "https://lib.fredonbytes.cz",
      icon: "gallery",
    },
    {
      title: t("techSupportTitle"),
      description: t("techSupportDescription"),
      url: "https://tech.fredonbytes.cz",
      icon: "support",
    },
  ];

  const githubLinks = [
    {
      title: t("githubOrgTitle"),
      description: t("githubOrgDescription"),
      url: "https://github.com/FredonBytes",
      icon: "github",
      stats: {
        repos: 12,
        commits: 847,
        stars: 156,
      },
    },
    {
      title: t("githubPersonalTitle"),
      description: t("githubPersonalDescription"),
      url: "https://github.com/patrik-fredon",
      icon: "github",
      stats: {
        repos: 28,
        commits: 1243,
        stars: 89,
      },
    },
  ];

  const companyLinks = [
    {
      title: t("companyWebsiteTitle"),
      description: t("companyWebsiteDescription"),
      url: "/",
      icon: "website",
      external: false,
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto space-y-8"
    >
      {/* Main Platforms */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-white mb-6 text-center font-mono">
          <span className="text-neon-cyan">{"//"}</span>{" "}
          <span className="text-neon-purple">{t("ourPlatformsHeading")}</span>
        </h2>
        <div className="space-y-4">
          {mainLinks.map((link, index) => (
            <LinkCard
              key={index}
              title={link.title}
              description={link.description}
              url={link.url}
              icon={link.icon}
              external={true}
            />
          ))}
        </div>
      </motion.div>

      {/* GitHub Repositories */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-white mb-6 text-center font-mono">
          <span className="text-neon-cyan">{"//"}</span>{" "}
          <span className="text-neon-purple">{t("githubHeading")}</span>
        </h2>
        <div className="space-y-4">
          {githubLinks.map((link, index) => (
            <LinkCard
              key={index}
              title={link.title}
              description={link.description}
              url={link.url}
              icon={link.icon}
              external={true}
              stats={link.stats}
            />
          ))}
        </div>
      </motion.div>

      {/* Company Links */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-white mb-6 text-center font-mono">
          <span className="text-neon-cyan">{"//"}</span>{" "}
          <span className="text-neon-purple">{t("companyHeading")}</span>
        </h2>
        <div className="space-y-4">
          {companyLinks.map((link, index) => (
            <LinkCard
              key={index}
              title={link.title}
              description={link.description}
              url={link.url}
              icon={link.icon}
              external={link.external}
            />
          ))}
        </div>
      </motion.div>

      {/* Footer Info */}
      <motion.div variants={itemVariants} className="text-center pt-8 pb-4">
        <p className="text-slate-400 text-sm font-mono">
          <span className="text-neon-cyan">{"//"}</span> {t("footerLocation")}
        </p>
        <p className="text-slate-500 text-xs mt-2 font-mono">
          $ {t("footerTagline")}
        </p>
      </motion.div>
    </motion.div>
  );
}
