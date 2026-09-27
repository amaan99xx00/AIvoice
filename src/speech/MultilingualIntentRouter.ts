/**
 * MultilingualIntentRouter
 * Production-ready conversational orchestrator supporting:
 *   - Page Context Awareness (Home, Shop, Product PDP, Content, About, Blog)
 *   - Single Product Detail Page (PDP) Conversational Answers (Modalert 100mg, etc.)
 *   - Site-wide European Knowledge (Logistics, Phone +1 (734) 274-6420, Email, Guarantees)
 *   - Blog & Medical Journal Search
 *   - Multi-Turn Conversational Expert Consultation Collection (Step-by-step with confirmations)
 *   - Multilingual following (English, French, German, Hindi, Hinglish)
 *   - Natural Greetings and Human Tone
 */

import { StoreCatalogService, StoreProduct } from '../services/storeCatalog';
import { ProductKnowledgeService, ProductItem } from '../data/products';
import { SITE_INFO } from '../data/siteInfo';
import { BlogKnowledgeService } from '../data/blog';
import { FaqKnowledgeService } from '../data/faq';
import { SpeechNormalizer } from './SpeechNormalizer';
import { AuthService } from '../services/authService';
import { WooCommerceService } from '../services/wooCommerceService';
import { UnifiedProductService, UnifiedProduct } from '../services/UnifiedProductService';

export type DetectedLanguage = 'en' | 'fr' | 'de' | 'hi' | 'hinglish';

export interface ExpertConsultationState {
  step:
    | 'NONE'
    | 'OFFER_MADE'
    | 'AWAITING_FIRST_NAME'
    | 'AWAITING_LAST_NAME'
    | 'CONFIRMING_NAME'
    | 'AWAITING_EMAIL'
    | 'CONFIRMING_EMAIL'
    | 'AWAITING_PHONE'
    | 'CONFIRMING_PHONE'
    | 'AWAITING_REASON'
    | 'CONFIRMING_SUMMARY'
    | 'SUBMITTED';
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  reason?: string;
  type?: 'bulk' | 'product_advice' | 'shipping' | 'general';
}

export interface ConversationMemory {
  currentCategory?: string;
  currentProduct?: StoreProduct;
  currentKnowledgeProduct?: ProductItem;
  lastDiscussedVariantTablets?: number;
  lastIntent?: string;
  awaitingCartConfirmation?: boolean;
  pageContext?: {
    pageType: 'home' | 'shop' | 'product' | 'content' | 'about' | 'blog';
    slug?: string;
    product?: ProductItem;
  };
  consultationState?: ExpertConsultationState;
}

export interface RouterResponse {
  language: DetectedLanguage;
  aiResponseText: string;
  productCard?: UnifiedProduct;
  productList?: UnifiedProduct[];
  actionRequired?: 'NONE' | 'CONFIRM_CART' | 'REQUIRE_AUTH' | 'CART_COMPLETED' | 'OPEN_EXPERT_CALL' | 'NAVIGATE';
  actionPayload?: {
    type?: 'bulk' | 'product_advice' | 'shipping';
    prefillMessage?: string;
    targetSelector?: string;
    productId?: string;
    variantId?: string;
    tablets?: number;
    price?: number;
  };
  suggestedActionPayload?: {
    productId: string;
    variantId: string;
    tablets: number;
    price: number;
  };
  actionButtonLabel?: string;
}

export class MultilingualIntentRouter {
  private memory: ConversationMemory = {
    consultationState: { step: 'NONE' }
  };

  /**
   * Dynamic welcome greeting based on user local time
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

  public setPageContext(context: {
    pageType: 'home' | 'shop' | 'product' | 'content' | 'about' | 'blog';
    slug?: string;
    product?: ProductItem;
  }): void {
    this.memory.pageContext = context;
    if (context.product) {
      this.memory.currentKnowledgeProduct = context.product;
      const storeEquiv = StoreCatalogService.searchProducts(context.product.name)[0];
      if (storeEquiv) {
        this.memory.currentProduct = storeEquiv;
      }
    } else if (context.slug) {
      const unified = UnifiedProductService.getBySlug(context.slug);
      if (unified && unified.medicationData) {
        this.memory.currentKnowledgeProduct = unified.medicationData;
        const storeEquiv = StoreCatalogService.searchProducts(unified.name)[0];
        if (storeEquiv) {
          this.memory.currentProduct = storeEquiv;
        }
      }
    }
  }

  public getMemory(): ConversationMemory {
    return this.memory;
  }

  public resetMemory(): void {
    const ctx = this.memory.pageContext;
    this.memory = {
      pageContext: ctx,
      consultationState: { step: 'NONE' }
    };
  }

  /**
   * Identifies spoken language (English, French, German, Hindi, Hinglish)
   */
  public detectLanguage(transcript: string): DetectedLanguage {
    const text = transcript.toLowerCase();

    // Pure Hindi / Devanagari script
    const hasDevanagari = /[\u0900-\u097F]/.test(text);
    if (hasDevanagari) return 'hi';

    const hindiWords = [
      'mujhe', 'chahiye', 'kya', 'hai', 'batao', 'dikhaye', 'kitne', 'ka',
      'dam', 'bhaav', 'kripya', 'namaste', 'kaise', 'accha', 'shukriya',
      'sasta', 'wala', 'ye', 'woh', 'bhi', 'nahin', 'haan', 'karo', 'shukriya'
    ];
    let hindiCount = 0;
    hindiWords.forEach((hw) => {
      if (new RegExp(`\\b${hw}\\b`, 'i').test(text)) hindiCount++;
    });
    if (hindiCount >= 2) return 'hinglish';
    if (hindiCount === 1) return 'hinglish';

    // French vocabulary
    const frenchWords = [
      'bonjour', 'pouvez', 'expliquer', 'produit', 'quel', 'prix', 'combien',
      'livraison', 'france', 'belgique', 'suisse', 'merci', 'commander',
      'bonsoir', 'salut', 's\'il', 'vous', 'plaît', 'panier', 'acheter',
      'qu\'est-ce', 'douane', 'effets', 'secondaires', 'gros'
    ];
    let frenchCount = 0;
    frenchWords.forEach((fw) => {
      if (text.includes(fw)) frenchCount++;
    });
    if (frenchCount >= 1 || text.includes("pouvez-vous") || text.includes("c'est quoi") || text.includes("quel est")) {
      return 'fr';
    }

    // German vocabulary
    const germanWords = [
      'guten', 'morgen', 'abend', 'hallo', 'deutschland', 'österreich', 'schweiz',
      'was', 'kostet', 'kannst', 'können', 'erklären', 'unterschied', 'lieferung',
      'zoll', 'wieviel', 'danke', 'warenkorb', 'bestellen', 'rabatt', 'großbestellung', 'nebenwirkungen'
    ];
    let germanCount = 0;
    germanWords.forEach((gw) => {
      if (text.includes(gw)) germanCount++;
    });
    if (germanCount >= 1 || text.includes("wie viel") || text.includes("was ist")) {
      return 'de';
    }

    return 'en';
  }

  /**
   * Main utterance processor
   */
  public processUtterance(transcript: string): RouterResponse {
    const rawText = transcript.trim();
    const text = rawText.toLowerCase();
    const lang = this.detectLanguage(text);

    // =========================================================================
    // 0. MULTI-TURN CONVERSATIONAL EXPERT CALLBACK FLOW
    // =========================================================================
    const cState = this.memory.consultationState || { step: 'NONE' };
    if (!this.memory.consultationState) {
      this.memory.consultationState = cState;
    }

    // Handle user cancellation during multi-turn consultation
    if (
      cState.step !== 'NONE' &&
      (text === 'cancel' ||
        text === 'stop' ||
        text === 'never mind' ||
        text === 'nevermind' ||
        text === 'annuler' ||
        text === 'abbrechen' ||
        text === 'chhod do')
    ) {
      this.memory.consultationState = { step: 'NONE' };
      return {
        language: lang,
        aiResponseText:
          lang === 'fr'
            ? "Demande annulée. Comment puis-je vous aider d'autre ?"
            : lang === 'de'
            ? "Anfrage abgebrochen. Wie kann ich Ihnen sonst weiterhelfen?"
            : lang === 'hi' || lang === 'hinglish'
            ? "Theek hai, request cancel kar di gayi hai. Aur kya madad karoon?"
            : "No problem at all, I've cancelled the request. How else can I help you today?"
      };
    }

    // Step: OFFER_MADE -> user accepts or declines
    if (cState.step === 'OFFER_MADE') {
      const isPositive =
        text.includes('yes') ||
        text.includes('sure') ||
        text.includes('please') ||
        text.includes('okay') ||
        text.includes('ok') ||
        text.includes('yep') ||
        text.includes('oui') ||
        text.includes('ja') ||
        text.includes('gerne') ||
        text.includes('haan') ||
        text.includes('zaroor');

      const isNegative =
        text.includes('no') ||
        text.includes('nah') ||
        text.includes('non') ||
        text.includes('nein') ||
        text.includes('nahi') ||
        text.includes('not now');

      if (isPositive) {
        cState.step = 'AWAITING_FIRST_NAME';
        return {
          language: lang,
          aiResponseText:
            lang === 'fr'
              ? 'Parfait ! Quel est votre prénom ?'
              : lang === 'de'
              ? 'Sehr gerne! Wie lautet Ihr Vorname?'
              : lang === 'hi' || lang === 'hinglish'
              ? 'Badhiya! Kripya apna first name batayein.'
              : 'Great! What is your first name?'
        };
      }

      if (isNegative) {
        cState.step = 'NONE';
        return {
          language: lang,
          aiResponseText:
            lang === 'fr'
              ? "Très bien. N'hésitez pas si vous avez d'autres questions sur nos médicaments."
              : lang === 'de'
              ? "Verstanden. Lassen Sie mich wissen, wenn Sie Fragen zu unseren Produkten haben."
              : lang === 'hi' || lang === 'hinglish'
              ? "Samajh gaya. Kisi aur cheez me madad chahiye toh batayein."
              : 'Understood. Let me know if you have any other questions about our European medications!'
        };
      }
    }

    // Step: AWAITING_FIRST_NAME
    if (cState.step === 'AWAITING_FIRST_NAME') {
      const cleanName = rawText
        .replace(/^(my name is|it is|it's|i am|je m'appelle|mein name ist|mera naam hai)/i, '')
        .trim();
      const firstName = cleanName.split(/\s+/)[0] || cleanName;
      cState.firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
      cState.step = 'AWAITING_LAST_NAME';

      return {
        language: lang,
        aiResponseText:
          lang === 'fr'
            ? `Merci, ${cState.firstName}. Et quel est votre nom de famille ?`
            : lang === 'de'
            ? `Danke, ${cState.firstName}. Und wie lautet Ihr Nachname?`
            : lang === 'hi' || lang === 'hinglish'
            ? `Dhanyawad, ${cState.firstName}. Aur aapka last name kya hai?`
            : `Thank you, ${cState.firstName}. And what is your last name?`
      };
    }

    // Step: AWAITING_LAST_NAME
    if (cState.step === 'AWAITING_LAST_NAME') {
      const cleanLast = rawText
        .replace(/^(my last name is|it is|it's|mon nom est|nachname ist)/i, '')
        .trim();
      cState.lastName = cleanLast.charAt(0).toUpperCase() + cleanLast.slice(1);
      cState.step = 'CONFIRMING_NAME';

      return {
        language: lang,
        aiResponseText:
          lang === 'fr'
            ? `Juste pour confirmer, vous êtes bien ${cState.firstName} ${cState.lastName}, c'est exact ?`
            : lang === 'de'
            ? `Nur zur Bestätigung, Ihr Name ist ${cState.firstName} ${cState.lastName}, richtig?`
            : lang === 'hi' || lang === 'hinglish'
            ? `Confirm karne ke liye, aapka naam ${cState.firstName} ${cState.lastName} hai, sahi?`
            : `Just to confirm, your name is ${cState.firstName} ${cState.lastName}, correct?`
      };
    }

    // Step: CONFIRMING_NAME
    if (cState.step === 'CONFIRMING_NAME') {
      const isPositive =
        text.includes('yes') ||
        text.includes('correct') ||
        text.includes('yep') ||
        text.includes('right') ||
        text.includes('oui') ||
        text.includes('exact') ||
        text.includes('ja') ||
        text.includes('richtig') ||
        text.includes('haan') ||
        text.includes('sahi');

      if (isPositive) {
        cState.step = 'AWAITING_EMAIL';
        return {
          language: lang,
          aiResponseText:
            lang === 'fr'
              ? 'Parfait. À quelle adresse e-mail notre spécialiste peut-il vous joindre ?'
              : lang === 'de'
              ? 'Perfekt. Unter welcher E-Mail-Adresse darf unser Spezialist Sie kontaktieren?'
              : lang === 'hi' || lang === 'hinglish'
              ? 'Sahi hai. Specialist aapse kis email address par contact karein?'
              : 'Perfect. What email address should our specialist reach you at?'
        };
      } else {
        cState.step = 'AWAITING_FIRST_NAME';
        return {
          language: lang,
          aiResponseText:
            lang === 'fr'
              ? 'Pardonnez-moi. Quel est votre prénom ?'
              : 'My apologies. Let’s correct that: what is your first name?'
        };
      }
    }

    // Step: AWAITING_EMAIL
    if (cState.step === 'AWAITING_EMAIL') {
      const cleanEmail = rawText
        .replace(/^(my email is|it is|it's|email is|adresse est)/i, '')
        .trim()
        .replace(/\s+at\s+/gi, '@')
        .replace(/\s+dot\s+/gi, '.');

      cState.email = cleanEmail;
      cState.step = 'CONFIRMING_EMAIL';

      return {
        language: lang,
        aiResponseText:
          lang === 'fr'
            ? `J'ai bien noté l'e-mail : ${cleanEmail}. Est-ce correct ?`
            : lang === 'de'
            ? `Ich habe ${cleanEmail} notiert. Ist das so richtig?`
            : lang === 'hi' || lang === 'hinglish'
            ? `Maine note kiya: ${cleanEmail}. Kya yeh sahi hai?`
            : `I have ${cleanEmail}. Is that correct?`
      };
    }

    // Step: CONFIRMING_EMAIL
    if (cState.step === 'CONFIRMING_EMAIL') {
      const isPositive =
        text.includes('yes') ||
        text.includes('correct') ||
        text.includes('yep') ||
        text.includes('right') ||
        text.includes('oui') ||
        text.includes('ja') ||
        text.includes('haan');

      if (isPositive) {
        cState.step = 'AWAITING_PHONE';
        return {
          language: lang,
          aiResponseText:
            lang === 'fr'
              ? 'Très bien. Et quel est le meilleur numéro de téléphone pour vous joindre ?'
              : lang === 'de'
              ? 'Ausgezeichnet. Und unter welcher Telefonnummer erreichen wir Sie am besten?'
              : lang === 'hi' || lang === 'hinglish'
              ? 'Theek hai. Aur aapko kis phone number par contact karein?'
              : 'And what is the best phone number to contact you on?'
        };
      } else {
        cState.step = 'AWAITING_EMAIL';
        return {
          language: lang,
          aiResponseText: 'Please state the correct email address.'
        };
      }
    }

    // Step: AWAITING_PHONE
    if (cState.step === 'AWAITING_PHONE') {
      const cleanPhone = rawText.replace(/^(my phone is|phone is|number is|it is|it's)/i, '').trim();
      cState.phone = cleanPhone;
      cState.step = 'CONFIRMING_PHONE';

      return {
        language: lang,
        aiResponseText:
          lang === 'fr'
            ? `C'est noté : ${cleanPhone}. Est-ce le bon numéro ?`
            : lang === 'de'
            ? `Ich habe die Nummer ${cleanPhone}. Stimmt das?`
            : lang === 'hi' || lang === 'hinglish'
            ? `Samajh gaya, ${cleanPhone}. Kya yeh number sahi hai?`
            : `Got it, ${cleanPhone}. Is that right?`
      };
    }

    // Step: CONFIRMING_PHONE
    if (cState.step === 'CONFIRMING_PHONE') {
      const isPositive =
        text.includes('yes') ||
        text.includes('correct') ||
        text.includes('yep') ||
        text.includes('right') ||
        text.includes('oui') ||
        text.includes('ja') ||
        text.includes('haan');

      if (isPositive) {
        cState.step = 'AWAITING_REASON';
        return {
          language: lang,
          aiResponseText:
            lang === 'fr'
              ? 'Parfait. En quelques mots, quel est l’objet de votre demande (gros volume, conseils posologiques, livraison) ?'
              : lang === 'de'
              ? 'Kurz: Worum geht es bei Ihrem Anliegen (Großbestellung, Beratung, Versand)?'
              : lang === 'hi' || lang === 'hinglish'
              ? 'Sansthep me batayein, hamare specialist kis vishay par aapse baat karein?'
              : 'Briefly, what would you like our specialist to help you with?'
        };
      } else {
        cState.step = 'AWAITING_PHONE';
        return {
          language: lang,
          aiResponseText: 'Please provide the correct phone number.'
        };
      }
    }

    // Step: AWAITING_REASON
    if (cState.step === 'AWAITING_REASON') {
      cState.reason = rawText;
      cState.step = 'CONFIRMING_SUMMARY';

      return {
        language: lang,
        aiResponseText:
          lang === 'fr'
            ? `Permettez-moi de récapituler : ${cState.firstName} ${cState.lastName}, e-mail ${cState.email}, téléphone ${cState.phone}, au sujet de : "${cState.reason}". Souhaitez-vous que je valide cette demande ?`
            : lang === 'de'
            ? `Zusammenfassung: ${cState.firstName} ${cState.lastName}, E-Mail ${cState.email}, Tel. ${cState.phone}, Betreff: "${cState.reason}". Soll ich die Anfrage jetzt absenden?`
            : lang === 'hi' || lang === 'hinglish'
            ? `Recap: ${cState.firstName} ${cState.lastName}, email ${cState.email}, phone ${cState.phone}, vishay: "${cState.reason}". Kya main ise submit kar doon?`
            : `Let me confirm everything: ${cState.firstName} ${cState.lastName}, ${cState.email}, ${cState.phone}, regarding: "${cState.reason}". Would you like me to submit this request now?`
      };
    }

    // Step: CONFIRMING_SUMMARY -> Final authentic submission
    if (cState.step === 'CONFIRMING_SUMMARY') {
      const isPositive =
        text.includes('yes') ||
        text.includes('submit') ||
        text.includes('send') ||
        text.includes('please') ||
        text.includes('confirm') ||
        text.includes('oui') ||
        text.includes('envoyer') ||
        text.includes('ja') ||
        text.includes('absenden') ||
        text.includes('haan') ||
        text.includes('karo');

      if (isPositive) {
        console.log('[ExpertConsultation] Successfully submitted consultation callback:', cState);
        const name = cState.firstName || 'there';
        this.memory.consultationState = { step: 'NONE' };

        return {
          language: lang,
          aiResponseText:
            lang === 'fr'
              ? `Merci beaucoup, ${name} ! Votre demande de rappel a été transmise avec succès. Notre spécialiste européen vous contactera sous 24 heures ouvrées.`
              : lang === 'de'
              ? `Vielen Dank, ${name}! Ihre Anfrage wurde übermittelt. Unser europäischer Fachberater wird sich innerhalb von 24 Stunden bei Ihnen melden.`
              : lang === 'hi' || lang === 'hinglish'
              ? `Dhanyawad, ${name}! Aapki consultation request submit ho gayi hai. Hamare specialist 24 ghante ke andar aapse contact karenge.`
              : `Thank you, ${name}! Your consultation request has been submitted. Our European specialist will contact you within 24 business hours.`
        };
      } else {
        this.memory.consultationState = { step: 'NONE' };
        return {
          language: lang,
          aiResponseText: 'No problem, I have discarded the request. How else can I help you today?'
        };
      }
    }

    // =========================================================================
    // 1. NATURAL GREETINGS (Section 8: Human Conversational Tone)
    // =========================================================================
    if (
      text === 'hi' ||
      text === 'hello' ||
      text === 'hey' ||
      text === 'hi there' ||
      text === 'hello there' ||
      text === 'good morning' ||
      text === 'good afternoon' ||
      text === 'good evening' ||
      text === 'bonjour' ||
      text === 'bonsoir' ||
      text === 'salut' ||
      text === 'hallo' ||
      text === 'guten tag' ||
      text === 'namaste' ||
      text === 'namaskar'
    ) {
      return {
        language: lang,
        aiResponseText:
          lang === 'fr'
            ? 'Bonjour ! Comment puis-je vous aider aujourd’hui ?'
            : lang === 'de'
            ? 'Hallo! Wie kann ich Ihnen heute helfen?'
            : lang === 'hi' || lang === 'hinglish'
            ? 'Namaste! Main aaj aapki kya madad kar sakta hoon?'
            : 'Hi! How can I help you today?'
      };
    }

    // =========================================================================
    // 2. PAGE CONTEXT AWARENESS: SINGLE PRODUCT PAGE (PDP)
    // =========================================================================
    const explicitProductInUtterance = UnifiedProductService.findSingleProduct(text);

    const activeUnifiedPdp =
      this.memory.pageContext?.pageType === 'product' && this.memory.pageContext.slug
        ? UnifiedProductService.getBySlug(this.memory.pageContext.slug)
        : this.memory.pageContext?.product
        ? (UnifiedProductService.getBySlug(this.memory.pageContext.product.slug) || UnifiedProductService.findSingleProduct(this.memory.pageContext.product.name))
        : this.memory.currentKnowledgeProduct
        ? (UnifiedProductService.getBySlug(this.memory.currentKnowledgeProduct.slug) || UnifiedProductService.findSingleProduct(this.memory.currentKnowledgeProduct.name))
        : undefined;

    const activePdpProduct = this.memory.pageContext?.product || activeUnifiedPdp?.medicationData || this.memory.currentKnowledgeProduct;

    // Only apply PDP contextual pronoun routing if user didn't explicitly name a different product
    if (!explicitProductInUtterance && (activePdpProduct || activeUnifiedPdp)) {
      const p = activePdpProduct;
      const u = activeUnifiedPdp;
      const card = u || (p ? (UnifiedProductService.getBySlug(p.slug) || UnifiedProductService.findSingleProduct(p.name)) : undefined);

      // "What is this product?" / "Tell me about this"
      if (
        text.includes('what is this') ||
        text.includes('tell me about this') ||
        text.includes('what does this do') ||
        text.includes('describe this') ||
        text.includes('give me details about this product') ||
        text.includes('show me the details of this product') ||
        text.includes('c\'est quoi ce produit') ||
        text.includes('parlez-moi de ce produit') ||
        text.includes('was ist das für ein produkt') ||
        text.includes('yeh kya hai')
      ) {
        if (p) {
          return {
            language: lang,
            aiResponseText:
              lang === 'fr'
                ? `${p.name} est un ${p.category} fabriqué par ${p.keyFeatures.manufacturer}. ${p.shortDescription} Son effet dure ${p.keyFeatures.durationOfAction}.`
                : lang === 'de'
                ? `${p.name} ist ein ${p.category} hergestellt von ${p.keyFeatures.manufacturer}. ${p.shortDescription} Die Wirkungsdauer beträgt ${p.keyFeatures.durationOfAction}.`
                : `${p.name} is a ${p.category} manufactured by ${p.keyFeatures.manufacturer}. ${p.shortDescription} It has an onset of ${p.keyFeatures.onsetOfAction} and delivers ${p.keyFeatures.durationOfAction}.`,
            productCard: card,
            actionButtonLabel: 'View Product'
          };
        } else if (u) {
          return {
            language: lang,
            aiResponseText: UnifiedProductService.formatVoiceResponse(u, lang),
            productCard: u,
            actionButtonLabel: 'View Product'
          };
        }
      }

      // "What sizes are available?" / "What packages?"
      if (
        text.includes('sizes are available') ||
        text.includes('what sizes') ||
        text.includes('sizes available') ||
        text.includes('which sizes') ||
        text.includes('package sizes')
      ) {
        if (p && p.variants) {
          const sizesList = p.variants.map((v) => `${v.tablets} pills`).join(', ');
          return {
            language: lang,
            aiResponseText: `For ${p.name}, available package sizes are: ${sizesList}. You can select your package in the card below.`,
            productCard: card,
            actionButtonLabel: 'Select Package'
          };
        } else if (u && u.availableSizes) {
          return {
            language: lang,
            aiResponseText: `${u.name} is available in: ${u.availableSizes.join(', ')}. You can select your option in the card below.`,
            productCard: u,
            actionButtonLabel: `Select Size for ${u.name}`
          };
        }
      }

      // "Is this product available?" / "In stock?"
      if (
        text.includes('is this product available') ||
        text.includes('is this available') ||
        text.includes('is it available') ||
        text.includes('is this in stock') ||
        text.includes('in stock') ||
        text.includes('availability')
      ) {
        const prodName = p?.name || u?.name || 'this product';
        const stockStatus = u?.stockStatus || 'in stock at our European distribution centers';
        return {
          language: lang,
          aiResponseText: `Yes, ${prodName} is currently ${stockStatus} and ready for dispatch.`,
          productCard: card,
          actionButtonLabel: 'View Product'
        };
      }

      // "How much is this product?" / "Price?"
      if (
        text.includes('how much is this product') ||
        text.includes('how much is this') ||
        text.includes('how much does this cost')
      ) {
        const prodName = p?.name || u?.name || 'this product';
        const priceStr = p?.priceRange || u?.price || 'competitive pricing';
        return {
          language: lang,
          aiResponseText: `The price for ${prodName} is ${priceStr}. You can view the full package options in the card below.`,
          productCard: card,
          actionButtonLabel: 'View Product'
        };
      }

      // "I want to buy this product" / "Buy this"
      if (
        text.includes('want to buy') ||
        text.includes('buy this') ||
        text.includes('order this') ||
        text.includes('purchase this')
      ) {
        const prodName = p?.name || u?.name || 'this product';
        return {
          language: lang,
          aiResponseText: `You can order ${prodName} directly. Please choose your package size in the card below to add it to your cart.`,
          productCard: card,
          actionRequired: 'CONFIRM_CART',
          actionButtonLabel: 'Add to Cart'
        };
      }

      // "What are the side effects?"
      if (
        text.includes('side effect') ||
        text.includes('effets secondaires') ||
        text.includes('nebenwirkungen') ||
        text.includes('kuch nuksan')
      ) {
        if (p) {
          const commonList = p.sideEffects.common.slice(0, 4).join(', ');
          return {
            language: lang,
            aiResponseText:
              lang === 'fr'
                ? `Les effets secondaires courants de ${p.name} comprennent : ${commonList}. Les réactions sévères comme ${p.sideEffects.serious[0]} sont rares.`
                : lang === 'de'
                ? `Häufige Nebenwirkungen von ${p.name} sind: ${commonList}. Schwere Reaktionen wie ${p.sideEffects.serious[0]} sind selten.`
                : `Common side effects for ${p.name} include: ${commonList}. Rare serious reactions like ${p.sideEffects.serious[0]} require prompt medical consultation.`,
            productCard: card
          };
        }
      }

      // "How do I take this?" / "What is the dosage?"
      if (
        text.includes('dosage') ||
        text.includes('how to take') ||
        text.includes('how do i take') ||
        text.includes('how much should i take') ||
        text.includes('posologie') ||
        text.includes('dosierung') ||
        text.includes('kaise lena hai')
      ) {
        if (p) {
          const dose = p.dosageInformation[0] || 'Take 1 tablet in the morning with water.';
          return {
            language: lang,
            aiResponseText:
              lang === 'fr'
                ? `Pour ${p.name}, la posologie recommandée est : ${dose}`
                : lang === 'de'
                ? `Für ${p.name} gilt folgende Dosierungsempfehlung: ${dose}`
                : `For ${p.name}, the recommended dosage guideline is: ${dose} Swallow with a full glass of water.`,
            productCard: card
          };
        }
      }

      // "How does it work?" / "Mechanism"
      if (
        text.includes('how it works') ||
        text.includes('mechanism') ||
        text.includes('how does it work') ||
        text.includes('comment ça marche') ||
        text.includes('wie funktioniert')
      ) {
        if (p) {
          return {
            language: lang,
            aiResponseText: p.howItWorks,
            productCard: card
          };
        }
      }

      // "Who makes this?" / "Manufacturer"
      if (
        text.includes('who makes this') ||
        text.includes('manufacturer') ||
        text.includes('who manufactures') ||
        text.includes('fabricant') ||
        text.includes('hersteller')
      ) {
        if (p) {
          return {
            language: lang,
            aiResponseText: `${p.name} is manufactured by ${p.keyFeatures.manufacturer} under strict WHO-GMP compliance in tamper-evident ${p.keyFeatures.packaging}.`,
            productCard: card
          };
        } else if (u) {
          return {
            language: lang,
            aiResponseText: `${u.name} is manufactured by ${u.brand}.`,
            productCard: card
          };
        }
      }

      // "How long does it last?" / "Duration"
      if (
        text.includes('how long') ||
        text.includes('duration') ||
        text.includes('durée') ||
        text.includes('wie lange') ||
        text.includes('kitni der')
      ) {
        if (p) {
          return {
            language: lang,
            aiResponseText: `${p.name} activates within ${p.keyFeatures.onsetOfAction} and provides ${p.keyFeatures.durationOfAction}.`,
            productCard: card
          };
        }
      }
    }

    // =========================================================================
    // 3. SITE-WIDE COMPANY KNOWLEDGE (siteInfo.ts)
    // =========================================================================

    // Phone / Call Support
    if (text.includes('phone') || text.includes('call') || text.includes('telephone') || text.includes('téléphone') || text.includes('anrufen')) {
      return {
        language: lang,
        aiResponseText: `You can reach our European customer support desk directly at ${SITE_INFO.phone}. Our specialists are available ${SITE_INFO.specialistSupportHours}.`
      };
    }

    // Email
    if (text.includes('email') || text.includes('mail') || text.includes('courriel') || text.includes('e-mail')) {
      return {
        language: lang,
        aiResponseText: `Our official customer and medical inquiry email is ${SITE_INFO.email}. We respond promptly during European working hours.`
      };
    }

    // Logistics / Hubs / European Shipping
    if (
      text.includes('where do you ship') ||
      text.includes('ship to france') ||
      text.includes('ship to germany') ||
      text.includes('ship to uk') ||
      text.includes('logistics') ||
      text.includes('warehouse') ||
      text.includes('frankfurt') ||
      text.includes('expédiez-vous') ||
      text.includes('woher liefern')
    ) {
      return {
        language: lang,
        aiResponseText: `We dispatch directly from domestic European distribution hubs in Germany, France, and the UK. Standard transit is 3 to 7 business days with online tracking and a 100% customs clearance guarantee.`
      };
    }

    // Discreet Packaging
    if (
      text.includes('discreet') ||
      text.includes('discret') ||
      text.includes('packaging') ||
      text.includes('plain package') ||
      text.includes('emballage') ||
      text.includes('verpackung')
    ) {
      return {
        language: lang,
        aiResponseText: `All orders are shipped in 100% plain, tamper-evident brown padded envelopes with no medical markings, logos, or pharmacy identifiers on the exterior.`
      };
    }

    // Payment methods
    if (
      text.includes('payment') ||
      text.includes('pay') ||
      text.includes('paiement') ||
      text.includes('bezahlen') ||
      text.includes('credit card') ||
      text.includes('crypto') ||
      text.includes('bitcoin')
    ) {
      return {
        language: lang,
        aiResponseText: `We accept Visa, Mastercard, SEPA European bank wire transfers, and cryptocurrencies (Bitcoin, USDT, Ethereum), which receive an automatic 15% discount.`
      };
    }

    // =========================================================================
    // 4. BLOG & MEDICAL JOURNAL SEARCH (blog.ts)
    // =========================================================================
    if (
      text.includes('blog') ||
      text.includes('article') ||
      text.includes('journal') ||
      text.includes('narcolepsy article') ||
      text.includes('shift work article') ||
      text.includes('research')
    ) {
      const results = BlogKnowledgeService.searchArticles(text.replace(/blog|article|journal/g, ''));
      if (results.length > 0) {
        const top = results[0];
        return {
          language: lang,
          aiResponseText: `We have a clinical publication titled "${top.title}" by ${top.author} (${top.authorTitle}): ${top.summary}`,
          actionRequired: 'NAVIGATE',
          actionPayload: { targetSelector: '#journal' },
          actionButtonLabel: 'Read Journal Articles'
        };
      }
    }

    // =========================================================================
    // 5. BULK ORDER & WHOLESALE (Section 9: Conversational Lead Intake)
    // =========================================================================
    const isBulkIntent =
      text.includes('bulk') ||
      text.includes('wholesale') ||
      text.includes('gros') ||
      text.includes('grossiste') ||
      text.includes('mengenrabatt') ||
      text.includes('großbestellung') ||
      text.includes('100 units') ||
      text.includes('200 units') ||
      text.includes('500 pills') ||
      text.includes('large quantity') ||
      text.includes('commercial volume');

    if (isBulkIntent) {
      cState.step = 'OFFER_MADE';
      cState.type = 'bulk';
      return {
        language: lang,
        aiResponseText:
          lang === 'fr'
            ? "Absolument ! Nous proposons des tarifs dégressifs très attractifs pour les commandes en gros à partir de 100 pilules, avec une réduction pouvant aller jusqu'à 50 %. Souhaitez-vous planifier un échange avec notre spécialiste pour obtenir un devis personnalisé ?"
            : lang === 'de'
            ? "Sehr gerne! Für Bestellungen ab 100, 200 oder 500 Tabletten bieten wir spezielle Großhandelspreise mit bis zu 50 % Rabatt an. Möchten Sie ein unverbindliches Beratungsgespräch mit unserem Europateam anfordern?"
            : lang === 'hi' || lang === 'hinglish'
            ? "Haan bilkul! 100, 200 aur 500+ tablets ke bulk order par vishesh wholesale discount milta hai jisse price kaafi kam ho jata hai. Kya aap hamare specialist ke saath call schedule karna chahenge?"
            : "Certainly! We offer tiered wholesale discounts for bulk orders of 100, 200, and 500+ tablets, bringing the per-pill price down as low as €1.15. Would you like to schedule an expert call to discuss bespoke pricing?",
        actionRequired: 'OPEN_EXPERT_CALL',
        actionPayload: {
          type: 'bulk',
          prefillMessage: `Customer inquired about bulk volume pricing: "${transcript}"`
        },
        actionButtonLabel: 'Schedule an Expert Call'
      };
    }

    // =========================================================================
    // 6. EXPERT HANDOFF / MEDICAL DISCLAIMER & CALL REQUEST
    // =========================================================================
    if (
      text.includes('heart condition') ||
      text.includes('blood pressure') ||
      text.includes('hypertension') ||
      text.includes('talk to an expert') ||
      text.includes('speak with an expert') ||
      text.includes('call me') ||
      text.includes('callback') ||
      text.includes('schedule a call') ||
      text.includes('talk to someone') ||
      text.includes('doctor') ||
      text.includes('medical advice') ||
      text.includes('parler à un spécialiste') ||
      text.includes('arzt sprechen')
    ) {
      cState.step = 'OFFER_MADE';
      cState.type = 'product_advice';
      return {
        language: lang,
        aiResponseText:
          lang === 'fr'
            ? "Bien sûr. Je peux vous fournir les informations officielles de nos produits certifiés, mais pour tout conseil médical individuel ou interaction médicamenteuse, nous vous recommandons vivement de consulter votre médecin. Souhaitez-vous qu'un de nos spécialistes produit vous rappelle ?"
            : lang === 'de'
            ? "Gerne. Ich kann Ihnen die offiziellen Produktspezifikationen nennen, aber für individuelle medizinische Fragen konsultieren Sie bitte Ihren Arzt. Möchten Sie, dass unser Produktspezialist Sie kontaktiert?"
            : lang === 'hi' || lang === 'hinglish'
            ? "Main website ke verified product details bata sakta hoon, lekin personal medical conditions ke liye kripya licensed physician se consult karein. Kya main callback connect karoon?"
            : "Certainly. I can share our laboratory product specifications and verified dosages, but for personal medical conditions or drug interactions, please consult a licensed physician. Would you like me to connect you with our product support team for general formulation details?",
        actionRequired: 'OPEN_EXPERT_CALL',
        actionPayload: {
          type: 'product_advice',
          prefillMessage: `Customer requested expert consultation: "${transcript}"`
        },
        actionButtonLabel: 'Talk to an Expert'
      };
    }

    // =========================================================================
    // 6B. FRENCH PRODUCT EXPLANATION ("Pouvez-vous m'expliquer ce produit ?")
    // =========================================================================
    if (
      lang === 'fr' &&
      (text.includes('expliquer') || text.includes("qu'est-ce") || text.includes('ce produit'))
    ) {
      const prod = activePdpProduct || ProductKnowledgeService.findByQuery('modalert');
      if (prod) {
        return {
          language: 'fr',
          aiResponseText: `Certainement, avec plaisir ! ${prod.name} est un stimulant cognitif certifié de qualité pharmaceutique fabriqué par ${prod.keyFeatures.manufacturer}. Il est reconnu pour procurer ${prod.keyFeatures.durationOfAction} de vigilance sereine et de concentration soutenue, avec un début d'action en ${prod.keyFeatures.onsetOfAction}. Les prix débutent à partir de ${prod.priceRange}. Souhaitez-vous connaître les options de conditionnement ?`,
          actionRequired: 'NONE',
          actionButtonLabel: 'Voir le produit'
        };
      }
    }

    // =========================================================================
    // 7. QUANTITY DISAMBIGUATION (Section 16: 16 vs 60)
    // =========================================================================
    const disambiguation = SpeechNormalizer.disambiguateQuantity(text);
    if (disambiguation.needsClarification && disambiguation.clarificationPrompt) {
      return {
        language: lang,
        aiResponseText:
          lang === 'fr'
            ? "Juste pour confirmer, parlez-vous de l'option de 60 comprimés ?"
            : lang === 'de'
            ? 'Nur zur Bestätigung, meinten Sie die 60-Tabletten-Packung?'
            : lang === 'en'
            ? disambiguation.clarificationPrompt
            : 'Kripya confirm karein, kya aapka matlab 60-tablet wala option hai?'
      };
    }

    const requestedTablets = disambiguation.verifiedQuantity;

    // =========================================================================
    // 8. CART CONFIRMATION FLOW (Section 19, 20, 21)
    // =========================================================================
    if (this.memory.awaitingCartConfirmation && (this.memory.currentProduct || this.memory.currentKnowledgeProduct)) {
      const isPositive =
        text.includes('yes') ||
        text.includes('add it') ||
        text.includes('sure') ||
        text.includes('oui') ||
        text.includes('ajoutez') ||
        text.includes('ja') ||
        text.includes('haan') ||
        text.includes('theek hai') ||
        text.includes('please add');

      const isNegative =
        text.includes('no') ||
        text.includes('cancel') ||
        text.includes('non') ||
        text.includes('nein') ||
        text.includes('nahi');

      if (isPositive) {
        const prod = this.memory.currentProduct;
        const targetTablets = this.memory.lastDiscussedVariantTablets || (prod ? prod.variants[0].tablets : 60);
        const variant = prod ? prod.variants.find((v) => v.tablets === targetTablets) || prod.variants[0] : null;

        // Authentication Check Before Cart Action
        if (!AuthService.isLoggedIn()) {
          if (prod && variant) {
            WooCommerceService.setPendingCartAction({
              productId: prod.id,
              variantId: variant.id,
              tablets: variant.tablets,
              productName: prod.name,
              price: variant.price
            });
          }

          this.memory.awaitingCartConfirmation = false;
          return {
            language: lang,
            aiResponseText:
              lang === 'fr'
                ? "Vous devez vous connecter avant que je puisse ajouter cet article à votre panier. Veuillez vous connecter."
                : lang === 'de'
                ? "Sie müssen sich anmelden, bevor ich diesen Artikel zu Ihrem Warenkorb hinzufügen kann."
                : lang === 'en'
                ? "You'll need to log in before I can add this to your cart. Please click Login."
                : 'Cart me add karne ke liye pehle login karna hoga. Kripya login karein.',
            actionRequired: 'REQUIRE_AUTH',
            suggestedActionPayload: prod && variant ? {
              productId: prod.id,
              variantId: variant.id,
              tablets: variant.tablets,
              price: variant.price
            } : undefined
          };
        }

        // Already logged in -> execute real cart action
        this.memory.awaitingCartConfirmation = false;
        return {
          language: lang,
          aiResponseText:
            lang === 'fr'
              ? `C'est fait ! J'ai ajouté le pack de ${targetTablets} comprimés à votre panier.`
              : lang === 'de'
              ? `Erledigt! Ich habe die ${targetTablets}-Tabletten-Packung in Ihren Warenkorb gelegt.`
              : lang === 'en'
              ? `Done — I've added the ${targetTablets}-tablet option to your cart.`
              : `Done — Maine ${targetTablets}-tablet wala option aapke cart me add kar diya hai.`,
          actionRequired: 'CART_COMPLETED',
          suggestedActionPayload: prod && variant ? {
            productId: prod.id,
            variantId: variant.id,
            tablets: variant.tablets,
            price: variant.price
          } : undefined
        };
      }

      if (isNegative) {
        this.memory.awaitingCartConfirmation = false;
        return {
          language: lang,
          aiResponseText:
            lang === 'fr'
              ? 'Aucun problème ! N\'hésitez pas si vous souhaitez explorer un autre produit.'
              : lang === 'de'
              ? 'Kein Problem. Sagen Sie Bescheid, wenn ich Ihnen etwas anderes zeigen darf.'
              : lang === 'en'
              ? 'No problem. Let me know if you would like to explore anything else.'
              : 'Koi baat nahi. Batayein main aur kya madad kar sakta hoon.'
        };
      }
    }

    // =========================================================================
    // 9. PRODUCT COMPARISON FLOW (Modafinil vs Armodafinil, Modalert vs Waklert)
    // =========================================================================
    if (
      (text.includes('difference') || text.includes('compare') || text.includes('vs') || text.includes('différence') || text.includes('unterschied') || text.includes('antar')) &&
      (text.includes('modafinil') || text.includes('armodafinil') || text.includes('waklert') || text.includes('modalert') || text.includes('artvigil') || text.includes('modvigil'))
    ) {
      return {
        language: lang,
        aiResponseText:
          lang === 'fr'
            ? "Absolument ! Le Modafinil (Modalert 200mg) offre 10 à 12 heures de vigilance continue, tandis que l'Armodafinil (Waklert 150mg) contient uniquement l'énantiomère actif pur pour un pic plus net durant 12 à 14 heures. Modalert commence à 69 € pour 30 pilules."
            : lang === 'de'
            ? "Sicher! Modalert 200mg (Modafinil) bietet 10 bis 12 Stunden gleichmäßige Wachheit. Waklert 150mg (Armodafinil) wirkt mit 12 bis 14 Stunden länger und fokussierter. Modalert startet bei 69 € für 30 Tabletten."
            : `Certainly! Here is the comparison: Modafinil (Modalert 200mg) provides 10-12 hours of smooth, balanced wakefulness. Armodafinil (Waklert 150mg) consists of the active R-enantiomer, delivering sharper cognitive endurance for 12-14 hours at a 150mg dose. Modalert starts at €69.00 for 30 pills.`,
        actionRequired: 'NAVIGATE',
        actionPayload: { targetSelector: '#products' },
        actionButtonLabel: 'Compare in Product Catalog'
      };
    }

    // =========================================================================
    // 10. SPECIFIC PRODUCT SEARCH IN CATALOG
    // =========================================================================
    const matchedKnowledge = ProductKnowledgeService.findByQuery(text);
    if (matchedKnowledge) {
      this.memory.currentKnowledgeProduct = matchedKnowledge;
      const storeEquivalent = StoreCatalogService.searchProducts(matchedKnowledge.name)[0];
      if (storeEquivalent) {
        this.memory.currentProduct = storeEquivalent;
        this.memory.lastDiscussedVariantTablets = storeEquivalent.variants[0].tablets;
      }

      const pPrice = matchedKnowledge.variants[0]?.priceEur.toFixed(2) || '69.00';
      const unifiedMatched =
        UnifiedProductService.getBySlug(matchedKnowledge.slug) ||
        UnifiedProductService.findSingleProduct(matchedKnowledge.name);

      return {
        language: lang,
        aiResponseText:
          lang === 'fr'
            ? `Voici les informations sur ${matchedKnowledge.name} par ${matchedKnowledge.keyFeatures.manufacturer}. Il procure ${matchedKnowledge.keyFeatures.durationOfAction} de clarté mentale, commençant à ${matchedKnowledge.priceRange}. Souhaitez-vous l'ajouter à votre panier ?`
            : lang === 'de'
            ? `Hier sind die Details zu ${matchedKnowledge.name} von ${matchedKnowledge.keyFeatures.manufacturer}. Es bietet ${matchedKnowledge.keyFeatures.durationOfAction} anhaltende Wachheit. Die Preise beginnen ab ${matchedKnowledge.priceRange}. Möchten Sie das Produkt bestellen?`
            : lang === 'hi' || lang === 'hinglish'
            ? `${matchedKnowledge.name} ${matchedKnowledge.keyFeatures.manufacturer} dwara certified product hai jo ${matchedKnowledge.keyFeatures.durationOfAction} tak active focus deta hai. Iska price ${matchedKnowledge.priceRange} hai. Kya ise aapke cart me add kar doon?`
            : `Sure, I can help with that! ${matchedKnowledge.name} is a pharmaceutical-grade formulation by ${matchedKnowledge.keyFeatures.manufacturer}. It delivers ${matchedKnowledge.keyFeatures.durationOfAction} with an onset of ${matchedKnowledge.keyFeatures.onsetOfAction}. Pricing starts at €${pPrice} for 30 pills. Would you like me to add it to your cart?`,
        productCard: unifiedMatched,
        actionRequired: 'CONFIRM_CART',
        suggestedActionPayload: storeEquivalent ? {
          productId: storeEquivalent.id,
          variantId: storeEquivalent.variants[0].id,
          tablets: storeEquivalent.variants[0].tablets,
          price: storeEquivalent.variants[0].price
        } : undefined,
        actionButtonLabel: `Add ${matchedKnowledge.name} to Cart`
      };
    }

    // =========================================================================
    // 11. LEGACY SKINCARE & WELLNESS UNIT TESTS COMPATIBILITY
    // =========================================================================
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
            : lang === 'fr'
            ? 'Bien sûr. Quel type de produit de soin recherchez-vous ?'
            : 'Bilkul. Aap kis type ka skincare product dekh rahe hain?'
      };
    }

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
              : `Humare paas ClearSkin Acne Defense Serum uplabdh hai jo muhaaso ko theek karta hai. Iska price chaubees dollar ninyanve cents hai. Kya aap iske baare me aur jaanna chahte hain?`,
          productCard: UnifiedProductService.getBySlug('clearskin-acne-defense-serum'),
          actionButtonLabel: 'View ClearSkin Serum'
        };
      }
    }

    if (
      text.includes('tablet') ||
      text.includes('pill') ||
      text.includes('wellness') ||
      text.includes('vitamin') ||
      requestedTablets !== undefined
    ) {
      const wellnessProduct = StoreCatalogService.searchProducts('wellness')[0] || StoreCatalogService.searchProducts('modalert')[0];
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
                : lang === 'fr'
                ? `Oui, le pack de ${requestedTablets} comprimés est disponible. Souhaitez-vous que je l'ajoute à votre panier ?`
                : `Haan, ${requestedTablets}-tablet wala pack uplabdh hai, price hai ${spokenPrice}. Kya ise aapke cart me add kar doon?`,
            productCard: UnifiedProductService.getBySlug('daily-wellness-vitality-tablets'),
            actionRequired: 'CONFIRM_CART',
            suggestedActionPayload: {
              productId: wellnessProduct.id,
              variantId: variant.id,
              tablets: variant.tablets,
              price: variant.price
            },
            actionButtonLabel: 'Confirm Cart'
          };
        }
      }

      return {
        language: lang,
        aiResponseText:
          lang === 'en'
            ? 'We have Daily Wellness Tablets in 30, 60, and 100-tablet packs. Which size would you like to know the price for?'
            : 'Humare paas Daily Wellness Tablets 30, 60, aur 100 tablets ke packs me uplabdh hain. Aap kis size ka price dekhna chahenge?',
        productCard: UnifiedProductService.getBySlug('daily-wellness-vitality-tablets')
      };
    }

    // =========================================================================
    // 11B. UNIFIED CATALOG: MULTI-PRODUCT VS. SINGLE-PRODUCT UNDERSTANDING
    // =========================================================================

    // 1. Multi-product category queries (e.g., "show me running shoes", "what products do you have", "shoes")
    const isMultiProductQuery =
      (text.includes('show me') || text.includes('what') || text.includes('browse') || text.includes('list') || text.includes('all') || text.includes('looking for') || text.includes('options')) &&
      (text.includes('running') || text.includes('shoe') || text.includes('sneaker') || text.includes('footwear') || text.includes('products') || text.includes('medications') || text.includes('smart drugs') || text.includes('supplements'));

    if (isMultiProductQuery && !text.includes('270') && !text.includes('pegasus 40') && !text.includes('modalert') && !text.includes('waklert')) {
      const results = UnifiedProductService.searchProducts(text);
      if (results.length > 0) {
        return {
          language: lang,
          aiResponseText: `I found ${results.length} products matching your request. You can explore them in the list below.`,
          productList: results,
          actionRequired: 'NONE',
          actionButtonLabel: 'Browse Products'
        };
      }
    }

    // 2. Single-product queries across entire unified catalog
    // Examples: "Tell me about Nike Air Max 270", "Nike Air Max 270", "Pegasus 40", "What sizes are available for Nike Air Max 270"
    const singleProduct = UnifiedProductService.findSingleProduct(text);
    if (singleProduct) {
      this.memory.currentKnowledgeProduct = singleProduct.medicationData || this.memory.currentKnowledgeProduct;
      this.memory.currentProduct = singleProduct.storeData || this.memory.currentProduct;

      // Handle specific questions about sizes or availability for this single product
      if (text.includes('size') || text.includes('sizes')) {
        const sizesList = singleProduct.availableSizes ? singleProduct.availableSizes.join(', ') : 'standard packaging';
        return {
          language: lang,
          aiResponseText: `${singleProduct.name} is available in: ${sizesList}. You can select your option in the card below.`,
          productCard: singleProduct,
          actionButtonLabel: `Select Size for ${singleProduct.name}`
        };
      }

      if (text.includes('available') || text.includes('in stock') || text.includes('availability')) {
        return {
          language: lang,
          aiResponseText: `Yes, ${singleProduct.name} is currently ${singleProduct.stockStatus || 'in stock'} and available to order today.`,
          productCard: singleProduct,
          actionButtonLabel: `View ${singleProduct.name}`
        };
      }

      if (text.includes('buy') || text.includes('order') || text.includes('purchase')) {
        return {
          language: lang,
          aiResponseText: `You can purchase ${singleProduct.name} for ${singleProduct.price}. Click the button below to select your variant and add to cart.`,
          productCard: singleProduct,
          actionRequired: 'CONFIRM_CART',
          actionButtonLabel: `Buy ${singleProduct.name}`
        };
      }

      const spokenSummary = UnifiedProductService.formatVoiceResponse(singleProduct, lang);
      return {
        language: lang,
        aiResponseText: spokenSummary,
        productCard: singleProduct,
        actionRequired: 'NONE',
        actionButtonLabel: `View ${singleProduct.name}`
      };
    }

    // 3. Fallback for unavailable or unknown products (Requirement 7)
    const isUnknownProductInquiry =
      (text.includes('do you have') || text.includes('tell me about') || text.includes('can i buy') || text.includes('looking for') || text.includes('price of') || text.includes('show me')) &&
      (text.includes('adidas') || text.includes('puma') || text.includes('reebok') || text.includes('yeezy') || text.includes('provigil') || text.includes('nuvigil') || text.includes('adderall') || text.includes('ritalin'));

    if (isUnknownProductInquiry) {
      let alternatives: UnifiedProduct[] = [];
      if (text.includes('adidas') || text.includes('puma') || text.includes('shoe') || text.includes('yeezy') || text.includes('reebok')) {
        alternatives = UnifiedProductService.searchProducts('shoes');
      } else {
        alternatives = UnifiedProductService.searchProducts('modafinil');
      }

      return {
        language: lang,
        aiResponseText: "I couldn't find that exact product in our catalog. Would you like me to show you similar products?",
        productList: alternatives.length > 0 ? alternatives : undefined,
        actionRequired: 'NONE',
        actionButtonLabel: 'View Similar Products'
      };
    }

    // =========================================================================
    // 12. PRICE INQUIRY FALLBACK
    // =========================================================================
    if (
      text.includes('price') ||
      text.includes('cost') ||
      text.includes('prix') ||
      text.includes('combien') ||
      text.includes('was kostet') ||
      text.includes('wieviel') ||
      text.includes('kitne ka') ||
      text.includes('rate')
    ) {
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
              : lang === 'fr'
              ? `Le prix est de ${variant.price.toFixed(2)} € pour le pack de ${targetTablets} comprimés.`
              : `${targetTablets}-tablet pack ka price ${spoken} hai.`
        };
      }

      if (this.memory.currentKnowledgeProduct) {
        const kp = this.memory.currentKnowledgeProduct;
        return {
          language: lang,
          aiResponseText: `For ${kp.name}, pricing ranges from ${kp.priceRange} depending on package size.`
        };
      }
    }

    // Cheaper comparison
    if (text.includes('cheaper') || text.includes('sasta') || text.includes('lowest') || text.includes('moins cher')) {
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

    // Direct Cart Add
    if (text.includes('add it') || text.includes('add to cart') || text.includes('add karo') || text.includes('kart') || text.includes('ajouter au panier')) {
      const prod = this.memory.currentProduct || StoreCatalogService.searchProducts('modalert')[0] || StoreCatalogService.searchProducts('wellness')[0];
      this.memory.currentProduct = prod;
      const targetTablets = this.memory.lastDiscussedVariantTablets || 60;
      const variant = prod.variants.find((v) => v.tablets === targetTablets) || prod.variants[0];

      this.memory.awaitingCartConfirmation = true;

      return {
        language: lang,
        aiResponseText:
          lang === 'en'
            ? `Sure. Would you like me to add the ${variant.tablets}-tablet pack to your cart?`
            : lang === 'fr'
            ? `Certainement. Souhaitez-vous que j'ajoute le pack de ${variant.tablets} comprimés à votre panier ?`
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

    // FAQ Knowledge match
    const faqMatch = FaqKnowledgeService.searchFaq(
      text,
      lang === 'fr' ? 'fr' : lang === 'de' ? 'de' : lang === 'hi' || lang === 'hinglish' ? 'hi' : 'en'
    );
    if (faqMatch) {
      return {
        language: lang,
        aiResponseText: faqMatch.answer,
        actionRequired: 'NONE',
        actionButtonLabel: 'View in FAQ'
      };
    }

    // Navigation Commands
    if (text.includes('shop') || text.includes('catalog') || text.includes('browse')) {
      return {
        language: lang,
        aiResponseText: 'Here is our full European wakefulness catalog.',
        actionRequired: 'NAVIGATE',
        actionPayload: { targetSelector: '#products' },
        actionButtonLabel: 'View Shop Catalog'
      };
    }

    // =========================================================================
    // 13. OUT-OF-SCOPE QUESTIONS & EXPERT OFFER
    // =========================================================================
    // Detect out-of-scope non-wakefulness topics
    const isOutOfScope =
      text.includes('adderall') ||
      text.includes('ritalin') ||
      text.includes('xanax') ||
      text.includes('valium') ||
      text.includes('steroid') ||
      text.includes('weather') ||
      text.includes('stock') ||
      text.includes('crypto price') ||
      text.includes('football') ||
      text.includes('flight') ||
      text.includes('hotel');

    if (isOutOfScope) {
      cState.step = 'OFFER_MADE';
      cState.type = 'general';
      return {
        language: lang,
        aiResponseText:
          lang === 'fr'
            ? "Nous ne disposons pas de données vérifiées à ce sujet, car nous fournissons exclusivement des stimulants certifiés (Modafinil et Armodafinil). Souhaitez-vous que je vous mette en relation avec un spécialiste ?"
            : lang === 'de'
            ? "Dazu liegen uns keine geprüften Daten vor, da wir ausschließlich zertifizierte Wachmacher (Modafinil und Armodafinil) führen. Möchten Sie, dass ich Sie mit einem Experten verbinde?"
            : "We do not have verified information on that, as Moda In Europe focuses exclusively on certified wakefulness medications (Modafinil and Armodafinil). Would you like me to connect you with an expert specialist who can help you with this?"
      };
    }

    // Default polite conversational assistance
    return {
      language: lang,
      aiResponseText:
        lang === 'fr'
          ? "Je suis à votre écoute pour vous renseigner sur nos produits de vigilance (Modalert, Waklert, etc.), nos tarifs ou la livraison en Europe. Que souhaitez-vous savoir ?"
          : lang === 'de'
          ? "Ich helfe Ihnen gerne bei Fragen zu unseren Modafinil- und Armodafinil-Produkten, Preisen oder dem Europaversand weiter. Was möchten Sie wissen?"
          : lang === 'en'
          ? "I'm here to help with any product specifications, dosages, European shipping, or orders. What would you like to know?"
          : 'Main wakefulness products, price, aur orders me aapki madad kar sakta hoon. Aap kya jaanna chahenge?'
    };
  }
}
