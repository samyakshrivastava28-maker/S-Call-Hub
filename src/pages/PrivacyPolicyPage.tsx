import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 md:p-12"
        >
          <div className="mb-12 border-b border-white/10 pb-8">
            <h1 className="text-4xl font-display font-bold mb-4">Privacy Policy</h1>
            <p className="text-s-gray-400">Last updated: April 2026</p>
          </div>
          
          <div className="space-y-10 text-s-gray-300 text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-4">1. Data Collection</h2>
              <p>We collect information that you provide directly to us when using S-Call Hub, including contact details, business information, and any data provided during consultation requests. We also collect usage data through our platform.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-4">2. AI Voice Processing</h2>
              <p>To provide our services, we process audio data through advanced AI voice systems including Vapi AI, Retell AI, and Omni Dimension. Text generation and conversational AI capabilities are powered by Gemini AI. Voice data is processed securely and is only retained as permitted by our terms of service and applicable law.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-4">3. User Accounts</h2>
              <p>When you create an account, we store your name and email address securely. You are responsible for maintaining the confidentiality of your password.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-4">4. Cookies</h2>
              <p>We use cookies and similar tracking technologies to track activity on our platform and hold certain information to improve and analyze our service.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-4">5. Security</h2>
              <p>The security of your data is important to us. We implement commercially acceptable means to protect personal information, though no method of transmission over the Internet is 100% secure.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-4">6. Third-Party Services</h2>
              <p>Our platform integrates with third-party providers including Vapi AI, Retell AI, Omni Dimension, and Gemini AI. By using S-Call Hub, you acknowledge that data may be processed by these partners in accordance with their respective privacy policies to deliver core functionality.</p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-white mb-4">7. Contact Information</h2>
              <p>If you have any questions about this Privacy Policy, you can contact us at:</p>
              <ul className="mt-4 space-y-2 list-none p-0 text-white">
                <li>Email: s.callhub2811@gmail.com</li>
                <li>Phone: 8305500767</li>
              </ul>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
