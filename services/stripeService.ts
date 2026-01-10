import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Get Stripe instance (lazy loaded)
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.error('Stripe publishable key not found');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

/**
 * Detect user's country based on timezone and locale
 * Returns 'IN' for India, 'OTHER' for all other countries
 */
export const detectUserCountry = (): string => {
  try {
    // Method 1: Check timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone.includes('Kolkata') || timezone.includes('India')) {
      return 'IN';
    }

    // Method 2: Check locale
    const locale = navigator.language || (navigator as any).userLanguage;
    if (locale === 'en-IN' || locale === 'hi-IN' || locale.startsWith('hi')) {
      return 'IN';
    }

    // Default to international
    return 'OTHER';
  } catch (error) {
    console.error('Country detection error:', error);
    return 'OTHER';
  }
};

/**
 * Get user's country with IP-based detection (more accurate)
 * Falls back to timezone-based detection if API fails
 */
export const detectUserCountryWithIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://ipapi.co/json/', {
      timeout: 3000, // 3 second timeout
    } as any);

    if (!response.ok) {
      throw new Error('IP detection API failed');
    }

    const data = await response.json();
    return data.country_code || detectUserCountry();
  } catch (error) {
    console.warn('IP-based country detection failed, falling back to timezone:', error);
    return detectUserCountry();
  }
};

/**
 * Convert INR prices to USD
 * Using approximate exchange rate: 1 INR ≈ $0.012 USD (₹83/USD)
 */
export const convertINRtoUSD = (inrAmount: number): number => {
  const exchangeRate = 0.012; // 1 INR ≈ $0.012 USD
  return Math.ceil(inrAmount * exchangeRate * 100) / 100; // Round to 2 decimals
};

/**
 * Get currency symbol based on country
 */
export const getCurrencySymbol = (country: string): string => {
  return country === 'IN' ? '₹' : '$';
};

/**
 * Get currency code based on country
 */
export const getCurrencyCode = (country: string): string => {
  return country === 'IN' ? 'INR' : 'USD';
};

/**
 * Format price for display based on country
 */
export const formatPrice = (inrPrice: number, country: string): string => {
  if (country === 'IN') {
    return `₹${inrPrice}`;
  } else {
    const usdPrice = convertINRtoUSD(inrPrice);
    return `$${usdPrice.toFixed(2)}`;
  }
};

/**
 * Get payment method name for display
 */
export const getPaymentMethodName = (country: string): string => {
  return country === 'IN' ? 'Razorpay' : 'Stripe';
};
