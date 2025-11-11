"use client";
import { motion } from "framer-motion";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "../../common/Button";
import TerminalLayout from "./TerminalLayout";

export default function DesktopClient() {
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

    return (
        <>
            {/* Desktop View (Hidden on mobile/tablet) */}

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-7xl mx-auto"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap:16 lg:gap-20  items-center">
                        <TerminalLayout />

                        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
                            <motion.h1
                                variants={itemVariants}
                                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-terminal-light leading-tight font-mono items-center justify-center"
                            >
                                <div className="relative w-full max-w-lg lg:max-w-none h-60">
                                    <Image
                                        src="/FredonBytes_GraphicLogo.png"
                                        alt="FredonBytes Logo"
                                        fill
                                        className="object-contain"
                                        priority
                                        quality={100}
                                        sizes="400px"
                                    />
                                </div>
                                {t("hero.title")}
                                <span className=" bg-linear-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent mt-2">
                                    {t("hero.titleHighlight")}
                                </span>
                            </motion.h1>

                            <motion.p
                                variants={itemVariants}
                                className="text-md sm:text-lg lg:text-xl text-terminal-light/80 max-w-2xl leading-relaxed "
                            >
                                {t("hero.subtitle")}
                            </motion.p>
                            <motion.p
                                variants={itemVariants}
                                className="text-md text-terminal-light/80 max-w-2xl leading-relaxed "
                            >
                                {t("hero.subtitle2")}
                            </motion.p>
                            <motion.p
                                variants={itemVariants}
                                className="text-sm lg:text-md text-terminal-light/80 max-w-2xl leading-relaxed "
                            >
                                {t("hero.subtitle3")}
                            </motion.p>
                            <motion.div
                                variants={itemVariants}
                                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto"
                            >
                                <Link href="/contact" className="w-full sm:w-auto">
                                    <Button
                                        variant="gradient"
                                        size="lg"
                                        className="font-mono w-full sm:w-auto"
                                    >
                                        $ start_project --now
                                    </Button>
                                </Link>
                                <Link href="/about" className="w-full sm:w-auto">
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        className="font-mono w-full sm:w-auto"
                                    >
                                        $ view_team
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>

        </>
    );
}
