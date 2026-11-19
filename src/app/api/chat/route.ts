import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SAMPLE_PRODUCTS, CATEGORIES, Product, Category, formatPrice } from '@/lib/data';
import { parseShoppingQuery, searchCatalog, getRecommendations } from '@/lib/search-engine';

export interface ChatRequestBody {
  message: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  catalog?: Product[];
  categories?: Category[];
  cartContext?: {
    itemCount: number;
    total: number;
    items: { id: string; name: string; quantity: number; price: number; color: string; size: string }[];
  };
}

export interface ChatResponsePayload {
  reply: string;
  productIds: string[];
  action?: 'VIEW_CART' | 'CHECKOUT' | 'ADD_TO_CART' | 'REMOVE_FROM_CART' | 'CLEAR_CART' | null;
  actionPayload?: {
    productId?: string;
    productName?: string;
    color?: string;
    size?: string;
    quantity?: number;
  };
  quickReplies?: string[];
}

// Candidate Gemini models in order of preference
const GEMINI_MODELS = ['gemini-3.5-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];

async function callGemini(
  prompt: string,
  systemInstruction: string,
  apiKey: string
): Promise<string | null> {
  const genAI = new GoogleGenerativeAI(apiKey);

  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction,
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 800,
        },
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text) return text;
    } catch (err: any) {
      console.warn(`Gemini model ${modelName} failed:`, err?.message || err);
      // Continue to next model fallback
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json();
    const { message, history = [], catalog = SAMPLE_PRODUCTS, categories = CATEGORIES, cartContext } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const currentCatalog = Array.isArray(catalog) && catalog.length > 0 ? catalog : SAMPLE_PRODUCTS;
    const currentCategories = Array.isArray(categories) && categories.length > 0 ? categories : CATEGORIES;

    // 1. Run local intelligent parsing to understand user query, budget, categories, intent
    const parsedFilters = parseShoppingQuery(message, currentCategories);
    const localSearchResults = searchCatalog(currentCatalog, parsedFilters, currentCategories);

    // If intent is CART related, handle immediately
    if (parsedFilters.intent === 'VIEW_CART') {
      const count = cartContext?.itemCount || 0;
      const total = cartContext?.total || 0;
      let reply = '';
      if (count === 0) {
        reply = `Your shopping bag is currently empty! 🛍️\n\nWould you like me to recommend some of our trending **Lawn Suits**, **Luxury Pret**, or festive **Bridal** designs?`;
      } else {
        const itemsList = cartContext?.items?.map(it => `• **${it.name}** (${it.color}, ${it.size}) × ${it.quantity} - ${formatPrice(it.price * it.quantity)}`).join('\n') || '';
        reply = `You currently have **${count} ${count === 1 ? 'item' : 'items'}** in your shopping cart:\n\n${itemsList}\n\n**Total:** ${formatPrice(total)}\n${total >= 3000 ? '🎉 *You qualify for FREE Delivery across Pakistan!*' : '🚚 *Standard shipping: PKR 250 (Free over PKR 3,000)*'}`;
      }
      return NextResponse.json<ChatResponsePayload>({
        reply,
        productIds: [],
        action: 'VIEW_CART',
        quickReplies: count > 0 ? ['Proceed to Checkout', 'Continue Shopping', 'Clear Cart'] : ['Show Lawn Suits', 'Show Bridal Outfits', 'View Sale Items'],
      });
    }

    if (parsedFilters.intent === 'CHECKOUT') {
      const count = cartContext?.itemCount || 0;
      if (count === 0) {
        return NextResponse.json<ChatResponsePayload>({
          reply: `Your cart is empty! Please add a dress you love to your bag first, and I'll take you straight to checkout. 👗✨`,
          productIds: localSearchResults.products.slice(0, 3).map(p => p.id),
          action: null,
          quickReplies: ['Show Lawn Collection', 'Under PKR 5,000', 'Bridal Collection'],
        });
      }
      return NextResponse.json<ChatResponsePayload>({
        reply: `Taking you to secure checkout with your **${count} ${count === 1 ? 'item' : 'items'}** (Total: ${formatPrice(cartContext?.total || 0)}). We offer Cash on Delivery (COD) and fast delivery across Pakistan! 📦🚚`,
        productIds: [],
        action: 'CHECKOUT',
        quickReplies: ['View My Cart', 'Continue Shopping'],
      });
    }

    if (parsedFilters.intent === 'CLEAR_CART') {
      return NextResponse.json<ChatResponsePayload>({
        reply: `I have cleared your shopping cart. Feel free to browse our latest collection anytime! ✨`,
        productIds: [],
        action: 'CLEAR_CART',
        quickReplies: ['Show New Arrivals', 'Under PKR 5,000', 'Bridal Collection'],
      });
    }

    // 2. Prepare structured catalog summary for AI
    const catalogSummary = currentCatalog.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      category: p.category,
      fabric: p.fabric || 'Standard',
      occasion: p.occasion || 'General',
      colors: p.colors.slice(0, 4),
      sizes: p.sizes,
      stock: p.stock,
      isSale: p.isSale || false,
      rating: p.rating,
      brand: p.brand,
    }));

    // AI System instruction
    const SYSTEM_PROMPT = `You are the expert, warm, and highly professional AI Fashion Salesperson at "Elegance Pakistan", a premium women's clothing brand.

STORE POLICIES & INFO:
- Brand: Elegance Pakistan
- Free Delivery across Pakistan on orders over PKR 3,000 (standard delivery PKR 250 for orders below)
- Delivery time: 3-5 business days for major cities (Lahore, Karachi, Islamabad), 5-7 days nationwide
- Payment Methods: Cash on Delivery (COD), JazzCash, Easypaisa, Bank Transfer (IBFT)
- Return Policy: 7 days hassle-free exchange & returns for unworn items with tags intact
- Sizes available: XS, S, M, L, XL, XXL (plus Custom tailoring for bridal)
- WhatsApp support: +92 300 1234567

AVAILABLE PRODUCTS IN WEBSITE CATALOG:
${JSON.stringify(catalogSummary)}

CATEGORIES:
${currentCategories.map(c => `- ${c.name} (slug: ${c.slug})`).join('\n')}

CURRENT CART STATUS:
- Item count: ${cartContext?.itemCount || 0}
- Cart total: PKR ${cartContext?.total || 0}

RULES YOU MUST FOLLOW STRICTLY:
1. ONLY recommend products that exist in the catalog above. Use their exact "id". NEVER invent fake products, names, or prices.
2. Prices must always be the real catalog prices in PKR (e.g. "PKR 5,800").
3. Understand English, Urdu, and Roman Urdu naturally (e.g. "Koi achi bridal dress dikhao", "5000 tak ke lawn suits", "shaadi ke liye kuch elegant", "sasti dress", "black suit"). Reply in friendly English, but warmly acknowledge Roman Urdu terms (e.g. "Ji bilkul!", "Zaroor!").
4. If a user asks to add a product or buy a dress, specify the product id and default color/size in the action payload.
5. If user has a budget, strictly select products within that budget.
6. When answering, return your answer in valid JSON matching this schema:
{
  "reply": "Warm conversational response with styling tips or details in markdown",
  "productIds": ["p001", "p008"], // Array of up to 6 matching catalog product IDs to show as interactive cards
  "action": null, // or "ADD_TO_CART" | "VIEW_CART" | "CHECKOUT"
  "actionPayload": { "productId": "...", "color": "...", "size": "..." },
  "quickReplies": ["Quick suggestion 1", "Quick suggestion 2", "Quick suggestion 3"]
}
OUTPUT ONLY THE JSON OBJECT. NO PROSE BEFORE OR AFTER THE JSON.`;

    const apiKey = process.env.GEMINI_API_KEY;
    let aiResponse: ChatResponsePayload | null = null;

    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      const historyContext = history.slice(-6).map(h => `${h.role}: ${h.content}`).join('\n');
      const prompt = `Conversation history:\n${historyContext}\n\nCustomer: ${message}\n\nProvide your sales response as JSON with matching productIds from the catalog:`;

      try {
        const rawAiText = await callGemini(prompt, SYSTEM_PROMPT, apiKey);
        if (rawAiText) {
          // Extract JSON block if wrapped in ```json
          const cleanJson = rawAiText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
          const parsed = JSON.parse(cleanJson);
          if (parsed && typeof parsed.reply === 'string') {
            // Verify product IDs exist in current catalog
            const validIds = (parsed.productIds || []).filter((id: string) =>
              currentCatalog.some(p => p.id === id)
            );

            // If Gemini returned no IDs or empty array but local search found good matches, augment with local search
            const finalProductIds = validIds.length > 0
              ? validIds
              : localSearchResults.products.slice(0, 4).map(p => p.id);

            aiResponse = {
              reply: parsed.reply,
              productIds: finalProductIds,
              action: parsed.action || null,
              actionPayload: parsed.actionPayload,
              quickReplies: parsed.quickReplies || [
                'Show Lawn Collection',
                'Under PKR 5,000',
                'View Bridal Dresses',
              ],
            };
          }
        }
      } catch (aiErr) {
        console.error('Gemini parsing/call error:', aiErr);
      }
    }

    // 3. Resilient Fallback Engine: If Gemini wasn't called or failed, generate a dynamic response
    if (!aiResponse) {
      const matchedProducts = localSearchResults.products;
      const count = matchedProducts.length;
      let reply = '';
      let quickReplies = ['Show Lawn Collection', 'Under PKR 5,000', 'Bridal Outfits'];

      if (parsedFilters.intent === 'GREETING') {
        reply = `Assalam-o-Alaikum! 🌸 Welcome to **Elegance Pakistan**! I'm your AI Shopping Assistant.\n\nI can help you browse our exclusive **Lawn Suits**, **Bridal Outfits**, **Luxury Pret**, filter by your exact budget in PKR, check sizes, and add items directly to your cart.\n\nWhat are you looking for today?`;
        quickReplies = ['Explore Bridal Collection', 'Show Lawn Suits', 'Under PKR 5,000', 'View Sale Items'];
      } else if (count === 0) {
        // No exact match, suggest closest alternatives
        const suggestions = currentCatalog.slice(0, 3);
        reply = `I couldn't find an exact match for "${message}". However, here are some of our most popular pieces you might love! 💖\n\nYou can also browse by category or tell me your budget (e.g. *under PKR 5,000* or *5k to 10k*).`;
        return NextResponse.json<ChatResponsePayload>({
          reply,
          productIds: suggestions.map(p => p.id),
          quickReplies: ['Show Lawn Collection', 'Under PKR 5,000', 'View All Dresses'],
        });
      } else {
        const catName = parsedFilters.category
          ? (currentCategories.find(c => c.slug === parsedFilters.category)?.name || parsedFilters.category)
          : '';

        if (parsedFilters.sort === 'cheapest') {
          reply = `Here are our most budget-friendly pieces starting from just **${formatPrice(matchedProducts[0].price)}**! 🏷️✨`;
        } else if (parsedFilters.sort === 'expensive') {
          reply = `Here are our most exclusive, luxury creations crafted with supreme fabrics and rich hand-embroidery: 👑💎`;
        } else if (parsedFilters.category === 'bridal-collection') {
          reply = `Ji bilkul! Here are our breathtaking bridal outfits featuring handcrafted dabka, tilla, and royal sequins. Perfect for your special day! 👰✨`;
          quickReplies = ['Red Bridal Dresses', 'Under PKR 50,000', 'View Velvet Lehenga'];
        } else if (parsedFilters.maxPrice !== undefined && parsedFilters.minPrice !== undefined) {
          reply = `Here are beautiful outfits between **${formatPrice(parsedFilters.minPrice)}** and **${formatPrice(parsedFilters.maxPrice)}**: 👗`;
        } else if (parsedFilters.maxPrice !== undefined) {
          reply = `Here are our top recommended outfits under **${formatPrice(parsedFilters.maxPrice)}**: 🌸`;
        } else if (catName) {
          reply = `Here are our available designs from the **${catName}** collection: ✨`;
          quickReplies = [`Under PKR 6,000 in ${catName}`, 'Show Sale Items', 'View All Categories'];
        } else if (parsedFilters.color) {
          reply = `Found gorgeous outfits available in **${parsedFilters.color}**: 🎨`;
        } else {
          reply = `Here are the matching outfits from our catalog for you! You can click **Add to Cart**, **Buy Now**, or view details: 🛍️`;
        }
      }

      aiResponse = {
        reply,
        productIds: matchedProducts.slice(0, 6).map(p => p.id),
        action: null,
        quickReplies,
      };
    }

    return NextResponse.json<ChatResponsePayload>(aiResponse);
  } catch (error: any) {
    console.error('Fatal Chat API error:', error);
    // Even on unexpected error, never show generic "having a moment" dead end
    return NextResponse.json<ChatResponsePayload>(
      {
        reply: `Assalam-o-Alaikum! Welcome to Elegance Pakistan. I'm ready to help you find your dream outfit, explore our lawn and bridal collections, or assist with your shopping cart! 🌸`,
        productIds: SAMPLE_PRODUCTS.slice(0, 3).map(p => p.id),
        action: null,
        quickReplies: ['Show Lawn Collection', 'Under PKR 5,000', 'Bridal Collection'],
      },
      { status: 200 }
    );
  }
}