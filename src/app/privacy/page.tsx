'use client';

import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-neutral-50/50 py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500 hover:text-rose-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
                Legal & Security
              </span>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-gray-900">
                Privacy Policy
              </h1>
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-8 border-b border-gray-100 pb-4">
            Last updated: November 2026 • Elegance Pakistan E-Commerce
          </p>

          <div className="space-y-8 text-sm sm:text-base text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">1. Introduction</h2>
              <p>
                At Elegance Pakistan (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we deeply respect your personal privacy. This Privacy Policy details how we collect, store, and utilize your personal information when you browse our website, interact with our Gemini AI fashion assistant, place orders for Pakistani women&apos;s apparel, or contact our customer support.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">2. Information We Collect</h2>
              <p className="mb-2">We collect information that enables us to fulfill your orders and enhance your shopping journey:</p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-gray-700">
                <li><strong>Contact details:</strong> Full name, phone number, shipping address, city, and email address.</li>
                <li><strong>Order data:</strong> Products ordered, sizing, color preferences, order totals in Pakistani Rupees (PKR), and delivery preferences.</li>
                <li><strong>Local Storage persistence:</strong> We store your active shopping bag, wishlist items, saved profile preferences, and local order records in your browser&apos;s Local Storage for fast, seamless access.</li>
                <li><strong>AI Assistant Conversations:</strong> Questions asked to our Gemini AI shopping assistant to provide context-aware dress recommendations and size advice.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">3. How Your Information is Used</h2>
              <p>
                Your details are exclusively utilized to process, dispatch, and track your clothing orders across Pakistan, verify Cash on Delivery (COD) phone numbers, deliver timely WhatsApp tracking links, and customize style recommendations. We do not sell or rent customer data to third-party marketing brokers.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">4. Courier & Logistics Sharing</h2>
              <p>
                To deliver parcels to your doorstep, necessary delivery details (name, delivery address, contact number, order amount to collect) are shared solely with authorized courier services operating in Pakistan (including TCS, Leopards Courier, and Call Courier).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">5. Data Security</h2>
              <p>
                We adopt industry-standard encryption and security protocols. Sensitive API keys (including Google Gemini AI API credentials) are strictly kept on the server-side and never exposed to client-side scripts.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">6. Contact Our Privacy Officer</h2>
              <p>
                For questions regarding your saved preferences or data removal, please reach out to{' '}
                <a href="mailto:privacy@elegancepakistan.pk" className="text-rose-600 font-semibold underline">
                  privacy@elegancepakistan.pk
                </a>{' '}
                or WhatsApp us at +92 333 3307703.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
