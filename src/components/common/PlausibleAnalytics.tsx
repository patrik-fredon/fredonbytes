"use client";

import Script from "next/script";

/**
 * Plausible Analytics Component
 *
 * Implements Plausible Analytics with lazy loading to prevent blocking SSR/SSG/ISR
 * - Uses Next.js Script component with lazyOnload strategy
 * - Does not block page rendering or hydration
 * - Fully compatible with static generation
 * - Tracks: file downloads, outbound links, pageviews, revenue, custom events
 *
 * @see https://plausible.io/docs
 */
export default function PlausibleAnalytics() {
  return (
    <>
      {/* Plausible Analytics Script - Lazy loaded after page interactive */}
      <Script
        defer
        data-domain="fredonbytes.eu"
        src="https://plausible.homelab-fredon.space/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js"
        strategy="lazyOnload"
        id="plausible-script"
      />

      {/* Initialize Plausible global function - Must load after main script */}
      <Script
        id="plausible-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.plausible = window.plausible || function() {
              (window.plausible.q = window.plausible.q || []).push(arguments)
            }
          `,
        }}
      />
    </>
  );
}
