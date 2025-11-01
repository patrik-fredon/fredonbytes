"use client";

import { motion } from "framer-motion";

import Image from "next/image";
import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
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

import { Button } from "../common/Button";
import TerminalWindow from "../dev-ui/TerminalWindow";
import GridBackground from "../dev-ui/GridBackground";



export default function HeroSection() {
  const t = useTranslations();
  const [typedText, setTypedText] = useState("");
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get code snippets from translations with proper type handling
  const getCodeSnippets = (): string[] => {

    return [
      "const success = await buildAmazingWebsite();",
      'function createDigitalDominance() { return "Fredonbytes"; }',
      "const innovation = () => code + creativity + strategy;",
      "export default class Fredonbytes extends Excellence {}",
    ];
  };

  const codeSnippets = getCodeSnippets();

  useEffect(() => {
    const currentLine = codeSnippets[currentLineIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = isDeleting ? 1000 : 2000;

    const timer = setTimeout(() => {
      if (!isDeleting && charIndex < currentLine.length) {
        setTypedText(currentLine.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        setTypedText(currentLine.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (!isDeleting && charIndex === currentLine.length) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setCurrentLineIndex((prev) => (prev + 1) % codeSnippets.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, currentLineIndex, codeSnippets]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

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


  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0">
        <GridBackground />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* FredonBytes Logo */}
          <motion.div
            variants={itemVariants}
            className="mb-10 mx-auto max-w-md"
          >
            <div className="relative w-full h-64 sm:h-40 lg:h-72 mx-auto">
              <Image
                src="/FredonBytes_GraphicLogo.png"
                alt="FredonBytes Logo"
                fill
                className="object-contain"
                priority
                quality={100}
                sizes="(max-width: 840px) 120vw, (max-width: 1240px) 648px, 672px"
              />
            </div>
          </motion.div>

          {/* Terminal Code Editor */}
          <motion.div
            variants={itemVariants}
            className="mb-8 mx-auto max-w-2xl"
          >
            <TerminalWindow title="fredonbytes.ts">
              <div className="font-mono text-sm space-y-1">
                <div className="flex">
                  <span className="text-slate-500 select-none w-8 text-right mr-4">1</span>
                  <span className="text-neon-cyan">{"//"} </span>
                  <span className="text-slate-400">
                    {t("hero.codeComments.creating")}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-slate-500 select-none w-8 text-right mr-4">2</span>
                  <span className="text-code-green">
                    {typedText}
                    <span className="animate-pulse text-neon-cyan">|</span>
                  </span>
                </div>
              </div>
            </TerminalWindow>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-terminal-light mb-6 leading-tight font-mono"
          >
            {t("hero.title")}
            <span className="block bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent mt-2">
              {t("hero.titleHighlight")}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl sm:text-2xl text-terminal-light/80 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* Value Proposition */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-6 mb-10"
          >
            <div className="flex items-center space-x-2 text-terminal-light px-4 py-2 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20 hover:border-neon-cyan/40 hover:shadow-glow-cyan-subtle transition-all">
              <Code className="w-5 h-5 text-neon-cyan" />
              <span className="font-medium font-mono">
                {t("hero.valueProps.development")}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-terminal-light px-4 py-2 rounded-lg bg-neon-purple/5 border border-neon-purple/20 hover:border-neon-purple/40 hover:shadow-glow-purple-subtle transition-all">
              <Zap className="w-5 h-5 text-neon-purple" />
              <span className="font-medium font-mono">{t("hero.valueProps.design")}</span>
            </div>
            <div className="flex items-center space-x-2 text-terminal-light px-4 py-2 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20 hover:border-neon-cyan/40 hover:shadow-glow-cyan-subtle transition-all">
              <Globe className="w-5 h-5 text-neon-cyan" />
              <span className="font-medium font-mono">
                {t("hero.valueProps.marketing")}
              </span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link href="/contact">
              <Button variant="gradient" size="xl" className="font-mono">
                $ start_project --now
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="secondary" size="xl" className="font-mono">
                $ view_portfolio
              </Button>
            </Link>
          </motion.div>



        </motion.div>
      </div>


    </section>
  );
}
