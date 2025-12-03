/**
 * Currency formatting utilities with internationalization support
 */

export type Currency = "CZK" | "EUR";
export type Locale = "cs" | "en" | "de";

/**
 * Format price with proper currency symbol and locale-specific formatting
 */
export function formatPrice(
  price: number | null,
  currency: Currency,
  locale: Locale = "en",
): string {
  if (price === null) return "";

  // Use Intl.NumberFormat for proper locale-specific formatting
  const formatter = new Intl.NumberFormat(getLocaleCode(locale), {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(price);
}

/**
 * Format price range with proper currency symbol and locale-specific formatting
 */
export function formatPriceRange(
  minPrice: number,
  maxPrice: number,
  currency: Currency,
  locale: Locale = "en",
): string {
  const formattedMin = formatPrice(minPrice, currency, locale);
  const formattedMax = formatPrice(maxPrice, currency, locale);

  return `${formattedMin} - ${formattedMax}`;
}

/**
 * Get the proper locale code for Intl.NumberFormat
 */
function getLocaleCode(locale: Locale): string {
  switch (locale) {
    case "cs":
      return "cs-CZ";
    case "de":
      return "de-DE";
    default:
      return "en-US";
  }
}

/**
 * Get currency symbol for display
 */
export function getCurrencySymbol(currency: Currency): string {
  switch (currency) {
    case "CZK":
      return "Kč";
    case "EUR":
      return "€";
    default:
      return currency;
  }
}

/**
 * Convert price between currencies (basic conversion, in real app would use exchange rates)
 */
export function convertPrice(
  price: number,
  fromCurrency: Currency,
  toCurrency: Currency,
): number {
  if (fromCurrency === toCurrency) return price;

  // Basic conversion rates (in real app, these would come from an API)
  const rates = {
    CZK_TO_EUR: 0.041,
    EUR_TO_CZK: 24.5,
  };

  if (fromCurrency === "CZK" && toCurrency === "EUR") {
    return Math.round(price * rates.CZK_TO_EUR);
  }

  if (fromCurrency === "EUR" && toCurrency === "CZK") {
    return Math.round(price * rates.EUR_TO_CZK);
  }

  return price;
}

/**
 * Get default currency for locale
 */
export function getDefaultCurrency(locale: Locale): Currency {
  switch (locale) {
    case "cs":
      return "CZK";
    default:
      return "EUR";
  }
}
