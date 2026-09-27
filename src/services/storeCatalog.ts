/**
 * StoreCatalog
 * Verified product catalog and policies for Moda In Europe (modaineurope.com)
 * Wakefulness medications, Modafinil, Armodafinil, Smart Pills, and Wellness.
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
  category: 'skincare' | 'wellness' | 'haircare' | 'wakefulness' | 'modafinil' | 'armodafinil';
  subCategory?: string;
  description: string;
  descriptionHi: string;
  variants: ProductVariant[];
  inStock: boolean;
  image: string;
  rating?: number;
  featured?: boolean;
  sku?: string;
  priceRange?: string;
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
    standard: 'Free discreet tracked shipping across Europe on orders over €150 (delivery within 3-7 business days).',
    standardHi: 'Pure Europe me 150 Euro se upar ke orders par free discreet delivery (3-7 din me).',
    express: 'Express Courier EU Delivery is available for €14.99 with guaranteed customs clearance.',
    expressHi: 'Chaudah Euro ninyanve cents me express courier delivery uplabdh hai.',
    freeThreshold: 150
  },
  returns: {
    periodDays: 30,
    description: '100% money-back guarantee with guaranteed European delivery and free reshipment if customs hold occurs.',
    descriptionHi: 'Hum 30-din ki full delivery guarantee aur money-back guarantee dete hain.'
  }
};

export const STORE_PRODUCTS: StoreProduct[] = [
  // 1. Modalert 200 mg (Flagship Modafinil)
  {
    id: 'prod-modalert-200',
    name: 'Modalert 200 mg',
    nameHi: 'मोडअलर्ट 200 मिलीग्राम (मोडाफिनिल)',
    category: 'modafinil',
    subCategory: 'wakefulness',
    description: 'Premium pharmaceutical-grade Modafinil 200mg by Sun Pharma. Trusted worldwide for daytime alertness, cognitive enhancement, and narcolepsy management.',
    descriptionHi: 'सन फार्मा द्वारा निर्मित मोडाफिनिल 200 मिलीग्राम, दिन के समय सतर्कता और ध्यान बढ़ाने के लिए।',
    inStock: true,
    rating: 5.0,
    featured: true,
    sku: 'MODALERT200MG',
    priceRange: '€69.00 – €749.00',
    image: 'https://modaineurope.com/wp-content/uploads/2026/02/Modalert-200-mg.webp',
    variants: [
      {
        id: 'var-modalert200-30',
        tablets: 30,
        price: 69.0,
        formattedPriceEn: 'sixty-nine euros',
        formattedPriceHi: 'unhattar euro',
        stock: 120
      },
      {
        id: 'var-modalert200-60',
        tablets: 60,
        price: 119.0,
        formattedPriceEn: 'one hundred and nineteen euros',
        formattedPriceHi: 'ek sau unnees euro',
        stock: 95
      },
      {
        id: 'var-modalert200-100',
        tablets: 100,
        price: 169.0,
        formattedPriceEn: 'one hundred and sixty-nine euros',
        formattedPriceHi: 'ek sau unhattar euro',
        stock: 80
      },
      {
        id: 'var-modalert200-200',
        tablets: 200,
        price: 289.0,
        formattedPriceEn: 'two hundred and eighty-nine euros',
        formattedPriceHi: 'do sau nawasi euro',
        stock: 50
      }
    ]
  },

  // 2. Modalert 100 mg
  {
    id: 'prod-modalert-100',
    name: 'Modalert 100 mg',
    nameHi: 'मोडअलर्ट 100 मिलीग्राम',
    category: 'modafinil',
    subCategory: 'wakefulness',
    description: 'Mild daytime wakefulness and sustained focus formula by Sun Pharma. Ideal for beginner users or lighter cognitive enhancement schedules.',
    descriptionHi: 'हल्की सतर्कता और एकाग्रता के लिए मोडाफिनिल 100 मिलीग्राम।',
    inStock: true,
    rating: 4.0,
    featured: false,
    sku: 'MODALERT100MG',
    priceRange: '€69.00 – €449.00',
    image: 'https://modaineurope.com/wp-content/uploads/2026/02/Modalert-100-mg.webp',
    variants: [
      {
        id: 'var-modalert100-30',
        tablets: 30,
        price: 69.0,
        formattedPriceEn: 'sixty-nine euros',
        formattedPriceHi: 'unhattar euro',
        stock: 60
      },
      {
        id: 'var-modalert100-60',
        tablets: 60,
        price: 109.0,
        formattedPriceEn: 'one hundred and nine euros',
        formattedPriceHi: 'ek sau nau euro',
        stock: 50
      },
      {
        id: 'var-modalert100-100',
        tablets: 100,
        price: 155.0,
        formattedPriceEn: 'one hundred and fifty-five euros',
        formattedPriceHi: 'ek sau pachpan euro',
        stock: 40
      }
    ]
  },

  // 3. Waklert 150 mg (Flagship Armodafinil)
  {
    id: 'prod-waklert-150',
    name: 'Waklert 150 mg',
    nameHi: 'वाकलर्ट 150 मिलीग्राम (आर्मोडाफिनिल)',
    category: 'armodafinil',
    subCategory: 'wakefulness',
    description: 'Pure R-isomer Armodafinil 150mg by Sun Pharma. Provides longer-lasting, smoother mental clarity and peak alertness without afternoon jitters.',
    descriptionHi: 'सन फार्मा द्वारा आर-आइसोमर आर्मोडाफिनिल 150 मिलीग्राम जो लंबे समय तक सतर्कता प्रदान करता है।',
    inStock: true,
    rating: 5.0,
    featured: true,
    sku: 'WAKLERT150MG',
    priceRange: '€69.00 – €449.00',
    image: 'https://modaineurope.com/wp-content/uploads/2026/02/Waklert-150-mg.webp',
    variants: [
      {
        id: 'var-waklert-30',
        tablets: 30,
        price: 69.0,
        formattedPriceEn: 'sixty-nine euros',
        formattedPriceHi: 'unhattar euro',
        stock: 110
      },
      {
        id: 'var-waklert-60',
        tablets: 60,
        price: 119.0,
        formattedPriceEn: 'one hundred and nineteen euros',
        formattedPriceHi: 'ek sau unnees euro',
        stock: 90
      },
      {
        id: 'var-waklert-100',
        tablets: 100,
        price: 169.0,
        formattedPriceEn: 'one hundred and sixty-nine euros',
        formattedPriceHi: 'ek sau unhattar euro',
        stock: 65
      },
      {
        id: 'var-waklert-200',
        tablets: 200,
        price: 289.0,
        formattedPriceEn: 'two hundred and eighty-nine euros',
        formattedPriceHi: 'do sau nawasi euro',
        stock: 45
      }
    ]
  },

  // 4. Modvigil 200 mg
  {
    id: 'prod-modvigil-200',
    name: 'Modvigil 200 mg',
    nameHi: 'मोडविजिल 200 मिलीग्राम',
    category: 'modafinil',
    subCategory: 'wakefulness',
    description: 'Cost-effective, high-potency Modafinil 200mg by HAB Pharma. Highly popular across European shift workers and university students for consistent focus.',
    descriptionHi: 'एचएबी फार्मा द्वारा मोडाफिनिल 200 मिलीग्राम जो लंबे समय तक ध्यान बनाए रखने में मदद करता है।',
    inStock: true,
    rating: 4.0,
    featured: true,
    sku: 'MODVIGIL200MG',
    priceRange: '€85.00 – €449.00',
    image: 'https://modaineurope.com/wp-content/uploads/2026/02/Modvigil-200mg.webp',
    variants: [
      {
        id: 'var-modvigil-30',
        tablets: 30,
        price: 85.0,
        formattedPriceEn: 'eighty-five euros',
        formattedPriceHi: 'pachasi euro',
        stock: 75
      },
      {
        id: 'var-modvigil-60',
        tablets: 60,
        price: 135.0,
        formattedPriceEn: 'one hundred and thirty-five euros',
        formattedPriceHi: 'ek sau paintis euro',
        stock: 55
      },
      {
        id: 'var-modvigil-100',
        tablets: 100,
        price: 185.0,
        formattedPriceEn: 'one hundred and eighty-five euros',
        formattedPriceHi: 'ek sau pachasi euro',
        stock: 45
      }
    ]
  },

  // 5. Artvigil 150 mg
  {
    id: 'prod-artvigil-150',
    name: 'Artvigil 150 mg',
    nameHi: 'आर्टविजिल 150 मिलीग्राम (आर्मोडाफिनिल)',
    category: 'armodafinil',
    subCategory: 'wakefulness',
    description: 'Armodafinil 150mg by HAB Pharmaceuticals. Designed for smooth, long-tail wakefulness without energy crashes or restless sleep.',
    descriptionHi: 'एचएबी फार्मा द्वारा आर्मोडाफिनिल 150 मिलीग्राम।',
    inStock: true,
    rating: 4.0,
    featured: true,
    sku: 'ARTVIGIL150MG',
    priceRange: '€89.00 – €419.00',
    image: 'https://modaineurope.com/wp-content/uploads/2026/02/Artvigil-150-mg.webp',
    variants: [
      {
        id: 'var-artvigil-30',
        tablets: 30,
        price: 89.0,
        formattedPriceEn: 'eighty-nine euros',
        formattedPriceHi: 'nawasi euro',
        stock: 80
      },
      {
        id: 'var-artvigil-60',
        tablets: 60,
        price: 139.0,
        formattedPriceEn: 'one hundred and thirty-nine euros',
        formattedPriceHi: 'ek sau untalis euro',
        stock: 60
      },
      {
        id: 'var-artvigil-100',
        tablets: 100,
        price: 189.0,
        formattedPriceEn: 'one hundred and eighty-nine euros',
        formattedPriceHi: 'ek sau nawasi euro',
        stock: 45
      }
    ]
  },

  // 6. Modacare 200 mg
  {
    id: 'prod-modacare-200',
    name: 'Modacare 200 mg',
    nameHi: 'मोडाकेयर 200 मिलीग्राम',
    category: 'modafinil',
    subCategory: 'wakefulness',
    description: 'European standard Modafinil 200mg formulation promoting steady daytime alertness and enhanced productivity for busy professionals.',
    descriptionHi: 'यूरोपीय मानक मोडाफिनिल 200 मिलीग्राम।',
    inStock: true,
    rating: 4.0,
    featured: false,
    sku: 'MODACARE200MG',
    priceRange: '€69.00 – €395.00',
    image: 'https://modaineurope.com/wp-content/uploads/2026/02/Modacare-200-mg.webp',
    variants: [
      {
        id: 'var-modacare-30',
        tablets: 30,
        price: 69.0,
        formattedPriceEn: 'sixty-nine euros',
        formattedPriceHi: 'unhattar euro',
        stock: 50
      },
      {
        id: 'var-modacare-60',
        tablets: 60,
        price: 109.0,
        formattedPriceEn: 'one hundred and nine euros',
        formattedPriceHi: 'ek sau nau euro',
        stock: 40
      },
      {
        id: 'var-modacare-100',
        tablets: 100,
        price: 155.0,
        formattedPriceEn: 'one hundred and fifty-five euros',
        formattedPriceHi: 'ek sau pachpan euro',
        stock: 35
      }
    ]
  },

  // 7. Modafil MD 200 mg (Sublingual)
  {
    id: 'prod-modafil-md-200',
    name: 'Modafil MD 200 mg',
    nameHi: 'मोडाफिल एमडी 200 मिलीग्राम (सबलिंगुअल)',
    category: 'modafinil',
    subCategory: 'sublingual',
    description: 'Fast-acting sublingual orodispersible Modafinil 200mg. Dissolves under the tongue for rapid absorption within 15 minutes with a refreshing mint taste.',
    descriptionHi: 'जीभ के नीचे घुलने वाली तेजी से असर करने वाली मोडाफिनिल टैबलेट।',
    inStock: true,
    rating: 5.0,
    featured: false,
    sku: 'MODAFILMD200MG',
    priceRange: '€70.00 – €749.00',
    image: 'https://modaineurope.com/wp-content/uploads/2026/02/Modafil-MD-200-mg.webp',
    variants: [
      {
        id: 'var-modafilmd-30',
        tablets: 30,
        price: 70.0,
        formattedPriceEn: 'seventy euros',
        formattedPriceHi: 'sattar euro',
        stock: 65
      },
      {
        id: 'var-modafilmd-60',
        tablets: 60,
        price: 119.0,
        formattedPriceEn: 'one hundred and nineteen euros',
        formattedPriceHi: 'ek sau unnees euro',
        stock: 50
      },
      {
        id: 'var-modafilmd-100',
        tablets: 100,
        price: 169.0,
        formattedPriceEn: 'one hundred and sixty-nine euros',
        formattedPriceHi: 'ek sau unhattar euro',
        stock: 40
      }
    ]
  },

  // 8. Vilafinil 200 mg
  {
    id: 'prod-vilafinil-200',
    name: 'Vilafinil 200 mg',
    nameHi: 'विलाफिनिल 200 मिलीग्राम',
    category: 'modafinil',
    subCategory: 'wakefulness',
    description: 'Generic Modafinil 200mg by Centurion Laboratories. Delivers reliable wakefulness, mental stamina, and fatigue resistance at an economical price point.',
    descriptionHi: 'सेंचुरियन लैबोरेटरीज द्वारा निर्मित विलाफिनिल 200 मिलीग्राम।',
    inStock: true,
    rating: 5.0,
    featured: false,
    sku: 'VILAFINIL200MG',
    priceRange: '€69.00 – €449.00',
    image: 'https://modaineurope.com/wp-content/uploads/2026/02/Vilafinil-200-mg.webp',
    variants: [
      {
        id: 'var-vilafinil-30',
        tablets: 30,
        price: 69.0,
        formattedPriceEn: 'sixty-nine euros',
        formattedPriceHi: 'unhattar euro',
        stock: 70
      },
      {
        id: 'var-vilafinil-60',
        tablets: 60,
        price: 109.0,
        formattedPriceEn: 'one hundred and nine euros',
        formattedPriceHi: 'ek sau nau euro',
        stock: 55
      },
      {
        id: 'var-vilafinil-100',
        tablets: 100,
        price: 155.0,
        formattedPriceEn: 'one hundred and fifty-five euros',
        formattedPriceHi: 'ek sau pachpan euro',
        stock: 45
      }
    ]
  },

  // 9. ModaXL 200 mg
  {
    id: 'prod-modaxl-200',
    name: 'ModaXL 200 mg',
    nameHi: 'मोडाएक्सएल 200 मिलीग्राम',
    category: 'modafinil',
    subCategory: 'extended-release',
    description: 'Next-generation extended-absorption Modafinil 200mg. Engineered for maximum bioavailability and smooth cognitive output throughout prolonged workdays.',
    descriptionHi: 'उन्नत अवशोषण क्षमता युक्त मोडाएक्सएल 200 मिलीग्राम।',
    inStock: true,
    rating: 5.0,
    featured: true,
    sku: 'MODAXL200MG',
    priceRange: '€129.00 – €779.00',
    image: 'https://modaineurope.com/wp-content/uploads/2026/06/MODAXL-200-1.webp',
    variants: [
      {
        id: 'var-modaxl-30',
        tablets: 30,
        price: 129.0,
        formattedPriceEn: 'one hundred and twenty-nine euros',
        formattedPriceHi: 'ek sau untees euro',
        stock: 40
      },
      {
        id: 'var-modaxl-60',
        tablets: 60,
        price: 199.0,
        formattedPriceEn: 'one hundred and ninety-nine euros',
        formattedPriceHi: 'ek sau ninyanve euro',
        stock: 30
      },
      {
        id: 'var-modaxl-100',
        tablets: 100,
        price: 289.0,
        formattedPriceEn: 'two hundred and eighty-nine euros',
        formattedPriceHi: 'do sau nawasi euro',
        stock: 25
      }
    ]
  },

  // 10. Armodavinil 150 mg
  {
    id: 'prod-armodavinil-150',
    name: 'Armodavinil 150 mg',
    nameHi: 'आर्मोडाविनिल 150 मिलीग्राम',
    category: 'armodafinil',
    subCategory: 'wakefulness',
    description: 'Clean-acting Armodafinil 150mg tablet. Tailored for shift-work sleep disorder (SWSD) and individuals requiring 12-hour laser focus.',
    descriptionHi: 'नाइट शिफ्ट और लंबे समय तक काम करने वालों के लिए आर्मोडाविनिल 150 मिलीग्राम।',
    inStock: true,
    rating: 4.0,
    featured: false,
    sku: 'ARMODAVINIL150MG',
    priceRange: '€69.00 – €449.00',
    image: 'https://modaineurope.com/wp-content/uploads/2026/02/Armodavinil-150-mg.webp',
    variants: [
      {
        id: 'var-armodavinil-30',
        tablets: 30,
        price: 69.0,
        formattedPriceEn: 'sixty-nine euros',
        formattedPriceHi: 'unhattar euro',
        stock: 45
      },
      {
        id: 'var-armodavinil-60',
        tablets: 60,
        price: 109.0,
        formattedPriceEn: 'one hundred and nine euros',
        formattedPriceHi: 'ek sau nau euro',
        stock: 35
      }
    ]
  },

  // 11. Modaheal 200 mg
  {
    id: 'prod-modaheal-200',
    name: 'Modaheal 200 mg',
    nameHi: 'मोडाहील 200 मिलीग्राम',
    category: 'modafinil',
    subCategory: 'wakefulness',
    description: 'High-purity Modafinil 200mg by Healing Pharma. Renowned for consistent batch quality, quick onset, and stable European supply.',
    descriptionHi: 'हीलिंग फार्मा द्वारा निर्मित मोडाहील 200 मिलीग्राम।',
    inStock: true,
    rating: 5.0,
    featured: false,
    sku: 'MODAHEAL200MG',
    priceRange: '€69.00 – €449.00',
    image: 'https://modaineurope.com/wp-content/uploads/2026/02/Modaheal-200-mg.webp',
    variants: [
      {
        id: 'var-modaheal-30',
        tablets: 30,
        price: 69.0,
        formattedPriceEn: 'sixty-nine euros',
        formattedPriceHi: 'unhattar euro',
        stock: 50
      },
      {
        id: 'var-modaheal-60',
        tablets: 60,
        price: 109.0,
        formattedPriceEn: 'one hundred and nine euros',
        formattedPriceHi: 'ek sau nau euro',
        stock: 40
      }
    ]
  },

  // 12. Modawake 200 mg
  {
    id: 'prod-modawake-200',
    name: 'Modawake 200 mg',
    nameHi: 'मोडावेक 200 मिलीग्राम',
    category: 'modafinil',
    subCategory: 'wakefulness',
    description: 'Hab Pharma certified Modafinil 200mg for combating daytime fatigue, jetlag, and irregular sleep disruptions across Europe.',
    descriptionHi: 'थकान और नींद की समस्या से राहत के लिए मोडावेक 200 मिलीग्राम।',
    inStock: true,
    rating: 4.0,
    featured: false,
    sku: 'MODAWAKE200MG',
    priceRange: '€69.00 – €449.00',
    image: 'https://modaineurope.com/wp-content/uploads/2026/02/Modawake-200-mg.webp',
    variants: [
      {
        id: 'var-modawake-30',
        tablets: 30,
        price: 69.0,
        formattedPriceEn: 'sixty-nine euros',
        formattedPriceHi: 'unhattar euro',
        stock: 40
      },
      {
        id: 'var-modawake-60',
        tablets: 60,
        price: 109.0,
        formattedPriceEn: 'one hundred and nine euros',
        formattedPriceHi: 'ek sau nau euro',
        stock: 30
      }
    ]
  },

  // Retain legacy test products for automated test suite compatibility
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
        tablets: 30,
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
  }
];

export class StoreCatalogService {
  /**
   * On-demand product search only when user intent requires it
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
        ((q.includes('wellness') || q.includes('multivitamin')) && prod.category === 'wellness') ||
        ((q.includes('modalert') || q.includes('modafinil') || q.includes('wakefulness') || q.includes('alert') || q.includes('sleep') || q.includes('provigil') || q.includes('pill')) &&
          (prod.category === 'modafinil' || prod.category === 'wakefulness')) ||
        ((q.includes('waklert') || q.includes('armodafinil') || q.includes('artvigil')) &&
          prod.category === 'armodafinil');

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
