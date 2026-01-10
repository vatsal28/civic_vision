# New Pages Added - Contact Us & Refunds

## Pages Created

### 1. Contact Us
**URL:** https://re-do.ai/contact

**Features:**
- Primary contact email: vatsalmishra28@gmail.com
- Support categories:
  - 💡 General Inquiries
  - 🛠️ Technical Support
  - 💳 Payment & Billing
  - 🤝 Partnerships & Business
  - ✨ Feature Requests
- Response time: 24-48 hours (12 hours for urgent issues)
- Links to other policy pages

### 2. Cancellation & Refunds
**URL:** https://re-do.ai/refunds

**Key Points:**
- No cancellation policy (digital credits are instant)
- Refunds handled through Razorpay
- Email vatsalmishra28@gmail.com for refund requests
- 5-7 business day processing time
- Clear eligibility criteria (eligible vs not eligible)
- Credits never expire

## Design Features

Both pages include:
- ✅ Matching site design (Fraunces + Nunito fonts)
- ✅ Peachy gradient background (#FFF9F5 to #FFE8E0)
- ✅ White content cards with rounded corners
- ✅ Blue accent color (#4f7eff)
- ✅ Mobile responsive
- ✅ Proper favicons
- ✅ SEO meta tags

## Sitemap Updates

Updated `sitemap.xml` to include:
- https://re-do.ai/contact (priority: 0.4)
- https://re-do.ai/refunds (priority: 0.4)

Also updated URLs for existing pages:
- https://re-do.ai/privacy (was /privacy-policy)
- https://re-do.ai/terms (was /terms-of-service)

## Access

Pages are now live at:
1. **Contact:** https://re-do.ai/contact
2. **Refunds:** https://re-do.ai/refunds

Both pages include "Back to Redo AI" links and cross-links to:
- Terms of Service (/terms)
- Privacy Policy (/privacy)
- Each other

## For Razorpay Compliance

These pages help with:
- Clear contact information
- Transparent refund policy
- Compliance with payment gateway requirements
- Professional business presence

## Routing Configuration

Updated `vercel.json` to handle static HTML page routing:
```json
{
  "rewrites": [
    { "source": "/contact", "destination": "/contact.html" },
    { "source": "/refunds", "destination": "/refunds.html" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures `/contact` and `/refunds` serve the static HTML files before falling back to the React SPA.

---

Last Updated: January 10, 2026
Status: Live ✅
