<div align="center">

# ✨ Redo AI

**Transform your city and home with AI-powered visualization**

[Live Demo](https://re-do.ai) • [Privacy Policy](https://re-do.ai/privacy-policy) • [Terms of Service](https://re-do.ai/terms-of-service)

</div>

---

## 🏙️ City Mode

Transform urban environments — remove trash, add greenery, repair infrastructure, and visualize cleaner neighborhoods.

<div align="center">
<img width="100%" alt="Redo AI City Mode" src="./assets/city-screenshot.png" />
</div>

## 🏠 Home Mode

Redesign interior spaces — change furniture, adjust lighting, add plants, and explore different design styles.

<div align="center">
<img width="100%" alt="Redo AI Home Mode" src="./assets/home-screenshot.png" />
</div>

---

## ✨ Features

### City Mode
- 🗑️ **Remove Trash** — Clean up litter and garbage
- 🎨 **Fresh Paint** — Revitalize building facades
- 🧱 **Remove Debris** — Clear rubble and ruins
- 🌳 **Manicured Greenery** — Perfect lawns and trees
- 🚴 **European Infrastructure** — Bike lanes and walkability
- 🔌 **Remove Wires** — Clear stray cables and power lines
- 🌸 **Add Flowers & Plants** — Beautify with colorful vegetation

### Home Mode
- 🪑 **Modern Furniture** — Update furniture styles
- 🌿 **Add Indoor Plants** — Bring nature inside
- 💡 **Warm Lighting** — Cozy ambient lighting
- 🎨 **Wall Colors** — Fresh paint options
- 🖼️ **Art & Decor** — Add artwork and decorations
- 📚 **Organized Spaces** — Declutter and organize

### Core Features
- 🔄 **Interactive Comparison** — Side-by-side slider to compare before/after
- 📱 **Mobile Friendly** — Responsive design with PWA support
- 🔑 **BYOK Mode** — Bring your own Gemini API key for unlimited use
- 💳 **Credit System** — Pay-as-you-go with credit packages
- 📤 **Share & Download** — Export transformations with branding

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Firebase project (for auth & database)
- Google Gemini API key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vatsal28/civic_vision.git
   cd civic_vision
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
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

4. **Set up Firebase Functions secrets:**
   ```bash
   firebase functions:secrets:set GEMINI_API_KEY
   firebase functions:secrets:set RAZORPAY_KEY_ID
   firebase functions:secrets:set RAZORPAY_KEY_SECRET
   firebase functions:secrets:set RAZORPAY_WEBHOOK_SECRET
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open in browser:**
   Navigate to `http://localhost:3000`

---

## 🎯 Usage

1. **Sign in** with Google or use BYOK mode with your own API key
2. **Choose mode** — City for urban environments, Home for interior spaces
3. **Upload a photo** of the space you want to transform
4. **Select filters** — Choose which improvements to apply
5. **Generate** — Click "Reimagine" and wait for AI processing
6. **Compare** — Use the slider to see before/after
7. **Share or Download** — Export your transformation

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS 4, Framer Motion |
| Backend | Firebase Functions |
| Database | Firebase Firestore |
| Auth | Firebase Auth (Google Sign-In) |
| AI | Google Gemini API (`gemini-2.0-flash-preview-image-01`) |
| Payments | Razorpay (India) |
| Hosting | Vercel |
| Analytics | Vercel Analytics, Firebase Analytics |

---

## 📁 Project Structure

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

## 🔒 Security

- **No image storage** — Images are processed in real-time and not stored
- **API keys in secrets** — Sensitive keys stored in Firebase secrets
- **BYOK isolation** — User API keys stored only in browser sessionStorage
- **Secure payments** — Razorpay handles all payment data

---

## 📄 License

This project is open source under the [GNU Affero General Public License v3.0](LICENSE).

This means:
- ✅ You can use, modify, and distribute this software
- ✅ You must keep it open source under the same license
- ✅ If you run a modified version on a server, you must share your source code

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📬 Contact

- **Email:** vatsalmishra28@gmail.com
- **Website:** [re-do.ai](https://re-do.ai)

---

<div align="center">

**Built with ❤️ using AI**

</div>
