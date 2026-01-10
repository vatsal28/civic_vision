# Test Account Credentials for Razorpay Review

## Application Details
- **Application Name:** Redo AI
- **Website URL:** https://re-do.ai
- **Service:** AI-powered image transformation for urban planning and interior design
- **Payment Integration:** Razorpay for India, Stripe for International

---

## Test Account Access

### Option 1: Demo Mode (Recommended - No Login Required)
**URL:** https://re-do.ai?demo=razorpay

**How to Test:**
1. Open the URL above
2. You'll be automatically logged in as a demo user
3. You get 2 free demo credits to test the service
4. Click "Get More Credits" to see the pricing modal
5. Select a package and proceed to Razorpay payment

**Demo Account Details:**
- No registration required
- Pre-loaded with 2 credits
- Full access to all features
- Razorpay payment integration active

---

### Option 2: Google Sign-In (Real Account)
**URL:** https://re-do.ai

**How to Test:**
1. Open https://re-do.ai
2. Click "Sign in with Google"
3. Use any Google account to sign in
4. New users get 2 free credits automatically
5. Click "Get More Credits" to test payment flow

**Test Email:** You can use any Gmail account

---

## Testing the Payment Flow

### Step 1: Access the Application
- Open: https://re-do.ai?demo=razorpay
- You'll see the main interface with 2 credits displayed

### Step 2: View Pricing
- Click the "2 credits" button in top-right corner
- OR upload an image and use credits to see pricing modal
- You'll see three packages:
  - ₹49 for 10 credits
  - ₹199 for 50 credits
  - ₹349 for 100 credits

### Step 3: Initiate Payment
- Select any package (radio button)
- Click "Buy Pack" button
- Razorpay checkout modal will open

### Step 4: Test Payment
Use Razorpay test cards:
- **Success:** Card: 4111 1111 1111 1111, CVV: 123, Expiry: Any future date
- **Failure:** Card: 4000 0000 0000 0002, CVV: 123, Expiry: Any future date
- **UPI:** success@razorpay
- **Netbanking:** Select any bank → Use test credentials

### Step 5: Verify Success
- After successful payment, credits are added automatically
- You'll see a success confirmation
- Credits counter updates in real-time

---

## Application Features

### What the App Does
**Redo AI** transforms photos using AI:
1. **City Mode:** Visualize urban improvements (green spaces, bike lanes, clean streets)
2. **Home Mode:** Redesign interior spaces (furniture, colors, room types)

### How It Works
1. User uploads a photo
2. Selects transformation filters
3. Clicks "Generate" (costs 1 credit)
4. AI generates transformed image in ~10 seconds
5. User can download before/after comparison

### Credit System
- New users: 2 free credits (1 for City, 1 for Home)
- Each generation: 1 credit
- Purchase more via Razorpay (India) or Stripe (International)

---

## Payment Integration Details

### Packages & Pricing
```
Starter Pack: ₹49 for 10 credits
Popular Pack: ₹199 for 50 credits
Pro Pack: ₹349 for 100 credits
```

### Razorpay Integration
- **Environment:** Production (Live keys configured)
- **Payment Methods:** Cards, UPI, Netbanking, Wallets
- **Currency:** INR
- **Region:** India only
- **Webhook:** Configured for automatic credit addition

### Security Features
- Server-side package validation (never trust client)
- Payment signature verification
- Webhook signature validation
- Firestore transaction for atomic credit updates
- Duplicate payment prevention

---

## Technical Implementation

### Frontend
- React + TypeScript + Vite
- Razorpay Checkout SDK integration
- Firebase Authentication (Google Sign-In)

### Backend
- Firebase Cloud Functions
- Razorpay Orders API
- Webhook handling for payment.captured events
- Firestore for user data and payment records

### Firebase Project
- **Project ID:** civicvision-6583e
- **Region:** us-central1
- **Firestore Collections:**
  - `users` - User profiles and credits
  - `payments` - Payment transaction records
  - `failed_payments` - Failed payment logs

---

## Webhook Configuration

### Webhook URL
```
https://us-central1-civicvision-6583e.cloudfunctions.net/razorpayWebhook
```

### Events Subscribed
- `payment.captured` - Successful payment
- `payment.failed` - Failed payment
- `refund.created` - Refund initiated
- `refund.processed` - Refund completed

### Webhook Verification
- Signature verification using Razorpay secret
- Idempotency checks to prevent duplicate processing
- Transaction-based credit updates

---

## Business Information

### Business Details
- **Business Name:** Redo AI
- **Business Type:** SaaS (Software as a Service)
- **Service Category:** AI/ML Image Processing
- **Target Market:** Urban planners, real estate agents, interior designers, homeowners

### Contact Information
- **Developer Email:** vatsalmishra28@gmail.com
- **Support Email:** vatsalmishra28@gmail.com
- **Website:** https://re-do.ai

### Legal
- Privacy Policy: Available on website
- Terms of Service: Available on website
- Refund Policy: Available in pricing section

---

## Compliance

### Data Protection
- No credit card data stored on our servers
- Payment processing handled entirely by Razorpay
- User data stored securely in Firebase (Google Cloud)
- HTTPS encryption for all communications

### Payment Flow
1. User selects package on our website
2. We create Razorpay order via API (server-side)
3. Razorpay Checkout opens (hosted by Razorpay)
4. User completes payment on Razorpay's secure page
5. Razorpay sends webhook to our server
6. We verify signature and add credits
7. User receives confirmation

---

## Testing Checklist for Reviewers

- [ ] Access demo mode: https://re-do.ai?demo=razorpay
- [ ] Navigate to pricing by clicking credits counter
- [ ] Select a package (₹49, ₹199, or ₹349)
- [ ] Verify pricing information is clear
- [ ] Click "Buy Pack" button
- [ ] Razorpay checkout opens correctly
- [ ] Test with Razorpay test card (4111 1111 1111 1111)
- [ ] Verify payment success message
- [ ] Confirm credits are added to account
- [ ] Test the actual service (upload image, generate transformation)
- [ ] Verify user can use purchased credits

---

## Screenshots

### Landing Page
![Landing Page](Screenshot%202026-01-06%20at%2011.48.18.png)

### Pricing Modal
Shows three credit packages with Razorpay payment button

### Payment Flow
Razorpay Checkout → Payment Success → Credits Added

---

## Support During Review

If you encounter any issues during testing, please contact:
- **Email:** vatsalmishra28@gmail.com
- **Response Time:** Within 2-4 hours during business hours (IST)

---

## Additional Notes

### Why We Need Razorpay
- Our primary market is India
- Need local payment methods (UPI, Netbanking)
- Better success rates with Indian cards
- Lower transaction fees for Indian payments

### Growth Projections
- Current: Beta testing phase
- Expected: 500-1000 transactions/month within 3 months
- Target: Real estate professionals and design studios

### Compliance Commitment
- We comply with all RBI regulations
- Payment data handled per PCI-DSS standards
- User privacy protected per IT Act 2000
- Regular security audits and updates

---

Last Updated: January 10, 2026
Prepared for: Razorpay KYC/Verification Team
