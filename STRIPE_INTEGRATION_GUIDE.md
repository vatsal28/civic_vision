# Stripe Integration Guide for Redo AI

## Overview
Add Stripe for international payments alongside Razorpay for India. Automatically route users based on country.

**Current Setup:**
- Razorpay for India only
- Firebase Functions for payment processing
- Credits stored in Firestore

**Goal:**
- Stripe for international (all countries except India)
- Razorpay for India
- Auto-detect user country
- Same credit packages, same UI

---

## Step 1: Stripe Account Setup (15 min)

### 1.1 Create Stripe Account
1. Go to https://stripe.com
2. Sign up for free account
3. Complete business profile
4. **Note:** You can start testing immediately, go live later

### 1.2 Get API Keys
1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy **Publishable key** (starts with `pk_test_`)
3. Copy **Secret key** (starts with `sk_test_`)
4. Save these for later

### 1.3 Add to Environment Variables

**In Vercel:**
1. Go to your project → Settings → Environment Variables
2. Add:
   - `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_test_...`
   - `STRIPE_SECRET_KEY` = `sk_test_...` (this is SECRET, Firebase only)

**In local `.env` file:**
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

---

## Step 2: Install Dependencies (2 min)

```bash
# Frontend - Stripe.js library
npm install @stripe/stripe-js

# Firebase Functions - Stripe Node.js library
cd functions
npm install stripe
cd ..
```

---

## Step 3: Frontend Implementation

### 3.1 Create Stripe Service (`services/stripeService.ts`)

```typescript
import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

/**
 * Detect user's country based on timezone and locale
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
    if (locale === 'en-IN' || locale === 'hi-IN') {
      return 'IN';
    }

    // Method 3: For more accuracy, use a geolocation API (optional)
    // You can use ipapi.co or similar services

    // Default to international
    return 'OTHER';
  } catch (error) {
    console.error('Country detection error:', error);
    return 'OTHER';
  }
};

/**
 * Get user's country with IP-based detection (more accurate)
 * Optional - requires API call
 */
export const detectUserCountryWithIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country_code || 'OTHER';
  } catch (error) {
    console.error('IP-based country detection failed:', error);
    return detectUserCountry(); // Fallback to timezone-based
  }
};

/**
 * Convert INR prices to USD (approximate)
 */
export const convertINRtoUSD = (inrAmount: number): number => {
  const exchangeRate = 0.012; // 1 INR ≈ $0.012 USD
  return Math.ceil(inrAmount * exchangeRate * 100) / 100; // Round to 2 decimals
};
```

### 3.2 Update `PricingModal.tsx`

**Add country detection and payment routing:**

```typescript
import { getStripe, detectUserCountry, convertINRtoUSD } from '../services/stripeService';

// Inside PricingModal component:
const [userCountry, setUserCountry] = useState<string>('OTHER');
const [loadingPayment, setLoadingPayment] = useState(false);

useEffect(() => {
  // Detect country on mount
  const country = detectUserCountry();
  setUserCountry(country);
}, []);

const handlePurchase = async (credits: number, inrPrice: number) => {
  setLoadingPayment(true);

  try {
    if (userCountry === 'IN') {
      // Use Razorpay for India
      await handleRazorpayPayment(credits, inrPrice);
    } else {
      // Use Stripe for international
      await handleStripePayment(credits, inrPrice);
    }
  } catch (error) {
    console.error('Payment error:', error);
    alert('Payment failed. Please try again.');
  } finally {
    setLoadingPayment(false);
  }
};

const handleStripePayment = async (credits: number, inrPrice: number) => {
  // Convert INR to USD
  const usdPrice = convertINRtoUSD(inrPrice);

  // Call Firebase Function to create Stripe Checkout session
  const { getFunctions, httpsCallable } = await import('firebase/functions');
  const functions = getFunctions();
  const createCheckoutSession = httpsCallable(functions, 'createStripeCheckout');

  const response = await createCheckoutSession({
    credits,
    amount: usdPrice,
    currency: 'usd',
  });

  const data = response.data as { sessionId: string };

  // Redirect to Stripe Checkout
  const stripe = await getStripe();
  if (stripe) {
    const { error } = await stripe.redirectToCheckout({
      sessionId: data.sessionId,
    });

    if (error) {
      console.error('Stripe redirect error:', error);
      alert('Failed to redirect to payment. Please try again.');
    }
  }
};

const handleRazorpayPayment = async (credits: number, inrPrice: number) => {
  // Your existing Razorpay implementation
  // ... (keep as is)
};
```

**Update pricing display:**

```typescript
// Show price in local currency
const displayPrice = (inrPrice: number) => {
  if (userCountry === 'IN') {
    return `₹${inrPrice}`;
  } else {
    const usdPrice = convertINRtoUSD(inrPrice);
    return `$${usdPrice.toFixed(2)}`;
  }
};

// Update your pricing cards:
<div className="text-2xl font-bold">
  {displayPrice(package.price)}
</div>
<div className="text-xs text-gray-500">
  {userCountry === 'IN' ? 'Indian Rupees' : 'US Dollars'}
</div>
```

---

## Step 4: Firebase Functions Implementation

### 4.1 Create Stripe Checkout Function

**In `functions/src/index.ts`, add:**

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(functions.config().stripe.secret_key, {
  apiVersion: '2024-12-18.acacia', // Use latest API version
});

/**
 * Create Stripe Checkout Session
 */
export const createStripeCheckout = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  const { credits, amount, currency } = data;
  const userId = context.auth.uid;

  // Validate inputs
  if (!credits || !amount || !currency) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing required fields'
    );
  }

  try {
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: `${credits} Redo AI Credits`,
              description: `Generate ${credits} AI transformations`,
              images: ['https://re-do.ai/images/og-image.jpg'],
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${data.successUrl || 'https://re-do.ai'}?payment=success&credits=${credits}`,
      cancel_url: `${data.cancelUrl || 'https://re-do.ai'}?payment=cancelled`,
      client_reference_id: userId, // Track which user made payment
      metadata: {
        userId,
        credits: credits.toString(),
        timestamp: new Date().toISOString(),
      },
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    console.error('Stripe checkout creation error:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to create checkout session'
    );
  }
});

/**
 * Stripe Webhook - Handle successful payments
 */
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = functions.config().stripe.webhook_secret;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Extract metadata
    const userId = session.client_reference_id;
    const credits = parseInt(session.metadata?.credits || '0');

    if (!userId || !credits) {
      console.error('Missing userId or credits in session metadata');
      res.status(400).send('Invalid session metadata');
      return;
    }

    try {
      // Add credits to user account
      const userRef = admin.firestore().collection('users').doc(userId);
      await userRef.update({
        credits: admin.firestore.FieldValue.increment(credits),
        totalPurchased: admin.firestore.FieldValue.increment(credits),
        lastPurchase: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Log purchase in separate collection for analytics
      await admin.firestore().collection('purchases').add({
        userId,
        credits,
        amount: session.amount_total! / 100,
        currency: session.currency,
        paymentMethod: 'stripe',
        status: 'completed',
        sessionId: session.id,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✅ Added ${credits} credits to user ${userId}`);
    } catch (error) {
      console.error('Error updating user credits:', error);
      res.status(500).send('Failed to update credits');
      return;
    }
  }

  res.json({ received: true });
});
```

### 4.2 Deploy Firebase Functions

```bash
# Set Stripe secret key in Firebase
firebase functions:config:set stripe.secret_key="sk_test_your_secret_key"

# Deploy functions
firebase deploy --only functions
```

### 4.3 Setup Stripe Webhook (IMPORTANT!)

**After deploying, you need to configure webhooks:**

1. Get your webhook URL:
   ```
   https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/stripeWebhook
   ```

2. Go to: https://dashboard.stripe.com/test/webhooks

3. Click "Add endpoint"

4. Enter your webhook URL

5. Select events to listen for:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`

6. Copy the **Signing secret** (starts with `whsec_`)

7. Set in Firebase:
   ```bash
   firebase functions:config:set stripe.webhook_secret="whsec_your_signing_secret"
   firebase deploy --only functions
   ```

---

## Step 5: Handle Payment Success/Failure

### 5.1 Update `App.tsx` to Handle URL Params

```typescript
// In App.tsx, add useEffect to check for payment status
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentStatus = urlParams.get('payment');
  const creditsAdded = urlParams.get('credits');

  if (paymentStatus === 'success' && creditsAdded) {
    // Show success message
    alert(`Payment successful! ${creditsAdded} credits added to your account.`);

    // Track analytics
    analytics.trackPurchaseCompleted(parseInt(creditsAdded));

    // Clean up URL
    window.history.replaceState({}, document.title, window.location.pathname);
  } else if (paymentStatus === 'cancelled') {
    // User cancelled payment
    alert('Payment cancelled. You can try again anytime.');
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}, []);
```

---

## Step 6: Testing

### 6.1 Test Stripe Integration

**Test Credit Cards (Use these in test mode):**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0027 6000 3184`

**Test Details:**
- Expiry: Any future date (e.g., 12/34)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

### 6.2 Testing Checklist

- [ ] Country detection works (India vs International)
- [ ] Razorpay shows for India users
- [ ] Stripe shows for international users
- [ ] Price converts correctly (INR → USD)
- [ ] Stripe Checkout opens correctly
- [ ] Test payment completes successfully
- [ ] Credits added to Firestore after payment
- [ ] Webhook receives payment event
- [ ] Success page shows with credits
- [ ] Analytics tracks purchase

---

## Step 7: Go Live

### 7.1 Switch to Production Mode

1. **Get production API keys:**
   - Dashboard → https://dashboard.stripe.com/apikeys
   - Copy `pk_live_...` and `sk_live_...`

2. **Update environment variables:**
   ```bash
   # Vercel
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key

   # Firebase
   firebase functions:config:set stripe.secret_key="sk_live_your_key"
   firebase deploy --only functions
   ```

3. **Setup production webhook:**
   - Create new webhook endpoint with production URL
   - Update webhook secret:
     ```bash
     firebase functions:config:set stripe.webhook_secret="whsec_production_secret"
     firebase deploy --only functions
     ```

4. **Activate Stripe account:**
   - Complete business verification in Stripe Dashboard
   - Add bank account for payouts
   - Verify identity documents

---

## Pricing Comparison

| Package | India (INR) | International (USD) |
|---------|-------------|---------------------|
| 10 credits | ₹49 | $0.59 |
| 25 credits | ₹99 | $1.19 |
| 50 credits | ₹199 | $2.39 |
| 100 credits | ₹399 | $4.79 |

**Note:** USD prices calculated at ~₹83/USD exchange rate

---

## Common Issues & Solutions

### Issue: "Webhook signature verification failed"
**Solution:** Make sure webhook secret is set correctly:
```bash
firebase functions:config:get
firebase functions:config:set stripe.webhook_secret="whsec_..."
```

### Issue: Credits not added after payment
**Solution:** Check Firebase Functions logs:
```bash
firebase functions:log
```

### Issue: Country detection shows wrong country
**Solution:** Use IP-based detection (more accurate):
```typescript
const country = await detectUserCountryWithIP();
```

### Issue: Stripe Checkout not loading
**Solution:** Verify publishable key is correct and not expired

---

## Security Best Practices

✅ **DO:**
- Always verify webhook signatures
- Use HTTPS for all endpoints
- Store secret keys in Firebase config (never in code)
- Validate all inputs in Firebase Functions
- Log all transactions for audit trail

❌ **DON'T:**
- Never expose secret keys in frontend
- Don't trust client-side price calculations
- Don't skip webhook verification
- Don't store card details (Stripe handles this)

---

## Analytics to Track

Add these events to `analyticsService.ts`:

```typescript
export const trackPaymentMethodShown = (method: 'stripe' | 'razorpay', country: string) => {
  safeLogEvent('payment_method_shown', { method, country });
};

export const trackStripeCheckoutOpened = (amount: number, currency: string) => {
  safeLogEvent('stripe_checkout_opened', { amount, currency });
};

export const trackPurchaseCompleted = (credits: number, method: 'stripe' | 'razorpay') => {
  safeLogEvent('purchase_completed', {
    credits,
    method,
    value: credits, // For Google Analytics ecommerce
  });
};

export const trackPaymentFailed = (error: string, method: string) => {
  safeLogEvent('payment_failed', { error, method });
};
```

---

## Estimated Timeline

- **Setup Stripe Account:** 15 minutes
- **Install Dependencies:** 5 minutes
- **Frontend Implementation:** 2 hours
- **Backend Implementation:** 3 hours
- **Testing:** 2 hours
- **Deployment & Webhook Setup:** 1 hour

**Total:** ~8 hours (as planned in IMPLEMENTATION_PLAN.md)

---

## Next Steps After Integration

1. ✅ Test thoroughly with test cards
2. ✅ Monitor webhook logs for 24 hours
3. ✅ Track conversion rates (Stripe vs Razorpay)
4. ✅ Optimize pricing based on geography
5. ✅ Add more payment methods (Apple Pay, Google Pay)
6. ✅ Implement subscription plans (future)

---

Last Updated: January 10, 2026
Status: Ready to implement
Owner: Vatsal
