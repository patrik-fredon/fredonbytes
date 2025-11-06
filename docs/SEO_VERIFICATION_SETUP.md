# SEO Verification Tags Setup Guide

Tento návod vás provede nastavením verification tags pro Google Search Console a Bing Webmaster Tools.

## 🎯 Co to je?

Verification tags jsou speciální meta tagy, které umožňují vyhledávačům ověřit, že jste vlastníkem webu. Po ověření získáte přístup k SEO nástrojům jako:
- **Google Search Console** - monitoring indexování, výkonu ve vyhledávání, chyb crawlingu
- **Bing Webmaster Tools** - stejné funkce pro Bing vyhledávač

## 📋 Postup

### 1. Google Search Console

1. **Zaregistrujte se na Google Search Console:**
   - Přejděte na: https://search.google.com/search-console
   - Přidejte svou doménu: `https://fredonbytes.cz`

2. **Získejte verification kód:**
   - Vyberte metodu ověření: **HTML tag**
   - Google vám poskytne meta tag, který vypadá takto:
     ```html
     <meta name="google-site-verification" content="ABC123XYZ..." />
     ```
   - Zkopírujte hodnotu z `content=""` (např. `ABC123XYZ...`)

3. **Přidejte kód do projektu:**
   - Otevřete soubor `.env` (nebo `.env.local`) v kořeni projektu
   - Přidejte řádek:
     ```bash
     NEXT_PUBLIC_GOOGLE_VERIFICATION=ABC123XYZ...
     ```
   - Nahraďte `ABC123XYZ...` svým skutečným kódem

4. **Znovu buildujte a deployujte:**
   ```bash
   npm run build
   ```

5. **Ověřte v Google Search Console:**
   - Klikněte na tlačítko "Ověřit" v Search Console
   - Pokud vše proběhlo správně, Google potvrdí vlastnictví

### 2. Bing Webmaster Tools

1. **Zaregistrujte se na Bing Webmaster:**
   - Přejděte na: https://www.bing.com/webmasters
   - Přidejte svou doménu: `https://fredonbytes.cz`

2. **Získejte verification kód:**
   - Vyberte metodu ověření: **Meta tag**
   - Bing vám poskytne meta tag:
     ```html
     <meta name="msvalidate.01" content="DEF456ABC..." />
     ```
   - Zkopírujte hodnotu z `content=""` (např. `DEF456ABC...`)

3. **Přidejte kód do projektu:**
   - Otevřete soubor `.env` (nebo `.env.local`)
   - Přidejte řádek:
     ```bash
     NEXT_PUBLIC_BING_VERIFICATION=DEF456ABC...
     ```
   - Nahraďte `DEF456ABC...` svým skutečným kódem

4. **Znovu buildujte a deployujte:**
   ```bash
   npm run build
   ```

5. **Ověřte v Bing Webmaster:**
   - Klikněte na "Verify" v Bing Webmaster Tools
   - Bing potvrdí vlastnictví

## 📝 Příklad .env souboru

```bash
# Google Search Console Verification
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-google-verification-code-here

# Bing Webmaster Tools Verification
NEXT_PUBLIC_BING_VERIFICATION=your-bing-verification-code-here

# Other environment variables...
NEXT_PUBLIC_SITE_URL=https://fredonbytes.cz
```

## ✅ Ověření instalace

Po buildu a deployi můžete zkontrolovat, že tagy jsou na místě:

1. Otevřete web v prohlížeči: `https://fredonbytes.cz`
2. Pravý klik → "Zobrazit zdroj stránky" (View Page Source)
3. Hledejte v `<head>` sekci:
   ```html
   <meta name="google-site-verification" content="..." />
   <meta name="msvalidate.01" content="..." />
   ```

Nebo použijte browser DevTools:
```bash
# V konzoli prohlížeče:
document.querySelector('meta[name="google-site-verification"]')
document.querySelector('meta[name="msvalidate.01"]')
```

## 🚀 Výhody po ověření

### Google Search Console
- ✅ Monitoring indexování stránek
- ✅ Analýza search queries (co uživatelé hledají)
- ✅ Core Web Vitals monitoring
- ✅ Rich snippets testing
- ✅ XML sitemap submission
- ✅ Crawl error reports
- ✅ Manual action notifications

### Bing Webmaster Tools
- ✅ Podobné funkce jako Google
- ✅ Bing-specific SEO recommendations
- ✅ Keyword research
- ✅ Site scan tool

## 🔒 Bezpečnost

- ⚠️ Nikdy nesdílejte své verification kódy veřejně
- ⚠️ Přidejte `.env` do `.gitignore` (již je defaultně)
- ⚠️ Pro produkci použijte environment variables na hosting platformě

## 📚 Další kroky

Po úspěšném ověření:
1. Odešlete XML sitemap do obou nástrojů:
   - Google: `https://fredonbytes.cz/sitemap.xml`
   - Bing: `https://fredonbytes.cz/sitemap.xml`

2. Nastavte notifikace pro:
   - Crawl errors
   - Manual actions
   - Security issues

3. Sledujte pravidelně:
   - Search performance
   - Index coverage
   - Core Web Vitals

## 🆘 Troubleshooting

**Problém:** Google/Bing nemůže najít verification tag

**Řešení:**
1. Zkontrolujte, že jste správně zkopírovali kód (bez mezer)
2. Ověřte, že environment variable začíná `NEXT_PUBLIC_`
3. Zkontrolujte, že jste provedli rebuild (`npm run build`)
4. Vyčistěte cache prohlížeče a zkuste znovu
5. Počkejte 5-10 minut a zkuste ověření znovu

**Problém:** Environment variable není definovaná

**Řešení:**
1. Ujistěte se, že máte soubor `.env` v kořeni projektu
2. Restartujte dev server: `npm run dev`
3. Pro produkci: nastavte environment variables v hosting panelu

---

**Datum vytvoření:** 2025-11-06
**Status:** ✅ Implementováno v Fázi 2
**Souvisejícís soubor:** `src/app/[locale]/layout.tsx` (řádky 94-108)
