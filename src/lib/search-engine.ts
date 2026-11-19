import { Product, Category, formatPrice } from './data';

export interface ParsedFilters {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  color?: string;
  fabric?: string;
  occasion?: string;
  sort?: 'cheapest' | 'expensive' | 'rating' | 'newest';
  isSale?: boolean;
  intent?: 'SEARCH' | 'VIEW_CART' | 'CHECKOUT' | 'ADD_TO_CART' | 'REMOVE_FROM_CART' | 'CLEAR_CART' | 'GREETING' | 'HELP';
  targetProductId?: string;
}

export interface SearchResult {
  products: Product[];
  totalMatches: number;
  filters: ParsedFilters;
  summary: string;
}

// Convert "5k", "10k", "15k", "10 thousand" into numbers
export function parsePriceToken(token: string): number | null {
  const clean = token.toLowerCase().trim().replace(/,/g, '');

  // 5k, 10.5k
  const kMatch = clean.match(/^([\d.]+)\s*k$/);
  if (kMatch) {
    const val = parseFloat(kMatch[1]);
    return isNaN(val) ? null : Math.round(val * 1000);
  }

  // 10 thousand / 10 hazar / 5 hazar
  const thousandMatch = clean.match(/^([\d.]+)\s*(thousand|hazar|hazaar|lac|lakh)$/);
  if (thousandMatch) {
    const val = parseFloat(thousandMatch[1]);
    const multiplier = thousandMatch[2].startsWith('l') ? 100000 : 1000;
    return isNaN(val) ? null : Math.round(val * multiplier);
  }

  // pure number
  const num = parseInt(clean, 10);
  return isNaN(num) ? null : num;
}

// Extract budget and price ranges from natural language (Urdu & English)
export function extractPriceRange(text: string): { minPrice?: number; maxPrice?: number; sort?: 'cheapest' | 'expensive' } {
  const lower = text.toLowerCase().replace(/pkr|rs\.?|rupees|rupay/gi, ' ');
  let minPrice: number | undefined;
  let maxPrice: number | undefined;
  let sort: 'cheapest' | 'expensive' | undefined;

  // Sorting intents
  if (/cheapest|sasta|saste|kam price|low price|lowest price|budget friendly|minimum price/i.test(lower)) {
    sort = 'cheapest';
  } else if (/most expensive|expensive|mehenga|mehnga|highest price|luxury|premium/i.test(lower)) {
    sort = 'expensive';
  }

  // Range: "between 5k and 15k", "5000 to 10000", "5k - 10k", "5000 se 10000"
  const rangeMatch = lower.match(/(?:between|from)?\s*([\d.]+\s*k?|[\d.]+\s*(?:thousand|hazar))\s*(?:and|to|-|se)\s*([\d.]+\s*k?|[\d.]+\s*(?:thousand|hazar))/i);
  if (rangeMatch) {
    const p1 = parsePriceToken(rangeMatch[1]);
    const p2 = parsePriceToken(rangeMatch[2]);
    if (p1 !== null && p2 !== null) {
      minPrice = Math.min(p1, p2);
      maxPrice = Math.max(p1, p2);
      return { minPrice, maxPrice, sort };
    }
  }

  // Under / Below / Less than / Tak: "under 5000", "below PKR 3,000", "5000 tak", "under 10k", "less than 8k"
  const underMatch = lower.match(/(?:under|below|less than|within|max(?:imum)?|upto|up to)\s*([\d.]+\s*k?|[\d.]+\s*(?:thousand|hazar)|\d+)/i) ||
                     lower.match(/([\d.]+\s*k?|[\d.]+\s*(?:thousand|hazar)|\d+)\s*(?:tak|k andr|ke andar|or less)/i);
  if (underMatch) {
    const p = parsePriceToken(underMatch[1]);
    if (p !== null && p > 50) {
      maxPrice = p;
      return { minPrice, maxPrice, sort };
    }
  }

  // Above / More than / Se zyada: "above 10k", "more than 5000", "10000 se zyada"
  const aboveMatch = lower.match(/(?:above|more than|over|greater than|min(?:imum)?)\s*([\d.]+\s*k?|[\d.]+\s*(?:thousand|hazar)|\d+)/i) ||
                     lower.match(/([\d.]+\s*k?|[\d.]+\s*(?:thousand|hazar)|\d+)\s*(?:se zyada|se upar|or more)/i);
  if (aboveMatch) {
    const p = parsePriceToken(aboveMatch[1]);
    if (p !== null && p > 50) {
      minPrice = p;
      return { minPrice, maxPrice, sort };
    }
  }

  // Budget of X: "budget of 8000", "budget 8k", "mera budget 7000 hai"
  const budgetMatch = lower.match(/(?:budget\s*(?:of|is|hai)?\s*|budget\s*[:=]?\s*)([\d.]+\s*k?|[\d.]+\s*(?:thousand|hazar)|\d+)/i);
  if (budgetMatch) {
    const p = parsePriceToken(budgetMatch[1]);
    if (p !== null && p > 50) {
      maxPrice = p;
      return { minPrice, maxPrice, sort };
    }
  }

  return { minPrice, maxPrice, sort };
}

// Detect category from query
const CATEGORY_MAP: Record<string, string[]> = {
  'bridal-collection': ['bridal', 'bride', 'wedding', 'shaadi', 'shadi', 'dulhan', 'lehenga', 'lehnga', 'barat', 'walima', 'nikkah', 'engagement'],
  'lawn-collection': ['lawn', '3-piece', '3 piece', 'three piece', 'summer lawn', 'lawn suit', 'lawn dress'],
  'party-wear': ['party', 'party wear', 'partywear', 'festive', 'evening wear', 'function'],
  'formal-wear': ['formal', 'office', 'formal wear', 'work wear', 'interview'],
  'casual-wear': ['casual', 'daily wear', 'everyday', 'routine', 'comfort', 'cotton suit', 'co-ord', 'coord'],
  'luxury-pret': ['luxury', 'pret', 'luxury pret', 'designer', 'couture', 'zardozi', 'chiffon'],
  'kurti-collection': ['kurti', 'kurta', 'tunic', 'top', 'kurtis'],
  'winter-collection': ['winter', 'shawl', 'pashmina', 'karandi', 'khaddar', 'velvet', 'warm'],
  'unstitched-suits': ['unstitched', 'unstitched suit', 'kapra', 'cloth', 'fabric suit'],
  'dupattas-accessories': ['dupatta', 'phulkari', 'scarf', 'shawl', 'chadar'],
  'new-arrivals': ['new', 'latest', 'fresh', 'nayi', 'naye', 'new arrival', 'new collection'],
  'sale': ['sale', 'discount', 'offer', 'deal', 'sasta', 'off', 'clearance'],
};

export function detectCategory(text: string, existingCategories: Category[]): string | undefined {
  const lower = text.toLowerCase();

  // First check exact slug or category name from dynamic categories
  for (const cat of existingCategories) {
    if (lower.includes(cat.name.toLowerCase()) || lower.includes(cat.slug.toLowerCase())) {
      return cat.slug;
    }
  }

  // Then check synonyms map
  for (const [slug, keywords] of Object.entries(CATEGORY_MAP)) {
    if (keywords.some(kw => new RegExp(`\\b${kw}\\b`, 'i').test(lower))) {
      return slug;
    }
  }

  return undefined;
}

// Detect colors from English and Roman Urdu
const COLOR_KEYWORDS: Record<string, string[]> = {
  'Black': ['black', 'kala', 'kali', 'siah'],
  'Red': ['red', 'lal', 'laal', 'surkh', 'crimson', 'maroon'],
  'Blue': ['blue', 'neela', 'neeli', 'navy', 'teal', 'powder blue', 'turquoise', 'sky blue'],
  'Green': ['green', 'hara', 'hari', 'sabz', 'emerald', 'mint', 'olive', 'sage'],
  'Pink': ['pink', 'gulabi', 'blush', 'rose', 'dusty rose'],
  'Gold': ['gold', 'golden', 'sunhera', 'zari', 'champagne', 'tilla'],
  'White': ['white', 'safaid', 'safed', 'ivory', 'cream', 'off-white'],
  'Purple': ['purple', 'baingani', 'jamni', 'lilac', 'fuchsia'],
  'Yellow': ['yellow', 'peela', 'peeli', 'mustard'],
  'Orange': ['orange', 'narangi', 'coral', 'peach', 'terracotta'],
};

export function detectColor(text: string): string | undefined {
  const lower = text.toLowerCase();
  for (const [colorName, keywords] of Object.entries(COLOR_KEYWORDS)) {
    if (keywords.some(kw => new RegExp(`\\b${kw}\\b`, 'i').test(lower))) {
      return colorName;
    }
  }
  return undefined;
}

// Detect fabric
const FABRICS = ['lawn', 'chiffon', 'silk', 'velvet', 'cotton', 'linen', 'karandi', 'georgette', 'pashmina', 'net', 'cotton silk'];
export function detectFabric(text: string): string | undefined {
  const lower = text.toLowerCase();
  return FABRICS.find(f => new RegExp(`\\b${f}\\b`, 'i').test(lower));
}

// Parse natural language shopping query
export function parseShoppingQuery(text: string, existingCategories: Category[] = []): ParsedFilters {
  const lower = text.toLowerCase().trim();
  const filters: ParsedFilters = {};

  // Intent detection
  if (/^(hi|hello|hey|assalam|aoa|salam|hy)/i.test(lower) && lower.split(/\s+/).length <= 3) {
    filters.intent = 'GREETING';
    return filters;
  }

  if (/show\s*(?:me\s*)?(?:my\s*)?cart|view\s*cart|cart\s*dikhao|mera\s*cart|total\s*(?:kitna|bill|kya|amount)|how\s*much\s*is\s*my\s*total/i.test(lower)) {
    filters.intent = 'VIEW_CART';
    return filters;
  }

  if (/proceed\s*to\s*checkout|checkout|buy\s*now|khareedna\s*hai|order\s*karna\s*hai|place\s*order/i.test(lower)) {
    filters.intent = 'CHECKOUT';
    return filters;
  }

  if (/clear\s*cart|empty\s*cart|cart\s*khali/i.test(lower)) {
    filters.intent = 'CLEAR_CART';
    return filters;
  }

  if (/remove\s*(?:this|it|item|product)?\s*from\s*(?:my\s*)?cart|cart\s*se\s*(?:hata|nikal)/i.test(lower)) {
    filters.intent = 'REMOVE_FROM_CART';
    return filters;
  }

  if (/add\s*(?:this|it|product|dress|suit)?\s*to\s*(?:my\s*)?cart|cart\s*m(?:ein|e)\s*dalo|cart\s*karo/i.test(lower)) {
    filters.intent = 'ADD_TO_CART';
    return filters;
  }

  filters.intent = 'SEARCH';

  // Extract price filters
  const priceRange = extractPriceRange(lower);
  if (priceRange.minPrice !== undefined) filters.minPrice = priceRange.minPrice;
  if (priceRange.maxPrice !== undefined) filters.maxPrice = priceRange.maxPrice;
  if (priceRange.sort) filters.sort = priceRange.sort;

  // Extract category
  const category = detectCategory(lower, existingCategories);
  if (category) filters.category = category;

  // Extract color
  const color = detectColor(lower);
  if (color) filters.color = color;

  // Extract fabric
  const fabric = detectFabric(lower);
  if (fabric) filters.fabric = fabric;

  // Check sale / discount
  if (/sale|discount|off|sasta|deal/i.test(lower)) {
    filters.isSale = true;
  }

  // Raw query for text match
  filters.query = lower;

  return filters;
}

// Intelligent multi-criteria search and ranking
export function searchCatalog(
  products: Product[],
  filters: ParsedFilters,
  categories: Category[] = []
): SearchResult {
  let matched = [...products];

  // 1. Category Filter
  if (filters.category) {
    if (filters.category === 'new-arrivals') {
      matched = matched.filter(p => p.isNew);
    } else if (filters.category === 'sale') {
      matched = matched.filter(p => p.isSale);
    } else {
      matched = matched.filter(p => p.category.toLowerCase() === filters.category!.toLowerCase());
    }
  }

  // 2. Price Min Filter
  if (filters.minPrice !== undefined) {
    matched = matched.filter(p => p.price >= filters.minPrice!);
  }

  // 3. Price Max Filter
  if (filters.maxPrice !== undefined) {
    matched = matched.filter(p => p.price <= filters.maxPrice!);
  }

  // 4. Sale Filter
  if (filters.isSale && !filters.category) {
    const saleItems = matched.filter(p => p.isSale || (p.originalPrice && p.originalPrice > p.price));
    if (saleItems.length > 0) matched = saleItems;
  }

  // 5. Color Filter
  if (filters.color) {
    const targetColor = filters.color.toLowerCase();
    const withColor = matched.filter(p =>
      p.colors.some(c => c.toLowerCase().includes(targetColor)) ||
      p.description.toLowerCase().includes(targetColor) ||
      p.tags.some(t => t.toLowerCase().includes(targetColor))
    );
    if (withColor.length > 0) matched = withColor;
  }

  // 6. Fabric Filter
  if (filters.fabric) {
    const targetFabric = filters.fabric.toLowerCase();
    const withFabric = matched.filter(p =>
      (p.fabric && p.fabric.toLowerCase().includes(targetFabric)) ||
      p.name.toLowerCase().includes(targetFabric) ||
      p.description.toLowerCase().includes(targetFabric) ||
      p.tags.some(t => t.toLowerCase().includes(targetFabric))
    );
    if (withFabric.length > 0) matched = withFabric;
  }

  // 7. Text Query Scoring (if specific keywords like "embroidered", "kylie", etc. are used)
  if (filters.query) {
    const rawTerms = filters.query
      .replace(/show|me|all|available|dresses|dress|suits|suit|products|product|koi|acha|achi|si|kro|karo|dikhao|chahiye|find|want|buy|please/gi, '')
      .trim()
      .split(/\s+/)
      .filter(t => t.length > 2);

    if (rawTerms.length > 0) {
      // Score each product
      const scored = matched.map(p => {
        let score = 0;
        const pName = p.name.toLowerCase();
        const pDesc = p.description.toLowerCase();
        const pTags = p.tags.map(t => t.toLowerCase()).join(' ');
        const pFabric = (p.fabric || '').toLowerCase();
        const pOccasion = (p.occasion || '').toLowerCase();

        for (const term of rawTerms) {
          if (pName.includes(term)) score += 20;
          if (pDesc.includes(term)) score += 10;
          if (pTags.includes(term)) score += 15;
          if (pFabric.includes(term)) score += 10;
          if (pOccasion.includes(term)) score += 10;
        }

        // Exact category mention boost
        if (filters.category && p.category.toLowerCase() === filters.category.toLowerCase()) {
          score += 25;
        }

        return { product: p, score };
      });

      // If we got positive keyword hits, rank by score
      const hasHits = scored.some(s => s.score > 0);
      if (hasHits) {
        scored.sort((a, b) => b.score - a.score);
        matched = scored.filter(s => s.score > 0).map(s => s.product);
      }
    }
  }

  // 8. Sorting
  if (filters.sort === 'cheapest') {
    matched.sort((a, b) => a.price - b.price);
  } else if (filters.sort === 'expensive') {
    matched.sort((a, b) => b.price - a.price);
  } else if (filters.sort === 'rating') {
    matched.sort((a, b) => b.rating - a.rating);
  }

  // Summary generation
  let summary = `Found ${matched.length} ${matched.length === 1 ? 'product' : 'products'}`;
  if (filters.category) {
    const catName = categories.find(c => c.slug === filters.category)?.name || filters.category;
    summary += ` in ${catName}`;
  }
  if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
    summary += ` between ${formatPrice(filters.minPrice)} and ${formatPrice(filters.maxPrice)}`;
  } else if (filters.maxPrice !== undefined) {
    summary += ` under ${formatPrice(filters.maxPrice)}`;
  } else if (filters.minPrice !== undefined) {
    summary += ` above ${formatPrice(filters.minPrice)}`;
  }
  if (filters.color) summary += ` in ${filters.color}`;
  if (filters.fabric) summary += ` (${filters.fabric})`;

  return {
    products: matched,
    totalMatches: matched.length,
    filters,
    summary,
  };
}

// Find similar/recommended products
export function getRecommendations(
  baseProduct: Product,
  allProducts: Product[],
  limit = 4
): Product[] {
  return allProducts
    .filter(p => p.id !== baseProduct.id)
    .map(p => {
      let score = 0;
      if (p.category === baseProduct.category) score += 30;
      if (p.fabric && baseProduct.fabric && p.fabric === baseProduct.fabric) score += 20;
      if (Math.abs(p.price - baseProduct.price) <= 3000) score += 20;
      if (p.colors.some(c => baseProduct.colors.includes(c))) score += 15;
      if (p.tags.some(t => baseProduct.tags.includes(t))) score += 15;
      return { product: p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.product);
}
