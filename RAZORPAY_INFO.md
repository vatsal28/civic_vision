# Razorpay Payment Integration

## Current Status
✅ **Razorpay ONLY** - No Stripe integration
✅ India payments via Razorpay
✅ International waitlist (coming soon)

## Test Access for Razorpay Team

### Demo Mode (No Login Required)
**URL:** https://re-do.ai?demo=razorpay

- Auto-login with 2 demo credits
- Full access to payment testing
- No registration needed

### Regular Access
**URL:** https://re-do.ai

- Sign in with any Google account
- New users get 2 free credits

## Pricing Packages

| Package | Price | Credits |
|---------|-------|---------|
| Starter | ₹49 | 10 credits |
| Popular | ₹199 | 50 credits |
| Pro | ₹349 | 100 credits |

## Testing Payment Flow

1. Open https://re-do.ai?demo=razorpay
2. Click credits counter in top-right
3. Select any package
4. Click "Buy Pack"
5. Razorpay checkout opens
6. Use test card: **4111 1111 1111 1111**
7. CVV: 123, Expiry: Any future date
8. Complete payment
9. Credits added automatically

## For Your Customer (India)

Your app now works perfectly for India customers:
- ✅ Razorpay payment gateway
- ✅ All Indian payment methods (Cards, UPI, Netbanking, Wallets)
- ✅ INR pricing
- ✅ Instant credit addition via webhooks
- ✅ Both demo mode and live mode working

Customer can:
1. Go to https://re-do.ai
2. Sign in with Google
3. Use 2 free credits
4. Buy more credits via Razorpay

## Technical Details

### Webhook URL
```
https://us-central1-civicvision-6583e.cloudfunctions.net/razorpayWebhook
```

### Events Handled
- `payment.captured` - Adds credits
- `payment.failed` - Logs failure
- `refund.created` - Records refund
- `refund.processed` - Deducts credits

### Security
- Server-side package validation
- Payment signature verification
- Webhook signature validation
- Firestore transactions for atomicity
- Duplicate payment prevention

---

Last Updated: January 10, 2026
