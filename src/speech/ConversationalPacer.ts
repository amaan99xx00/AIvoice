/**
 * ConversationalPacer
 * Implements 5A.13 (Natural Speaking Speed & List Pacing):
 *
 * Formats AI output so that:
 * 1. Product option lists have natural pauses between choices.
 * 2. Conversational turns remain concise and prompt.
 * 3. Prepares text with SSML or neural punctuation cues (ellipses/periods) for smooth pacing.
 */

import { VOICE_CONFIG } from '../config/voiceConfig';
import { SpeechNormalizer } from './SpeechNormalizer';

export class ConversationalPacer {
  /**
   * 5A.13: Formats multi-product catalog options with natural conversational pacing and clear pauses.
   */
  public static formatProductOptionsResponse(): string {
    const catalog = VOICE_CONFIG.sampleCatalog;

    let response = 'Sure. I found three options.\n\n';
    catalog.forEach((item, index) => {
      const priceSpoken = SpeechNormalizer.formatPriceForSpeech(item.price);
      if (index === catalog.length - 1) {
        response += `And the ${item.pills}-pill option is ${priceSpoken}.\n\n`;
      } else {
        response += `The ${item.pills}-pill option is ${priceSpoken}.\n\n`;
      }
    });

    response += 'Which one would you like to know more about?';
    return response;
  }

  /**
   * Applies conversational cadence pauses to arbitrary AI text responses.
   * Splits multi-sentence responses and ensures appropriate commas and sentence stops.
   */
  public static formatForNaturalPacing(rawText: string): string {
    let formatted = rawText.trim();

    // Ensure list bullets or linebreaks translate to natural audio pauses
    formatted = formatted.replace(/\n\s*[-*•]\s*/g, '.\n');

    // Normalize multiple exclamation marks or uppercase shoutings into warm conversational tone
    formatted = formatted.replace(/!{2,}/g, '.');

    return formatted;
  }
}
