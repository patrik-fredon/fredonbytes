"use client";

import { motion } from "framer-motion";
import {
  Code,
  Zap,
  Globe,
  Database,
  Server,
  Cpu,
  Terminal,
  Cloud,
  Smartphone,
  Monitor,
} from "lucide-react";
import React, { useMemo } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { generateParticlePositions } from "@/lib/seeded-random";

export default function AnimatedBackground() {
  const prefersReducedMotion = useReducedMotion();

  // Generate deterministic particle positions to prevent hydration mismatches
  const particlePositions = generateParticlePositions(12);

  // Development-themed floating icons
  const allFloatingIcons = [
    {
      Icon: Code,
      position: { top: "10%", left: "5%" },
      color: "text-blue-500",
      delay: 0,
    },
    {
      Icon: Zap,
      position: { top: "20%", right: "10%" },
      color: "text-purple-500",
      delay: 1,
    },
    {
      Icon: Globe,
      position: { bottom: "30%", left: "8%" },
      color: "text-cyan-500",
      delay: 2,
    },
    {
      Icon: Database,
      position: { top: "40%", right: "5%" },
      color: "text-green-500",
      delay: 3,
    },
    {
      Icon: Server,
      position: { bottom: "15%", right: "15%" },
      color: "text-orange-500",
      delay: 0.5,
    },
    {
      Icon: Cpu,
      position: { top: "60%", left: "12%" },
      color: "text-pink-500",
      delay: 1.5,
    },
    {
      Icon: Terminal,
      position: { top: "80%", right: "8%" },
      color: "text-indigo-500",
      delay: 2.5,
    },
    {
      Icon: Cloud,
      position: { top: "15%", left: "40%" },
      color: "text-teal-500",
      delay: 0.8,
    },
    {
      Icon: Smartphone,
      position: { bottom: "60%", right: "40%" },
      color: "text-red-500",
      delay: 1.8,
    },
    {
      Icon: Monitor,
      position: { bottom: "45%", left: "35%" },
      color: "text-violet-500",
      delay: 2.3,
    },
  ];

  // Reduce icons on mobile (< 768px) - use useState to prevent hydration mismatch
  const [floatingIcons, setFloatingIcons] = React.useState(() =>
    allFloatingIcons.slice(0, 3),
  );

  React.useEffect(() => {
    // Only run on client after hydration
    const updateIcons = () => {
      setFloatingIcons(
        window.innerWidth < 768
          ? allFloatingIcons.slice(0, 3)
          : allFloatingIcons,
      );
    };

    updateIcons();
    window.addEventListener("resize", updateIcons);
    return () => window.removeEventListener("resize", updateIcons);
  }, []);

  const floatingVariants = {
    animate: prefersReducedMotion
      ? {}
      : {
          y: [-10, 10, -10],
          rotate: [0, 5, 0, -5, 0],
          scale: [1, 1.05, 1],
          transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        },
  };

  const orbitVariants = {
    animate: prefersReducedMotion
      ? {}
      : {
          rotate: 360,
          transition: {
            duration: 60,
            repeat: Infinity,
            ease: "linear" as const,
          },
        },
  };

  const pulseVariants = {
    animate: prefersReducedMotion
      ? {}
      : {
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        },
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient background */}
      <div className="absolute inset-0  bg-gradient-to-br from-cyan-950/10 to-purple-950/10" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0  opacity-30" />

      {/* Large animated gradient blobs - Dev themed */}
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 rounded-full filter blur-3xl opacity-5"
        variants={pulseVariants}
        animate="animate"
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-neon-purple/10 to-neon-cyan/10 rounded-full filter blur-3xl opacity-5"
        variants={pulseVariants}
        animate="animate"
        transition={{ delay: 1 }}
      />

      {/* Additional moving gradient orbs - Dev themed */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-full filter blur-2xl opacity-15"
        variants={orbitVariants}
        animate="animate"
        style={{ transformOrigin: "200px 200px" }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 rounded-full filter blur-2xl opacity-15"
        variants={orbitVariants}
        animate="animate"
        transition={{ delay: 30 }}
        style={{ transformOrigin: "-150px -150px" }}
      />

      {/* Floating development icons */}
      {floatingIcons.map((item, index) => {
        const { Icon, position, delay } = item;
        return (
          <motion.div
            key={index}
            className="absolute text-neon-cyan opacity-[0.08]"
            style={position}
            variants={floatingVariants}
            animate="animate"
            transition={{ delay }}
          >
            <Icon className="w-6 h-6 md:w-8 md:h-8" />
          </motion.div>
        );
      })}

      {/* Animated code-like particles */}
      <div className="absolute inset-0">
        {particlePositions.map((position, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon-cyan rounded-full opacity-20"
            style={{
              left: `${position.left}%`,
              top: `${position.top}%`,
            }}
            animate={
              prefersReducedMotion
                ? {}
                : {
                    y: [0, -20, 0],
                    opacity: [0.2, 0.8, 0.2],
                    scale: [1, 1.5, 1],
                  }
            }
            transition={
              prefersReducedMotion
                ? {}
                : {
                    duration: 3 + (i % 4),
                    repeat: Infinity,
                    delay: (i % 3) * 0.5,
                    ease: "easeInOut" as const,
                  }
            }
          />
        ))}
      </div>

      {/* Subtle geometric shapes */}
      <motion.div
        className="absolute top-1/3 left-1/6 w-16 h-16 border border-neon-cyan/20 opacity-20"
        animate={
          prefersReducedMotion
            ? {}
            : {
                rotate: [0, 180, 360],
                scale: [1, 1.1, 1],
              }
        }
        transition={
          prefersReducedMotion
            ? {}
            : {
                duration: 20,
                repeat: Infinity,
                ease: "linear" as const,
              }
        }
      />
      <motion.div
        className="absolute bottom-1/3 right-1/6 w-12 h-12 border border-neon-purple/20 opacity-20 rounded-full"
        animate={
          prefersReducedMotion
            ? {}
            : {
                rotate: [360, 180, 0],
                scale: [1, 0.9, 1],
              }
        }
        transition={
          prefersReducedMotion
            ? {}
            : {
                duration: 25,
                repeat: Infinity,
                ease: "linear" as const,
              }
        }
      />
    </div>
  );
}
