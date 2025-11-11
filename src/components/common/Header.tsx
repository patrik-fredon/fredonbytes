"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link as IntlLink } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { Button } from "./Button";
import LanguageSwitcher from "./LanguageSwitcher";

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const t = useTranslations();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Manage body scroll lock - decoupled from state update
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isMenuOpen) {
        document.body.classList.add("menu-open");
      } else {
        document.body.classList.remove("menu-open");
      }
    }

    return () => {
      if (typeof document !== "undefined") {
        document.body.classList.remove("menu-open");
      }
    };
  }, [isMenuOpen]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const toggleMenu = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      startTransition(() => {
        setIsMenuOpen((prev) => !prev);
      });
    }, 150);
  }, []);

  const closeMenu = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    startTransition(() => {
      setIsMenuOpen(false);
    });
  }, []);

  const navItems = [
    { href: "/about", key: "navigation.about", isRoute: true },
    { href: "/projects", key: "navigation.projects", isRoute: true },
    { href: "/pricing", key: "navigation.pricing", isRoute: true },
    { href: "/contact", key: "navigation.contact", isRoute: true },
  ];

  const servicesItems = [
    { href: "/services/hosting", key: "navigation.servicesHosting" },
    { href: "/services/branding", key: "navigation.servicesBranding" },
    { href: "/services/consulting", key: "navigation.servicesConsulting" },
    { href: "/services/seo", key: "navigation.servicesSeo" },
    { href: "/services/social-media", key: "navigation.servicesSocialMedia" },
    { href: "/services/development", key: "navigation.servicesDevelopment" },
    { href: "/services/design", key: "navigation.servicesDesign" },
  ];

  const externalLinks = [
    {
      href: "https://me.fredonbytes.cz",
      key: "navigation.portfolio",
      external: true,
    },
    {
      href: "https://lib.fredonbytes.cz",
      key: "navigation.gallery",
      external: true,
    },
    {
      href: "https://tech.fredonbytes.cz",
      key: "navigation.support",
      external: true,
    },
  ];

  return (
    <>
      {/* Backdrop Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-terminal-darker/80 backdrop-blur-sm z-1035 lg:hidden animate-fade-in"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      <header
        className={cn(
          "fixed top-0 left-0 right-0 transition-normal z-1040",
          isScrolled
            ? "bg-glass-bg backdrop-blur-glass shadow-glow-cyan-subtle border-b border-neon-cyan/20"
            : "bg-transparent",
          className,
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
              <div className="relative w-8 h-8 lg:w-10 lg:h-10 flex-shrink-0">
                <Image
                  src="/FredonBytes_GraphicLogo.webp"
                  alt="Fredonbytes Logo"
                  width={40}
                  height={40}
                  className="object-contain transition-transform duration-200 group-hover:scale-110 w-full h-full"
                  priority
                  quality={90}
                  sizes="(max-width: 1024px) 32px, 40px"
                />
              </div>
              <span className="text-xl lg:text-2xl font-mono font-bold text-neon-cyan">
                Fredonbytes
              </span>
            </IntlLink>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navItems.map((item) => (
                <IntlLink
                  key={item.href}
                  href={item.href}
                  className="relative py-3 px-5 text-terminal-light hover:text-neon-cyan transition-fast font-medium font-mono hover:shadow-glow-cyan-subtle rounded-lg z-10"
                >
                  {t(item.key)}
                </IntlLink>
              ))}

              {/* Services Dropdown */}
              <div className="relative group z-20">
                <button
                  type="button"
                  className="py-3 px-5 text-terminal-light hover:text-neon-cyan transition-normal font-medium font-mono flex items-center space-x-1 hover:shadow-glow-cyan-subtle rounded-lg"
                >
                  <span>{t("navigation.services")}</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full right-0 pt-3 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-dropdown">
                  <div className="bg-terminal-dark/95 backdrop-blur-md rounded-lg border border-neon-cyan/30 py-2">
                    {servicesItems.map((service) => (
                      <IntlLink
                        key={service.href}
                        href={service.href}
                        className="block px-5 py-3 text-terminal-light hover:text-neon-cyan hover:bg-neon-cyan/10 transition-fast font-mono"
                      >
                        {t(service.key)}
                      </IntlLink>
                    ))}
                  </div>
                </div>
              </div>

              {/* External Links Dropdown */}
              <div className="relative group z-20">
                <button
                  type="button"
                  className="py-3 px-5 text-terminal-light hover:text-neon-cyan transition-normal font-medium font-mono flex items-center space-x-1 hover:shadow-glow-cyan-subtle rounded-lg"
                >
                  <span>{t("navigation.links")}</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full right-0 pt-3 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-dropdown">
                  <div className="bg-terminal-dark/95 backdrop-blur-md rounded-lg border border-neon-cyan/30 py-2">
                    {externalLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-5 py-3 text-terminal-light hover:text-neon-cyan hover:bg-neon-cyan/10 transition-fast font-mono"
                      >
                        {t(link.key)}
                      </a>
                    ))}
                    <IntlLink
                      href="/links"
                      className="block px-5 py-3 text-terminal-light hover:text-neon-cyan hover:bg-neon-cyan/10 last:rounded-b-lg transition-fast border-t border-neon-cyan/20 mt-1"
                    >
                      {t("navigation.allLinks")}
                    </IntlLink>
                  </div>
                </div>
              </div>

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* CTA Button */}
              <IntlLink href="/contact">
                <Button variant="gradient" size="lg">
                  {t("navigation.getStarted")}
                </Button>
              </IntlLink>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex relative items-center space-x-2">
              <button
                type="button"
                onClick={toggleMenu}
                className={`relative lg:hidden flex items-center justify-center  p-2 text-neon-cyan hover:text-neon-cyan transition-fast mobile-touch-target   group ${
                  isMenuOpen ? "hamburger-open" : ""
                }`}
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                <div className="w-5 h-5 flex flex-col justify-center items-center relative">
                  <span className="hamburger-line bg-neon-purple shadow-glow-cyan-subtle"></span>
                  <span className="hamburger-line bg-neon-purple shadow-glow-cyan-subtle"></span>
                  <span className="hamburger-line bg-neon-cyan shadow-glow-cyan-subtle"></span>
                </div>
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-lg bg-neon-cyan/10 opacity-0 group-hover:opacity-100 transition-fast blur-sm"></div>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 bottom-0 z-1036 mobile-nav animate-slide-up overflow-y-auto">
          <div className="min-h-full bg-terminal-dark/95 backdrop-blur-glass border-t border-neon-cyan/30 shadow-glow-cyan grid-bg">
            <div className="px-4 py-4 space-y-3 safe-area-bottom">
              {navItems.map((item) => (
                <IntlLink
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="flex items-center text-terminal-light hover:text-neon-cyan transition-fast font-medium font-mono mobile-touch-target py-4 px-4 rounded-lg hover:bg-neon-cyan/10 hover:border-neon-cyan/30 hover:shadow-glow-cyan-subtle min-h-12 border border-transparent"
                >
                  <span className="text-neon-cyan mr-2">›</span>
                  {t(item.key)}
                </IntlLink>
              ))}

              <div className="border-t border-neon-cyan/20 pt-4 mt-4">
                <p className="text-xs font-medium text-terminal-muted mb-3 px-2 font-mono uppercase tracking-wider">
                  <span className="text-neon-cyan">{`// `}</span>
                  {t("navigation.services")}
                </p>
                {servicesItems.map((service) => (
                  <IntlLink
                    key={service.href}
                    href={service.href}
                    onClick={closeMenu}
                    className="flex items-center text-terminal-light hover:text-neon-cyan transition-fast py-3 px-4 rounded-lg hover:bg-neon-cyan/10 hover:border-neon-cyan/30 hover:shadow-glow-cyan-subtle min-h-11 font-mono border border-transparent"
                  >
                    <span className="text-neon-cyan mr-2">›</span>
                    {t(service.key)}
                  </IntlLink>
                ))}
              </div>

              <div className="border-t border-neon-cyan/20 pt-4 mt-4">
                <p className="text-xs font-medium text-terminal-muted mb-3 px-2 font-mono uppercase tracking-wider">
                  <span className="text-electric-purple">{`// `}</span>
                  {t("external.externalLinks")}
                </p>
                {externalLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                    className="flex items-center text-terminal-light hover:text-electric-purple transition-fast py-3 px-4 rounded-lg hover:bg-electric-purple/10 hover:border-electric-purple/30 hover:shadow-glow-purple-subtle min-h-11 font-mono border border-transparent"
                  >
                    <span className="text-electric-purple mr-2">↗</span>
                    {t(link.key)}
                  </a>
                ))}
                <IntlLink
                  href="/links"
                  onClick={closeMenu}
                  className="flex items-center text-terminal-light hover:text-electric-purple transition-fast py-3 px-4 rounded-lg hover:bg-electric-purple/10 hover:border-electric-purple/30 hover:shadow-glow-purple-subtle min-h-11 font-mono border border-transparent"
                >
                  <span className="text-electric-purple mr-2">⚡</span>
                  {t("navigation.allLinks")}
                </IntlLink>
              </div>

              <div className="border-t border-neon-cyan/20 pt-6 mt-6">
                <IntlLink
                  href="/contact"
                  onClick={closeMenu}
                  className="block mb-4"
                >
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full min-h-[52px] text-base font-mono shadow-glow-cyan"
                  >
                    <span className="mr-2">▶</span>
                    {t("navigation.getStarted")}
                  </Button>
                </IntlLink>
              </div>
              <LanguageSwitcher variant="mobile" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
