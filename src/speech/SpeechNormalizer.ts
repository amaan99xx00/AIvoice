/**
 * SpeechNormalizer
 * Implements 5A.14 (Pronunciation) & 5A.15 (Number and Quantity Clarity):
 * - Normalizes currency prices into natural spoken words ($59.99 -> "fifty-nine dollars and ninety-nine cents")
 * - Disambiguates phonetically close quantities (e.g., 60 vs 16, 30 vs 13)
 * - Generates polite verification prompts when quantity is uncertain
 */

import { VOICE_CONFIG } from '../config/voiceConfig';

const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const TEENS = [
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen'
];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

export class SpeechNormalizer {
  /**
   * Converts integer up to 999 into spoken English words
   */
  public static numberToWords(n: number): string {
    if (n === 0) return 'zero';
    if (n < 0) return 'negative ' + this.numberToWords(Math.abs(n));

    let words = '';

    if (Math.floor(n / 100) > 0) {
      words += ONES[Math.floor(n / 100)] + ' hundred ';
      n %= 100;
    }

    if (n > 0) {
      if (n < 10) {
        words += ONES[n];
      } else if (n < 20) {
        words += TEENS[n - 10];
      } else {
        words += TENS[Math.floor(n / 10)];
        if (n % 10 > 0) {
          words += '-' + ONES[n % 10];
        }
      }
    }

    return words.trim();
  }

  /**
   * 5A.14: Formats currency strings into natural spoken English.
   * Example: "$59.99" -> "fifty-nine dollars and ninety-nine cents"
   * Example: "₹499" -> "four hundred ninety-nine rupees"
   */
  public static formatPriceForSpeech(priceStr: string | number): string {
    let raw = typeof priceStr === 'number' ? priceStr.toFixed(2) : priceStr.trim();
    let currency = 'dollars';
    let subCurrency = 'cents';

    if (raw.includes('₹') || raw.toLowerCase().includes('rs') || raw.toLowerCase().includes('inr')) {
      currency = 'rupees';
      subCurrency = 'paise';
    }

    // Strip currency symbols
    const cleanNum = raw.replace(/[^\d.]/g, '');
    const parts = cleanNum.split('.');
    const wholeUnits = parseInt(parts[0], 10) || 0;
    const decimalUnits = parts[1] ? parseInt(parts[1].padEnd(2, '0').slice(0, 2), 10) : 0;

    const wholeWords = this.numberToWords(wholeUnits);
    const wholeLabel = wholeUnits === 1 ? currency.replace(/s$/, '') : currency;

    if (decimalUnits > 0) {
      const decimalWords = this.numberToWords(decimalUnits);
      const subLabel = decimalUnits === 1 ? subCurrency.replace(/s$/, '') : subCurrency;
      return `${wholeWords} ${wholeLabel} and ${decimalWords} ${subLabel}`;
    }

    return `${wholeWords} ${wholeLabel}`;
  }

  /**
   * 5A.15: Resolves and disambiguates pill quantities (e.g. 60 vs 16, 30 vs 13).
   * Verifies against authorized product catalog entries.
   */
  public static disambiguateQuantity(transcript: string): {
    verifiedQuantity?: number;
    needsClarification: boolean;
    clarificationPrompt?: string;
  } {
    const text = transcript.toLowerCase();
    const catalogQuantities = VOICE_CONFIG.sampleCatalog.map((c) => c.pills);

    // Phonetic confusion patterns
    const isSixteen = /\b(16|sixteen)\b/.test(text);
    const isSixty = /\b(60|sixty)\b/.test(text);
    const isThirteen = /\b(13|thirteen)\b/.test(text);
    const isThirty = /\b(30|thirty)\b/.test(text);
    const isHundred = /\b(100|hundred|one hundred)\b/.test(text);

    // 16 vs 60 ambiguity check
    if (isSixteen && !isSixty) {
      // 16 pills is NOT in catalog, but 60 is! High likelihood of acoustic confusion in noisy environments
      if (!catalogQuantities.includes(16) && catalogQuantities.includes(60)) {
        return {
          needsClarification: true,
          clarificationPrompt: VOICE_CONFIG.messages.quantityClarification(60)
        };
      }
    }

    if (isThirteen && !isThirty) {
      if (!catalogQuantities.includes(13) && catalogQuantities.includes(30)) {
        return {
          needsClarification: true,
          clarificationPrompt: VOICE_CONFIG.messages.quantityClarification(30)
        };
      }
    }

    if (isSixty) return { verifiedQuantity: 60, needsClarification: false };
    if (isThirty) return { verifiedQuantity: 30, needsClarification: false };
    if (isHundred) return { verifiedQuantity: 100, needsClarification: false };

    return { needsClarification: false };
  }

  /**
   * Pre-processes raw AI response text before TTS synthesis so numbers, prices, and symbols
   * are spoken naturally without robotic stuttering.
   */
  public static normalizeTtsText(rawText: string): string {
    let result = rawText;

    // Convert dollar prices like $59.99 or $59
    result = result.replace(/\$(\d+(?:\.\d{1,2})?)/g, (_match, p1) => {
      return this.formatPriceForSpeech(p1);
    });

    // Convert rupee prices like ₹499
    result = result.replace(/₹(\d+(?:\.\d{1,2})?)/g, (_match, p1) => {
      return this.formatPriceForSpeech('₹' + p1);
    });

    return result;
  }
}
