# Redo AI

**AI-powered visualization for urban and interior design transformations**

[Live Demo](https://re-do.ai) • [Privacy Policy](https://re-do.ai/privacy-policy) • [Terms of Service](https://re-do.ai/terms-of-service)

---

## About

Redo AI is a web application that uses Google's Gemini API to transform photos of urban environments and interior spaces. It offers two modes:

**City Mode** - Transform urban environments by removing trash, adding greenery, repairing infrastructure, and visualizing cleaner neighborhoods.

**Home Mode** - Redesign interior spaces with different furniture, lighting, plants, and design styles.

---

## Features

### City Mode
- Remove trash and litter
- Fresh paint for building facades
- Clear debris and rubble
- Add manicured greenery
- European-style infrastructure (bike lanes, walkability)
- Remove overhead wires and cables
- Add flowers and decorative vegetation

### Home Mode
- Modern furniture styles
- Indoor plants and greenery
- Warm ambient lighting
- Wall color changes
- Art and decorative elements
- Declutter and organize spaces
- Multiple design presets (Scandinavian, Mid-Century, Japanese Zen, etc.)

### Core Features
- Interactive before/after comparison slider
- Mobile-responsive design with PWA support
- BYOK (Bring Your Own Key) mode for unlimited use
- Credit-based system with Razorpay payments
- Share and download transformations

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS 4, Framer Motion |
| Backend | Firebase Functions |
| Database | Firebase Firestore |
| Auth | Firebase Auth (Google Sign-In) |
| AI | Google Gemini API (`gemini-3-pro-image-preview`) |
| Payments | Razorpay (India) |
| Hosting | Vercel |
| Analytics | Vercel Analytics, Firebase Analytics |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Firebase project (for auth & database)
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vatsal28/civic_vision.git
   cd civic_vision
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:

   Copy `.env.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

   Required variables:
   ```env
   # Firebase
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

   # Razorpay (optional, for payments)
   VITE_RAZORPAY_KEY_ID=rzp_test_xxx
   ```

4. Set up Firebase Functions secrets:
   ```bash
   firebase functions:secrets:set GEMINI_API_KEY
   firebase functions:secrets:set RAZORPAY_KEY_ID
   firebase functions:secrets:set RAZORPAY_KEY_SECRET
   firebase functions:secrets:set RAZORPAY_WEBHOOK_SECRET
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

---

## Usage

1. Sign in with Google or use BYOK mode with your own API key
2. Choose mode: City for urban environments, Home for interior spaces
3. Upload a photo of the space you want to transform
4. Select filters to apply
5. Click "Reimagine" and wait for AI processing
6. Use the slider to compare before/after
7. Share or download your transformation

---

## Project Structure

```
civic_vision/
├── components/          # React components
│   ├── AuthScreen.tsx   # Login/BYOK screen
│   ├── FilterControls.tsx
│   ├── ComparisonSlider.tsx
│   ├── PricingModal.tsx
│   ├── ShareModal.tsx
│   └── ...
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Auth state management
├── services/            # API services
│   ├── geminiService.ts # Gemini AI integration
│   └── analyticsService.ts
├── functions/           # Firebase Cloud Functions
│   └── index.js         # Backend logic
├── utils/               # Utility functions
├── constants.ts         # Filter definitions
├── App.tsx              # Main app component
└── index.tsx            # Entry point
```

---

## Security

- Images are processed in real-time and not stored
- API keys stored securely in Firebase secrets
- User API keys (BYOK mode) stored only in browser sessionStorage
- Payment processing handled by Razorpay

---

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE).

Key points:
- You can use, modify, and distribute this software
- You must keep it open source under the same license
- If you run a modified version on a server, you must share your source code

---

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## Contact

- Email: vatsalmishra28@gmail.com
- Website: [re-do.ai](https://re-do.ai)
