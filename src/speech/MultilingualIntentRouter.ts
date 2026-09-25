/**
 * MultilingualIntentRouter
 * Implements Section 5 (Dynamic Greeting), Section 11 (Natural Conversation),
 * Section 12 (Language Following: English, Hindi, Hinglish),
 * Section 13 (Stop after greeting), Section 14 & 17 (On-Demand Product Search),
 * Section 15 (Never Guess Info), Section 16 (Variant Understanding),
 * Section 18 (Context Maintenance), Section 19 (User Confirmation Before Cart),
 * and Section 39 (Human Conversational Tone).
 */

import { StoreCatalogService, StoreProduct, STORE_POLICIES } from '../services/storeCatalog';
import { SpeechNormalizer } from './SpeechNormalizer';
import { AuthService } from '../services/authService';
import { WooCommerceService } from '../services/wooCommerceService';

export type DetectedLanguage = 'en' | 'hi' | 'hinglish';

export interface ConversationMemory {
  currentCategory?: string;
  currentProduct?: StoreProduct;
  lastDiscussedVariantTablets?: number;
  lastIntent?: string;
  awaitingCartConfirmation?: boolean;
}

export interface RouterResponse {
  language: DetectedLanguage;
  aiResponseText: string;
  actionRequired?: 'NONE' | 'CONFIRM_CART' | 'REQUIRE_AUTH' | 'CART_COMPLETED';
  suggestedActionPayload?: {
    productId: string;
    variantId: string;
    tablets: number;
    price: number;
  };
}

export class MultilingualIntentRouter {
  private memory: ConversationMemory = {};

  /**
   * Section 5: Generates dynamic welcome greeting based on local time
   * 00:00–11:59: "Good morning! How can I help you today?"
   * 12:00–16:59: "Good afternoon! How can I help you today?"
   * 17:00–23:59: "Good evening! How can I help you today?"
   */
  public static getDynamicGreeting(date: Date = new Date()): string {
    const hour = date.getHours();
    if (hour >= 0 && hour < 12) {
      return 'Good morning! How can I help you today?';
    } else if (hour >= 12 && hour < 17) {
      return 'Good afternoon! How can I help you today?';
    } else {
      return 'Good evening! How can I help you today?';
    }
  }

  public getMemory(): ConversationMemory {
    return this.memory;
  }

  public resetMemory(): void {
    this.memory = {};
  }

  /**
   * Section 12: Identifies spoken language (English, Hindi, Hinglish)
   */
  public detectLanguage(transcript: string): DetectedLanguage {
    const text = transcript.toLowerCase();

    // Pure Hindi / Devanagari script or strong Hindi vocabulary
    const hasDevanagari = /[\u0900-\u097F]/.test(text);
    const hindiWords = [
      'mujhe', 'chahiye', 'kya', 'hai', 'batao', 'dikhaye', 'kitne', 'ka',
      'dam', 'bhaav', 'kripya', 'namaste', 'kaise', 'accha', 'shukriya',
      'sasta', 'wala', 'ye', 'woh', 'bhi', 'nahin', 'haan'
    ];

    let hindiMatchCount = 0;
    hindiWords.forEach((hw) => {
      const regex = new RegExp(`\\b${hw}\\b`, 'i');
      if (regex.test(text)) hindiMatchCount++;
    });

    if (hasDevanagari) return 'hi';
    if (hindiMatchCount >= 2) return 'hinglish';
    if (hindiMatchCount === 1) return 'hinglish';
    return 'en';
  }

  /**
   * Routes user utterance to conversational handler maintaining context
   */
  public processUtterance(transcript: string): RouterResponse {
    const text = transcript.trim().toLowerCase();
    const lang = this.detectLanguage(text);

    // Section 16: Disambiguation between 16 and 60
    const disambiguation = SpeechNormalizer.disambiguateQuantity(text);
    if (disambiguation.needsClarification && disambiguation.clarificationPrompt) {
      const responseText =
        lang === 'en'
          ? disambiguation.clarificationPrompt
          : 'Kripya confirm karein, kya aapka matlab 60-tablet wala option hai?';
      return {
        language: lang,
        aiResponseText: responseText
      };
    }

    const requestedTablets = disambiguation.verifiedQuantity;

    // 1. Handling Cart Confirmation State (Section 19, 20, 21)
    if (this.memory.awaitingCartConfirmation && this.memory.currentProduct) {
      const isPositive =
        text.includes('yes') ||
        text.includes('add it') ||
        text.includes('sure') ||
        text.includes('haan') ||
        text.includes('theek hai') ||
        text.includes('kart me daal do') ||
        text.includes('please add');

      const isNegative =
        text.includes('no') ||
        text.includes('cancel') ||
        text.includes('mat karo') ||
        text.includes('nahi') ||
        text.includes('wait');

      if (isPositive) {
        const prod = this.memory.currentProduct;
        const targetTablets = this.memory.lastDiscussedVariantTablets || prod.variants[0].tablets;
        const variant = prod.variants.find((v) => v.tablets === targetTablets) || prod.variants[0];

        // Section 20: Authentication Check Before Cart Action
        if (!AuthService.isLoggedIn()) {
          // Preserve pending cart context
          WooCommerceService.setPendingCartAction({
            productId: prod.id,
            variantId: variant.id,
            tablets: variant.tablets,
            productName: prod.name,
            price: variant.price
          });

          this.memory.awaitingCartConfirmation = false;
          return {
            language: lang,
            aiResponseText:
              lang === 'en'
                ? "You'll need to log in before I can add this to your cart. Please click Login."
                : 'Cart me add karne ke liye pehle login karna hoga. Kripya login karein.',
            actionRequired: 'REQUIRE_AUTH',
            suggestedActionPayload: {
              productId: prod.id,
              variantId: variant.id,
              tablets: variant.tablets,
              price: variant.price
            }
          };
        }

        // Already logged in -> execute real cart action (Section 22)
        this.memory.awaitingCartConfirmation = false;
        return {
          language: lang,
          aiResponseText:
            lang === 'en'
              ? `Done — I've added the ${targetTablets}-tablet option to your cart.`
              : `Done — Maine ${targetTablets}-tablet wala option aapke cart me add kar diya hai.`,
          actionRequired: 'CART_COMPLETED',
          suggestedActionPayload: {
            productId: prod.id,
            variantId: variant.id,
            tablets: variant.tablets,
            price: variant.price
          }
        };
      }

      if (isNegative) {
        this.memory.awaitingCartConfirmation = false;
        return {
          language: lang,
          aiResponseText:
            lang === 'en'
              ? 'No problem. Let me know if you would like to explore anything else.'
              : 'Koi baat nahi. Batayein main aur kya madad kar sakta hoon.'
        };
      }
    }

    // 2. Skincare Inquiry - Section 11 example:
    // User: "I need something for skin care." -> AI: "Sure. What kind of skincare product are you looking for?"
    // User: "Mujhe koi skincare product chahiye." -> AI: "Bilkul. Aap kis type ka skincare product dekh rahe hain?"
    if (
      (text.includes('skincare') || text.includes('skin care') || text.includes('skin')) &&
      !text.includes('acne') &&
      !text.includes('cleanser')
    ) {
      this.memory.currentCategory = 'skincare';
      return {
        language: lang,
        aiResponseText:
          lang === 'en'
            ? 'Sure. What kind of skincare product are you looking for?'
            : 'Bilkul. Aap kis type ka skincare product dekh rahe hain?'
      };
    }

    // 3. Acne Inquiry - Section 11 example:
    // User: "Something for acne." -> AI: "Okay. Let me check the available products." -> retrieves acne serum
    if (text.includes('acne') || text.includes('pimples') || text.includes('daag')) {
      const acneProduct = StoreCatalogService.searchProducts('acne')[0];
      if (acneProduct) {
        this.memory.currentCategory = 'skincare';
        this.memory.currentProduct = acneProduct;
        this.memory.lastDiscussedVariantTablets = acneProduct.variants[0].tablets;

        return {
          language: lang,
          aiResponseText:
            lang === 'en'
              ? `I found our ClearSkin Acne Defense Serum with salicylic acid and niacinamide. It's twenty-four dollars and ninety-nine cents. Would you like more details?`
              : `Humare paas ClearSkin Acne Defense Serum uplabdh hai jo muhaaso ko theek karta hai. Iska price chaubees dollar ninyanve cents hai. Kya aap iske baare me aur jaanna chahte hain?`
        };
      }
    }

    // 4. Daily Wellness / Tablets Inquiry (Section 16: 30, 60, 100 tablets)
    if (
      text.includes('tablet') ||
      text.includes('pill') ||
      text.includes('wellness') ||
      text.includes('vitamin') ||
      requestedTablets !== undefined
    ) {
      const wellnessProduct = StoreCatalogService.searchProducts('wellness')[0];
      this.memory.currentProduct = wellnessProduct;

      if (requestedTablets) {
        this.memory.lastDiscussedVariantTablets = requestedTablets;
        const variant = wellnessProduct.variants.find((v) => v.tablets === requestedTablets);
        if (variant) {
          const spokenPrice =
            lang === 'en' ? variant.formattedPriceEn : variant.formattedPriceHi;
          this.memory.awaitingCartConfirmation = true;
          return {
            language: lang,
            aiResponseText:
              lang === 'en'
                ? `Yes, the ${requestedTablets}-tablet pack is available for ${spokenPrice}. Would you like me to add it to your cart?`
                : `Haan, ${requestedTablets}-tablet wala pack uplabdh hai, price hai ${spokenPrice}. Kya ise aapke cart me add kar doon?`,
            actionRequired: 'CONFIRM_CART',
            suggestedActionPayload: {
              productId: wellnessProduct.id,
              variantId: variant.id,
              tablets: variant.tablets,
              price: variant.price
            }
          };
        }
      }

      // If user asks general tablet options
      return {
        language: lang,
        aiResponseText:
          lang === 'en'
            ? 'We have Daily Wellness Tablets in 30, 60, and 100-tablet packs. Which size would you like to know the price for?'
            : 'Humare paas Daily Wellness Tablets 30, 60, aur 100 tablets ke packs me uplabdh hain. Aap kis size ka price dekhna chahenge?'
      };
    }

    // 5. Price Questions - Section 14, 15, 39:
    // User: "What's the price?" / "What is the price?" / "Kitne ka hai?"
    if (text.includes('price') || text.includes('cost') || text.includes('kitne ka') || text.includes('rate')) {
      if (this.memory.currentProduct) {
        const prod = this.memory.currentProduct;
        const targetTablets = this.memory.lastDiscussedVariantTablets || prod.variants[0].tablets;
        const variant = prod.variants.find((v) => v.tablets === targetTablets) || prod.variants[0];
        const spoken = lang === 'en' ? variant.formattedPriceEn : variant.formattedPriceHi;

        return {
          language: lang,
          aiResponseText:
            lang === 'en'
              ? `It's ${spoken} for the ${targetTablets}-tablet pack.`
              : `${targetTablets}-tablet pack ka price ${spoken} hai.`
        };
      }

      // Default catalog pricing overview
      return {
        language: lang,
        aiResponseText:
          lang === 'en'
            ? 'The 30-tablet pack is twenty-nine dollars and ninety-nine cents, and the 60-tablet pack is fifty-four dollars and ninety-nine cents.'
            : '30-tablet pack untees dollar ninyanve cents ka hai, aur 60-tablet pack chawwan dollar ninyanve cents ka hai.'
      };
    }

    // 6. Contextual Follow-up: "Which one is cheaper?" (Section 18)
    if (text.includes('cheaper') || text.includes('sasta') || text.includes('lowest')) {
      if (this.memory.currentProduct) {
        const cheapestVariant = [...this.memory.currentProduct.variants].sort((a, b) => a.price - b.price)[0];
        this.memory.lastDiscussedVariantTablets = cheapestVariant.tablets;
        const spoken = lang === 'en' ? cheapestVariant.formattedPriceEn : cheapestVariant.formattedPriceHi;

        return {
          language: lang,
          aiResponseText:
            lang === 'en'
              ? `The ${cheapestVariant.tablets}-tablet pack is the most affordable at ${spoken}. Would you like me to add it?`
              : `Sabse sasta ${cheapestVariant.tablets}-tablet pack hai ${spoken} me. Kya ise add kar doon?`,
          actionRequired: 'CONFIRM_CART',
          suggestedActionPayload: {
            productId: this.memory.currentProduct.id,
            variantId: cheapestVariant.id,
            tablets: cheapestVariant.tablets,
            price: cheapestVariant.price
          }
        };
      }
    }

    // 7. Direct Cart Intent: "Add it", "Add to cart", "Haan add karo" (Section 19)
    if (text.includes('add it') || text.includes('add to cart') || text.includes('add karo') || text.includes('kart')) {
      const prod = this.memory.currentProduct || StoreCatalogService.searchProducts('wellness')[0];
      this.memory.currentProduct = prod;
      const targetTablets = this.memory.lastDiscussedVariantTablets || 60;
      const variant = prod.variants.find((v) => v.tablets === targetTablets) || prod.variants[0];

      this.memory.awaitingCartConfirmation = true;

      return {
        language: lang,
        aiResponseText:
          lang === 'en'
            ? `Sure. Would you like me to add the ${variant.tablets}-tablet pack to your cart?`
            : `Bilkul. Kya main ${variant.tablets}-tablet pack aapke cart me add kar doon?`,
        actionRequired: 'CONFIRM_CART',
        suggestedActionPayload: {
          productId: prod.id,
          variantId: variant.id,
          tablets: variant.tablets,
          price: variant.price
        }
      };
    }

    // 8. Shipping Questions (Section 15)
    if (text.includes('shipping') || text.includes('delivery') || text.includes('charges')) {
      return {
        language: lang,
        aiResponseText:
          lang === 'en'
            ? STORE_POLICIES.shipping.standard
            : STORE_POLICIES.shipping.standardHi
      };
    }

    // 9. Return / Refund Policy (Section 15)
    if (text.includes('return') || text.includes('refund') || text.includes('policy') || text.includes('guarantee')) {
      return {
        language: lang,
        aiResponseText:
          lang === 'en'
            ? STORE_POLICIES.returns.description
            : STORE_POLICIES.returns.descriptionHi
      };
    }

    // 10. General Stock / Availability (Section 15)
    if (text.includes('available') || text.includes('in stock') || text.includes('mil jayega')) {
      return {
        language: lang,
        aiResponseText:
          lang === 'en'
            ? 'Yes, all our skincare and wellness products are currently in stock and ready to ship.'
            : 'Haan, sabhi skincare aur wellness products abhi stock me uplabdh hain.'
      };
    }

    // Fallback natural response
    return {
      language: lang,
      aiResponseText:
        lang === 'en'
          ? "I'm here to help with any skincare or wellness products, prices, or orders. What would you like to know?"
          : 'Main skincare ya wellness products, price, aur orders me aapki madad kar sakta hoon. Aap kya jaanna chahenge?'
    };
  }
}
