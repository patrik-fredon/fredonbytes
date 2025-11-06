import { Github, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import React from "react";
import { Link } from "@/i18n/navigation";

import CookieSettingsLink from "./CookieSettingsLink";

interface FooterProps {
  locale: string;
}

export default async function Footer({ locale }: FooterProps) {
  // Generate current year on server at build/request time
  const currentYear = new Date().getFullYear();
  const t = await getTranslations({ locale });

  const socialLinks = [
    {
      href: "https://github.com/FredonBytes",
      icon: Github,
      label: t("footer.social.githubFredon"),
      external: true,
    },
    {
      href: "https://github.com/patrik-fredon",
      icon: Github,
      label: t("footer.social.githubPatrik"),
      external: true,
    },
    {
      href: "https://linkedin.com/company/fredonbytes",
      icon: Linkedin,
      label: t("footer.social.linkedin"),
      external: true,
    },
    {
      href: "https://twitter.com/fredonbytes",
      icon: Twitter,
      label: t("footer.social.twitter"),
      external: true,
    },
  ];

  const quickLinks = [
    { href: "/about", label: t("footer.links.aboutUs") },
    { href: "#services", label: t("navigation.services") },
    { href: "/projects", label: t("navigation.projects") },
    { href: "/pricing", label: t("navigation.pricing") },
    { href: "/contact", label: t("navigation.contact") },
  ];

  const externalLinks = [
    {
      href: "https://me.fredonbytes.cz",
      label: t("footer.links.personalPortfolio"),
    },
    {
      href: "https://tech.fredonbytes.cz",
      label: t("footer.links.technicalSupport"),
    },
    { href: "/links", label: t("navigation.allLinks") },
  ];

  const legalLinks = [
    { href: "/policies", label: t("footer.links.privacyPolicy") },
    { href: "/terms", label: t("footer.links.termsOfService") },
    { href: "/cookies", label: t("footer.links.cookiePolicy") },
    { href: "/gdpr", label: t("footer.links.gdpr") },
  ];

  return (
    <footer className="bg-terminal-darker text-terminal-light border-t border-neon-cyan/20 z-90 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4 group">
              <div className="relative w-8 h-8">
                <Image
                  src="/FredonBytes_GraphicLogo.png"
                  alt="Fredonbytes Logo"
                  fill
                  className="object-contain transition-transform duration-200 group-hover:scale-110"
                  loading="lazy"
                  quality={80}
                  sizes="32px"
                />
              </div>
              <span className="text-xl font-mono font-bold text-neon-cyan">
                Fredonbytes
              </span>
            </Link>

            <p className="text-terminal-muted mb-6 leading-relaxed font-mono text-sm">
              <span className="text-neon-cyan/70">{"// "}</span>
              {t("footer.description")}
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-neon-cyan shrink-0" />
                <span className="text-terminal-muted text-sm font-mono">
                  {t("footer.contact.location")}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-neon-cyan shrink-0" />
                <a
                  href="tel:+420799027984"
                  className="text-terminal-muted text-sm font-mono hover:text-neon-cyan transition-fast -subtle"
                >
                  {t("footer.contact.phone")}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-neon-cyan shrink-0" />
                <a
                  href="mailto:info@fredonbytes.cz"
                  className="text-terminal-muted text-sm font-mono hover:text-neon-cyan transition-fast -subtle"
                >
                  {t("footer.contact.email")}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-mono font-semibold mb-4 text-neon-cyan">
              <span className="text-terminal-muted">{"// "}</span>
              {t("footer.sections.quickLinks")}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-terminal-muted hover:text-neon-cyan transition-fast text-sm font-mono -subtle"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* External Links */}
          <div>
            <h3 className="text-lg font-mono font-semibold mb-4 text-neon-cyan">
              <span className="text-terminal-muted">{"// "}</span>
              {t("footer.sections.ourPlatforms")}
            </h3>
            <ul className="space-y-2">
              {externalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    {...(link.href.startsWith("http")
                      ? {
                          target: "_blank",
                          rel: "noopener noreferrer",
                        }
                      : {})}
                    className="text-terminal-muted hover:text-neon-cyan transition-fast text-sm font-mono -subtle"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h3 className="text-lg font-mono font-semibold mb-4 text-neon-cyan">
              <span className="text-terminal-muted">{"// "}</span>
              {t("footer.sections.legalSocial")}
            </h3>
            <ul className="space-y-2 mb-6">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-terminal-muted hover:text-neon-cyan transition-fast text-sm font-mono -subtle"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <CookieSettingsLink />
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neon-cyan/70 hover:text-neon-cyan transition-fast "
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neon-cyan/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-terminal-muted text-sm font-mono">
              <span className="text-neon-cyan/70">{"// "}</span>
              {t("footer.copyright", { year: currentYear })}
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-6 text-terminal-muted text-sm font-mono">
                <span>{t("footer.taglines.madeWith")}</span>
                <span className="text-neon-cyan">{"•"}</span>
                <span>{t("footer.taglines.motto")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
