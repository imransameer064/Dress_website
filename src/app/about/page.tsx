'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Award, ShieldCheck, Truck, Users, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-50/50 pb-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rose-950 via-rose-900 to-gray-950 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs sm:text-sm font-medium mb-4 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Celebrating Pakistani Textile Heritage</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-6 leading-tight">
              Crafting Elegance for the Modern Pakistani Woman
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Founded on the belief that traditional Pakistani craftsmanship deserves contemporary flair, Elegance Pakistan delivers exquisite bridal wear, luxury pret, and lawn collections that celebrate your grace.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-xl shadow-gray-200/50 border border-gray-100">
          {/* Story Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
                Our Story & Philosophy
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-gray-900 leading-tight">
                Where Artisanal Heritage Meets Modern Haute Couture
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                From the historic bazaars of Lahore and the bustling textile hubs of Faisalabad to the cosmopolitan energy of Karachi and Islamabad, Pakistani fashion is known worldwide for its unmatched depth, rich textures, and breathtaking embroideries.
              </p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                At Elegance Pakistan, each ensemble is thoughtfully created with handpicked organza, pure lawn, chiffons, and raw silks. We honor the master karigars (artisans) whose intricate zardozi, gota, resham, and mirror work turn every dress into wearable art.
              </p>
              <div className="pt-2 flex items-center gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm rounded-full shadow-md transition-colors"
                >
                  <span>Explore Collections</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs sm:text-sm rounded-full transition-colors"
                >
                  <span>Get in Touch</span>
                </Link>
              </div>
            </div>

            <div className="relative h-[360px] sm:h-[480px] rounded-3xl overflow-hidden shadow-2xl bg-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80"
                alt="Pakistani Designer Fashion"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40">
                <p className="text-xs font-serif italic text-gray-800">
                  &quot;Fashion is an expression of our cultural soul. Our goal is to empower women to feel majestic and effortlessly poised.&quot;
                </p>
                <span className="block text-[11px] font-bold text-rose-700 mt-1">
                  — The Creative Studio, Elegance Pakistan
                </span>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 px-6 bg-rose-50/60 rounded-3xl border border-rose-100 mb-16 text-center">
            <div>
              <span className="text-3xl sm:text-4xl font-serif font-bold text-rose-600 block mb-1">
                50,000+
              </span>
              <span className="text-xs sm:text-sm text-gray-600 font-medium">Delighted Customers</span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-serif font-bold text-rose-600 block mb-1">
                100%
              </span>
              <span className="text-xs sm:text-sm text-gray-600 font-medium">Authentic Designer Fabrics</span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-serif font-bold text-rose-600 block mb-1">
                120+
              </span>
              <span className="text-xs sm:text-sm text-gray-600 font-medium">Pakistani Cities Served</span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-serif font-bold text-rose-600 block mb-1">
                7 Days
              </span>
              <span className="text-xs sm:text-sm text-gray-600 font-medium">Hassle-Free Return Guarantee</span>
            </div>
          </div>

          {/* Core Values */}
          <div>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-2">
                Why Women Across Pakistan Trust Us
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Built on honesty, genuine fabric excellence, and unparalleled customer delight
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-neutral-50 border border-gray-100 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-gray-900 mb-2">Uncompromised Quality</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Every thread, embellishment, and border undergoes stringent multi-stage inspection to guarantee lasting elegance.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-50 border border-gray-100 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                  <Truck className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-gray-900 mb-2">Nationwide Cash on Delivery</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Enjoy prompt, tracked deliveries with TCS, Leopards, and Call Courier right to your doorstep anywhere in Pakistan.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-50 border border-gray-100 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-gray-900 mb-2">Personalized Fashion Care</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Whether you need custom sizing guidance or styling advice, our AI assistant and WhatsApp fashion consultants are here 24/7.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
