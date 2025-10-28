"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { Link as IntlLink } from "@/i18n/navigation";

import { Button } from "./Button";
import LanguageSwitcher from "./LanguageSwitcher";

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cleanup body class on unmount
  useEffect(() => {
    return () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('menu-open');
      }
    };
  }, []);

  const toggleMenu = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);

    // Prevent body scroll when menu is open on mobile
    if (typeof document !== 'undefined') {
      if (newState) {
        document.body.classList.add('menu-open');
      } else {
        document.body.classList.remove('menu-open');
      }
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);

    // Re-enable body scroll
    if (typeof document !== 'undefined') {
      document.body.classList.remove('menu-open');
    }
  };

  const navItems = [
    { href: "/about", key: "navigation.about", isRoute: true },
    { href: "/projects", key: "navigation.projects", isRoute: true },
    { href: "/pricing", key: "navigation.pricing", isRoute: true },
    { href: "/contact", key: "navigation.contact", isRoute: true },
  ];

  const externalLinks = [
    {
      href: "https://me.fredonbytes.cloud",
      key: "navigation.portfolio",
      external: true,
    },
    {
      href: "https://lib.fredonbytes.cloud",
      key: "navigation.gallery",
      external: true,
    },
    {
      href: "https://tech.fredonbytes.cloud",
      key: "navigation.support",
      external: true,
    },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-slate-200 dark:border-slate-700"
          : "bg-transparent",
        className
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <IntlLink
            href="/"
            className="flex items-center space-x-2 group"
            onClick={closeMenu}
          >
            <div className="relative w-8 h-8 lg:w-10 lg:h-10">
              <Image
                src="/FredonBytes_GraphicLogo.png"
                alt="Fredonbytes Logo"
                fill
                className="object-contain transition-transform duration-200 group-hover:scale-110"
                priority
                quality={85}
                sizes="(max-width: 1024px) 32px, 40px"
              />
            </div>
            <span className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">
              Fredonbytes
            </span>
          </IntlLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) =>
              item.isRoute ? (
                <IntlLink
                  key={item.href}
                  href={item.href}
                  className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 font-medium"
                >
                  {t(item.key)}
                </IntlLink>
              ) : (
                <IntlLink
                  key={item.href}
                  href={item.href}
                  className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 font-medium"
                >
                  {t(item.key)}
                </IntlLink>
              )
            )}

            {/* External Links Dropdown */}
            <div className="relative group">
              <button className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 font-medium flex items-center space-x-1">
                <span>{t("navigation.links")}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {externalLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg transition-colors duration-200"
                  >
                    {t(link.key)}
                  </a>
                ))}
                <IntlLink
                  href="/links"
                  className="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 last:rounded-b-lg transition-colors duration-200 border-t border-slate-200 dark:border-slate-600"
                >
                  {t("navigation.allLinks")}
                </IntlLink>
              </div>
            </div>

            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <IntlLink href="/contact">
              <Button variant="gradient" size="lg">
                {t("navigation.getStarted")}
              </Button>
            </IntlLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className={`lg:hidden p-3 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 mobile-touch-target min-h-[44px] min-w-[44px] flex items-center justify-center ${isMenuOpen ? "hamburger-open" : ""
              }`}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <div className="w-6 h-6 flex flex-col justify-center">
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-lg mobile-nav animate-slide-up">
            <div className="px-4 py-4 space-y-2 safe-area-bottom">
              {navItems.map((item) =>
                item.isRoute ? (
                  <IntlLink
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="block text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 font-medium mobile-touch-target py-3 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] flex items-center"
                  >
                    {t(item.key)}
                  </IntlLink>
                ) : (
                  <IntlLink
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="block text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 font-medium mobile-touch-target py-3 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] flex items-center"
                  >
                    {t(item.key)}
                  </IntlLink>
                )
              )}

              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 px-2">
                  {t("external.externalLinks")}
                </p>
                {externalLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                    className="block text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 py-2 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] flex items-center"
                  >
                    {t(link.key)}
                  </a>
                ))}
                <IntlLink
                  href="/links"
                  onClick={closeMenu}
                  className="block text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 py-2 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] flex items-center"
                >
                  {t("navigation.allLinks")}
                </IntlLink>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mb-4">
                <div className="px-2">
                  <LanguageSwitcher />
                </div>
              </div>

              <div className="pt-2 px-2">
                <IntlLink href="/contact" onClick={closeMenu} className="block">
                  <Button variant="gradient" size="lg" className="w-full min-h-[44px]">
                    {t("navigation.getStarted")}
                  </Button>
                </IntlLink>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
