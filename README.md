# CivicVision

AI-powered visualization for civic improvements and interior redesigns.

CivicVision is now a **static BYOK app**: anyone can clone it, paste their own Gemini API key in the browser, and run it locally. No Firebase, no payments, no backend, no committed secrets. Radical concept: portfolio repos should not ship a credit-printing backend. Wild.

## Features

- City mode: clean streets, repaired facades, greenery, bike lanes, walkability concepts
- Home mode: furniture, lighting, plants, wall colors, decluttering, design styles
- Before/after comparison slider
- Share/download generated transformations
- Browser-session API key storage only

## Tech stack

| Area | Tech |
|---|---|
| App | React 19, TypeScript, Vite |
| Styling | Tailwind CSS 4, Framer Motion |
| AI | Google Gemini API |
| Analytics | Vercel Analytics only |
| Backend | None |

## Quick start

```bash
git clone https://github.com/vatsal28/civic_vision.git
cd civic_vision
npm install
npm run dev
```

Open the local URL Vite prints, usually:

```text
http://localhost:5173
```

Then click **Use app**, paste your Gemini API key, upload an image, and generate.

## API keys

This repo does **not** need a `.env.local` file.

The app asks for a Gemini API key in the browser and stores it in `sessionStorage`, which means:

- it survives tab refreshes
- it disappears when the browser session ends
- it is not committed to git
- it is not sent to any app backend, because there is no app backend

Get a key here:

https://aistudio.google.com/app/apikey

Image generation may require billing/model access on your Google account.

## Security posture

Current public-demo posture:

- No Firebase Auth
- No Firestore
- No Firebase Functions
- No Razorpay/payment code
- No SheetDB/waitlist endpoint
- No `VITE_*` AI key bundled into the browser build
- No server-side credit system

Important caveat: because this is BYOK, the browser directly calls Google Gemini with the user's key. Only use it on machines/browsers you trust.

## Project structure

```text
civic_vision/
├── components/          # React components
├── services/            # Gemini + local analytics adapters
├── utils/               # Image helpers
├── constants.ts         # Filter definitions
├── App.tsx              # Main app
├── AppRouter.tsx        # Routes
└── index.tsx            # Entry point
```

## Build

```bash
npm run build
npm run preview
```

## License

AGPL-3.0. See [LICENSE](LICENSE).
