'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Shield, Truck, RefreshCw, Star } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { useStore } from '@/lib/store-context';
import type { Product } from '@/lib/data';

const HERO_SLIDES = [
  {
    id: 1,
    title: 'Summer Lawn',
    subtitle: 'Collection 2026',
    desc: 'Discover breathtaking embroidered lawn suits crafted for the Pakistani summer',
    cta: 'Shop Lawn',
    href: '/shop?category=lawn-collection',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=90',
    badge: 'Up to 30% OFF',
  },
  {
    id: 2,
    title: 'Bridal',
    subtitle: 'Dreams Collection',
    desc: 'Make your special day unforgettable with our exquisite bridal ensembles',
    cta: 'Explore Bridal',
    href: '/shop?category=bridal-collection',
    image: 'https://images.unsplash.com/photo-1519657099807-6ed24e39c710?w=1200&q=90',
    badge: 'New Arrivals',
  },
];

const FEATURES = [
  { icon: Truck, title: 'Free Delivery', desc: 'On orders over PKR 3,000' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '7-day hassle-free returns' },
  { icon: Shield, title: '100% Authentic', desc: 'Genuine Pakistani fabrics' },
  { icon: Star, title: 'Premium Quality', desc: 'Crafted with excellence' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const { state } = useStore();
  const featuredProducts = state.products.filter(p => p.isFeatured).slice(0, 8);
  const newArrivals = state.products.filter(p => p.isNew).slice(0, 8);
  const saleProducts = state.products.filter(p => p.isSale).slice(0, 4);

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gray-950">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={HERO_SLIDES[0].image}
            alt="Hero"
            fill
            priority
            className="object-cover opacity-40"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-600/20 border border-rose-500/30 text-rose-300 text-sm mb-6"
            >
              <Sparkles className="w-4 h-4" />
              {HERO_SLIDES[0].badge}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-2"
            >
              {HERO_SLIDES[0].title}
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-3xl sm:text-4xl font-light text-rose-300 mb-6"
            >
              {HERO_SLIDES[0].subtitle}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-gray-300 text-lg leading-relaxed mb-10 max-w-xl"
            >
              {HERO_SLIDES[0].desc}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href={HERO_SLIDES[0].href}
                id="hero-cta-primary"
                className="btn-primary px-8 py-4 text-base"
              >
                {HERO_SLIDES[0].cta} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/shop"
                id="hero-cta-secondary"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/30 text-white hover:bg-white/10 transition-all duration-200 text-base font-semibold"
              >
                View All Collections
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ===== FEATURES BAR ===== */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} variants={item} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{title}</div>
                  <div className="text-gray-500 text-xs">{desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== CATEGORIES GRID ===== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Explore our curated collections of premium Pakistani women&apos;s fashion</p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {state.categories.slice(0, 8).map((cat) => (
              <motion.div key={cat.id} variants={item}>
                <Link
                  href={`/shop?category=${cat.slug}`}
                  className="group relative block aspect-square rounded-2xl overflow-hidden bg-gray-200"
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-sm sm:text-base leading-tight">{cat.name}</h3>
                    <p className="text-white/70 text-xs mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      Shop Now →
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-8">
            <Link href="/categories" className="btn-secondary px-8 py-3 text-sm">
              View All Categories
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="section-title">Featured Collection</h2>
            <p className="section-subtitle">Handpicked premium pieces loved by our customers</p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>

          <div className="text-center mt-10">
            <Link href="/shop" className="btn-primary px-8 py-3 text-sm">
              Shop All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PROMO BANNER ===== */}
      <section className="py-12 pattern-bg bg-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Banner 1 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden h-52 bg-gray-900"
            >
              <Image
                src="https://images.unsplash.com/photo-1519657099807-6ed24e39c710?w=800&q=80"
                alt="Bridal Collection"
                fill
                className="object-cover opacity-50"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 flex flex-col justify-center px-8">
                <span className="text-rose-300 text-sm font-medium mb-2">New Season</span>
                <h3 className="text-white text-2xl font-bold mb-3">Bridal Dreams</h3>
                <Link href="/shop?category=bridal-collection" className="btn-primary px-6 py-2 text-sm w-fit">
                  Explore Now
                </Link>
              </div>
            </motion.div>

            {/* Banner 2 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden h-52 bg-gray-900"
            >
              <Image
                src="https://images.unsplash.com/photo-1554568218-0f1715e72254?w=800&q=80"
                alt="Sale"
                fill
                className="object-cover opacity-50"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 flex flex-col justify-center px-8">
                <span className="text-amber-300 text-sm font-medium mb-2">Limited Time</span>
                <h3 className="text-white text-2xl font-bold mb-1">Sale Up to 30% OFF</h3>
                <p className="text-white/70 text-sm mb-3">On selected summer items</p>
                <Link href="/shop?category=sale" className="btn-primary px-6 py-2 text-sm w-fit bg-amber-500 hover:bg-amber-600">
                  Shop Sale
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== NEW ARRIVALS ===== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">New Arrivals</h2>
              <p className="text-gray-500 mt-1">Fresh styles just dropped</p>
            </div>
            <Link href="/shop?category=new-arrivals" className="btn-secondary px-5 py-2 text-sm flex items-center gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== SALE SECTION ===== */}
      {saleProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-10"
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">On Sale</h2>
                  <span className="badge-sale text-sm px-3 py-1">UP TO 30% OFF</span>
                </div>
                <p className="text-gray-500">Limited time deals — grab them before they&apos;re gone!</p>
              </div>
              <Link href="/shop?category=sale" className="btn-primary px-5 py-2 text-sm flex items-center gap-2">
                All Deals <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              {saleProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">Real reviews from real customers across Pakistan</p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { name: 'Fatima Khan', city: 'Lahore', review: 'The fabric quality is exceptional! I ordered the lawn 3-piece and it exceeded all my expectations. Will definitely order again.', rating: 5 },
              { name: 'Sana Mirza', city: 'Karachi', review: 'Received my luxury pret order on time and the packaging was beautiful. The embroidery is even more stunning in person!', rating: 5 },
              { name: 'Ayesha Malik', city: 'Islamabad', review: 'Best online shopping experience in Pakistan. Fast delivery, authentic products, and great customer service via WhatsApp!', rating: 5 },
            ].map((t) => (
              <motion.div key={t.name} variants={item} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(n => (
                    <Star key={n} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">&ldquo;{t.review}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.city}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 bg-gradient-to-br from-rose-600 to-rose-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-10 h-10 mx-auto mb-4 text-rose-200" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Your Style Journey Starts Here</h2>
            <p className="text-rose-100 text-lg mb-8 max-w-2xl mx-auto">
              Explore thousands of premium Pakistani fashion pieces. Free shipping on orders over PKR 3,000!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/shop"
                className="px-8 py-4 bg-white text-rose-600 rounded-full font-bold hover:bg-rose-50 transition-colors"
              >
                Shop Now
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 border border-white/40 text-white rounded-full font-bold hover:bg-white/10 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
