import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <main className="min-h-screen bg-[#FFF9F5] text-[#2D2A32] px-6 py-10" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div className="mx-auto max-w-3xl bg-white/80 border border-black/10 rounded-2xl shadow-xl p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Fraunces', serif" }}>Privacy Policy</h1>
        <p className="text-[#6B6574] mb-6">CivicVision is a local-first demo application.</p>

        <h2 className="text-xl font-bold mt-6 mb-2">What this version stores</h2>
        <ul className="list-disc pl-6 space-y-2 text-[#4B4652]">
          <li>Your Gemini API key is stored in browser <code>sessionStorage</code> only.</li>
          <li>Uploaded and generated images are held in browser memory while you use the app.</li>
          <li>The app does not run its own backend database.</li>
          <li>The app does not process payments.</li>
        </ul>

        <h2 className="text-xl font-bold mt-6 mb-2">Third-party services</h2>
        <p className="text-[#4B4652] mb-3">
          When you generate an image, your browser sends the image and prompt directly to Google Gemini using the API key you provided.
          Google handles that request under Google's API terms and privacy policy.
        </p>
        <p className="text-[#4B4652]">Vercel Analytics may collect basic site analytics if this app is deployed with Vercel Analytics enabled.</p>

        <h2 className="text-xl font-bold mt-6 mb-2">Contact</h2>
        <p className="text-[#4B4652]">Questions: <a className="text-[#4f7eff] hover:underline" href="mailto:vatsalmishra28@gmail.com">vatsalmishra28@gmail.com</a></p>
      </div>
    </main>
  );
};
