'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In local demo, save contact message or notify user
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Order Inquiry',
        message: '',
      });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-20">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-rose-950 via-rose-900 to-gray-950 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs sm:text-sm font-medium mb-4 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>We&apos;re Here to Assist You</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight mb-4">
              Get in Touch with Our Fashion Team
            </h1>
            <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              Have queries about custom bridal appointments, order statuses, fabric details, or exchanges? Our customer care specialists are eager to assist.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
              Send Us a Message
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-6">
              Fill out the form below and our team will get back to you within 24 business hours.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-2xl"
              >
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-emerald-900 mb-1">
                  Thank You for Contacting Us!
                </h3>
                <p className="text-xs sm:text-sm text-emerald-700 max-w-md mx-auto">
                  Your message has been received. One of our fashion consultants will contact you shortly via email or phone.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ayesha Malik"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ayesha@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Phone Number (PK) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0300-1234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500 bg-white"
                    >
                      <option value="Order Inquiry">Order Status & Tracking</option>
                      <option value="Bridal Consultation">Bridal Couture Appointment</option>
                      <option value="Custom Stitching">Custom Stitching & Sizing</option>
                      <option value="Returns & Exchanges">Returns & Exchanges</option>
                      <option value="Wholesale / Other">Wholesale & General</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide details about your query or order ID..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full text-sm border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-rose-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Contact info */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/50 border border-gray-100 space-y-5">
              <h3 className="text-lg font-serif font-bold text-gray-900 border-b border-gray-100 pb-3">
                Customer Care & WhatsApp
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-gray-600">
                <a
                  href="https://wa.me/923001234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors border border-emerald-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold block text-sm">Instant WhatsApp Support</span>
                    <span className="text-emerald-700 text-xs">+92 300 1234567 (Chat Now)</span>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs block">Helpline Phone</span>
                    <span className="font-bold text-gray-900">+92 (051) 8765432</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs block">Email Support</span>
                    <span className="font-bold text-gray-900">support@elegancepakistan.pk</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs block">Working Hours</span>
                    <span className="font-semibold text-gray-800">
                      Mon - Sat: 10:00 AM - 10:00 PM (PKT)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Flagship Studios */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
              <h3 className="text-lg font-serif font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">
                Flagship Boutique Locations
              </h3>

              <div className="space-y-4 text-xs text-gray-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900 text-sm block">Lahore Studio:</strong>
                    <span>14-C, MM Alam Road, Gulberg III, Lahore, Punjab</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900 text-sm block">Karachi Flagship:</strong>
                    <span>Dolmen Mall Clifton, Marine Drive, Block 4, Karachi, Sindh</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900 text-sm block">Islamabad Boutique:</strong>
                    <span>Beverly Centre, Blue Area, F-6/1, Islamabad, Federal Territory</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
