'use client';

import Link from 'next/link';
import { Truck, CheckCircle2, Clock, ShieldCheck, ArrowLeft, PackageCheck } from 'lucide-react';

export default function ShippingPolicyPage() {
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
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
                Nationwide Delivery Service
              </span>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-gray-900">
                Shipping & Delivery Policy
              </h1>
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-8 border-b border-gray-100 pb-4">
            Reliable Doorstep Delivery Across Pakistan • TCS, Leopards & Call Courier
          </p>

          <div className="space-y-8 text-sm sm:text-base text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">1. Delivery Rates & Free Shipping</h2>
              <p className="mb-3">
                We believe in straightforward, transparent pricing with zero surprise handling fees:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                    Orders Above PKR 3,000
                  </span>
                  <div className="text-2xl font-bold text-emerald-700 mt-1">FREE Shipping</div>
                  <p className="text-xs text-emerald-800 mt-1">
                    Applicable to all cities, towns, and districts across Pakistan.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
                    Orders Below PKR 3,000
                  </span>
                  <div className="text-2xl font-bold text-gray-900 mt-1">PKR 250 Flat Rate</div>
                  <p className="text-xs text-gray-600 mt-1">
                    Standard insured shipping fee anywhere in Pakistan.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">2. Estimated Delivery Timeframes</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-gray-100">
                  <Clock className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-sm text-gray-900 block">
                      Karachi, Lahore, Islamabad & Rawalpindi
                    </strong>
                    <span className="text-xs text-gray-600">
                      2 to 3 Business Days (Express metro delivery routes)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-gray-100">
                  <Clock className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-sm text-gray-900 block">
                      Faisalabad, Multan, Peshawar, Gujranwala, Sialkot & Hyderabad
                    </strong>
                    <span className="text-xs text-gray-600">
                      3 to 4 Business Days
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-gray-100">
                  <Clock className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-sm text-gray-900 block">
                      Balochistan, Interior Sindh, Gilgit-Baltistan & Azad Kashmir
                    </strong>
                    <span className="text-xs text-gray-600">
                      5 to 7 Business Days
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">3. Cash on Delivery (COD) Verification</h2>
              <p>
                For all Cash on Delivery orders, our automated system or customer service agent will send a verification SMS or WhatsApp confirmation. Once confirmed, your outfit is steam-pressed, carefully packaged in our luxury garment box, and handed over to the courier partner.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">4. Live Parcel Tracking</h2>
              <p>
                As soon as your package is dispatched, you receive a tracking code linking directly to TCS, Leopards, or Call Courier tracking portals. You can also monitor your live status directly on our{' '}
                <Link href="/orders" className="text-rose-600 font-semibold underline">
                  Live Order Tracking Page
                </Link>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">5. Open Parcel Inspection</h2>
              <p>
                Couriers in Pakistan collect payment upon delivery. If your flyer shows signs of tampering, please decline receipt and contact us immediately at +92 300 1234567 so we can dispatch a fresh replacement without delay.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
