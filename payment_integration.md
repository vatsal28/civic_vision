# Razorpay Payment Integration Plan

**Version:** 1.0  
**Created:** January 2025  
**Status:** Planning

---

## 1. Current State Analysis

### Already Built (Backend)

| Component | Status | Location | Notes |
|-----------|--------|----------|-------|
| `createRazorpayOrder` | ✅ Done | `functions/index.js:249-312` | Creates order with userId/credits in notes |
| `razorpayWebhook` | ✅ Done | `functions/index.js:319-414` | Handles `payment.captured`, prevents double-credit |
| `razorpay-utils.js` | ✅ Done | `functions/razorpay-utils.js` | Signature verification utilities |
| Payments collection | ✅ Done | Firestore | Records processed payments |
| `addCredits` | ✅ Done | `functions/index.js:197-243` | Manual credit addition (placeholder) |

### Not Yet Built (Frontend)

| Component | Status | Notes |
|-----------|--------|-------|
| Razorpay Checkout integration | ❌ Missing | Need to load Razorpay SDK, open checkout |
| Payment verification flow | ❌ Missing | Client-side signature verification |
| Payment status UI | ❌ Missing | Processing, success, failure states |
| Error handling | ❌ Missing | User-friendly error messages |

### Current PricingModal Behavior

The `PricingModal.tsx` currently only implements a **waitlist** flow:
- User selects a package
- Clicks "Join Waitlist"
- Entry saved to Firestore `waitlist` collection
- No actual payment processing

---

## 2. Security Vulnerabilities

### 2.1 Price/Credit Manipulation (CRITICAL)

**Location:** `functions/index.js:263`

```javascript
// ❌ CURRENT: Trusts client-sent values
const { packageId, amount, credits } = data;
```

**Attack Vector:** User modifies request to send `{ packageId: 'pro', amount: 1, credits: 1000 }`

**Fix Required:**
```javascript
// ✅ FIXED: Define packages server-side
const PACKAGES = {
    'starter': { credits: 10, price: 49 },
    'popular': { credits: 50, price: 199 },
    'pro': { credits: 100, price: 349 }
};

// Lookup by ID only, ignore client amount/credits
const pkg = PACKAGES[packageId];
if (!pkg) throw new Error('Invalid package');
// Use pkg.price and pkg.credits
```

### 2.2 Hardcoded API Keys (CRITICAL)

**Location:** `functions/index.js:278, 302, 355`

```javascript
// ❌ CURRENT: Hardcoded test key
const razorpay = initializeRazorpay(
    'rzp_test_XXXXXXXXXXXX',  // Hardcoded!
    process.env.RAZORPAY_KEY_SECRET
);
```

**Fix Required:**
```javascript
// ✅ FIXED: Use environment variable
const razorpay = initializeRazorpay(
    process.env.RAZORPAY_KEY_ID,
    process.env.RAZORPAY_KEY_SECRET
);
```

### 2.3 Webhook Signature Verification (HIGH)

**Location:** `functions/index.js:327-335`

```javascript
// ❌ CURRENT: May fail with parsed JSON body
const payload = req.body;
const isValid = verifyWebhookSignature(payload, signature, secret);
```

**Issue:** Firebase Functions parses JSON by default. Razorpay signature is computed on raw body string.

**Fix Required:**
```javascript
// ✅ FIXED: Use rawBody for signature verification
const rawBody = req.rawBody;
const isValid = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex') === signature;
```

### 2.4 Missing Amount Validation in Webhook (HIGH)

**Location:** `functions/index.js:350`

```javascript
// ❌ CURRENT: Doesn't verify amount matches expected
const amount = paymentEntity.amount;
```

**Attack Vector:** Attacker creates order for ₹349 (100 credits), pays ₹1, webhook still adds 100 credits.

**Fix Required:**
```javascript
// ✅ FIXED: Validate amount matches package
const PACKAGES = { /* ... */ };
const expectedAmount = PACKAGES[order.notes.packageId].price * 100;
if (paymentEntity.amount !== expectedAmount) {
    console.error('Amount mismatch!');
    return res.status(400).send('Amount mismatch');
}
```

### 2.5 Missing Webhook Secret Check (MEDIUM)

**Issue:** If `RAZORPAY_WEBHOOK_SECRET` is not set, signature verification may pass incorrectly.

**Fix Required:**
```javascript
if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
    console.error('Webhook secret not configured');
    return res.status(500).send('Server configuration error');
}
```

### 2.6 No Rate Limiting (MEDIUM)

**Issue:** No rate limiting on order creation. Attacker could spam orders.

**Fix Required:** Add rate limiting using Firebase Functions or middleware.

---

## 3. Race Conditions & Edge Cases

### 3.1 Race Condition: Double Order Creation

**Scenario:**
```
Time 0ms:   Click → createOrder()
Time 50ms:  Click → createOrder()
Time 100ms: Order 1 created
Time 150ms: Order 2 created → User has 2 pending orders
```

**Impact:** Confusing UX, potential for paying for wrong order.

**Fix:**
- Debounce button clicks on frontend
- Disable button during order creation
- Track pending order in state

### 3.2 Race Condition: Webhook vs Client Verification

**Scenario:**
```
Time 0ms:   Payment succeeds
Time 50ms:  Webhook arrives → Adds credits
Time 100ms: Client verifies → Tries to add credits again
```

**Impact:** Double crediting.

**Fix:**
- Only webhook adds credits
- Client just confirms success + refreshes via Firestore listener
- Never call `addCredits` from client after payment

### 3.3 Race Condition: Payment During Credit Usage

**Scenario:**
```
Tab 1: Has 0 credits, buying more
Tab 2: Uses last credit
Webhook: Adds 10 credits
Tab 1: Shows "Purchase successful"
Tab 2: Shows "Insufficient credits" (stale state)
```

**Impact:** Confusing UX.

**Fix:** Already handled - Firestore listener provides real-time updates.

### 3.4 Edge Case: User Closes Browser During Payment

**Scenario:** Razorpay modal open → User closes browser → Payment completes on Razorpay side.

**Impact:** User never sees success screen.

**Fix:**
- Webhook handles credit addition regardless
- User sees credits on next login
- Consider email notification on successful payment

### 3.5 Edge Case: Webhook Fails or Delayed

**Scenario:** Payment succeeds but webhook times out or Firestore write fails.

**Impact:** User paid but no credits received.

**Fix:**
- Log failed webhooks to separate collection for manual review
- Add client-side verification as backup
- Consider reconciliation job

### 3.6 Edge Case: Network Timeout on Order Creation

**Scenario:** Order created on Razorpay but response never received by client.

**Impact:** User retries, multiple orders exist.

**Fix:**
- Show clear loading state
- If timeout, show "Check payment status" option
- Idempotency key for order creation (optional)

---

## 4. Implementation Plan

### Phase 1: Backend Security Fixes

#### Step 1.1: Add Package Definitions

```javascript
// Add at top of functions/index.js

/**
 * Credit packages - SINGLE SOURCE OF TRUTH
 * All pricing decisions based on this, never client data
 */
const PACKAGES = {
    'starter': { id: 'starter', credits: 10, price: 49, name: 'Starter Pack' },
    'popular': { id: 'popular', credits: 50, price: 199, name: 'Popular Pack' },
    'pro': { id: 'pro', credits: 100, price: 349, name: 'Pro Pack' }
};
```

#### Step 1.2: Fix createRazorpayOrder

```javascript
exports.createRazorpayOrder = functions
    .runWith({
        secrets: ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET']
    })
    .https.onCall(async (data, context) => {
        // 1. Verify authentication
        if (!context.auth) {
            throw new functions.https.HttpsError(
                'unauthenticated',
                'You must be signed in to purchase credits'
            );
        }

        const userId = context.auth.uid;
        const { packageId } = data;

        // 2. Validate package (SERVER-SIDE LOOKUP)
        const pkg = PACKAGES[packageId];
        if (!pkg) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Invalid package selected'
            );
        }

        try {
            const { initializeRazorpay } = require('./razorpay-utils');

            // 3. Use environment variables (not hardcoded)
            const razorpay = initializeRazorpay(
                process.env.RAZORPAY_KEY_ID,
                process.env.RAZORPAY_KEY_SECRET
            );

            // 4. Create order with SERVER-SIDE values
            const order = await razorpay.orders.create({
                amount: pkg.price * 100, // Convert to paise
                currency: 'INR',
                receipt: `rcpt_${userId.slice(0, 8)}_${Date.now()}`,
                notes: {
                    userId,
                    packageId: pkg.id,
                    credits: pkg.credits.toString(),
                    expectedAmount: (pkg.price * 100).toString()
                }
            });

            console.log(`Created order ${order.id} for user ${userId}, package ${packageId}`);

            return {
                success: true,
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                keyId: process.env.RAZORPAY_KEY_ID,
                packageName: pkg.name,
                credits: pkg.credits
            };

        } catch (error) {
            console.error('Error creating Razorpay order:', error);
            throw new functions.https.HttpsError(
                'internal',
                'Failed to create payment order. Please try again.'
            );
        }
    });
```

#### Step 1.3: Fix razorpayWebhook

```javascript
exports.razorpayWebhook = functions
    .runWith({
        secrets: ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET', 'RAZORPAY_WEBHOOK_SECRET']
    })
    .https.onRequest(async (req, res) => {
        // 1. Verify webhook secret is configured
        if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
            console.error('RAZORPAY_WEBHOOK_SECRET not configured');
            return res.status(500).send('Server configuration error');
        }

        try {
            const crypto = require('crypto');
            
            // 2. Get signature and raw body
            const signature = req.headers['x-razorpay-signature'];
            const rawBody = req.rawBody;

            if (!signature || !rawBody) {
                console.error('Missing signature or body');
                return res.status(400).send('Invalid request');
            }

            // 3. Verify signature using RAW body
            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
                .update(rawBody)
                .digest('hex');

            if (expectedSignature !== signature) {
                console.error('Invalid webhook signature');
                return res.status(400).send('Invalid signature');
            }

            // 4. Parse body after verification
            const payload = JSON.parse(rawBody.toString());
            const event = payload.event;
            
            console.log(`Received Razorpay webhook: ${event}`);

            // 5. Handle payment.captured event
            if (event === 'payment.captured') {
                await handlePaymentCaptured(payload);
            }

            // 6. Handle payment.failed event
            if (event === 'payment.failed') {
                await handlePaymentFailed(payload);
            }

            res.status(200).send('OK');

        } catch (error) {
            console.error('Error processing webhook:', error);
            
            // Log for manual review
            try {
                await admin.firestore().collection('failed_webhooks').add({
                    rawBody: req.rawBody?.toString(),
                    error: error.message,
                    timestamp: admin.firestore.FieldValue.serverTimestamp()
                });
            } catch (logError) {
                console.error('Failed to log webhook error:', logError);
            }

            res.status(500).send('Internal error');
        }
    });

async function handlePaymentCaptured(payload) {
    const { initializeRazorpay } = require('./razorpay-utils');
    
    const paymentEntity = payload.payload.payment.entity;
    const orderId = paymentEntity.order_id;
    const paymentId = paymentEntity.id;
    const paidAmount = paymentEntity.amount;

    // 1. Fetch order to get notes
    const razorpay = initializeRazorpay(
        process.env.RAZORPAY_KEY_ID,
        process.env.RAZORPAY_KEY_SECRET
    );

    const order = await razorpay.orders.fetch(orderId);
    const { userId, packageId, credits, expectedAmount } = order.notes;

    // 2. Validate required fields
    if (!userId || !packageId || !credits) {
        throw new Error(`Missing order notes: userId=${userId}, packageId=${packageId}, credits=${credits}`);
    }

    // 3. Validate amount matches expected
    if (paidAmount.toString() !== expectedAmount) {
        throw new Error(`Amount mismatch: paid=${paidAmount}, expected=${expectedAmount}`);
    }

    // 4. Check for duplicate processing
    const paymentsRef = admin.firestore().collection('payments');
    const existingPayment = await paymentsRef.doc(paymentId).get();

    if (existingPayment.exists) {
        console.log(`Payment ${paymentId} already processed, skipping`);
        return;
    }

    // 5. Add credits using transaction
    const userRef = admin.firestore().collection('users').doc(userId);

    await admin.firestore().runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);

        if (!userDoc.exists) {
            throw new Error(`User ${userId} not found`);
        }

        // Update user credits
        transaction.update(userRef, {
            credits: admin.firestore.FieldValue.increment(parseInt(credits)),
            lastPurchaseAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Record payment
        transaction.set(paymentsRef.doc(paymentId), {
            userId,
            orderId,
            paymentId,
            packageId,
            amount: paidAmount / 100,
            credits: parseInt(credits),
            status: 'captured',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    });

    console.log(`Added ${credits} credits to user ${userId} for payment ${paymentId}`);
}

async function handlePaymentFailed(payload) {
    const paymentEntity = payload.payload.payment.entity;
    const orderId = paymentEntity.order_id;
    const paymentId = paymentEntity.id;
    const errorCode = paymentEntity.error_code;
    const errorDescription = paymentEntity.error_description;

    console.log(`Payment failed: ${paymentId}, error: ${errorCode} - ${errorDescription}`);

    // Record failed payment for analytics
    await admin.firestore().collection('failed_payments').add({
        orderId,
        paymentId,
        errorCode,
        errorDescription,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
}
```

#### Step 1.4: Add verifyPayment Function (Backup)

```javascript
/**
 * Client-side backup verification
 * Called after Razorpay checkout success to confirm payment processed
 */
exports.verifyPayment = functions
    .runWith({
        secrets: ['RAZORPAY_KEY_SECRET']
    })
    .https.onCall(async (data, context) => {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Must be signed in');
        }

        const { orderId, paymentId, signature } = data;
        const userId = context.auth.uid;

        // 1. Verify signature
        const { verifyPaymentSignature } = require('./razorpay-utils');
        const isValid = verifyPaymentSignature(
            orderId,
            paymentId,
            signature,
            process.env.RAZORPAY_KEY_SECRET
        );

        if (!isValid) {
            throw new functions.https.HttpsError('invalid-argument', 'Invalid payment signature');
        }

        // 2. Check if payment was processed
        const paymentDoc = await admin.firestore()
            .collection('payments')
            .doc(paymentId)
            .get();

        if (paymentDoc.exists) {
            const payment = paymentDoc.data();
            if (payment.userId !== userId) {
                throw new functions.https.HttpsError('permission-denied', 'Payment belongs to another user');
            }
            return {
                success: true,
                processed: true,
                credits: payment.credits
            };
        }

        // 3. Payment not yet processed (webhook may be delayed)
        return {
            success: true,
            processed: false,
            message: 'Payment received, credits will be added shortly'
        };
    });
```

### Phase 2: Frontend Integration

#### Step 2.1: Create Razorpay Utility

**File:** `utils/razorpay.ts`

```typescript
declare global {
    interface Window {
        Razorpay: any;
    }
}

export interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    order_id: string;
    name: string;
    description: string;
    prefill?: {
        email?: string;
        name?: string;
    };
    theme?: {
        color?: string;
    };
    handler: (response: RazorpayResponse) => void;
    modal?: {
        ondismiss?: () => void;
        escape?: boolean;
        confirm_close?: boolean;
    };
}

/**
 * Load Razorpay SDK dynamically
 */
export const loadRazorpay = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        // Already loaded
        if (window.Razorpay) {
            return resolve(window.Razorpay);
        }

        // Check if script is already loading
        const existingScript = document.querySelector('script[src*="razorpay"]');
        if (existingScript) {
            existingScript.addEventListener('load', () => resolve(window.Razorpay));
            existingScript.addEventListener('error', () => reject(new Error('Failed to load Razorpay')));
            return;
        }

        // Load script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(window.Razorpay);
        script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
        document.body.appendChild(script);
    });
};

/**
 * Open Razorpay checkout
 */
export const openRazorpayCheckout = async (options: RazorpayOptions): Promise<void> => {
    const Razorpay = await loadRazorpay();
    const rzp = new Razorpay(options);
    rzp.open();
};
```

#### Step 2.2: Add Analytics Events

**File:** `services/analyticsService.ts` (additions)

```typescript
// Payment funnel events
export const trackPackageSelected = (packageId: string, price: number) => {
    safeLogEvent('package_selected', { package_id: packageId, price });
};

export const trackCheckoutOpened = (orderId: string, packageId: string) => {
    safeLogEvent('checkout_opened', { order_id: orderId, package_id: packageId });
};

export const trackPaymentSuccess = (orderId: string, packageId: string, credits: number, amount: number) => {
    safeLogEvent('payment_success', { 
        order_id: orderId, 
        package_id: packageId,
        credits,
        amount
    });
};

export const trackPaymentFailed = (orderId: string, error: string) => {
    safeLogEvent('payment_failed', { order_id: orderId, error });
};

export const trackPaymentCancelled = (orderId: string) => {
    safeLogEvent('payment_cancelled', { order_id: orderId });
};
```

#### Step 2.3: Update PricingModal

**File:** `components/PricingModal.tsx` (complete rewrite)

The modal needs to be updated to:
1. Replace waitlist flow with actual payment
2. Add payment state machine
3. Integrate Razorpay checkout
4. Handle success/failure/cancellation
5. Show appropriate UI for each state

### Phase 3: Reliability & Monitoring

#### Step 3.1: Failed Webhook Logging

Already included in Phase 1 webhook implementation.

#### Step 3.2: Payment Status Polling (Optional)

For cases where webhook is delayed, client can poll for payment status:

```typescript
const pollPaymentStatus = async (paymentId: string, maxAttempts = 5): Promise<boolean> => {
    for (let i = 0; i < maxAttempts; i++) {
        const paymentDoc = await getDoc(doc(db, 'payments', paymentId));
        if (paymentDoc.exists()) {
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s
    }
    return false;
};
```

#### Step 3.3: Admin Reconciliation (Future)

Consider adding:
- Firebase scheduled function to check for unprocessed orders
- Admin dashboard to view failed webhooks/payments
- Manual credit addition tool for support

---

## 5. Implementation Checklist

### Backend Tasks

- [ ] Add `PACKAGES` constant to `functions/index.js`
- [ ] Update `createRazorpayOrder` to validate package server-side
- [ ] Update `createRazorpayOrder` to use env variables for keys
- [ ] Add `RAZORPAY_KEY_ID` to Firebase secrets
- [ ] Fix webhook signature verification to use rawBody
- [ ] Add amount validation in webhook
- [ ] Add `handlePaymentCaptured` helper function
- [ ] Add `handlePaymentFailed` helper function
- [ ] Add failed webhook logging to Firestore
- [ ] Add `verifyPayment` cloud function
- [ ] Deploy functions to Firebase
- [ ] Test with Razorpay test mode

### Frontend Tasks

- [ ] Create `utils/razorpay.ts` with SDK loader
- [ ] Add payment analytics events to `analyticsService.ts`
- [ ] Update `PricingModal.tsx` with payment flow
- [ ] Add payment state machine (idle/creating/checkout/verifying/success/failed)
- [ ] Integrate Razorpay checkout
- [ ] Add success confirmation screen
- [ ] Add failure error screen
- [ ] Add loading states
- [ ] Handle modal dismiss (payment cancelled)
- [ ] Test full payment flow

### Razorpay Dashboard Tasks

- [ ] Get live API keys (after KYC approval)
- [ ] Add webhook URL: `https://<region>-<project>.cloudfunctions.net/razorpayWebhook`
- [ ] Select webhook events: `payment.captured`, `payment.failed`
- [ ] Copy webhook secret
- [ ] Set `RAZORPAY_WEBHOOK_SECRET` in Firebase secrets
- [ ] Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to live keys
- [ ] Test webhook delivery

### Testing Checklist

- [ ] Happy path: Select package → Pay → Credits added
- [ ] Cancel payment: Open checkout → Close → No charge, modal returns to selection
- [ ] Failed payment: Use failing test card → Error shown
- [ ] Double-click prevention: Rapid clicks → Only one order created
- [ ] Browser close: Close during payment → Webhook adds credits on next visit
- [ ] Amount validation: Verify server rejects tampered amounts
- [ ] Signature validation: Verify webhook rejects invalid signatures
- [ ] Duplicate prevention: Same payment ID → Only credited once

---

## 6. Test Cards (Razorpay Test Mode)

| Card Number | CVV | Expiry | Result |
|-------------|-----|--------|--------|
| 4111 1111 1111 1111 | Any | Any future | Success |
| 5267 3181 8797 5449 | Any | Any future | Success (Mastercard) |
| 4000 0000 0000 0002 | Any | Any future | Declined |
| 5105 1051 0510 5100 | Any | Any future | Insufficient funds |

**UPI Test:** Use any UPI ID ending with `@razorpay` (e.g., `test@razorpay`)

---

## 7. Analytics Events

### Payment Funnel

| Event | Parameters | When |
|-------|------------|------|
| `pricing_modal_opened` | `current_credits` | Modal opens |
| `package_selected` | `package_id`, `price` | User clicks package |
| `checkout_opened` | `order_id`, `package_id` | Razorpay modal opens |
| `payment_success` | `order_id`, `package_id`, `credits`, `amount` | Payment confirmed |
| `payment_failed` | `order_id`, `error` | Payment failed |
| `payment_cancelled` | `order_id` | User closed Razorpay modal |

### Conversion Tracking

```
pricing_modal_opened → package_selected → checkout_opened → payment_success
                                                        ↘ payment_failed
                                                        ↘ payment_cancelled
```

---

## 8. Timeline Estimate

| Phase | Effort | Timeline |
|-------|--------|----------|
| Phase 1: Backend security fixes | 2-3 hours | Day 1 |
| Phase 2: Frontend integration | 3-4 hours | Day 1-2 |
| Phase 3: Testing & QA | 2-3 hours | Day 2 |
| Razorpay dashboard setup | 30 min | Day 2 |
| Live deployment | 1 hour | Day 3 |
| **Total** | **8-11 hours** | **3 days** |

---

## 9. Environment Variables Required

### Firebase Secrets (set via CLI)

```bash
firebase functions:secrets:set RAZORPAY_KEY_ID
firebase functions:secrets:set RAZORPAY_KEY_SECRET
firebase functions:secrets:set RAZORPAY_WEBHOOK_SECRET
```

### Values

| Secret | Test Value | Live Value |
|--------|------------|------------|
| `RAZORPAY_KEY_ID` | `rzp_test_xxx` | `rzp_live_xxx` |
| `RAZORPAY_KEY_SECRET` | From Razorpay dashboard | From Razorpay dashboard |
| `RAZORPAY_WEBHOOK_SECRET` | From Razorpay webhook settings | From Razorpay webhook settings |

---

## 10. Rollback Plan

If issues arise after deployment:

1. **Immediate:** Disable payment button in PricingModal (show "Coming Soon")
2. **Short-term:** Revert to waitlist mode
3. **Manual:** Process any stuck payments via Firebase console
4. **Communication:** Email affected users if credits not delivered

---

## 11. Post-Launch Monitoring

### Metrics to Track

- Order creation success rate
- Payment success rate
- Webhook delivery success rate
- Average time from payment to credit delivery
- Failed payment reasons

### Alerts to Set Up

- Webhook failures > 5 in 1 hour
- Payment success rate < 90%
- Order creation errors spike

---

## Appendix: Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           PAYMENT FLOW                                   │
└─────────────────────────────────────────────────────────────────────────┘

User Action                    Frontend                         Backend
    │                             │                                │
    │ 1. Select Package           │                                │
    │────────────────────────────>│                                │
    │                             │                                │
    │ 2. Click "Buy Now"          │                                │
    │────────────────────────────>│                                │
    │                             │ 3. createRazorpayOrder()       │
    │                             │───────────────────────────────>│
    │                             │                                │
    │                             │                    4. Validate package
    │                             │                    5. Create Razorpay order
    │                             │                                │
    │                             │<───────────────────────────────│
    │                             │ 6. Return orderId, keyId       │
    │                             │                                │
    │                             │ 7. Open Razorpay Checkout      │
    │<────────────────────────────│                                │
    │                             │                                │
    │ 8. Complete Payment         │                                │
    │ (on Razorpay)               │                                │
    │                             │                                │
    │                             │                    9. Razorpay sends webhook
    │                             │                    ────────────────────────>
    │                             │                                │
    │                             │                    10. Verify signature
    │                             │                    11. Validate amount
    │                             │                    12. Add credits (transaction)
    │                             │                    13. Record payment
    │                             │                                │
    │                             │ 14. Firestore listener updates │
    │<────────────────────────────│<───────────────────────────────│
    │                             │                                │
    │ 15. Show success +          │                                │
    │     updated credits         │                                │
    │                             │                                │
```

