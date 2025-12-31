# Legal Pages Setup Guide

## What Has Been Done

✅ Created Privacy Policy page component (`components/PrivacyPolicy.tsx`)
✅ Created Terms of Service page component (`components/TermsOfService.tsx`)
✅ Set up React Router for routing (`AppRouter.tsx`)
✅ Updated `index.tsx` to use the router
✅ Updated `AuthScreen.tsx` links to point to `/privacy-policy` and `/terms-of-service`
✅ Added `react-router-dom` to `package.json`
✅ Created `vercel.json` for proper routing on Vercel

## What You Need to Do

### 1. Install Dependencies

Run this command in your terminal:

```bash
npm install
```

This will install `react-router-dom` which is needed for the routing to work.

### 2. Test Locally

Run the development server:

```bash
npm run dev
```

Then visit:
- `http://localhost:3000/privacy-policy` - Privacy Policy page
- `http://localhost:3000/terms-of-service` - Terms of Service page
- `http://localhost:3000/` - Main app (should work as before)

### 3. Deploy to Vercel

The `vercel.json` file is already configured to handle client-side routing. When you deploy:

1. Push your changes to GitHub
2. Vercel will automatically detect the changes and redeploy
3. The pages will be accessible at:
   - `https://re-do.ai/privacy-policy`
   - `https://re-do.ai/terms-of-service`

### 4. Verify After Deployment

After deployment, verify:
- ✅ Privacy Policy page loads at `/privacy-policy`
- ✅ Terms of Service page loads at `/terms-of-service`
- ✅ Links in AuthScreen work correctly
- ✅ "Back to App" buttons work
- ✅ Main app still works at `/`

## File Structure

```
/Users/vatsal/Desktop/civic_vision/
├── components/
│   ├── PrivacyPolicy.tsx      # Privacy Policy page
│   └── TermsOfService.tsx      # Terms of Service page
├── AppRouter.tsx               # Router configuration
├── vercel.json                 # Vercel routing config
├── PRIVACY_POLICY.md          # Markdown source (for reference)
└── TERMS_OF_SERVICE.md        # Markdown source (for reference)
```

## Notes

- The pages are styled to match your app's dark theme
- Both pages have a "Back to App" button that returns to the main app
- Links in the AuthScreen footer now point to the web pages instead of GitHub
- The `vercel.json` ensures all routes are handled by React Router (SPA routing)

## Troubleshooting

If pages don't load after deployment:
1. Check that `vercel.json` is in the root directory
2. Verify `react-router-dom` is installed (`npm list react-router-dom`)
3. Check Vercel deployment logs for any errors
4. Ensure the build completes successfully

