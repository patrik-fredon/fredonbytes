"use client";

/**
 * ConditionalAnalytics Component
 *
 * Conditionally loads analytics and marketing scripts based on user cookie consent.
 * This component respects GDPR/CCPA requirements by only loading scripts when
 * the user has explicitly consented to the respective cookie categories.
 *
 * Script Loading Strategy:
 * - All scripts use Next.js Script component with strategy="afterInteractive"
 * - Scripts load after the page becomes interactive (after hydration)
 * - Async attribute ensures non-blocking parallel downloads
 * - Error handlers provide graceful degradation if scripts fail to load
 * - Conditional rendering based on cookie consent prevents unauthorized tracking
 *
 * Performance Optimizations:
 * - Scripts don't block initial page load or First Contentful Paint (FCP)
 * - Async loading allows parallel script downloads
 * - Deferred execution until after page interactivity
 * - No impact on Largest Contentful Paint (LCP) or Time to Interactive (TTI)
 *
 * Supported Scripts:
 * - Analytics: Google Analytics (requires NEXT_PUBLIC_GA_ID)
 * - Marketing: Facebook Pixel (requires NEXT_PUBLIC_FB_PIXEL_ID)
 * - Marketing: LinkedIn Insight Tag (requires NEXT_PUBLIC_LINKEDIN_PARTNER_ID)
 * - Marketing: Google Ads (requires NEXT_PUBLIC_GOOGLE_ADS_ID)
 *
 * Environment Variables:
 * - NEXT_PUBLIC_GA_ID: Google Analytics Measurement ID (e.g., G-XXXXXXXXXX)
 * - NEXT_PUBLIC_FB_PIXEL_ID: Facebook Pixel ID (optional)
 * - NEXT_PUBLIC_LINKEDIN_PARTNER_ID: LinkedIn Partner ID (optional)
 * - NEXT_PUBLIC_GOOGLE_ADS_ID: Google Ads Conversion ID (optional)
 */

import Script from "next/script";
import { useEffect, useId, useState } from "react";

const COOKIE_CONSENT_NAME = "cookie-consent";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

interface CookieConsentData {
  session_id: string;
  version: number;
  timestamp: string;
  preferences: CookiePreferences;
}

export default function ConditionalAnalytics() {
  const [consent, setConsent] = useState<CookiePreferences | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const uniqueKey = useId();
  useEffect(() => {
    // Check cookie consent on mount
    const checkConsent = () => {
      const consentCookie = getCookie(COOKIE_CONSENT_NAME);

      if (consentCookie) {
        try {
          const consentData: CookieConsentData = JSON.parse(consentCookie);
          setConsent(consentData.preferences);
        } catch (error) {
          console.error("Error parsing cookie consent:", error);
          setConsent(null);
        }
      } else {
        setConsent(null);
      }

      setIsLoaded(true);
    };

    checkConsent();

    // Listen for cookie consent changes (when user updates preferences)
    const handleConsentChange = () => {
      checkConsent();
    };

    window.addEventListener("cookieConsentUpdated", handleConsentChange);

    return () => {
      window.removeEventListener("cookieConsentUpdated", handleConsentChange);
    };
  }, []);

  // Don't render anything until we've checked consent
  if (!isLoaded) {
    return null;
  }

  // Get environment variables for third-party scripts
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const fbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  const linkedInPartnerId = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID;
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

  return (
    <>
      {/* Google Analytics - Only load if analytics consent is given */}
      {/* Strategy: afterInteractive - loads after page becomes interactive */}
      {/* This ensures analytics doesn't block initial page load */}
      {consent?.analytics && gaId && (
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="afterInteractive"
          async
          onLoad={() => {
            // Initialize Google Analytics
            window.gtag =
              window.gtag ||
              ((...args: unknown[]) => {
                (window.dataLayer || []).push(...args);
              });
            window.gtag("js", new Date());
            window.gtag("config", gaId, {
              anonymize_ip: true, // Anonymize IP for GDPR compliance
              cookie_flags: "SameSite=Lax;Secure",
            });
          }}
          onError={(e) => {
            console.error("Failed to load Google Analytics:", e);
          }}
        />
      )}

      {/* Marketing Scripts - Only load if marketing consent is given */}
      {consent?.marketing && (
        <>
          {/* Facebook Pixel */}
          {/* Strategy: afterInteractive - loads after page becomes interactive */}
          {/* Async loading prevents blocking of other resources */}
          {fbPixelId && (
            <Script
              id={uniqueKey}
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${fbPixelId}');
                  fbq('track', 'PageView');
                `,
              }}
              onError={(e) => {
                console.error("Failed to load Facebook Pixel:", e);
              }}
            />
          )}

          {/* LinkedIn Insight Tag */}
          {/* Strategy: afterInteractive - loads after page becomes interactive */}
          {/* The script itself sets async=true for the dynamically created script tag */}
          {linkedInPartnerId && (
            <Script
              id={uniqueKey}
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  _linkedin_partner_id = "${linkedInPartnerId}";
                  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
                  window._linkedin_data_partner_ids.push(_linkedin_partner_id);
                  (function(l) {
                    if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
                    window.lintrk.q=[]}
                    var s = document.getElementsByTagName("script")[0];
                    var b = document.createElement("script");
                    b.type = "text/javascript";b.async = true;
                    b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
                    s.parentNode.insertBefore(b, s);})(window.lintrk);
                `,
              }}
              onError={(e) => {
                console.error("Failed to load LinkedIn Insight Tag:", e);
              }}
            />
          )}

          {/* Google Ads Conversion Tracking */}
          {/* Strategy: afterInteractive - loads after page becomes interactive */}
          {/* Async attribute ensures non-blocking load */}
          {googleAdsId && (
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
              strategy="afterInteractive"
              async
              onLoad={() => {
                window.gtag =
                  window.gtag ||
                  ((...args: unknown[]) => {
                    (window.dataLayer || []).push(...args);
                  });
                window.gtag("js", new Date());
                window.gtag("config", googleAdsId);
              }}
              onError={(e) => {
                console.error("Failed to load Google Ads:", e);
              }}
            />
          )}
        </>
      )}
    </>
  );
}

// Helper function to get cookie
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }

  return null;
}

// Extend Window interface for gtag and marketing scripts
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
    lintrk: unknown;
    _linkedin_data_partner_ids: string[];
    _linkedin_partner_id: string;
  }
}
