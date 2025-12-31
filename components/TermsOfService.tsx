import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const TermsOfService: React.FC = () => {
  useEffect(() => {
    // Ensure body can scroll
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    return () => {
      // Reset on unmount
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white font-sans overflow-y-auto">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0f1a] via-[#111827] to-[#0f172a] z-0" />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 z-0 pointer-events-none mix-blend-overlay" />

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 max-w-4xl pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to App
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Terms of Service</h1>
          <p className="text-gray-400">Last Updated: December 31, 2024</p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#151c2c] rounded-2xl p-6 md:p-8 border border-[#252f3f] prose prose-invert max-w-none"
        >
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using Redo AI ("the Service"), you agree to be bound by these Terms of Service ("Terms"). 
                If you disagree with any part of these Terms, you may not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
              <p>
                Redo AI is an AI-powered web application that transforms photos into visualizations of improved environments. 
                The Service operates in two modes:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                <li><strong>City Mode:</strong> Urban renewal and civic planning visualizations</li>
                <li><strong>Home Mode:</strong> Interior design and room decor transformations</li>
              </ul>
              <p className="mt-2">
                The Service uses Google's Gemini AI to generate transformed images based on user-uploaded photos and selected filters.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
              
              <h3 className="text-xl font-semibold text-white mt-4 mb-2">3.1 Account Creation</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>You may create an account by signing in with Google</li>
                <li>You must provide accurate and complete information</li>
                <li>You are responsible for maintaining the security of your account</li>
                <li>You must be at least 13 years old to use the Service</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">3.2 Account Types</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Guest Mode:</strong> Uses our API key with credit limits (2 free credits for new users: 1 for City, 1 for Home)</li>
                <li><strong>BYOK Mode:</strong> Uses your own Google Gemini API key (unlimited transformations)</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">3.3 Account Termination</h3>
              <p>
                We reserve the right to suspend or terminate your account if you violate these Terms or engage in 
                fraudulent, abusive, or illegal activity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Credits and Payments</h2>
              
              <h3 className="text-xl font-semibold text-white mt-4 mb-2">4.1 Credits System</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Credits are required to generate transformed images (1 credit per generation)</li>
                <li>New users receive 2 free credits upon account creation (1 for City, 1 for Home)</li>
                <li>Credits can be purchased through credit packages</li>
                <li>Credits do not expire</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">4.2 Payment Terms</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>All payments are processed securely through Razorpay</li>
                <li>Prices are displayed in Indian Rupees (₹)</li>
                <li>International payments and subscriptions are coming soon</li>
                <li>All sales are final unless required by law or at our discretion</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">4.3 Refunds</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Credits are non-refundable except as required by applicable law</li>
                <li>Refund requests must be submitted to <a href="mailto:vatsalmishra28@gmail.com" className="text-[#4f7eff] hover:underline">vatsalmishra28@gmail.com</a></li>
                <li>Refunds, if approved, will be processed within 30 days</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">4.4 Payment Processing</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>We use Razorpay as our payment processor</li>
                <li>By making a purchase, you agree to Razorpay's terms of service</li>
                <li>We are not responsible for payment processing errors or issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. User Content and Intellectual Property</h2>
              
              <h3 className="text-xl font-semibold text-white mt-4 mb-2">5.1 Your Content</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>You retain all rights to images you upload</li>
                <li>By uploading images, you grant us a license to process them for the Service</li>
                <li>You are responsible for ensuring you have the right to upload and transform images</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">5.2 Generated Content</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Generated images are created using AI technology</li>
                <li>You own the generated images created from your uploaded photos</li>
                <li>Generated images may include "Redo AI" branding</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">5.3 Prohibited Content</h3>
              <p>You may not upload images that:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Contain illegal, harmful, or offensive content</li>
                <li>Violate privacy rights of others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Use the Service for any illegal purpose</li>
                <li>Attempt to gain unauthorized access to the Service</li>
                <li>Reverse engineer, decompile, or disassemble the Service</li>
                <li>Use automated systems to access the Service without permission</li>
                <li>Abuse or overload our systems</li>
                <li>Share your API key (BYOK mode) with others</li>
                <li>Use the Service to create content that violates others' rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. API Keys (BYOK Mode)</h2>
              
              <h3 className="text-xl font-semibold text-white mt-4 mb-2">7.1 Your Responsibility</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>You are solely responsible for your Google Gemini API key</li>
                <li>You must ensure your API key has appropriate billing enabled</li>
                <li>We are not responsible for charges incurred through your API key</li>
                <li>API keys are stored only in your browser's sessionStorage</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">7.2 Key Security</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Never share your API key with others</li>
                <li>We do not store or have access to your API keys</li>
                <li>Keys are automatically cleared when you close your browser</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Service Availability</h2>
              
              <h3 className="text-xl font-semibold text-white mt-4 mb-2">8.1 Availability</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>We strive to maintain Service availability but do not guarantee uninterrupted access</li>
                <li>The Service may be unavailable due to maintenance, updates, or technical issues</li>
                <li>We are not liable for any downtime or service interruptions</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">8.2 Service Modifications</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>We reserve the right to modify, suspend, or discontinue the Service at any time</li>
                <li>We may change features, pricing, or terms with reasonable notice</li>
                <li>We are not liable for any losses resulting from Service modifications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Disclaimers and Limitations of Liability</h2>
              
              <h3 className="text-xl font-semibold text-white mt-4 mb-2">9.1 Service Disclaimer</h3>
              <p className="font-semibold text-yellow-400">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, 
                INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">9.2 AI-Generated Content</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Generated images are created by AI and may not always meet expectations</li>
                <li>We do not guarantee the accuracy, quality, or suitability of generated content</li>
                <li>You are responsible for reviewing and verifying generated images</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">9.3 Limitation of Liability</h3>
              <p className="font-semibold text-yellow-400">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, 
                OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">9.4 Maximum Liability</h3>
              <p>
                Our total liability for any claims arising from or related to the Service shall not exceed the amount 
                you paid us in the 12 months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Indemnification</h2>
              <p>You agree to indemnify and hold harmless Redo AI, its operators, and affiliates from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
                <li>Content you upload or generate</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Third-Party Services</h2>
              <p>The Service integrates with third-party services including:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Google Firebase (authentication, database, analytics)</li>
                <li>Google Gemini API (AI processing)</li>
                <li>Razorpay (payment processing)</li>
                <li>Vercel (hosting)</li>
              </ul>
              <p className="mt-2">
                Your use of these services is subject to their respective terms of service and privacy policies. 
                We are not responsible for the actions or policies of these third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. Open Source License</h2>
              <p>
                This software is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). This means:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>The source code is available and can be modified</li>
                <li>Modified versions must also be licensed under AGPL-3.0</li>
                <li>If you run a modified version on a server, you must make the source code available to users</li>
              </ul>
              <p className="mt-2">
                For the full license text, see the LICENSE file in the repository.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">13. Privacy</h2>
              <p>
                Your use of the Service is also governed by our{' '}
                <a href="/privacy-policy" className="text-[#4f7eff] hover:underline">Privacy Policy</a>, 
                which is incorporated into these Terms by reference. Please review our Privacy Policy to understand 
                how we collect, use, and protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">14. Governing Law and Dispute Resolution</h2>
              
              <h3 className="text-xl font-semibold text-white mt-4 mb-2">14.1 Governing Law</h3>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India, 
                without regard to its conflict of law provisions.
              </p>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">14.2 Dispute Resolution</h3>
              <p>Any disputes arising from or relating to these Terms or the Service shall be resolved through:</p>
              <ol className="list-decimal list-inside ml-4 space-y-1">
                <li>Good faith negotiation</li>
                <li>If negotiation fails, binding arbitration in accordance with Indian arbitration laws</li>
                <li>Courts of competent jurisdiction in India shall have exclusive jurisdiction</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">15. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of material changes by:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Posting the updated Terms on this page</li>
                <li>Updating the "Last Updated" date</li>
                <li>Providing notice through the Service when possible</li>
              </ul>
              <p className="mt-2">
                Your continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">16. Severability</h2>
              <p>
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be 
                limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">17. Entire Agreement</h2>
              <p>
                These Terms, together with the Privacy Policy, constitute the entire agreement between you and Redo AI 
                regarding the Service and supersede all prior agreements and understandings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">18. Contact Information</h2>
              <p>If you have questions about these Terms, please contact us at:</p>
              <p className="mt-2">
                <strong>Email:</strong> <a href="mailto:vatsalmishra28@gmail.com" className="text-[#4f7eff] hover:underline">vatsalmishra28@gmail.com</a><br />
                <strong>Website:</strong> <a href="https://re-do.ai" className="text-[#4f7eff] hover:underline">re-do.ai</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">19. Acknowledgment</h2>
              <p className="font-semibold text-yellow-400">
                BY USING THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF SERVICE.
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-[#252f3f] text-sm text-gray-500">
              <p>
                <strong>Note:</strong> These Terms of Service are provided in accordance with the GNU Affero General Public License v3.0 
                under which this software is licensed.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

