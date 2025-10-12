'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';
import CookieCustomizeModal from './CookieCustomizeModal';
import type { CookiePreferences } from './CookieConsentBanner';

const COOKIE_CONSENT_NAME = 'cookie-consent';
const COOKIE_CONSENT_VERSION = 1;

interface CookieConsentData {
  session_id: string;
  version: number;
  timestamp: string;
  preferences: CookiePreferences;
}

export default function CookieSettingsLink() {
  const t = useTranslations('cookies.banner');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSavePreferences = async (preferences: CookiePreferences) => {
    setIsLoading(true);
    
    try {
      // Get existing session_id or generate new one
      const existingCookie = getCookie(COOKIE_CONSENT_NAME);
      let sessionId: string;
      
      if (existingCookie) {
        try {
          const consentData: CookieConsentData = JSON.parse(existingCookie);
          sessionId = consentData.session_id;
        } catch {
          sessionId = generateSessionId();
        }
      } else {
        sessionId = generateSessionId();
      }
      
      // Save to API
      const response = await fetch('/api/cookies/consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          essential: preferences.essential,
          analytics: preferences.analytics,
          marketing: preferences.marketing,
          preferences: preferences.preferences,
          consent_version: COOKIE_CONSENT_VERSION,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save cookie consent');
      }
      
      // Save to cookie
      const consentData: CookieConsentData = {
        session_id: sessionId,
        version: COOKIE_CONSENT_VERSION,
        timestamp: new Date().toISOString(),
        preferences,
      };
      
      setCookie(COOKIE_CONSENT_NAME, JSON.stringify(consentData), 365);
      
      // Reload page to apply changes
      window.location.reload();
      
    } catch (error) {
      console.error('Error saving cookie preferences:', error);
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <Settings className="w-4 h-4" />
        <span>{t('savePreferences')}</span>
      </button>

      {showModal && (
        <CookieCustomizeModal
          onSave={handleSavePreferences}
          onClose={() => setShowModal(false)}
          isLoading={isLoading}
        />
      )}
    </>
  );
}

// Helper functions
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  
  return null;
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function generateSessionId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
