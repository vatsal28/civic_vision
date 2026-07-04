import React from 'react';

export const TermsOfService: React.FC = () => {
  return (
    <main className="min-h-screen bg-[#FFF9F5] text-[#2D2A32] px-6 py-10" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div className="mx-auto max-w-3xl bg-white/80 border border-black/10 rounded-2xl shadow-xl p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Fraunces', serif" }}>Terms of Service</h1>
        <p className="text-[#6B6574] mb-6">CivicVision is provided as an open-source demo and portfolio project.</p>

        <h2 className="text-xl font-bold mt-6 mb-2">Use</h2>
        <p className="text-[#4B4652]">You provide your own Gemini API key and are responsible for usage, billing, quota, and compliance with Google's API terms.</p>

        <h2 className="text-xl font-bold mt-6 mb-2">No payments</h2>
        <p className="text-[#4B4652]">This public version does not sell credits, process payments, or provide subscriptions.</p>

        <h2 className="text-xl font-bold mt-6 mb-2">No warranty</h2>
        <p className="text-[#4B4652]">The software is provided as-is under the AGPL-3.0 license. Generated outputs may be inaccurate or unrealistic; verify before using them for real planning, design, or civic decisions.</p>

        <h2 className="text-xl font-bold mt-6 mb-2">Contact</h2>
        <p className="text-[#4B4652]">Questions: <a className="text-[#4f7eff] hover:underline" href="mailto:vatsalmishra28@gmail.com">vatsalmishra28@gmail.com</a></p>
      </div>
    </main>
  );
};
