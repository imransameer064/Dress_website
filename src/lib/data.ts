// ============================================================
// Core Data Types for Elegance Pakistan E-Commerce
// ============================================================

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  images: string[];
  colors: string[];
  sizes: string[];
  stock: number;
  rating: number;
  reviews: Review[];
  tags: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  isSale?: boolean;
  discount?: number;
  fabric?: string;
  occasion?: string;
  brand?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  customerInfo: CustomerInfo;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  province: string;
  postalCode: string;
}

// ============================================================
// Product Categories
// ============================================================

export const CATEGORIES: Category[] = [
 { id: 'luxury-pret', name: 'Luxury Pret', slug: 'luxury-pret', description: 'Exquisite luxury pret collection with premium embroidery', image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80' },
  { id: 'casual-wear', name: 'Casual Wear', slug: 'casual-wear', description: 'Comfortable and stylish everyday casual outfits', image: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=600&q=80' },
  { id: 'formal-wear', name: 'Formal Wear', slug: 'formal-wear', description: 'Elegant formal attire for office and special occasions', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80' },
  { id: 'party-wear', name: 'Party Wear', slug: 'party-wear', description: 'Glamorous party wear to make you stand out', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80' },
  { id: 'bridal-collection', name: 'Bridal Collection', slug: 'bridal-collection', description: 'Breathtaking bridal ensembles for your special day', image: 'https://images.unsplash.com/photo-1519657099807-6ed24e39c710?w=600&q=80' },
  { id: 'lawn-collection', name: 'Lawn Collection', slug: 'lawn-collection', description: 'Light and breezy lawn fabric for hot Pakistani summers', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80' },
  { id: 'kurti-collection', name: 'Kurti Collection', slug: 'kurti-collection', description: 'Versatile kurtis for casual and semi-formal wear', image: 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=600&q=80' },
  { id: 'winter-collection', name: 'Winter Collection', slug: 'winter-collection', description: 'Warm and stylish winter clothing', image: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=600&q=80' },
 { id: 'new-arrivals', name: 'New Arrivals', slug: 'new-arrivals', description: 'Fresh new styles just added to our collection', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80' },
  { id: 'sale', name: 'Sale & Discounts', slug: 'sale', description: 'Amazing deals on premium Pakistani fashion', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80' },
];

// ============================================================
// Sample Products Data
// ============================================================

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'p001',
    name: 'Karma Kylie Embroidered Lawn Suit',
    description: 'Premium 3-piece lawn suit featuring intricate Tilla embroidery, delicate sequin detailing, and a matching chiffon dupatta.',
    price: 6800,
    originalPrice: 9000,
    category: 'lawn-collection',
    images: ['/one.jpeg'],
    colors: ['Powder Blue', 'Mint Green', 'Rose Pink', 'Ivory White'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 45, rating: 4.5,
    reviews: [
      { id: 'r001', userId: 'u001', userName: 'Fatima Khan', rating: 5, comment: 'Absolutely beautiful! The embroidery is exquisite and the fabric quality is top-notch.', date: '2026-10-15', avatar: '' },
      { id: 'r002', userId: 'u002', userName: 'Ayesha Malik', rating: 4, comment: 'Lovely lawn suit. The colors are exactly as shown. Highly recommend!', date: '2026-10-20', avatar: '' },
    ],
    tags: ['lawn', 'summer', 'embroidered', '3-piece', 'floral', 'tilla', 'kylie'],
    isNew: true, isSale: true, discount: 25, fabric: 'Premium Lawn', occasion: 'Casual / Semi-Formal', brand: 'Karma by Elegance', createdAt: '2026-10-01',
  },
  {
    id: 'p002',
    name: 'Karma Floral Printed Lawn 3-Piece',
    description: 'Vibrant summer floral lawn 3-piece suit with dyed cambric trousers and printed chiffon dupatta.',
    price: 5200,
    originalPrice: 6500,
    category: 'lawn-collection',
    images: ['/two.jpeg'],
    colors: ['Coral Orange', 'Turquoise', 'Yellow', 'Purple'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 62, rating: 4.2,
    reviews: [{ id: 'r003', userId: 'u003', userName: 'Zara Ahmed', rating: 4, comment: 'Good quality fabric and beautiful print. Size M fits perfectly.', date: '2026-10-12', avatar: '' }],
    tags: ['lawn', 'printed', 'summer', 'colorful', '3-piece'],
    isFeatured: true, isSale: true, discount: 20, fabric: 'Lawn', occasion: 'Casual', brand: 'Karma by Elegance', createdAt: '2026-09-15',
  },
  {
    id: 'p003',
    name: 'Karma Royal Zardozi Luxury Pret Chiffon',
    description: 'Heavily embellished luxury pret suit with traditional zardozi, hand-stitched sequins, and pure chiffon finish.',
    price: 14500,
    originalPrice: 18000,
    category: 'luxury-pret',
    images: ['/three.jpeg'],
    colors: ['Emerald Green', 'Royal Blue', 'Maroon', 'Black'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 15, rating: 4.8,
    reviews: [
      { id: 'r004', userId: 'u004', userName: 'Sana Mirza', rating: 5, comment: 'Worth every rupee! The craftsmanship is extraordinary. Got so many compliments at the wedding.', date: '2026-10-08', avatar: '' },
      { id: 'r005', userId: 'u005', userName: 'Nadia Hussain', rating: 5, comment: 'Absolutely stunning. The chiffon quality and embroidery are perfect.', date: '2026-10-18', avatar: '' },
    ],
    tags: ['luxury', 'chiffon', 'embroidered', 'zardozi', 'wedding', 'formal', 'black'],
    isFeatured: true, isSale: true, discount: 21, fabric: 'Premium Chiffon', occasion: 'Formal / Wedding', brand: 'Karma by Elegance', createdAt: '2026-09-01',
  },
  {
    id: 'p004',
    name: 'Karma Velvet Sequined Festive Party Lehenga',
    description: 'Gorgeous festive party wear lehenga crafted in rich velvet with all-over golden sequin work and embroidered border.',
    price: 16000,
    originalPrice: 20000,
    category: 'party-wear',
    images: ['/four.jpeg'],
    colors: ['Deep Red', 'Royal Gold', 'Midnight Blue', 'Forest Green'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    stock: 8, rating: 4.9,
    reviews: [{ id: 'r006', userId: 'u006', userName: 'Hira Baig', rating: 5, comment: 'I wore this to my cousins wedding and everyone wanted to know where I got it from! Absolutely gorgeous.', date: '2026-09-28', avatar: '' }],
    tags: ['lehenga', 'velvet', 'sequined', 'party', 'wedding', 'festive', 'red', 'gold'],
    isFeatured: true, isSale: true, discount: 20, fabric: 'Velvet', occasion: 'Bridal / Party', brand: 'Karma by Elegance', createdAt: '2026-08-20',
  },
  {
    id: 'p005',
    name: 'Karma Daily Comfort Cotton Printed Kurti',
    description: 'Breathable everyday cotton kurti featuring trendy ethnic prints and comfortable tailoring for daily wear.',
    price: 2800,
    originalPrice: 3500,
    category: 'casual-wear',
    images: ['/five.jpeg'],
    colors: ['Sky Blue', 'Sage Green', 'Peach', 'White', 'Mustard'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 120, rating: 4.3,
    reviews: [
      { id: 'r007', userId: 'u007', userName: 'Maryam Ali', rating: 4, comment: 'Very comfortable for daily use. The cotton quality is excellent and does not fade after washing.', date: '2026-10-05', avatar: '' },
      { id: 'r008', userId: 'u008', userName: 'Amna Shah', rating: 5, comment: 'Best value for money! Bought 3 sets already.', date: '2026-10-22', avatar: '' },
    ],
    tags: ['kurti', 'cotton', 'casual', 'printed', 'comfortable', 'daily'],
    isNew: true, isSale: true, discount: 20, fabric: 'Cotton', occasion: 'Casual / Everyday', brand: 'Karma by Elegance', createdAt: '2026-10-01',
  },
  {
    id: 'p006',
    name: 'Karma Minimalist Linen 2-Piece Co-ord Set',
    description: 'Contemporary 2-piece linen co-ord set with clean minimalist lines, notch collar, and relaxed cigarette pants.',
    price: 4600,
    originalPrice: 5800,
    category: 'casual-wear',
    images: ['/six.jpeg'],
    colors: ['Beige', 'Olive', 'Dusty Rose', 'Cream'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 35, rating: 4.6,
    reviews: [{ id: 'r009', userId: 'u009', userName: 'Sara Qureshi', rating: 5, comment: 'Love the minimalist style! Very comfortable and looks chic.', date: '2026-10-10', avatar: '' }],
    tags: ['linen', 'co-ord', 'minimalist', 'summer', 'casual'],
    isFeatured: true, isSale: true, discount: 21, fabric: 'Linen', occasion: 'Casual', brand: 'Karma by Elegance', createdAt: '2026-09-20',
  },
  {
    id: 'p007',
    name: 'Karma Pure Silk Formal Shalwar Kameez',
    description: 'Sophisticated pure raw silk formal suit with elegant thread work on neckline and sleeves, ideal for office or evening gatherings.',
    price: 11500,
    originalPrice: 14000,
    category: 'formal-wear',
    images: ['/seven.jpeg'],
    colors: ['Navy Blue', 'Charcoal Gray', 'Deep Burgundy', 'Forest Green', 'Black'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 28, rating: 4.7,
    reviews: [{ id: 'r010', userId: 'u010', userName: 'Rabia Noor', rating: 5, comment: 'The perfect office outfit. Looks professional and feels comfortable throughout the day.', date: '2026-10-14', avatar: '' }],
    tags: ['silk', 'formal', 'office', 'shalwar-kameez', 'professional', 'black'],
    isSale: true, discount: 18, fabric: 'Silk', occasion: 'Formal / Office', brand: 'Karma by Elegance', createdAt: '2026-09-10',
  },
  {
    id: 'p008',
    name: 'Karma Royal Crimson Bridal Velvet Lehenga',
    description: 'Breathtaking bridal velvet lehenga with handcrafted tilla, dabka, and nakshi embroidery on rich bridal red. The ultimate bridal statement.',
    price: 48000,
    originalPrice: 60000,
    category: 'bridal-collection',
    images: ['/eight.jpeg'],
    colors: ['Bridal Red & Gold', 'Ivory & Gold', 'Fuchsia & Gold', 'Deep Green & Gold'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    stock: 5, rating: 5.0,
    reviews: [{ id: 'r011', userId: 'u011', userName: 'Zainab Raza', rating: 5, comment: 'My wedding dream came true! This lehenga is absolutely magical. Every stitch is perfect.', date: '2026-10-01', avatar: '' }],
    tags: ['bridal', 'lehenga', 'wedding', 'gold-embroidery', 'luxury', 'red', 'dabka'],
    isFeatured: true, isSale: true, discount: 20, fabric: 'Premium Silk & Net', occasion: 'Bridal / Wedding', brand: 'Karma Bridal', createdAt: '2026-07-01',
  },
  {
    id: 'p009',
    name: 'Karma Karandi Winter Embroidered Unstitched Suit',
    description: 'Warm premium karandi 3-piece unstitched suit with detailed Kashmiri floral embroidery and matching wool shawl.',
    price: 7500,
    originalPrice: 9500,
    category: 'unstitched-suits',
    images: ['/nine.jpeg'],
    colors: ['Teal', 'Maroon', 'Royal Blue', 'Olive Green'],
    sizes: ['3-Piece Suit (Unstitched)'],
    stock: 22, rating: 4.4,
    reviews: [{ id: 'r012', userId: 'u012', userName: 'Kiran Akhtar', rating: 4, comment: 'Beautiful embroidery and excellent fabric quality. Got it stitched and it looks fabulous!', date: '2026-10-19', avatar: '' }],
    tags: ['unstitched', 'karandi', 'winter', 'embroidered', 'ethnic', '3-piece'],
    isSale: true, discount: 21, fabric: 'Karandi', occasion: 'Formal / Semi-Formal', brand: 'Karma by Elegance', createdAt: '2026-09-05',
  },
  {
    id: 'p010',
    name: 'Karma A-Line Designer Embroidered Kurti',
    description: 'Flattering A-line silhouette cotton silk designer kurti adorned with delicate neckline resham embroidery and side slits.',
    price: 3400,
    originalPrice: 4200,
    category: 'kurti-collection',
    images: ['/ten.jpeg'],
    colors: ['White', 'Pink', 'Blue', 'Green', 'Orange'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 75, rating: 4.5,
    reviews: [{ id: 'r013', userId: 'u013', userName: 'Anum Farooq', rating: 5, comment: 'Stunning kurti! The embroidery is beautiful and the fabric is so comfortable.', date: '2026-10-23', avatar: '' }],
    tags: ['kurti', 'embroidered', 'a-line', 'versatile', 'designer'],
    isNew: true, isSale: true, discount: 19, fabric: 'Cotton Silk', occasion: 'Casual / Semi-Formal', brand: 'Karma by Elegance', createdAt: '2026-10-15',
  },
  {
    id: 'p011',
    name: 'Pashmina Embroidered Shawl',
    description: 'Pure pashmina shawl with exquisite hand embroidery. A timeless piece that adds elegance to any outfit. Perfect for winter evenings and formal occasions.',
    price: 18000, originalPrice: 22000, category: 'winter-collection',
    images: ['https://images.unsplash.com/photo-1584670747417-594a9412fda5?w=600&q=80', 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=600&q=80'],
    colors: ['Cream', 'Grey', 'Caramel', 'Black', 'Midnight Blue'],
    sizes: ['One Size'],
    stock: 18, rating: 4.9,
    reviews: [{ id: 'r014', userId: 'u014', userName: 'Mehwish Hayat', rating: 5, comment: 'The softest pashmina I have ever felt. The embroidery is absolutely stunning. A luxurious gift!', date: '2026-10-25', avatar: '' }],
    tags: ['pashmina', 'shawl', 'winter', 'embroidered', 'luxury', 'gift'],
    isSale: true, discount: 18, fabric: 'Pashmina', occasion: 'Formal / Gift', brand: 'Elegance', createdAt: '2026-08-15',
  },
  {
    id: 'p012',
    name: 'Handcrafted Phulkari Dupatta',
    description: 'Traditional phulkari embroidered dupatta featuring vibrant silk thread work. A cultural masterpiece that complements any Pakistani outfit perfectly.',
    price: 4200, category: 'dupattas-accessories',
    images: ['https://images.unsplash.com/photo-1584670747417-594a9412fda5?w=600&q=80', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80'],
    colors: ['Red & Multi', 'Blue & Multi', 'Green & Multi', 'Orange & Multi'],
    sizes: ['One Size (2.5m)'],
    stock: 30, rating: 4.7,
    reviews: [{ id: 'r015', userId: 'u015', userName: 'Aliya Raza', rating: 5, comment: 'Authentic phulkari work! Bought as a gift and the recipient loved it. Will definitely order more.', date: '2026-10-17', avatar: '' }],
    tags: ['dupatta', 'phulkari', 'embroidered', 'traditional', 'cultural'],
    isFeatured: true, fabric: 'Georgette with Silk Embroidery', occasion: 'Festive / Cultural', brand: 'Elegance', createdAt: '2026-09-25',
  },
  {
    id: 'p013',
    name: 'Floral Chiffon Maxi Dress',
    description: 'Elegant floral printed chiffon maxi dress with empire waistline and flowing silhouette. Perfect for garden parties and semi-formal occasions.',
    price: 5500, originalPrice: 7000, category: 'party-wear',
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80'],
    colors: ['Blush Pink', 'Lilac', 'Baby Blue', 'Mint'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 20, rating: 4.4, reviews: [],
    tags: ['chiffon', 'maxi', 'floral', 'party', 'elegant'],
    isNew: true, isSale: true, discount: 21, fabric: 'Chiffon', occasion: 'Party / Semi-Formal', brand: 'Elegance', createdAt: '2026-10-20',
  },
  {
    id: 'p014',
    name: 'Block Print Linen Casual Set',
    description: 'Artisanal block print linen 2-piece set featuring hand-stamped geometric patterns. Comfortable, breathable, and effortlessly stylish for everyday wear.',
    price: 3800, category: 'casual-wear',
    images: ['https://images.unsplash.com/photo-1554568218-0f1715e72254?w=600&q=80', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80'],
    colors: ['Terracotta', 'Indigo', 'Sage', 'Natural'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 42, rating: 4.3, reviews: [],
    tags: ['block-print', 'linen', 'artisanal', 'casual', 'geometric'],
    isNew: true, fabric: 'Linen', occasion: 'Casual', brand: 'Elegance', createdAt: '2026-10-18',
  },
  {
    id: 'p015',
    name: 'Embroidered Net Formal Kurta',
    description: 'Stunning net kurta with all-over embroidery and contrast lining. Perfect for formal dinners and special celebrations.',
    price: 9500, originalPrice: 12000, category: 'formal-wear',
    images: ['https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80'],
    colors: ['Rose Gold', 'Silver', 'Champagne', 'Black & Gold'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 16, rating: 4.6, reviews: [],
    tags: ['net', 'embroidered', 'formal', 'kurta', 'festive'],
    isSale: true, discount: 21, fabric: 'Net with Embroidery', occasion: 'Formal / Festive', brand: 'Elegance', createdAt: '2026-09-28',
  },
  {
    id: 'p016',
    name: 'Premium Lawn 3-Piece with Embroidery',
    description: 'Beautiful premium lawn 3-piece suit featuring hand embroidered neckline and border on dupatta. Paired with cambric trouser fabric. A must-have for your summer wardrobe.',
    price: 5800, category: 'lawn-collection',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80'],
    colors: ['Teal Blue', 'Peach', 'Lavender', 'White'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 38, rating: 4.5, reviews: [],
    tags: ['lawn', 'premium', '3-piece', 'embroidery', 'summer'],
    isFeatured: true, fabric: 'Premium Lawn', occasion: 'Casual / Semi-Formal', brand: 'Elegance', createdAt: '2026-10-05',
  },
  {
    id: 'p017',
    name: 'Premium Lawn 3-Piece with Embroidery',
    description: 'Beautiful premium lawn 3-piece suit featuring hand embroidered neckline and border on dupatta. Paired with cambric trouser fabric. A must-have for your summer wardrobe.',
    price: 5800, category: 'lawn-collection',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80'],
    colors: ['Teal Blue', 'Peach', 'Lavender', 'White'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 38, rating: 4.5, reviews: [],
    tags: ['lawn', 'premium', '3-piece', 'embroidery', 'summer'],
    isFeatured: true, fabric: 'Premium Lawn', occasion: 'Casual / Semi-Formal', brand: 'Elegance', createdAt: '2026-10-05',
  },
];

// ============================================================
// Utility Functions
// ============================================================

export function getProductsByCategory(category: string): Product[] {
  if (category === 'new-arrivals') return SAMPLE_PRODUCTS.filter(p => p.isNew);
  if (category === 'sale') return SAMPLE_PRODUCTS.filter(p => p.isSale);
  return SAMPLE_PRODUCTS.filter(p => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return SAMPLE_PRODUCTS.filter(p => p.isFeatured);
}

export function getNewArrivals(): Product[] {
  return SAMPLE_PRODUCTS.filter(p => p.isNew).slice(0, 8);
}

export function getSaleProducts(): Product[] {
  return SAMPLE_PRODUCTS.filter(p => p.isSale).slice(0, 8);
}

export function getProductById(id: string): Product | undefined {
  return SAMPLE_PRODUCTS.find(p => p.id === id);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return SAMPLE_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q)) ||
    p.category.toLowerCase().includes(q)
  );
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return SAMPLE_PRODUCTS
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

export function formatPrice(price: number): string {
  return `PKR ${price.toLocaleString('en-PK')}`;
}
