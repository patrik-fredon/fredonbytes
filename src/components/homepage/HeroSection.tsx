"use client";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Code,
  Globe,
  HeadphonesIcon,
  Palette,
  Server,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "../common/Button";
import GridBackground from "../dev-ui/GridBackground";
import TerminalWindow from "../dev-ui/TerminalWindow";

interface TerminalLine {
  lineNumber: number;
  content: string;
  isTyping: boolean;
  isComplete: boolean;
  displayText: string;
}

export default function HeroSection() {
  const t = useTranslations();

  // Advanced terminal state (desktop)
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [compilationStatus, setCompilationStatus] = useState<
    "typing" | "compiling" | "ready"
  >("typing");

  // Simple terminal state (mobile)
  const [typedText, setTypedText] = useState("");
  const [mobileLineIndex, setMobileLineIndex] = useState(0);
  const [mobileCharIndex, setMobileCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMobileTerminalVisible, setIsMobileTerminalVisible] = useState(false);

  const mobileCodeSnippets = [
    "const success = buildWebsite();",
    'return "Innovation + Code";',
    "const result = optimize();",
    "export class Fredonbytes {}",
  ];

  const fullCodeStructure = [
    {
      line: 1,
      code: 'import { Innovation, Quality, Performance } from "@fredonbytes/core";',
    },
    {
      line: 2,
      code: 'import type { WebProject, DeploymentConfig } from "@fredonbytes/types";',
    },
    { line: 3, code: "" },
    { line: 4, code: "interface DigitalSolution {" },
    { line: 5, code: "  development: boolean;" },
    { line: 6, code: "  design: boolean;" },
    { line: 7, code: "  marketing: boolean;" },
    { line: 8, code: "  performance: 'optimized';" },
    { line: 9, code: "}" },
    { line: 10, code: "" },
    { line: 11, code: "export class Fredonbytes implements DigitalSolution {" },
    { line: 12, code: "  async buildWebsite(): Promise<WebProject> {" },
    {
      line: 13,
      code: '    return await this.compile({ framework: "Next.js", style: "Modern" });',
    },
    { line: 14, code: "  }" },
    { line: 15, code: "" },
    { line: 16, code: "  async deployToCloud(): Promise<void> {" },
    {
      line: 17,
      code: '    await this.optimize("performance", "seo", "accessibility");',
    },
    { line: 18, code: "  }" },
    { line: 19, code: "}" },
  ];

  // Mobile terminal visibility detection
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMobileTerminalVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Mobile simple typing effect - only runs when visible
  useEffect(() => {
    if (!isMobileTerminalVisible) return;

    const currentLine = mobileCodeSnippets[mobileLineIndex];
    const typingSpeed = isDeleting ? 30 : 80;
    const pauseAfterTyping = 1500;
    const pauseBeforeDeleting = 500;

    const timer = setTimeout(() => {
      if (!isDeleting && mobileCharIndex < currentLine.length) {
        setTypedText(currentLine.substring(0, mobileCharIndex + 1));
        setMobileCharIndex(mobileCharIndex + 1);
      } else if (isDeleting && mobileCharIndex > 0) {
        setTypedText(currentLine.substring(0, mobileCharIndex - 1));
        setMobileCharIndex(mobileCharIndex - 1);
      } else if (!isDeleting && mobileCharIndex === currentLine.length) {
        setTimeout(() => setIsDeleting(true), pauseAfterTyping);
      } else if (isDeleting && mobileCharIndex === 0) {
        setTimeout(() => {
          setIsDeleting(false);
          setMobileLineIndex((prev) => (prev + 1) % mobileCodeSnippets.length);
        }, pauseBeforeDeleting);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [mobileCharIndex, isDeleting, mobileLineIndex, isMobileTerminalVisible]);

  // Desktop advanced terminal initialization
  useEffect(() => {
    const initialLines = fullCodeStructure.map((item) => ({
      lineNumber: item.line,
      content: item.code,
      isTyping: false,
      isComplete: false,
      displayText: "",
    }));
    setTerminalLines(initialLines);
  }, []);

  // Desktop advanced terminal typing effect
  useEffect(() => {
    if (currentLineIndex >= fullCodeStructure.length) {
      if (compilationStatus === "typing") {
        setCompilationStatus("compiling");
        setTimeout(() => {
          setCompilationStatus("ready");
          setTimeout(() => {
            setCompilationStatus("typing");
            setCurrentLineIndex(0);
            setCharIndex(0);
            const resetLines = fullCodeStructure.map((item) => ({
              lineNumber: item.line,
              content: item.code,
              isTyping: false,
              isComplete: false,
              displayText: "",
            }));
            setTerminalLines(resetLines);
          }, 3000);
        }, 800);
      }
      return;
    }

    const currentLine = fullCodeStructure[currentLineIndex];
    const targetText = currentLine.code;
    const typingSpeed = targetText.length === 0 ? 50 : Math.random() * 50 + 30;

    const timer = setTimeout(() => {
      if (charIndex < targetText.length) {
        setTerminalLines((prev) =>
          prev.map((line, idx) =>
            idx === currentLineIndex
              ? {
                ...line,
                isTyping: true,
                displayText: targetText.substring(0, charIndex + 1),
              }
              : line,
          ),
        );
        setCharIndex(charIndex + 1);
      } else {
        setTerminalLines((prev) =>
          prev.map((line, idx) =>
            idx === currentLineIndex
              ? {
                ...line,
                isTyping: false,
                isComplete: true,
                displayText: targetText,
              }
              : line,
          ),
        );
        setCurrentLineIndex(currentLineIndex + 1);
        setCharIndex(0);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentLineIndex, charIndex, compilationStatus]);

  const renderCodeLine = (line: TerminalLine) => {
    const { displayText, isTyping, isComplete } = line;

    const getColoredCode = (text: string) => {
      if (!text) return <span className="text-terminal-light">{text}</span>;

      const parts: React.ReactNode[] = [];
      let key = 0;

      const patterns = [
        {
          regex:
            /(import|export|class|interface|async|await|return|from|type|const|implements)/g,
          color: "text-neon-purple",
        },
        {
          regex:
            /(\bPromise\b|\bWebProject\b|\bDeploymentConfig\b|\bDigitalSolution\b|\bFredonbytes\b)/g,
          color: "text-neon-cyan",
        },
        { regex: /(boolean|void)/g, color: "text-code-green" },
        { regex: /(".*?"|'.*?')/g, color: "text-code-green" },
        { regex: /(@fredonbytes\/\w+)/g, color: "text-neon-cyan" },
        {
          regex: /(buildWebsite|deployToCloud|optimize|compile)/g,
          color: "text-yellow-400",
        },
      ];

      const tokens: Array<{
        text: string;
        color: string;
        start: number;
        end: number;
      }> = [];

      patterns.forEach(({ regex, color }) => {
        const matches = [...text.matchAll(regex)];
        matches.forEach((match) => {
          if (match.index !== undefined) {
            tokens.push({
              text: match[0],
              color,
              start: match.index,
              end: match.index + match[0].length,
            });
          }
        });
      });

      tokens.sort((a, b) => a.start - b.start);

      const mergedTokens: Array<{
        text: string;
        color: string;
        start: number;
        end: number;
      }> = [];
      tokens.forEach((token) => {
        const lastToken = mergedTokens[mergedTokens.length - 1];
        if (lastToken && token.start < lastToken.end) {
          return;
        }
        mergedTokens.push(token);
      });

      let lastIndex = 0;
      mergedTokens.forEach((token) => {
        if (token.start > lastIndex) {
          parts.push(
            <span key={`plain-${key++}`} className="text-terminal-light">
              {text.substring(lastIndex, token.start)}
            </span>,
          );
        }
        parts.push(
          <span key={`colored-${key++}`} className={token.color}>
            {token.text}
          </span>,
        );
        lastIndex = token.end;
      });

      if (lastIndex < text.length) {
        parts.push(
          <span key={`plain-${key++}`} className="text-terminal-light">
            {text.substring(lastIndex)}
          </span>,
        );
      }

      return parts.length > 0 ? (
        parts
      ) : (
        <span className="text-terminal-light">{text}</span>
      );
    };

    const lineOpacity = isComplete
      ? "opacity-100"
      : isTyping
        ? "opacity-90"
        : "opacity-0";
    const lineTransform =
      isComplete || isTyping ? "translate-y-0" : "translate-y-2";
    const lineGlow = isTyping
      ? "drop-shadow-[0_0_8px_rgba(0,217,255,0.3)]"
      : "";

    return (
      <div
        className={`flex transition-all duration-300 ${lineOpacity} ${lineGlow}`}
        style={{ transform: lineTransform }}
      >
        <span
          className={`text-slate-500 select-none w-10 text-right mr-4 transition-opacity duration-500 ${isComplete || isTyping ? "opacity-100" : "opacity-0"
            }`}
        >
          {line.lineNumber}
        </span>
        <div className="flex-1 font-mono text-xs sm:text-sm">
          {getColoredCode(displayText)}
          {isTyping && (
            <span className="inline-block w-2 h-4 bg-neon-cyan ml-1 animate-pulse" />
          )}
        </div>
      </div>
    );
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
    <>
      {/* Mobile/Tablet View (Hidden on lg) */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden xl:hidden">
        <div className="absolute inset-0">
          <GridBackground />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            <motion.div
              variants={itemVariants}
              className="mb-10 mx-auto max-w-md"
            >
              <div className="relative w-full h-64 sm:h-40 mx-auto">
                <Image
                  src="/FredonBytes_GraphicLogo.png"
                  alt="FredonBytes Logo"
                  fill
                  className="object-contain"
                  priority
                  quality={100}
                  sizes="(max-width: 840px) 120vw, 648px"
                />
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mb-8 mx-auto max-w-2xl"
            >
              {isMobileTerminalVisible ? (
                <TerminalWindow title="fredonbytes.ts">
                  <div className="font-mono text-xs sm:text-sm space-y-1 py-2">
                    <div className="flex">
                      <span className="text-slate-500 select-none w-6 sm:w-8 text-right mr-2 sm:mr-4">
                        1
                      </span>
                      <span className="text-neon-cyan">{"//"} </span>
                      <span className="text-slate-400 text-xs sm:text-sm">
                        {t("hero.codeComments.creating")}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-slate-500 select-none w-6 sm:w-8 text-right mr-2 sm:mr-4">
                        2
                      </span>
                      <span className="text-code-green text-xs sm:text-sm">
                        {typedText}
                        <span className="animate-pulse text-neon-cyan">|</span>
                      </span>
                    </div>
                  </div>
                </TerminalWindow>
              ) : (
                <div className="h-24 bg-terminal-dark/50 rounded-lg border border-neon-cyan/20 animate-pulse" />
              )}
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl font-bold text-terminal-light mb-6 leading-tight font-mono"
            >
              {t("hero.title")}
              <span className="block bg-linear-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent mt-2">
                {t("hero.titleHighlight")}
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl sm:text-2xl text-terminal-light/80 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-3 mb-10"
            >
              <div className="flex items-center space-x-2 text-terminal-light px-4 py-2 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20 hover:border-neon-cyan/40 hover:shadow-glow-cyan-subtle transition-all">
                <Code className="w-5 h-5 text-neon-cyan" />
                <span className="font-medium font-mono text-sm">
                  {t("hero.valueProps.development")}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-terminal-light px-4 py-2 rounded-lg bg-neon-purple/5 border border-neon-purple/20 hover:border-neon-purple/40 hover:shadow-glow-purple-subtle transition-all">
                <Zap className="w-5 h-5 text-neon-purple" />
                <span className="font-medium font-mono text-sm">
                  {t("hero.valueProps.design")}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-terminal-light px-4 py-2 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20 hover:border-neon-cyan/40 hover:shadow-glow-cyan-subtle transition-all">
                <Globe className="w-5 h-5 text-neon-cyan" />
                <span className="font-medium font-mono text-sm">
                  {t("hero.valueProps.marketing")}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-terminal-light px-4 py-2 rounded-lg bg-neon-purple/5 border border-neon-purple/20 hover:border-neon-purple/40 hover:shadow-glow-purple-subtle transition-all">
                <Server className="w-5 h-5 text-neon-purple" />
                <span className="font-medium font-mono text-sm">
                  {t("hero.valueProps.hosting")}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-terminal-light px-4 py-2 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20 hover:border-neon-cyan/40 hover:shadow-glow-cyan-subtle transition-all">
                <Palette className="w-5 h-5 text-neon-cyan" />
                <span className="font-medium font-mono text-sm">
                  {t("hero.valueProps.branding")}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-terminal-light px-4 py-2 rounded-lg bg-neon-purple/5 border border-neon-purple/20 hover:border-neon-purple/40 hover:shadow-glow-purple-subtle transition-all">
                <HeadphonesIcon className="w-5 h-5 text-neon-purple" />
                <span className="font-medium font-mono text-sm">
                  {t("hero.valueProps.consulting")}
                </span>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  variant="gradient"
                  size="xl"
                  className="font-mono w-full sm:w-auto"
                >
                  $ start_project --now
                </Button>
              </Link>
              <Link href="/projects" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="xl"
                  className="font-mono w-full sm:w-auto"
                >
                  $ view_portfolio
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Desktop View (Hidden on mobile/tablet) */}
      <section className="relative min-h-screen hidden xl:flex items-center justify-center overflow-hidden py-20">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap:16 lg:gap-24  items-center">
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center lg:items-start space-y-8"
              >
                <div className="w-full max-w-2xl lg:max-w-none">
                  <TerminalWindow
                    title={
                      <div className="flex items-center justify-between w-full  mx-auto">
                        <div className="flex items-center gap-6 ">
                          {compilationStatus === "typing" && (
                            <span className="text-xs text-yellow-400 animate-pulse flex items-center gap-4 px-2">
                              <span className="w-1 h-1 bg-yellow-400 rounded-full animate-ping" />
                              Building...
                            </span>
                          )}
                          {compilationStatus === "compiling" && (
                            <span className="text-xs text-neon-cyan animate-pulse flex items-center gap-1">
                              <span className="w-2 h-2 bg-neon-cyan rounded-full animate-ping" />
                              Compiling...
                            </span>
                          )}
                          {compilationStatus === "ready" && (
                            <span className="text-xs text-green-400 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Compiled ✓
                            </span>
                          )}
                        </div>
                        <span>fredonbytes.ts</span>
                      </div>
                    }
                  >
                    <div className="py-3 space-y-1 min-h-[450px]">
                      {terminalLines.map((line) => (
                        <React.Fragment key={line.lineNumber}>
                          {renderCodeLine(line)}
                        </React.Fragment>
                      ))}
                    </div>
                  </TerminalWindow>
                </div>
              </motion.div>

              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
                <motion.h1
                  variants={itemVariants}
                  className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-terminal-light leading-tight font-mono"
                >
                  <div className="relative w-full max-w-lg lg:max-w-none h-96">
                    <Image
                      src="/FredonBytes_GraphicLogo.png"
                      alt="FredonBytes Logo"
                      fill
                      className="object-contain"
                      priority
                      quality={100}
                      sizes="600px"
                    />
                  </div>
                  {t("hero.title")}
                  <span className="block bg-linear-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent mt-2">
                    {t("hero.titleHighlight")}
                  </span>
                </motion.h1>
                <motion.div
                  variants={itemVariants}
                  className="flex flex-wrap justify-center gap-2"
                >
                  <div className="flex items-center space-x-2 text-terminal-light px-4 py-2 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20 hover:border-neon-cyan/40 hover:shadow-glow-cyan-subtle transition-all">
                    <Code className="w-5 h-5 text-neon-cyan" />
                    <span className="font-medium font-mono text-sm">
                      {t("hero.valueProps.development")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-terminal-light px-4 py-2 rounded-lg bg-neon-purple/5 border border-neon-purple/20 hover:border-neon-purple/40 hover:shadow-glow-purple-subtle transition-all">
                    <Zap className="w-5 h-5 text-neon-purple" />
                    <span className="font-medium font-mono text-sm">
                      {t("hero.valueProps.design")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-terminal-light px-4 py-2 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20 hover:border-neon-cyan/40 hover:shadow-glow-cyan-subtle transition-all">
                    <Globe className="w-5 h-5 text-neon-cyan" />
                    <span className="font-medium font-mono text-sm">
                      {t("hero.valueProps.marketing")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-terminal-light px-4 py-2 rounded-lg bg-neon-purple/5 border border-neon-purple/20 hover:border-neon-purple/40 hover:shadow-glow-purple-subtle transition-all">
                    <Server className="w-5 h-5 text-neon-purple" />
                    <span className="font-medium font-mono text-sm">
                      {t("hero.valueProps.hosting")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-terminal-light px-4 py-2 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20 hover:border-neon-cyan/40 hover:shadow-glow-cyan-subtle transition-all">
                    <Palette className="w-5 h-5 text-neon-cyan" />
                    <span className="font-medium font-mono text-sm">
                      {t("hero.valueProps.branding")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-terminal-light px-4 py-2 rounded-lg bg-neon-purple/5 border border-neon-purple/20 hover:border-neon-purple/40 hover:shadow-glow-purple-subtle transition-all">
                    <HeadphonesIcon className="w-5 h-5 text-neon-purple" />
                    <span className="font-medium font-mono text-sm">
                      {t("hero.valueProps.consulting")}
                    </span>
                  </div>
                </motion.div>
                <motion.p
                  variants={itemVariants}
                  className="text-md sm:text-lg lg:text-xl text-terminal-light/80 max-w-2xl leading-relaxed "
                >
                  {t("hero.subtitle")}
                </motion.p>
                <motion.p
                  variants={itemVariants}
                  className="text-md sm:text-lg lg:text-xl text-terminal-light/80 max-w-2xl leading-relaxed "
                >
                  {t("hero.subtitle")}
                </motion.p>


                <motion.div
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto"
                >
                  <Link href="/contact" className="w-full sm:w-auto">
                    <Button
                      variant="gradient"
                      size="xl"
                      className="font-mono w-full sm:w-auto"
                    >
                      $ start_project --now
                    </Button>
                  </Link>
                  <Link href="/projects" className="w-full sm:w-auto">
                    <Button
                      variant="secondary"
                      size="xl"
                      className="font-mono w-full sm:w-auto"
                    >
                      $ view_portfolio
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
