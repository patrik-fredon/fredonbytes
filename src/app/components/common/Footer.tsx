'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Github, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { 
      href: 'https://github.com/FredonBytes', 
      icon: Github, 
      label: 'GitHub - FredonBytes',
      external: true 
    },
    { 
      href: 'https://github.com/patrik-fredon', 
      icon: Github, 
      label: 'GitHub - Patrik Fredon',
      external: true 
    },
    { 
      href: 'https://linkedin.com/company/fredonbytes', 
      icon: Linkedin, 
      label: 'LinkedIn',
      external: true 
    },
    { 
      href: 'https://twitter.com/fredonbytes', 
      icon: Twitter, 
      label: 'Twitter',
      external: true 
    },
  ]

  const quickLinks = [
    { href: '#about', label: 'About Us' },
    { href: '#services', label: 'Services' },
    { href: '#projects', label: 'Projects' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#contact', label: 'Contact' },
  ]

  const externalLinks = [
    { href: 'https://me.fredonbytes.cloud', label: 'Personal Portfolio' },
    { href: 'https://lib.fredonbytes.cloud', label: 'Project Gallery' },
    { href: 'https://tech.fredonbytes.cloud', label: 'Technical Support' },
    { href: '/links', label: 'All Links' },
  ]

  const legalLinks = [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms-of-service', label: 'Terms of Service' },
    { href: '/cookie-policy', label: 'Cookie Policy' },
  ]

  return (
    <footer className="bg-slate-900 text-white">
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
                />
              </div>
              <span className="text-xl font-bold">Fredonbytes</span>
            </Link>
            
            <p className="text-slate-300 mb-6 leading-relaxed">
              Your All-in-One IT Powerhouse. From code to clicks, we deliver complete digital dominance.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">Brno, Czech Republic</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a 
                  href="tel:+420799027984" 
                  className="text-slate-300 text-sm hover:text-white transition-colors duration-200"
                >
                  +420 799 027 984
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a 
                  href="mailto:info@fredonbytes.cloud" 
                  className="text-slate-300 text-sm hover:text-white transition-colors duration-200"
                >
                  info@fredonbytes.cloud
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-slate-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* External Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Platforms</h3>
            <ul className="space-y-2">
              {externalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    {...(link.href.startsWith('http') ? { 
                      target: '_blank', 
                      rel: 'noopener noreferrer' 
                    } : {})}
                    className="text-slate-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal & Social</h3>
            <ul className="space-y-2 mb-6">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Media */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-slate-400 text-sm">
              © {currentYear} Fredonbytes. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-slate-400 text-sm">
              <span>Made with ❤️ in Czech Republic</span>
              <span>•</span>
              <span>Code. Create. Conquer.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}