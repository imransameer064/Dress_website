'use client';

import Link from 'next/link';
import { RotateCcw, CheckCircle2, AlertCircle, ArrowLeft, MessageCircle } from 'lucide-react';

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen bg-neutral-50/50 py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
                Customer Satisfaction Guarantee
              </span>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-gray-900">
                Return & Refund Policy
              </h1>
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-8 border-b border-gray-100 pb-4">
            7-Day Hassle-Free Returns Across Pakistan • Elegance Pakistan
          </p>

          <div className="space-y-8 text-sm sm:text-base text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">1. Our 7-Day Return Guarantee</h2>
              <p>
                We want you to love your chosen outfits. If you are not entirely satisfied with your purchase, you may initiate an exchange or return within <strong>7 days</strong> of receiving your parcel.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">2. Conditions for Return</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm">
                    <strong>Unstitched Fabrics:</strong> Must be in pristine condition—uncut, unwashed, with original brand seal and flyer packaging intact.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm">
                    <strong>Stitched Dresses & Ready-to-Wear:</strong> Must be unworn, undamaged, and with all designer tags and accessories attached.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm">
                    <strong>Custom-Stitched & Bridal Ensembles:</strong> Outfits stitched to personalized customer measurements cannot be returned unless an error was made by our tailoring studio.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">3. How to Request an Exchange or Return</h2>
              <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-gray-700">
                <li>
                  Reach out to our customer care team via WhatsApp at <strong>+92 300 1234567</strong> or email <strong>returns@elegancepakistan.pk</strong> with your Order ID and photo of the item.
                </li>
                <li>
                  Our representative will confirm your return and schedule a reverse courier pickup (TCS / Leopards) from your address.
                </li>
                <li>
                  Once received at our Karachi or Lahore fulfillment facility, the item undergoes quality inspection within 48 hours.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">4. Refund Methods (PKR)</h2>
              <p className="mb-2">
                For approved returns, refunds will be processed via your preferred method within 3 to 5 business days:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-gray-700">
                <li>Direct Bank Transfer (IBFT) to any verified Pakistani bank account.</li>
                <li>Mobile Wallet payment to JazzCash or EasyPaisa.</li>
                <li>Elegance Pakistan Store Credit Voucher (with an additional 5% bonus balance).</li>
              </ul>
            </section>

            <div className="bg-rose-50/70 p-6 rounded-2xl border border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Need Immediate Return Assistance?</h3>
                <p className="text-xs text-gray-500">Our customer support officers on WhatsApp are ready to help.</p>
              </div>
              <a
                href="https://wa.me/923001234567?text=Hi!%20I%20would%20like%20to%20request%20a%20return%20or%20exchange."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors whitespace-nowrap self-start sm:self-auto"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
