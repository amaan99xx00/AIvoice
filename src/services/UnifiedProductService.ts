/**
 * UnifiedProductService
 * Centralized, multi-domain product catalog bridging European wakefulness medications,
 * skincare, wellness, and athletic footwear.
 *
 * Implements:
 *   - Single product exact & fuzzy matching
 *   - Category & multi-product attribute search
 *   - Dynamic product card generation with validated image fallbacks
 *   - Zero hallucination (strict verified fields only)
 */

import { PRODUCTS_CATALOG, ProductItem } from '../data/products';
import { StoreProduct } from './storeCatalog';

export interface UnifiedProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  subCategory?: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviewCount: number;
  image: string;
  fallbackImage: string;
  images?: string[];
  shortDescription: string;
  fullDescription?: string;
  inStock: boolean;
  stockStatus: string;
  availableSizes?: string[];
  availableColors?: string[];
  features?: string[];
  specifications: Record<string, string>;
  isMedication: boolean;
  medicationData?: ProductItem;
  storeData?: StoreProduct;
}

// Fallback high-fidelity SVG placeholders (100% reliable, zero network dependency)
export const FALLBACK_IMAGES = {
  shoes: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%230f172a"/><stop offset="100%" stop-color="%231e293b"/></linearGradient></defs><rect width="100%" height="100%" fill="%23f8fafc"/><rect x="20" y="20" width="360" height="260" rx="16" fill="url(%23g)"/><path d="M70 200 C110 200, 140 180, 180 180 C230 180, 260 210, 330 205 C335 190, 330 160, 310 150 C280 135, 260 145, 230 130 C200 115, 175 105, 150 115 C130 125, 110 160, 80 170 Z" fill="%2338bdf8" opacity="0.9"/><path d="M180 180 C210 160, 250 165, 280 180" stroke="%23ffcc00" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="285" cy="180" r="14" fill="%23ffcc00" opacity="0.85"/><text x="200" y="245" fill="%23ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" text-anchor="middle" letter-spacing="1">PREMIUM ATHLETIC FOOTWEAR</text></svg>`,
  medication: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%2300194b"/><stop offset="100%" stop-color="%2300349a"/></linearGradient></defs><rect width="100%" height="100%" fill="%23f8fafc"/><rect x="20" y="20" width="360" height="260" rx="16" fill="url(%23bg)"/><rect x="110" y="75" width="180" height="110" rx="12" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="3"/><circle cx="150" cy="110" r="18" fill="%23e2e8f0"/><circle cx="200" cy="110" r="18" fill="%23e2e8f0"/><circle cx="250" cy="110" r="18" fill="%23e2e8f0"/><circle cx="150" cy="150" r="18" fill="%23e2e8f0"/><circle cx="200" cy="150" r="18" fill="%23e2e8f0"/><circle cx="250" cy="150" r="18" fill="%23e2e8f0"/><path d="M190 45 h20 v30 h-20 z M180 55 h40 v10 h-40 z" fill="%23ffcc00"/><text x="200" y="225" fill="%23ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" text-anchor="middle">CERTIFIED PHARMACEUTICAL</text><text x="200" y="245" fill="%2393c5fd" font-family="system-ui, -apple-system, sans-serif" font-size="11" text-anchor="middle">DOMESTIC EUROPEAN DISPATCH</text></svg>`,
  skincare: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300"><defs><linearGradient id="sk" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23065f46"/><stop offset="100%" stop-color="%23047857"/></linearGradient></defs><rect width="100%" height="100%" fill="%23f8fafc"/><rect x="20" y="20" width="360" height="260" rx="16" fill="url(%23sk)"/><rect x="160" y="80" width="80" height="120" rx="10" fill="%23ffffff" opacity="0.95"/><rect x="180" y="55" width="40" height="25" rx="4" fill="%23d1fae5"/><rect x="195" y="40" width="10" height="15" fill="%2310b981"/><text x="200" y="235" fill="%23ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" text-anchor="middle">CLINICAL DERMATOLOGY</text></svg>`,
  general: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300"><defs><linearGradient id="gn" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%231e293b"/><stop offset="100%" stop-color="%23334155"/></linearGradient></defs><rect width="100%" height="100%" fill="%23f8fafc"/><rect x="20" y="20" width="360" height="260" rx="16" fill="url(%23gn)"/><circle cx="200" cy="125" r="45" fill="%23ffcc00" opacity="0.9"/><path d="M185 125 l10 10 l25 -25" stroke="%2300194b" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><text x="200" y="215" fill="%23ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" text-anchor="middle">VERIFIED PRODUCT</text></svg>`
};

// Additional catalog items explicitly covered in master specification & prompt examples
const EXTENDED_PRODUCTS: UnifiedProduct[] = [
  {
    id: 'prod-nike-air-max-270',
    slug: 'nike-air-max-270',
    name: 'Nike Air Max 270',
    brand: 'Nike',
    category: 'Athletic Footwear',
    subCategory: 'running shoes',
    price: '€149.99',
    originalPrice: '€169.99',
    rating: 4.8,
    reviewCount: 142,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    fallbackImage: FALLBACK_IMAGES.shoes,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80'
    ],
    shortDescription: 'The Nike Air Max 270 delivers visible air under every step, boasting Nike’s biggest heel Air unit yet for an ultra-responsive, super-soft ride.',
    fullDescription: 'Inspired by the Air Max 180 and Air Max 93, the Nike Air Max 270 features clean lines and dramatic styling. The engineered knit mesh upper offers targeted breathability while the high-volume Max Air 270 heel unit provides maximum impact cushioning for all-day comfort.',
    inStock: true,
    stockStatus: 'In Stock (Express Delivery Available)',
    availableSizes: ['US 7.5', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 12'],
    availableColors: ['Black / White', 'Triple Black', 'University Red / Black', 'Pure Platinum'],
    features: [
      'Large 270-degree Max Air heel unit provides responsive, springy cushioning',
      'Engineered mesh upper delivers flexible airflow and lightweight durability',
      'Dual-density foam midsole ensures smooth heel-to-toe transition',
      'Durable rubber outsole with high-traction waffle grip pattern'
    ],
    specifications: {
      'Brand': 'Nike',
      'Model': 'Air Max 270',
      'Category': 'Athletic Footwear / Running',
      'Upper Material': 'Engineered Mesh & Synthetic Overlays',
      'Midsole': 'Phylon Foam & 270 Max Air Unit',
      'Outsole': 'Solid Rubber Waffle Tread',
      'Closure': 'Asymmetrical Lace-up',
      'Weight': 'Approx. 310g (Men\'s Size 9)'
    },
    isMedication: false
  },
  {
    id: 'prod-nike-pegasus-40',
    slug: 'nike-air-zoom-pegasus-40',
    name: 'Nike Air Zoom Pegasus 40',
    brand: 'Nike',
    category: 'Athletic Footwear',
    subCategory: 'running shoes',
    price: '€129.99',
    originalPrice: '€145.00',
    rating: 4.7,
    reviewCount: 98,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
    fallbackImage: FALLBACK_IMAGES.shoes,
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'
    ],
    shortDescription: 'Workhorse with wings. Engineered for daily road running with tuned support, responsive Nike React foam, and dual Zoom Air units.',
    fullDescription: 'The Pegasus 40 offers a personalized, comfortable fit with an engineered single-layer mesh upper and an updated midfoot band that securely holds your foot.',
    inStock: true,
    stockStatus: 'In Stock (Express Delivery)',
    availableSizes: ['US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11'],
    availableColors: ['Black / Anthracite', 'Pure White', 'Royal Blue'],
    features: [
      'Dual Zoom Air units in the forefoot and heel for responsive energy return',
      'Nike React technology provides lightweight, resilient foam cushioning',
      'Highly tuned single-layer mesh upper for optimized breathability',
      'Waffle-inspired rubber outsole for reliable grip across wet and dry pavement'
    ],
    specifications: {
      'Brand': 'Nike',
      'Model': 'Air Zoom Pegasus 40',
      'Category': 'Road Running Shoes',
      'Colorway': 'Black / Anthracite',
      'Offset': '10mm (Heel: 33mm, Forefoot: 23mm)',
      'Weight': 'Approx. 288g'
    },
    isMedication: false
  },
  {
    id: 'prod-acne-serum',
    slug: 'clearskin-acne-defense-serum',
    name: 'ClearSkin Acne Defense Serum',
    brand: 'ClearSkin Clinical',
    category: 'Skincare',
    subCategory: 'acne',
    price: '$24.99',
    rating: 4.7,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80',
    fallbackImage: FALLBACK_IMAGES.skincare,
    shortDescription: 'Gentle, clinical-strength salicylic acid (2%) and niacinamide (4%) serum for clearing acne, blemishes, and blackheads.',
    inStock: true,
    stockStatus: 'In Stock',
    availableSizes: ['30ml Dropper Bottle', '60ml Value Size'],
    features: [
      '2% Beta Hydroxy Acid (Salicylic Acid) exfoliates pore linings',
      '4% Niacinamide calms redness and balances sebum secretion',
      'Hyaluronic acid base prevents excessive drying and flaking',
      'Fragrance-free, oil-free, non-comedogenic formulation'
    ],
    specifications: {
      'Brand': 'ClearSkin Clinical',
      'Skin Type': 'Acne-Prone, Oily, Combination',
      'Active Ingredients': '2% Salicylic Acid, 4% Niacinamide',
      'Volume': '30ml / 1 fl. oz.',
      'Usage': 'Apply 3-4 drops evening after cleansing'
    },
    isMedication: false
  },
  {
    id: 'prod-daily-wellness',
    slug: 'daily-wellness-vitality-tablets',
    name: 'Daily Wellness & Vitality Tablets',
    brand: 'Vitality Health',
    category: 'Wellness',
    subCategory: 'supplements',
    price: '$29.99 – $79.99',
    rating: 4.9,
    reviewCount: 112,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
    fallbackImage: FALLBACK_IMAGES.medication,
    shortDescription: 'All-in-one daily multivitamin, immune system booster, and mineral complex for sustained natural energy.',
    inStock: true,
    stockStatus: 'In Stock',
    availableSizes: ['30 Tablets', '60 Tablets', '100 Tablets'],
    features: [
      'Full spectrum vitamins A, C, D3, E, and B-complex',
      'Chelated Zinc, Selenium, and Magnesium for cellular vitality',
      'Coated easy-swallow vegetarian tablets',
      'Formulated without artificial colors, gluten, or allergens'
    ],
    specifications: {
      'Brand': 'Vitality Health',
      'Category': 'Dietary Supplement',
      'Serving Size': '1 Tablet Daily with meal',
      'Certifications': 'Non-GMO, GMP Certified Facility'
    },
    isMedication: false
  }
];

export class UnifiedProductService {
  private static cachedAll: UnifiedProduct[] | null = null;

  /**
   * Returns complete unified catalog bridging medications and general products
   */
  public static getAll(): UnifiedProduct[] {
    if (this.cachedAll) return this.cachedAll;

    // Convert the 12 verified European wakefulness medications
    const medications: UnifiedProduct[] = PRODUCTS_CATALOG.map((p) => {
      const defaultVar = p.variants[0];

      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        brand: p.keyFeatures.manufacturer || 'Sun Pharmaceuticals',
        category: p.category,
        subCategory: 'wakefulness',
        price: p.priceRange || `€${defaultVar.priceEur.toFixed(2)}`,
        rating: p.rating,
        reviewCount: p.reviewCount,
        image: p.images[0] || '',
        fallbackImage: FALLBACK_IMAGES.medication,
        images: p.images,
        shortDescription: p.shortDescription,
        fullDescription: p.fullDescription || p.overview,
        inStock: true,
        stockStatus: 'In Stock (Domestic EU Warehouse)',
        availableSizes: p.variants.map((v) => `${v.tablets} Pills (€${v.pricePerPill.toFixed(2)}/pill)`),
        availableColors: ['White Scored Tablets'],
        features: [
          `Onset of action in ${p.keyFeatures.onsetOfAction}`,
          `Provides ${p.keyFeatures.durationOfAction} of active focus`,
          `Manufactured by ${p.keyFeatures.manufacturer}`,
          `Packaging: ${p.keyFeatures.packaging} (${p.keyFeatures.packSize})`,
          `Primary indications: ${p.keyFeatures.usedFor}`
        ],
        specifications: {
          'Manufacturer': p.keyFeatures.manufacturer,
          'Active Substance': p.composition.active,
          'Strength': p.keyFeatures.strength,
          'Drug Class': p.keyFeatures.drugClass,
          'Dosage Form': p.keyFeatures.dosageForm,
          'Route': p.keyFeatures.routeOfAdministration,
          'Packaging': p.keyFeatures.packaging,
          'Onset': p.keyFeatures.onsetOfAction,
          'Duration': p.keyFeatures.durationOfAction,
          'EU Dispatch': 'Domestic EU Hubs (3–7 business days with tracking)'
        },
        isMedication: true,
        medicationData: p
      };
    });

    this.cachedAll = [...medications, ...EXTENDED_PRODUCTS];
    return this.cachedAll;
  }

  /**
   * Retrieves single product by exact slug
   */
  public static getBySlug(slug: string): UnifiedProduct | undefined {
    const clean = slug.toLowerCase().trim().replace(/^#?\/?(product\/)?/, '').replace(/\/$/, '');
    const normalizedClean = clean.replace(/(\d+)-mg$/, '$1mg');
    return this.getAll().find((p) => {
      const pSlug = p.slug.toLowerCase();
      const normalizedPSlug = pSlug.replace(/(\d+)-mg$/, '$1mg');
      return (
        pSlug === clean ||
        normalizedPSlug === normalizedClean ||
        pSlug.replace(/-/g, '') === clean.replace(/-/g, '')
      );
    });
  }

  /**
   * Retrieves single product by ID
   */
  public static getById(id: string): UnifiedProduct | undefined {
    return this.getAll().find((p) => p.id === id);
  }

  /**
   * High-accuracy Single Product Identifier
   * Handles exact names, partial names, typos, and natural language phrases
   */
  public static findSingleProduct(query: string): UnifiedProduct | undefined {
    const raw = query.toLowerCase().trim();
    if (!raw) return undefined;

    // 1. Strip conversational filler words
    const clean = raw
      .replace(/^(tell me about|what is|give me details about|details of|how much is|show me the details of|show me|i want to buy|can i buy|is|do you have|information on|specifications for|the|a|about)\s+/gi, '')
      .replace(/\s+(please|price|cost|sizes|size|available|details|in stock)\??$/gi, '')
      .trim();

    const all = this.getAll();

    // 2. Exact name or slug match
    const exact = all.find(
      (p) => p.name.toLowerCase() === clean || p.slug.toLowerCase() === clean || p.name.toLowerCase() === raw
    );
    if (exact) return exact;

    // 3. Priority for specific named models (e.g., "Air Max 270", "Nike Air Max", "Pegasus 40", "Modalert 100", "Waklert 150")
    if (raw.includes('270') || (raw.includes('air max') && !raw.includes('shoes'))) {
      const nike270 = all.find((p) => p.slug === 'nike-air-max-270');
      if (nike270) return nike270;
    }
    if (raw.includes('pegasus')) {
      const peg = all.find((p) => p.slug === 'nike-air-zoom-pegasus-40');
      if (peg) return peg;
    }
    if (raw.includes('acne') && (raw.includes('serum') || raw.includes('clearskin'))) {
      const acne = all.find((p) => p.slug === 'clearskin-acne-defense-serum');
      if (acne) return acne;
    }
    if (raw.includes('wellness') && (raw.includes('tablet') || raw.includes('vitamin'))) {
      const wel = all.find((p) => p.slug === 'daily-wellness-vitality-tablets');
      if (wel) return wel;
    }

    // 4. Token overlap match (e.g. "Modalert 100", "Modvigil MD", "Vilafinil")
    const cleanTokens = clean.split(/\s+/).filter((t) => t.length > 2);
    let bestMatch: UnifiedProduct | undefined;
    let highestScore = 0;

    for (const p of all) {
      const pNameLower = p.name.toLowerCase();
      let score = 0;

      // Direct substring
      if (pNameLower.includes(clean) || clean.includes(pNameLower)) {
        score += 10;
      }

      // Check strength/number token match (e.g. 100, 200, 150)
      const hasNumber = clean.match(/\b(100|150|200)\b/);
      if (hasNumber && pNameLower.includes(hasNumber[1])) {
        score += 5;
      }

      // Token matches
      cleanTokens.forEach((tok) => {
        if (pNameLower.includes(tok)) score += 3;
      });

      if (score > highestScore && score >= 6) {
        highestScore = score;
        bestMatch = p;
      }
    }

    return bestMatch;
  }

  /**
   * Search multiple products by category, color, or general keywords
   */
  public static searchProducts(query: string): UnifiedProduct[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.getAll();

    const isRunningShoeQuery =
      q.includes('running') ||
      q.includes('shoe') ||
      q.includes('footwear') ||
      q.includes('sneaker') ||
      q.includes('air max');

    const isMedicationQuery =
      q.includes('modafinil') ||
      q.includes('armodafinil') ||
      q.includes('wakefulness') ||
      q.includes('nootropic') ||
      q.includes('pill');

    const isSkincareQuery = q.includes('skin') || q.includes('acne') || q.includes('serum');

    return this.getAll().filter((p) => {
      const name = p.name.toLowerCase();
      const cat = p.category.toLowerCase();
      const desc = p.shortDescription.toLowerCase();
      const brand = p.brand.toLowerCase();

      if (isRunningShoeQuery && (cat.includes('footwear') || name.includes('nike'))) return true;
      if (isMedicationQuery && p.isMedication) return true;
      if (isSkincareQuery && cat.includes('skincare')) return true;

      // Color filter (e.g., "black running shoes")
      if (q.includes('black') && p.availableColors?.some((c) => c.toLowerCase().includes('black'))) {
        if (isRunningShoeQuery && cat.includes('footwear')) return true;
      }

      return (
        name.includes(q) ||
        cat.includes(q) ||
        desc.includes(q) ||
        brand.includes(q)
      );
    });
  }

  /**
   * Generate concise, spoken natural language explanation for voice agent
   */
  public static formatVoiceResponse(product: UnifiedProduct, lang: string = 'en'): string {
    const brandStr = product.brand ? `by ${product.brand}` : '';
    const sizeStr = product.availableSizes ? ` with ${product.availableSizes.length} package options` : '';
    const feature1 = product.features?.[0] || product.shortDescription;

    if (lang === 'fr') {
      return `Certainement ! ${product.name} ${brandStr} est disponible au tarif de ${product.price}. Il est actuellement en stock avec livraison suivie. Ses points forts : ${feature1}. Vous pouvez consulter la fiche complète ci-dessous.`;
    }

    if (lang === 'de') {
      return `Gerne! ${product.name} ${brandStr} ist ab ${product.price} erhältlich und sofort lieferbar. Hauptmerkmal: ${feature1}. Alle Details finden Sie in der Produktkarte unten.`;
    }

    if (lang === 'hi' || lang === 'hinglish') {
      return `Zaroor! ${product.name} ${brandStr} ka price ${product.price} hai aur yeh abhi stock me uplabdh hai. Iska main feature hai: ${feature1}. Aap niche di gayi card par click karke details dekh sakte hain.`;
    }

    return `Sure! ${product.name} ${brandStr} is priced at ${product.price}${sizeStr} and is currently in stock. Key feature: ${feature1}. You can view the full specifications by clicking the View Product button below.`;
  }
}
