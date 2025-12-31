import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const PrivacyPolicy: React.FC = () => {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Privacy Policy</h1>
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
              <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
              <p>
                Redo AI ("we," "our," or "us") operates the Redo AI service (the "Service") available at re-do.ai. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
              </p>
              <p className="mt-4">
                By using Redo AI, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-white mt-4 mb-2">2.1 Account Information</h3>
              <p>When you sign in with Google, we collect:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Email address</li>
                <li>Display name</li>
                <li>Profile photo URL</li>
                <li>Unique user identifier (Firebase UID)</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">2.2 Usage Data</h3>
              <p>We collect information about how you interact with the Service:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Images you upload (processed in real-time, not stored on our servers)</li>
                <li>Filter selections and preferences</li>
                <li>Credit balance and transaction history</li>
                <li>Feature usage analytics (e.g., image uploads, generations, downloads)</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">2.3 Payment Information</h3>
              <p>When you purchase credits:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Payment amount and package selection</li>
                <li>Payment transaction IDs (via Razorpay)</li>
                <li>Credit purchase history</li>
              </ul>
              <p className="mt-2 text-sm italic">
                <strong>Note:</strong> We do not store credit card information. All payment processing is handled securely by Razorpay, our payment processor.
              </p>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">2.4 API Keys (BYOK Mode)</h3>
              <p>If you choose to use "Your Own Key" mode:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Your Google Gemini API key is stored temporarily in your browser's sessionStorage</li>
                <li>API keys are never transmitted to or stored on our servers</li>
                <li>Keys are automatically cleared when you close your browser session</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">2.5 Technical Data</h3>
              <p>We automatically collect:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Device information (browser type, operating system)</li>
                <li>IP address</li>
                <li>Usage timestamps</li>
                <li>Error logs and performance metrics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
              <p>We use the collected information for:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Service Delivery:</strong> Processing your image transformations and managing your account</li>
                <li><strong>Credit Management:</strong> Tracking and managing your credit balance</li>
                <li><strong>Payment Processing:</strong> Facilitating credit purchases through Razorpay</li>
                <li><strong>Service Improvement:</strong> Analyzing usage patterns to improve our Service</li>
                <li><strong>Communication:</strong> Sending important service updates and notifications</li>
                <li><strong>Security:</strong> Detecting and preventing fraud, abuse, or security issues</li>
                <li><strong>Legal Compliance:</strong> Complying with applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Third-Party Services</h2>
              
              <h3 className="text-xl font-semibold text-white mt-4 mb-2">4.1 Google Services</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Firebase Authentication:</strong> Handles user authentication</li>
                <li><strong>Firebase Firestore:</strong> Stores user account data and credits</li>
                <li><strong>Firebase Analytics:</strong> Tracks usage analytics</li>
                <li><strong>Google Gemini API:</strong> Processes image transformations</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">4.2 Payment Processing</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Razorpay:</strong> Processes credit card payments securely</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">4.3 Hosting & Analytics</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Vercel:</strong> Hosts our Service and provides analytics</li>
              </ul>

              <p className="mt-4">
                These third-party services have their own privacy policies. We encourage you to review them:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#4f7eff] hover:underline">Google Privacy Policy</a></li>
                <li><a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-[#4f7eff] hover:underline">Razorpay Privacy Policy</a></li>
                <li><a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#4f7eff] hover:underline">Vercel Privacy Policy</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Data Storage and Security</h2>
              
              <h3 className="text-xl font-semibold text-white mt-4 mb-2">5.1 Data Storage</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>User account data is stored in Firebase Firestore (Google Cloud)</li>
                <li>Images are processed in real-time and not permanently stored on our servers</li>
                <li>Payment data is stored securely by Razorpay</li>
                <li>Analytics data is stored by Firebase and Vercel</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">5.2 Security Measures</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>All data transmission is encrypted using HTTPS/TLS</li>
                <li>API keys (BYOK mode) are stored only in browser sessionStorage, never on our servers</li>
                <li>Payment processing uses industry-standard encryption</li>
                <li>Access to user data is restricted to authorized personnel only</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">5.3 Data Retention</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Account data is retained until you delete your account</li>
                <li>Payment records are retained as required by law (typically 7 years)</li>
                <li>Analytics data is retained according to Firebase and Vercel policies</li>
                <li>Images are not stored after processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights and Choices</h2>
              
              <h3 className="text-xl font-semibold text-white mt-4 mb-2">6.1 Access and Correction</h3>
              <p>You can access and update your account information through the Service settings.</p>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">6.2 Data Deletion</h3>
              <p>
                You may request deletion of your account and associated data by contacting us at{' '}
                <a href="mailto:vatsalmishra28@gmail.com" className="text-[#4f7eff] hover:underline">vatsalmishra28@gmail.com</a>. 
                We will delete your data within 30 days, except where retention is required by law.
              </p>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">6.3 Opt-Out of Analytics</h3>
              <p>
                You can opt out of analytics tracking by disabling cookies in your browser settings. 
                Note: This may affect Service functionality.
              </p>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">6.4 Credit Refunds</h3>
              <p>
                Credits are non-refundable except as required by law or at our discretion. 
                Refund requests should be sent to <a href="mailto:vatsalmishra28@gmail.com" className="text-[#4f7eff] hover:underline">vatsalmishra28@gmail.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Children's Privacy</h2>
              <p>
                Redo AI is not intended for users under the age of 13. We do not knowingly collect personal information 
                from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your country of residence. 
                These countries may have data protection laws that differ from those in your country. By using the Service, you consent to such transfers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Contact Us</h2>
              <p>If you have questions about this Privacy Policy, please contact us at:</p>
              <p className="mt-2">
                <strong>Email:</strong> <a href="mailto:vatsalmishra28@gmail.com" className="text-[#4f7eff] hover:underline">vatsalmishra28@gmail.com</a><br />
                <strong>Website:</strong> <a href="https://re-do.ai" className="text-[#4f7eff] hover:underline">re-do.ai</a>
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-[#252f3f] text-sm text-gray-500">
              <p>
                <strong>Note:</strong> This Privacy Policy is provided in accordance with the GNU Affero General Public License v3.0 
                under which this software is licensed.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

