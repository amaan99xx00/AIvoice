/**
 * HinglishIntentParser
 * Implements 5A.9 (Speech Recognition Accuracy) & 5A.10 (Accents & Natural Speech):
 *
 * Correctly identifies intents across Hinglish, Indian English, British, and American phrasing:
 * - "60 pills kitne ka hai?"
 * - "Can you tell me about the 100-pill option?"
 * - "Is this product available?"
 * - "Add the cheaper one to my cart."
 * - "How much is shipping?"
 * - "Yes, add it."
 * - "Wait, I mean the 60-pill one."
 */

import { VOICE_CONFIG } from '../config/voiceConfig';
import { SpeechNormalizer } from './SpeechNormalizer';

export type UserIntent =
  | 'ask_price'
  | 'ask_options'
  | 'check_availability'
  | 'add_to_cart'
  | 'ask_shipping'
  | 'clarify_quantity'
  | 'interruption'
  | 'unclear';

export interface ParsedSpeechResult {
  intent: UserIntent;
  targetQuantity?: number;
  confidence: number;
  aiResponseText: string;
  needsClarification: boolean;
}

export class HinglishIntentParser {
  /**
   * Parses conversational customer speech, handling Hinglish and multi-accent phrasing
   */
  public static parse(transcript: string, previousContext?: { lastOfferedPill?: number }): ParsedSpeechResult {
    const text = transcript.trim().toLowerCase();

    if (!text || text.length < 2) {
      return {
        intent: 'unclear',
        confidence: 0,
        aiResponseText: VOICE_CONFIG.messages.unclearSpeech,
        needsClarification: true
      };
    }

    // 1. Check for quantity ambiguity (e.g. 60 vs 16 pills)
    const disambiguation = SpeechNormalizer.disambiguateQuantity(text);
    if (disambiguation.needsClarification && disambiguation.clarificationPrompt) {
      return {
        intent: 'clarify_quantity',
        confidence: 0.6,
        aiResponseText: disambiguation.clarificationPrompt,
        needsClarification: true
      };
    }

    const pillQty = disambiguation.verifiedQuantity;

    // 2. Price inquiry: "60 pills kitne ka hai?", "what is the price?", "how much is...", "bhaav kya hai"
    if (
      text.includes('kitne ka') ||
      text.includes('kitna') ||
      text.includes('price') ||
      text.includes('cost') ||
      text.includes('rate') ||
      text.includes('how much is') ||
      text.includes('kya price')
    ) {
      if (pillQty) {
        const item = VOICE_CONFIG.sampleCatalog.find((c) => c.pills === pillQty);
        if (item) {
          const spokenPrice = SpeechNormalizer.formatPriceForSpeech(item.price);
          return {
            intent: 'ask_price',
            targetQuantity: pillQty,
            confidence: 0.95,
            aiResponseText: `The ${pillQty}-pill option is ${spokenPrice}. Would you like me to add it to your cart?`,
            needsClarification: false
          };
        }
      }
      return {
        intent: 'ask_price',
        confidence: 0.9,
        aiResponseText: 'The 30-pill option is twenty-nine dollars and ninety-nine cents, the 60-pill option is fifty-four dollars and ninety-nine cents, and the 100-pill option is seventy-nine dollars and ninety-nine cents.',
        needsClarification: false
      };
    }

    // 3. Product inquiry: "Can you tell me about the 100-pill option?", "tell me about", "options kya hai"
    if (text.includes('tell me about') || text.includes('options') || text.includes('details')) {
      if (pillQty === 100) {
        return {
          intent: 'ask_options',
          targetQuantity: 100,
          confidence: 0.95,
          aiResponseText: 'The 100-pill option is our best value pack at seventy-nine dollars and ninety-nine cents, which covers over three months of daily wellness. Would you like to add it?',
          needsClarification: false
        };
      }
    }

    // 4. Availability check: "Is this product available?", "available hai?", "stock me hai?"
    if (text.includes('available') || text.includes('in stock') || text.includes('stock me') || text.includes('mil jayega')) {
      return {
        intent: 'check_availability',
        confidence: 0.95,
        aiResponseText: 'Yes, all 30, 60, and 100-pill options are currently in stock and ready to ship today.',
        needsClarification: false
      };
    }

    // 5. "Add the cheaper one to my cart", "add the cheaper", "sasta wala"
    if (text.includes('cheaper') || text.includes('sasta') || text.includes('lowest price')) {
      return {
        intent: 'add_to_cart',
        targetQuantity: 30,
        confidence: 0.95,
        aiResponseText: 'I have added the 30-pill supply at twenty-nine dollars and ninety-nine cents to your cart. Shall I proceed to checkout?',
        needsClarification: false
      };
    }

    // 6. Direct cart addition: "Yes, add it", "add to cart", "kart me daal do", "haan add karo"
    if (text.includes('add it') || text.includes('add to cart') || text.includes('haan add') || text.includes('kart me')) {
      const chosenQty = pillQty || previousContext?.lastOfferedPill || 60;
      return {
        intent: 'add_to_cart',
        targetQuantity: chosenQty,
        confidence: 0.95,
        aiResponseText: `Great! I've added the ${chosenQty}-pill option to your cart. Is there anything else you'd like to check?`,
        needsClarification: false
      };
    }

    // 7. Shipping inquiry: "How much is shipping?", "shipping kitna lagega", "delivery charges"
    if (text.includes('shipping') || text.includes('delivery') || text.includes('charges')) {
      return {
        intent: 'ask_shipping',
        confidence: 0.95,
        aiResponseText: 'Standard shipping is completely free on all orders today! Express two-day shipping is available for four dollars and ninety-nine cents.',
        needsClarification: false
      };
    }

    // 8. Conversational correction / interruption: "Wait, I mean the 60-pill one", "nahi 60 wala"
    if (
      (text.includes('wait') || text.includes('mean') || text.includes('nahi') || text.includes('actually')) &&
      pillQty
    ) {
      return {
        intent: 'clarify_quantity',
        targetQuantity: pillQty,
        confidence: 0.95,
        aiResponseText: `Understood! Switching to the ${pillQty}-pill option. The price is fifty-four dollars and ninety-nine cents. Shall I update your cart?`,
        needsClarification: false
      };
    }

    // 9. Fallback: 5A.10 - If speech recognition result is uncertain, ask naturally without guessing
    return {
      intent: 'unclear',
      confidence: 0.3,
      aiResponseText: VOICE_CONFIG.messages.unclearSpeech,
      needsClarification: true
    };
  }
}
