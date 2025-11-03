"use client";

import { motion } from "framer-motion";
import { MapPin, Mail, Phone } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

export default function ProfileHeader() {
  const t = useTranslations("linktree");
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
        staggerChildren: 0.1,
      },
    },
  };

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-center mb-12"
    >
      {/* Profile Image */}
      <motion.div
        variants={itemVariants}
        className="relative w-32 h-32 mx-auto mb-6"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-electric-purple rounded-full animate-pulse shadow-glow-cyan-intense"></div>
        <div className="relative w-full h-full bg-terminal-dark border-2 border-neon-cyan rounded-full p-1">
          <Image
            src="/FredonBytes_GraphicLogo.png"
            alt="Fredonbytes Logo"
            fill
            className="object-contain rounded-full p-4"
            priority
            quality={85}
            sizes="128px"
          />
        </div>
      </motion.div>

      {/* Name & Title */}
      <motion.h1
        variants={itemVariants}
        className="text-3xl lg:text-4xl font-bold text-white mb-2 font-mono"
      >
        <span className="text-neon-cyan">//</span>{" "}
        <span className="text-neon-purple">Fredonbytes</span>
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="text-lg text-slate-300 mb-4 font-mono"
      >
        {t("profileHeader.title")}
      </motion.p>

      {/* Short Description */}
      <motion.p
        variants={itemVariants}
        className="text-slate-400 max-w-2xl mx-auto mb-6 leading-relaxed font-mono"
      >
        <span className="text-neon-cyan">//</span>{" "}
        {t("profileHeader.description")}
      </motion.p>

      {/* Company Info */}
      <motion.div
        variants={itemVariants}
        className="flex flex-wrap justify-center gap-6 text-sm text-slate-400 font-mono"
      >
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-neon-cyan drop-shadow-[0_0_8px_currentColor]" />
          <span>Brno, Czech Republic</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-electric-purple drop-shadow-[0_0_8px_currentColor]" />
          <a
            href="tel:+420799027984"
            className="hover:text-neon-cyan transition-colors duration-[180ms]"
          >
            +420 799 027 984
          </a>
        </div>
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-code-green drop-shadow-[0_0_8px_currentColor]" />
          <a
            href="mailto:info@fredonbytes.cloud"
            className="hover:text-code-green transition-colors duration-[180ms]"
          >
            info@fredonbytes.cloud
          </a>
        </div>
      </motion.div>

      {/* Motto */}
      <motion.div variants={itemVariants} className="mt-8 text-center">
        <p className="text-lg font-semibold bg-gradient-to-r from-neon-cyan to-electric-purple bg-clip-text text-transparent font-mono">
          $ Code. Create. Conquer.
        </p>
      </motion.div>
    </motion.div>
  );
}
