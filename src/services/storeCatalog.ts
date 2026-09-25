/**
 * StoreCatalog
 * Verified product catalog and policies for on-demand queries (Section 14, 15, 16, 17).
 * Never hallucinated; verified data only.
 */

export interface ProductVariant {
  id: string;
  tablets: number;
  price: number;
  formattedPriceEn: string;
  formattedPriceHi: string;
  stock: number;
}

export interface StoreProduct {
  id: string;
  name: string;
  nameHi: string;
  category: 'skincare' | 'wellness' | 'haircare';
  subCategory?: string;
  description: string;
  descriptionHi: string;
  variants: ProductVariant[];
  inStock: boolean;
  image: string;
}

export interface StorePolicy {
  shipping: {
    standard: string;
    standardHi: string;
    express: string;
    expressHi: string;
    freeThreshold: number;
  };
  returns: {
    periodDays: number;
    description: string;
    descriptionHi: string;
  };
}

export const STORE_POLICIES: StorePolicy = {
  shipping: {
    standard: 'Free standard shipping on all orders today (delivery within 3-5 business days).',
    standardHi: 'Sabhi orders par standard delivery bilkul free hai (3-5 din me delivery).',
    express: 'Express 2-day delivery is available for $4.99.',
    expressHi: 'Do din me express delivery chaar dollar ninyanve cents me uplabdh hai.',
    freeThreshold: 0
  },
  returns: {
    periodDays: 30,
    description: 'We offer a 30-day money-back guarantee with hassle-free returns.',
    descriptionHi: 'Hum 30-din ki full money-back guarantee dete hain bina kisi pareshani ke.'
  }
};

export const STORE_PRODUCTS: StoreProduct[] = [
  {
    id: 'prod-acne-serum',
    name: 'ClearSkin Acne Defense Serum',
    nameHi: 'क्लियर स्किन मुँहासे डिफेंस सीरम',
    category: 'skincare',
    subCategory: 'acne',
    description: 'Gentle, clinical-strength salicylic acid & niacinamide serum for clearing acne and blemishes.',
    descriptionHi: 'मुँहासे और दाग-धब्बों को ठीक करने के लिए सैलिसिलिक एसिड और नियासिनमाइड युक्त कोमल सीरम।',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80',
    variants: [
      {
        id: 'var-serum-30ml',
        tablets: 30, // 30ml
        price: 24.99,
        formattedPriceEn: 'twenty-four dollars and ninety-nine cents',
        formattedPriceHi: 'chaubees dollar ninyanve cents',
        stock: 45
      }
    ]
  },
  {
    id: 'prod-daily-wellness',
    name: 'Daily Wellness & Vitality Tablets',
    nameHi: 'डेली वेलनेस एवं वाइटेलिटी टैबलेट्स',
    category: 'wellness',
    subCategory: 'supplements',
    description: 'All-in-one daily multivitamin, immunity booster, and energy support.',
    descriptionHi: 'दैनिक मल्टीविटामिन, रोग प्रतिरोधक क्षमता और ऊर्जा के लिए ऑल-इन-वन टैबलेट्स।',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
    variants: [
      {
        id: 'var-wellness-30',
        tablets: 30,
        price: 29.99,
        formattedPriceEn: 'twenty-nine dollars and ninety-nine cents',
        formattedPriceHi: 'untees dollar ninyanve cents',
        stock: 50
      },
      {
        id: 'var-wellness-60',
        tablets: 60,
        price: 54.99,
        formattedPriceEn: 'fifty-four dollars and ninety-nine cents',
        formattedPriceHi: 'chawwan dollar ninyanve cents',
        stock: 32
      },
      {
        id: 'var-wellness-100',
        tablets: 100,
        price: 79.99,
        formattedPriceEn: 'seventy-nine dollars and ninety-nine cents',
        formattedPriceHi: 'unasi dollar ninyanve cents',
        stock: 18
      }
    ]
  },
  {
    id: 'prod-hydrating-cleanser',
    name: 'HydraGlow Gentle Facial Cleanser',
    nameHi: 'हाइड्राग्लो जेंटल फेशियल क्लींजर',
    category: 'skincare',
    subCategory: 'cleanser',
    description: 'Deeply cleanses without stripping natural oils, formulated with hyaluronic acid & ceramides.',
    descriptionHi: 'हयालूरोनिक एसिड युक्त सौम्य फेस वॉश जो त्वचा की नमी बनाए रखता है।',
    inStock: true,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80',
    variants: [
      {
        id: 'var-cleanser-150ml',
        tablets: 30,
        price: 18.99,
        formattedPriceEn: 'eighteen dollars and ninety-nine cents',
        formattedPriceHi: 'atharah dollar ninyanve cents',
        stock: 60
      }
    ]
  }
];

export class StoreCatalogService {
  /**
   * On-demand product search only when user intent requires it (Section 14 & 17)
   */
  public static searchProducts(query: string): StoreProduct[] {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    return STORE_PRODUCTS.filter((prod) => {
      const matchName = prod.name.toLowerCase().includes(q) || prod.nameHi.includes(q);
      const matchCat = prod.category.toLowerCase().includes(q) || (prod.subCategory && prod.subCategory.includes(q));
      const matchDesc = prod.description.toLowerCase().includes(q);
      const matchKeyword =
        (q.includes('skin') && prod.category === 'skincare') ||
        (q.includes('acne') && prod.subCategory === 'acne') ||
        ((q.includes('wellness') || q.includes('tablet') || q.includes('pill')) && prod.category === 'wellness');

      return matchName || matchCat || matchDesc || matchKeyword;
    });
  }

  public static getProductById(id: string): StoreProduct | undefined {
    return STORE_PRODUCTS.find((p) => p.id === id);
  }

  public static findVariantByTablets(product: StoreProduct, tabletCount: number): ProductVariant | undefined {
    return product.variants.find((v) => v.tablets === tabletCount);
  }
}
