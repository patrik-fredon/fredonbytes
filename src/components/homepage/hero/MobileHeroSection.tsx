"use client";
import { motion } from "framer-motion";
import { Code, ComputerIcon, Globe, Palette, Server, Zap } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "../../common/Button";
import TerminalLayout from "./TerminalLayout";

export default function MobileClient() {
  // Simple terminal state (mobile)
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

  const t = useTranslations();

  return (
    <>
      {/* Mobile/Tablet View (Hidden on lg) */}

      <section className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full mx-auto"
        >
          <motion.div variants={itemVariants} className="m-10 mx-auto ">
            <div className="relative w-1/2 mx-auto  ">
              <Image
                src="/FredonBytes_GraphicLogo.webp"
                alt="FredonBytes Logo"
                width={256}
                height={128}
                className="object-contain w-full h-full"
                priority
                quality={90}
                sizes="(max-width: 640px) 256px, 384px"
              />
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl font-bold text-terminal-light mb-6 leading-tight font-mono"
          >
            {t("hero.title")}
            <span className="bg-linear-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
              {t("hero.titleHighlight")}
            </span>
          </motion.h1>

          <p className="text-md sm:text-lg lg:text-xl text-terminal-light/80  leading-relaxed mb-2">
            {t("hero.subtitle")}
          </p>
          <TerminalLayout />

          <p className="text-sm text-terminal-light/80 leading-relaxed m-4">
            {t("hero.subtitle2")}
          </p>
          <Link href="/about">
            <Button
              variant="secondary"
              size="sm"
              className="font-mono w-auto mx-auto px-2"
            >
              $ view_team
            </Button>
          </Link>

          <p className="text-sm lg:text-md text-terminal-light/80 leading-relaxed m-2">
            {t("hero.subtitle3")}
          </p>
          <Link href="/contact">
            <Button
              variant="gradient"
              size="sm"
              className="font-mono w-auto mx-auto px-2"
            >
              $ start_project --now
            </Button>
          </Link>
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-1 m-8"
          >
            <div className="flex items-center space-x-2 text-terminal-light px-2 py-2 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20 hover:border-neon-cyan/40 hover:shadow-glow-cyan-subtle transition-all">
              <Code className="w-3 h-3 text-neon-cyan" />
              <span className="font-medium font-mono text-sm">
                {t("hero.valueProps.development")}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-terminal-light px-2 py-2 rounded-lg bg-neon-purple/5 border border-neon-purple/20 hover:border-neon-purple/40 hover:shadow-glow-purple-subtle transition-all">
              <Zap className="w-3 h-3 text-neon-purple" />
              <span className="font-medium font-mono text-sm">
                {t("hero.valueProps.design")}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-terminal-light px-2 py-2 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20 hover:border-neon-cyan/40 hover:shadow-glow-cyan-subtle transition-all">
              <Globe className="w-3 h-3 text-neon-cyan" />
              <span className="font-medium font-mono text-sm">
                {t("hero.valueProps.marketing")}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-terminal-light px-2 py-2 rounded-lg bg-neon-purple/5 border border-neon-purple/20 hover:border-neon-purple/40 hover:shadow-glow-purple-subtle transition-all">
              <Server className="w-3 h-3 text-neon-purple" />
              <span className="font-medium font-mono text-sm">
                {t("hero.valueProps.hosting")}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-terminal-light px-2 py-2 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20 hover:border-neon-cyan/40 hover:shadow-glow-cyan-subtle transition-all">
              <Palette className="w-3 h-3 text-neon-cyan" />
              <span className="font-medium font-mono text-sm">
                {t("hero.valueProps.branding")}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-terminal-light px-2 py-2 rounded-lg bg-neon-purple/5 border border-neon-purple/20 hover:border-neon-purple/40 hover:shadow-glow-purple-subtle transition-all">
              <ComputerIcon className="w-3 h-3 text-neon-purple" />
              <span className="font-medium font-mono text-sm">
                {t("hero.valueProps.consulting")}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
