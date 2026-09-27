/**
 * Structured Product Knowledge System for Moda In Europe (modaineurope.com)
 * Comprehensive, verified clinical data for all European wakefulness medications.
 * Exactly matches Section 5, 6, 29, and 31 of the master specification.
 */

export interface ProductVariantOption {
  id: string;
  tablets: number;
  priceEur: number;
  pricePerPill: number;
  inStock: boolean;
}

export interface KeyFeaturesSpecification {
  drugClass: string;
  chemicalClass: string;
  dosageForm: string;
  routeOfAdministration: string;
  packaging: string;
  packSize: string;
  strength: string;
  usedFor: string;
  onsetOfAction: string;
  durationOfAction: string;
  manufacturer: string;
  shelfLife: string;
  storage: string;
}

export interface ProductComposition {
  active: string;
  inactive: string;
}

export interface ProductSideEffects {
  common: string[];
  serious: string[];
}

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  category: 'Modafinil Tablet' | 'Armodafinil Tablet' | 'Sublingual Tablet';
  rating: number;
  reviewCount: number;
  featured: boolean;
  priceRange: string;
  images: string[];
  shortDescription: string;
  fullDescription: string;
  overview: string;
  howItWorks: string;
  keyFeatures: KeyFeaturesSpecification;
  composition: ProductComposition;
  uses: string[];
  dosageInformation: string[];
  sideEffects: ProductSideEffects;
  interactions: string[];
  precautions: string[];
  conclusion: string;
  faqs: { question: string; answer: string }[];
  relatedProducts: string[]; // slugs of related products
  variants: ProductVariantOption[];
}

export const PRODUCTS_CATALOG: ProductItem[] = [
  // 1. Modalert 100 mg
  {
    id: 'prod-modalert-100',
    slug: 'modalert-100mg',
    name: 'Modalert 100 mg',
    category: 'Modafinil Tablet',
    rating: 4.0,
    reviewCount: 38,
    featured: false,
    priceRange: '€69.00 – €449.00',
    images: [
      'https://modaineurope.com/wp-content/uploads/2026/02/Modalert-100-mg.webp',
      'https://modaineurope.com/wp-content/uploads/2026/02/Modalert-100-mg_2.webp',
      'https://modaineurope.com/wp-content/uploads/2026/02/Modalert-100-mg_3.webp'
    ],
    shortDescription: 'Modalert 100 mg is a calibrated Modafinil-based medication that helps promote wakefulness and improve focus without evening insomnia.',
    fullDescription: 'Modalert 100 mg provides a gentle, calibrated dosage of pharmaceutical-grade Modafinil manufactured by Sun Pharma. It is ideal for individuals who are sensitive to stimulants, first-time nootropic users, or those needing afternoon flexibility.',
    overview: 'Modalert 100 mg is manufactured by Sun Pharmaceuticals under strict GMP controls. It selectively modulates brain arousal neurotransmitters to counteract daytime sleepiness, cognitive fatigue, and lethargy.',
    howItWorks: 'Modafinil binds to and inhibits dopamine transporters (DAT), blocking dopamine reuptake in the synaptic cleft. It simultaneously activates hypothalamic orexin neurons and stimulates histamine release to elevate cortical vigilance without peripheral jitteriness.',
    keyFeatures: {
      drugClass: 'Wakefulness promoting agent (Eugeroic)',
      chemicalClass: 'Diphenylmethanes',
      dosageForm: 'Oral scored tablet',
      routeOfAdministration: 'Oral ingestion with water',
      packaging: 'Blister pack with security tamper foil',
      packSize: '10 tablets per blister strip (10x10 packaging)',
      strength: '100 mg pure Modafinil',
      usedFor: 'Narcolepsy, Shift Work Disorder, Obstructive Sleep Apnea, daytime fatigue',
      onsetOfAction: '30 to 60 minutes after ingestion',
      durationOfAction: '8 to 10 hours of active alertness',
      manufacturer: 'Sun Pharmaceuticals Industries Ltd.',
      shelfLife: '24 months from manufacturing date',
      storage: 'Store at room temperature between 20°C and 25°C (68°F – 77°F)'
    },
    composition: {
      active: 'Modafinil 100 mg (racemic mixture of R- and S-enantiomers)',
      inactive: 'Croscarmellose sodium, Povidone, Magnesium stearate, Pregelatinized starch, Lactose Monohydrate, Microcrystalline cellulose'
    },
    uses: [
      'Narcolepsy: Overcoming sudden sleep attacks and daytime sleep paralysis',
      'Obstructive Sleep Apnea (OSA): Adjunct wakefulness support alongside nighttime CPAP',
      'Shift Work Sleep Disorder (SWSD): Combating acute vigilance dips during night shifts',
      'Cognitive Stamina: Sustained attention and mental endurance in demanding work schedules'
    ],
    dosageInformation: [
      'Standard recommended adult dose: One 100 mg tablet once daily in the morning',
      'For shift work sleep disorder: Take approximately 1 hour before the start of the work shift',
      'Swallow the tablet whole with a full glass of water; can be taken with or without food',
      'Avoid late afternoon administration to prevent interference with nocturnal sleep',
      'Do not exceed 200 mg in a 24-hour window without consulting a physician'
    ],
    sideEffects: {
      common: ['Headache', 'Mild nausea', 'Nasal congestion', 'Transient nervousness', 'Dry mouth', 'Mild dyspepsia'],
      serious: ['Severe allergic reaction (DRESS)', 'Stevens-Johnson Syndrome (rare dermatological rash)', 'Palpitations', 'Chest discomfort']
    },
    interactions: [
      'Hormonal contraceptives (Modafinil induces CYP3A4, reducing contraceptive efficacy)',
      'Warfarin (coumarin anticoagulants require prothrombin monitoring)',
      'Phenytoin, Omeprazole, Diazepam, Propranolol, and MAO inhibitors'
    ],
    precautions: [
      'Do not use if allergic to Modafinil or Armodafinil compounds',
      'Consult a doctor if you have pre-existing cardiovascular conditions, hypertension, or arrhythmia',
      'Avoid alcohol consumption while taking this medication as it increases dehydration and dizziness',
      'Stay properly hydrated with water throughout the day'
    ],
    conclusion: 'Modalert 100 mg is a balanced, highly dependable wakefulness medication providing clean morning focus with a shorter duration that allows for natural evening rest.',
    faqs: [
      {
        question: 'What is the primary use of Modalert 100 mg?',
        answer: 'It is primarily used to manage excessive daytime sleepiness related to narcolepsy, shift work disorder, and obstructive sleep apnea.'
      },
      {
        question: 'Can I split a Modalert 100 mg tablet?',
        answer: 'Yes, Modalert tablets have a central score mark, allowing them to be divided into 50 mg micro-doses if required.'
      },
      {
        question: 'How quickly does Modalert 100 mg kick in?',
        answer: 'Initial cognitive onset begins within 30 to 60 minutes, with peak plasma levels achieved at approximately 2 hours.'
      }
    ],
    relatedProducts: ['modalert-200-mg', 'modvigil-100-mg', 'modvigil-md-200-mg'],
    variants: [
      { id: 'var-modalert100-30', tablets: 30, priceEur: 69.00, pricePerPill: 2.30, inStock: true },
      { id: 'var-modalert100-60', tablets: 60, priceEur: 109.00, pricePerPill: 1.82, inStock: true },
      { id: 'var-modalert100-100', tablets: 100, priceEur: 169.00, pricePerPill: 1.69, inStock: true },
      { id: 'var-modalert100-200', tablets: 200, priceEur: 249.00, pricePerPill: 1.25, inStock: true },
      { id: 'var-modalert100-300', tablets: 300, priceEur: 319.00, pricePerPill: 1.06, inStock: true },
      { id: 'var-modalert100-500', tablets: 500, priceEur: 449.00, pricePerPill: 0.90, inStock: true }
    ]
  },

  // 2. Modalert 200 mg
  {
    id: 'prod-modalert-200',
    slug: 'modalert-200-mg',
    name: 'Modalert 200 mg',
    category: 'Modafinil Tablet',
    rating: 5.0,
    reviewCount: 248,
    featured: true,
    priceRange: '€69.00 – €749.00',
    images: [
      'https://modaineurope.com/wp-content/uploads/2026/02/Modalert-200-mg.webp',
      'https://modaineurope.com/wp-content/uploads/2026/02/Modalert-200-mg_2.webp'
    ],
    shortDescription: 'The gold-standard pharmaceutical Modafinil by Sun Pharma, recognized globally for 10-12 hours of smooth, focused wakefulness.',
    fullDescription: 'Modalert 200 mg is the flagship formulation from Sun Pharma. Containing 200 mg of pure pharmaceutical Modafinil, it elevates histamine and dopamine pathways to ensure seamless daytime productivity for professionals, doctors, and students.',
    overview: 'As the most popular Modafinil brand globally, Modalert 200 mg delivers reliable cognitive vigilance without the peripheral jitteriness or cardiovascular crashes associated with amphetamines.',
    howItWorks: 'Modafinil selectively blocks the dopamine active transporter (DAT) to elevate extracellular dopamine. It concurrently stimulates hypothalamic orexin (hypocretin) pathways and cortical histamine, promoting alert wakefulness without neurochemical depletion.',
    keyFeatures: {
      drugClass: 'Wakefulness promoting agent (Eugeroic)',
      chemicalClass: 'Diphenylmethanes',
      dosageForm: 'Oral scored tablet',
      routeOfAdministration: 'Oral ingestion with water',
      packaging: 'Alu-Alu blister pack with Sun Pharma hologram',
      packSize: '10 tablets per blister strip (10x10 pack available)',
      strength: '200 mg pure Modafinil',
      usedFor: 'Narcolepsy, Sleep Apnea, Shift Work Sleep Disorder, Executive Focus',
      onsetOfAction: '30 to 60 minutes',
      durationOfAction: '10 to 12 hours of active alertness',
      manufacturer: 'Sun Pharmaceuticals Industries Ltd.',
      shelfLife: '36 months from manufacturing date',
      storage: 'Store below 25°C in a dry place protected from light'
    },
    composition: {
      active: 'Modafinil 200 mg',
      inactive: 'Lactose monohydrate, Microcrystalline cellulose, Pregelatinized starch, Croscarmellose sodium, Povidone K-30, Magnesium stearate'
    },
    uses: [
      'Excessive Daytime Sleepiness (EDS) associated with Narcolepsy',
      'Shift Work Sleep Disorder (SWSD)',
      'Adjunct wakefulness therapy for Obstructive Sleep Apnea (OSA)',
      'Sustained mental concentration across 10-12 hour workdays'
    ],
    dosageInformation: [
      'Standard adult dosage: One 200 mg tablet taken once daily in the morning',
      'For night shift workers: Take one tablet approximately 1 hour before beginning work',
      'May be taken with or without meals; high-fat foods may slightly delay onset by 30 minutes',
      'Do not exceed 200 mg daily unless explicitly directed by a physician'
    ],
    sideEffects: {
      common: ['Headache (most common, preventable by drinking water)', 'Mild nausea', 'Insomnia if taken late', 'Dry mouth'],
      serious: ['Hypersensitivity rash', 'Stevens-Johnson syndrome', 'Elevated blood pressure', 'Chest pain']
    },
    interactions: [
      'Steroidal contraceptives (decreases pill efficacy; secondary protection advised)',
      'CYP2C19 substrates such as Omeprazole and Diazepam',
      'Warfarin, Cyclosporine, Triazolam'
    ],
    precautions: [
      'Do not take within 8 hours of anticipated bedtime',
      'Maintain an intake of at least 2 liters of water daily',
      'Avoid high doses of supplemental caffeine to prevent mild restlessness'
    ],
    conclusion: 'Modalert 200 mg stands as Europe\'s benchmark wakefulness solution, balancing potent cognitive endurance with high pharmaceutical tolerability.',
    faqs: [
      {
        question: 'How long does Modalert 200 mg stay active in the body?',
        answer: 'The active elimination half-life is 12 to 15 hours, providing approximately 10 to 12 hours of peak wakefulness.'
      },
      {
        question: 'Is Modalert 200 mg identical to Provigil?',
        answer: 'Yes, both contain pure 200 mg Modafinil with identical bioequivalence and hypothalamic mechanism of action.'
      }
    ],
    relatedProducts: ['waklert-150mg', 'modvigil-200mg', 'modafil-md-200-mg'],
    variants: [
      { id: 'var-modalert200-30', tablets: 30, priceEur: 69.00, pricePerPill: 2.30, inStock: true },
      { id: 'var-modalert200-60', tablets: 60, priceEur: 119.00, pricePerPill: 1.98, inStock: true },
      { id: 'var-modalert200-100', tablets: 100, priceEur: 169.00, pricePerPill: 1.69, inStock: true },
      { id: 'var-modalert200-200', tablets: 200, priceEur: 289.00, pricePerPill: 1.45, inStock: true },
      { id: 'var-modalert200-300', tablets: 300, priceEur: 389.00, pricePerPill: 1.30, inStock: true },
      { id: 'var-modalert200-500', tablets: 500, priceEur: 599.00, pricePerPill: 1.20, inStock: true }
    ]
  },

  // 3. Modvigil 200 mg
  {
    id: 'prod-modvigil-200',
    slug: 'modvigil-200mg',
    name: 'Modvigil 200 mg',
    category: 'Modafinil Tablet',
    rating: 4.0,
    reviewCount: 112,
    featured: false,
    priceRange: '€85.00 – €449.00',
    images: [
      'https://modaineurope.com/wp-content/uploads/2026/02/Modvigil-200-mg.webp',
      'https://modaineurope.com/wp-content/uploads/2026/02/Modvigil-200-mg_2.webp'
    ],
    shortDescription: 'Certified Modafinil 200 mg by HAB Pharma offering clean, reliable cognitive stamina at exceptional European value.',
    fullDescription: 'Modvigil 200 mg is manufactured by HAB Pharmaceuticals in certified WHO-GMP laboratories. It delivers unadulterated Modafinil wakefulness with a reputation for smooth, predictable onset and minimal metabolic rebound.',
    overview: 'Designed for daily students, long-shift workers, and software engineers, Modvigil 200 mg offers the same active ingredient as Provigil at a cost-effective price point.',
    howItWorks: 'Inhibits dopamine reuptake while stimulating central hypocretin and histamine neurotransmission, ensuring steady cognitive functioning for 9 to 11 hours.',
    keyFeatures: {
      drugClass: 'Eugeroic (Wakefulness promoter)',
      chemicalClass: 'Diphenylmethanes',
      dosageForm: 'Oral scored tablet',
      routeOfAdministration: 'Oral',
      packaging: 'Sealed blister foil strips',
      packSize: '10 tablets per blister strip',
      strength: '200 mg Modafinil',
      usedFor: 'Daytime fatigue, Sleep Apnea, Shift work sleep disorder',
      onsetOfAction: '45 to 60 minutes',
      durationOfAction: '9 to 11 hours',
      manufacturer: 'HAB Pharmaceuticals & Research Ltd.',
      shelfLife: '36 months',
      storage: 'Store at 15°C – 25°C away from moisture'
    },
    composition: {
      active: 'Modafinil 200 mg',
      inactive: 'Microcrystalline cellulose, Lactose, Povidone, Talc, Magnesium stearate'
    },
    uses: [
      'Excessive daytime sleepiness from sleep disorders',
      'Sustained mental concentration during analytical tasks',
      'Fatigue reduction during irregular work shifts'
    ],
    dosageInformation: [
      'Take 1 tablet (200 mg) in the morning with a glass of water',
      'Can be split along score mark for a 100 mg dose',
      'Avoid evening consumption'
    ],
    sideEffects: {
      common: ['Mild headache', 'Dry mouth', 'Mild gastrointestinal discomfort'],
      serious: ['Allergic rash', 'Anxiety in predisposed individuals']
    },
    interactions: [
      'Oral contraceptives',
      'Enzyme inducers and inhibitors affecting CYP3A4'
    ],
    precautions: [
      'Ensure adequate hydration',
      'Consult a physician if you have cardiovascular history'
    ],
    conclusion: 'Modvigil 200 mg offers unbeatable price-to-potency ratio, making it the preferred daily workhorse Modafinil for European customers.',
    faqs: [
      {
        question: 'How does Modvigil compare to Modalert?',
        answer: 'Both contain 200 mg of Modafinil. Many users describe Modvigil as slightly smoother and less intense, with virtually identical wakefulness duration.'
      }
    ],
    relatedProducts: ['modalert-200-mg', 'modvigil-md-200-mg', 'artvigil-150mg'],
    variants: [
      { id: 'var-modvigil200-30', tablets: 30, priceEur: 69.00, pricePerPill: 2.30, inStock: true },
      { id: 'var-modvigil200-60', tablets: 60, priceEur: 109.00, pricePerPill: 1.82, inStock: true },
      { id: 'var-modvigil200-100', tablets: 100, priceEur: 155.00, pricePerPill: 1.55, inStock: true },
      { id: 'var-modvigil200-200', tablets: 200, priceEur: 249.00, pricePerPill: 1.25, inStock: true },
      { id: 'var-modvigil200-300', tablets: 300, priceEur: 319.00, pricePerPill: 1.06, inStock: true },
      { id: 'var-modvigil200-500', tablets: 500, priceEur: 449.00, pricePerPill: 0.90, inStock: true }
    ]
  },

  // 4. Modvigil 100 mg
  {
    id: 'prod-modvigil-100',
    slug: 'modvigil-100-mg',
    name: 'Modvigil 100 mg',
    category: 'Modafinil Tablet',
    rating: 4.0,
    reviewCount: 42,
    featured: false,
    priceRange: '€51.00 – €368.00',
    images: [
      'https://modaineurope.com/wp-content/uploads/2026/08/Modvigil-100mg-300x300.webp',
      'https://modaineurope.com/wp-content/uploads/2026/08/Modvigil-100mg.webp'
    ],
    shortDescription: 'Gentle 100 mg Modafinil starter strength by HAB Pharma for balanced cognitive clarity and easy evening sleep.',
    fullDescription: 'Modvigil 100 mg is specifically calibrated for first-time eugeroic users or lightweight individuals who require sustained attention without the full 12-hour commitment of a 200 mg dose.',
    overview: 'Manufactured by HAB Pharma under ISO standards, Modvigil 100 mg provides smooth daytime vigilance with lower incidence of initial mild headaches.',
    howItWorks: 'Moderates dopamine reuptake and raises hypothalamic orexin release, maintaining clear mental stamina across a 6 to 8-hour window.',
    keyFeatures: {
      drugClass: 'Wakefulness promoter',
      chemicalClass: 'Diphenylmethanes',
      dosageForm: 'Oral tablet',
      routeOfAdministration: 'Oral',
      packaging: 'Factory sealed foil strip',
      packSize: '10 tablets per strip',
      strength: '100 mg Modafinil',
      usedFor: 'Mild daytime lethargy, study sessions, beginner cognitive support',
      onsetOfAction: '30 to 45 minutes',
      durationOfAction: '6 to 8 hours',
      manufacturer: 'HAB Pharmaceuticals & Research Ltd.',
      shelfLife: '36 months',
      storage: 'Room temperature below 25°C'
    },
    composition: {
      active: 'Modafinil 100 mg',
      inactive: 'Lactose monohydrate, Povidone, Microcrystalline cellulose, Magnesium stearate'
    },
    uses: [
      'Mild shift work fatigue',
      'Focus enhancement for 6 to 8 hour academic sessions',
      'Gentle daytime wakefulness without sleep cycle disruption'
    ],
    dosageInformation: [
      'Take 1 tablet in the morning with breakfast and water',
      'Do not take within 6 hours of bedtime'
    ],
    sideEffects: {
      common: ['Mild headache', 'Dry mouth'],
      serious: ['Allergic reaction']
    },
    interactions: ['Hormonal birth control', 'Anticoagulants'],
    precautions: ['Stay well hydrated'],
    conclusion: 'An economical, gentle starter dose of certified Modafinil suitable for beginners and sensitive users.',
    faqs: [
      {
        question: 'Who should choose Modvigil 100 mg over 200 mg?',
        answer: 'First-time users, those who experience mild headaches on 200 mg, and anyone wanting to fall asleep earlier in the evening.'
      }
    ],
    relatedProducts: ['modalert-100mg', 'modvigil-200mg', 'modvigil-md-200-mg'],
    variants: [
      { id: 'var-modvigil100-30', tablets: 30, priceEur: 51.00, pricePerPill: 1.70, inStock: true },
      { id: 'var-modvigil100-60', tablets: 60, priceEur: 89.00, pricePerPill: 1.48, inStock: true },
      { id: 'var-modvigil100-100', tablets: 100, priceEur: 135.00, pricePerPill: 1.35, inStock: true },
      { id: 'var-modvigil100-200', tablets: 200, priceEur: 219.00, pricePerPill: 1.10, inStock: true },
      { id: 'var-modvigil100-300', tablets: 300, priceEur: 289.00, pricePerPill: 0.96, inStock: true },
      { id: 'var-modvigil100-500', tablets: 500, priceEur: 368.00, pricePerPill: 0.74, inStock: true }
    ]
  },

  // 5. Modvigil MD 200 mg (Sublingual)
  {
    id: 'prod-modvigil-md-200',
    slug: 'modvigil-md-200-mg',
    name: 'Modvigil MD 200 mg',
    category: 'Sublingual Tablet',
    rating: 5.0,
    reviewCount: 96,
    featured: true,
    priceRange: '€69.00 – €395.00',
    images: [
      'https://modaineurope.com/wp-content/uploads/2026/02/Modvigil-MD-200-mg-300x300.webp',
      'https://modaineurope.com/wp-content/uploads/2026/02/Modvigil-MD-200-mg.webp'
    ],
    shortDescription: 'Fast-acting sublingual orally disintegrating Modafinil 200 mg with crisp spearmint flavor for rapid 15-minute cognitive onset.',
    fullDescription: 'Modvigil MD 200 mg (Mouth Dissolving) utilizes an advanced sublingual delivery system engineered by HAB Pharma. By dissolving directly beneath the tongue, active Modafinil enters systemic circulation via the sublingual mucosa, bypassing primary hepatic first-pass metabolism.',
    overview: 'Ideal for those seeking immediate alertness without waiting for traditional digestive breakdown, Modvigil MD activates in just 15 to 20 minutes.',
    howItWorks: 'Direct mucosal absorption allows rapid plasma saturation of Modafinil, activating hypothalamic dopamine and orexin pathways with unmatched speed and superior bioavailability.',
    keyFeatures: {
      drugClass: 'Sublingual Eugeroic',
      chemicalClass: 'Diphenylmethanes',
      dosageForm: 'Mouth-dissolving sublingual tablet',
      routeOfAdministration: 'Sublingual (under the tongue) or chewable',
      packaging: 'Moisture-sealed blister foil',
      packSize: '10 tablets per strip',
      strength: '200 mg Modafinil',
      usedFor: 'Rapid wakefulness onset, cognitive focus, overcoming acute fatigue',
      onsetOfAction: '15 to 20 minutes',
      durationOfAction: '8 to 10 hours',
      manufacturer: 'HAB Pharmaceuticals & Research Ltd.',
      shelfLife: '24 months',
      storage: 'Keep strictly dry, store below 25°C'
    },
    composition: {
      active: 'Modafinil 200 mg',
      inactive: 'Spearmint flavoring, Mannitol, Crospovidone, Aspartame, Colloidal silicon dioxide, Magnesium stearate'
    },
    uses: [
      'Immediate cognitive alertness when waking up groggy',
      'Fast-acting shift work wakefulness support',
      'Ideal for individuals who have difficulty swallowing pills'
    ],
    dosageInformation: [
      'Place 1 tablet under the tongue and allow it to dissolve completely (approx. 60-90 seconds)',
      'No water is required for administration',
      'Take in the morning or 20 minutes before required focus'
    ],
    sideEffects: {
      common: ['Pleasant spearmint aftertaste', 'Mild headache if dehydrated', 'Transient dry mouth'],
      serious: ['Allergic reaction']
    },
    interactions: ['Hormonal contraceptives', 'CYP enzyme substrates'],
    precautions: ['Contains aspartame (caution for phenylketonurics)', 'Avoid taking late in the afternoon'],
    conclusion: 'Modvigil MD 200 mg is the fastest-acting Modafinil on the European market, delivering immediate wakefulness through modern sublingual delivery.',
    faqs: [
      {
        question: 'Do I need water to take Modvigil MD 200 mg?',
        answer: 'No. The tablet dissolves quickly on or under your tongue without any water needed.'
      },
      {
        question: 'Why does Modvigil MD work faster than standard Modalert?',
        answer: 'Because mucosal sublingual absorption directly enters the bloodstream, bypassing the digestive tract and liver first-pass metabolism.'
      }
    ],
    relatedProducts: ['modafil-md-200-mg', 'modalert-200-mg', 'modvigil-200mg'],
    variants: [
      { id: 'var-modvigilmd200-30', tablets: 30, priceEur: 69.00, pricePerPill: 2.30, inStock: true },
      { id: 'var-modvigilmd200-60', tablets: 60, priceEur: 115.00, pricePerPill: 1.92, inStock: true },
      { id: 'var-modvigilmd200-100', tablets: 100, priceEur: 165.00, pricePerPill: 1.65, inStock: true },
      { id: 'var-modvigilmd200-200', tablets: 200, priceEur: 269.00, pricePerPill: 1.35, inStock: true },
      { id: 'var-modvigilmd200-300', tablets: 300, priceEur: 339.00, pricePerPill: 1.13, inStock: true },
      { id: 'var-modvigilmd200-500', tablets: 500, priceEur: 395.00, pricePerPill: 0.79, inStock: true }
    ]
  },

  // 6. Waklert 150 mg (Flagship Armodafinil)
  {
    id: 'prod-waklert-150',
    slug: 'waklert-150mg',
    name: 'Waklert 150 mg',
    category: 'Armodafinil Tablet',
    rating: 5.0,
    reviewCount: 215,
    featured: true,
    priceRange: '€69.00 – €449.00',
    images: [
      'https://modaineurope.com/wp-content/uploads/2026/02/Waklert-150-mg.webp',
      'https://modaineurope.com/wp-content/uploads/2026/02/Waklert-150-mg_2.webp'
    ],
    shortDescription: 'Sun Pharma\'s premier purified R-enantiomer Armodafinil 150 mg, engineered for 12 to 14 hours of sharp, unwavering focus.',
    fullDescription: 'Waklert 150 mg contains the isolated, purified R-enantiomer of Modafinil (known chemically as Armodafinil). By eliminating the rapidly metabolized S-enantiomer, Waklert produces an extended peak plasma concentration that remains elevated late into the afternoon.',
    overview: 'Regarded by executives and developers as the sharpest wakefulness medication available, Waklert 150 mg requires a lower chemical dose than Modafinil while lasting substantially longer.',
    howItWorks: 'Armodafinil binds with higher functional affinity to dopamine reuptake transporters and exhibits a prolonged biological half-life of 15 hours, providing unwavering hypothalamic wakefulness without cognitive dips.',
    keyFeatures: {
      drugClass: 'Non-amphetamine Eugeroic (R-enantiomer)',
      chemicalClass: 'Diphenylmethanes',
      dosageForm: 'Oral scored tablet',
      routeOfAdministration: 'Oral ingestion with water',
      packaging: 'Sun Pharma Alu-Alu security blister',
      packSize: '10 tablets per blister strip',
      strength: '150 mg pure Armodafinil',
      usedFor: 'Prolonged cognitive concentration, Narcolepsy, Shift work sleep disorder',
      onsetOfAction: '45 to 60 minutes',
      durationOfAction: '12 to 14 hours of continuous stamina',
      manufacturer: 'Sun Pharmaceuticals Industries Ltd.',
      shelfLife: '36 months',
      storage: 'Store at 20°C – 25°C away from humidity'
    },
    composition: {
      active: 'Armodafinil 150 mg (pure R-enantiomer)',
      inactive: 'Lactose monohydrate, Microcrystalline cellulose, Pregelatinized starch, Croscarmellose sodium, Povidone, Magnesium stearate'
    },
    uses: [
      'Extended 12-14 hour complex cognitive sessions',
      'Narcolepsy and obstructive sleep apnea daytime lethargy',
      'Long-distance driving and demanding overnight work shifts'
    ],
    dosageInformation: [
      'Standard dose: One 150 mg tablet taken early in the morning with water',
      'Due to its 14-hour longevity, do not take after 10:00 AM to avoid evening insomnia',
      'Start with half a tablet (75 mg) if you are new to Armodafinil'
    ],
    sideEffects: {
      common: ['Headache (preventable with hydration)', 'Mild insomnia if taken late', 'Dry mouth', 'Mild loss of appetite'],
      serious: ['Severe cutaneous rash', 'Anxiety or elevated heart rate']
    },
    interactions: ['Steroidal contraceptives', 'Warfarin', 'CYP3A4/5 substrates'],
    precautions: [
      'Drink at least 2.5 liters of water throughout the day',
      'Avoid combining with high amounts of energy drinks or caffeine'
    ],
    conclusion: 'Waklert 150 mg provides the purest, longest-lasting cognitive endurance on the European market, lasting a full 12 to 14 hours.',
    faqs: [
      {
        question: 'What is the difference between Waklert 150 mg and Modalert 200 mg?',
        answer: 'Waklert contains only the active R-isomer (Armodafinil), making it stronger per milligram and lasting 12 to 14 hours compared to Modalert\'s 10 to 12 hours.'
      }
    ],
    relatedProducts: ['artvigil-150mg', 'modalert-200-mg', 'modaxl-200mg-modafinil'],
    variants: [
      { id: 'var-waklert150-30', tablets: 30, priceEur: 69.00, pricePerPill: 2.30, inStock: true },
      { id: 'var-waklert150-60', tablets: 60, priceEur: 119.00, pricePerPill: 1.98, inStock: true },
      { id: 'var-waklert150-100', tablets: 100, priceEur: 169.00, pricePerPill: 1.69, inStock: true },
      { id: 'var-waklert150-200', tablets: 200, priceEur: 289.00, pricePerPill: 1.45, inStock: true },
      { id: 'var-waklert150-300', tablets: 300, priceEur: 369.00, pricePerPill: 1.23, inStock: true },
      { id: 'var-waklert150-500', tablets: 500, priceEur: 449.00, pricePerPill: 0.90, inStock: true }
    ]
  },

  // 7. Artvigil 150 mg (Armodafinil)
  {
    id: 'prod-artvigil-150',
    slug: 'artvigil-150mg',
    name: 'Artvigil 150mg',
    category: 'Armodafinil Tablet',
    rating: 4.0,
    reviewCount: 164,
    featured: false,
    priceRange: '€89.00 – €419.00',
    images: [
      'https://modaineurope.com/wp-content/uploads/2026/02/Artvigil-150-mg.webp',
      'https://modaineurope.com/wp-content/uploads/2026/02/Artvigil-150-mg_2.webp'
    ],
    shortDescription: 'HAB Pharma\'s signature Armodafinil 150 mg, delivering smooth 11-13 hours of laser wakefulness with a balanced onset.',
    fullDescription: 'Artvigil 150 mg is produced by HAB Pharma as a refined alternative to Waklert. It features pure R-enantiomer Armodafinil with an optimized binder formulation that provides a smoother, more gradual onset of focus without peak intensity spikes.',
    overview: 'Widely praised by creative professionals, writers, and analysts, Artvigil delivers continuous clarity with a very mild transition back to baseline.',
    howItWorks: 'Elevates extracellular dopamine and hypothalamic orexin through selective R-enantiomer action, maintaining steady blood levels for up to 13 hours.',
    keyFeatures: {
      drugClass: 'Armodafinil Eugeroic',
      chemicalClass: 'Diphenylmethanes',
      dosageForm: 'Oral scored tablet',
      routeOfAdministration: 'Oral',
      packaging: 'Foil blister strip',
      packSize: '10 tablets per strip',
      strength: '150 mg Armodafinil',
      usedFor: 'Daytime fatigue, concentration, analytical stamina',
      onsetOfAction: '45 to 60 minutes',
      durationOfAction: '11 to 13 hours',
      manufacturer: 'HAB Pharmaceuticals & Research Ltd.',
      shelfLife: '36 months',
      storage: 'Room temperature below 25°C'
    },
    composition: {
      active: 'Armodafinil 150 mg',
      inactive: 'Microcrystalline cellulose, Lactose, Povidone, Magnesium stearate'
    },
    uses: [
      'All-day mental stamina for writing, coding, and research',
      'Narcolepsy and shift work sleep disruption',
      'Sustained mental stamina without jitteriness'
    ],
    dosageInformation: [
      'Take 1 tablet in the morning with a glass of water',
      'Avoid taking after midday'
    ],
    sideEffects: {
      common: ['Mild headache', 'Dry mouth', 'Slight appetite reduction'],
      serious: ['Severe rash', 'Palpitations']
    },
    interactions: ['Birth control pills', 'Anticoagulants'],
    precautions: ['Stay hydrated with water'],
    conclusion: 'Artvigil 150 mg provides smooth, balanced Armodafinil wakefulness that lasts 11 to 13 hours with zero jitteriness.',
    faqs: [
      {
        question: 'Is Artvigil weaker than Waklert?',
        answer: 'Both contain 150 mg of active Armodafinil. Artvigil has a slightly smoother, more gradual onset curve which many users find more comfortable.'
      }
    ],
    relatedProducts: ['waklert-150mg', 'modvigil-200mg', 'modalert-200-mg'],
    variants: [
      { id: 'var-artvigil150-30', tablets: 30, priceEur: 89.00, pricePerPill: 2.97, inStock: true },
      { id: 'var-artvigil150-60', tablets: 60, priceEur: 129.00, pricePerPill: 2.15, inStock: true },
      { id: 'var-artvigil150-100', tablets: 100, priceEur: 179.00, pricePerPill: 1.79, inStock: true },
      { id: 'var-artvigil150-200', tablets: 200, priceEur: 279.00, pricePerPill: 1.40, inStock: true },
      { id: 'var-artvigil150-300', tablets: 300, priceEur: 349.00, pricePerPill: 1.16, inStock: true },
      { id: 'var-artvigil150-500', tablets: 500, priceEur: 419.00, pricePerPill: 0.84, inStock: true }
    ]
  },

  // 8. Modafil MD 200 mg
  {
    id: 'prod-modafil-md-200',
    slug: 'modafil-md-200-mg',
    name: 'Modafil Md 200 mg',
    category: 'Sublingual Tablet',
    rating: 5.0,
    reviewCount: 88,
    featured: false,
    priceRange: '€70.00 – €749.00',
    images: [
      'https://modaineurope.com/wp-content/uploads/2026/02/Modafil-MD-200-mg.webp',
      'https://modaineurope.com/wp-content/uploads/2026/02/Modafil-MD-200-mg_2.webp'
    ],
    shortDescription: 'Fast-dissolving sublingual Modafinil 200 mg by INTAS / Signature with quick mucosal uptake and 8-10 hours of clean focus.',
    fullDescription: 'Modafil MD 200 mg is an advanced mouth-dissolving tablet designed for rapid systemic delivery. It dissolves on the tongue within 30 seconds, delivering rapid cognitive clarity with less stomach sensitivity.',
    overview: 'Produced under strict pharmaceutical standards, Modafil MD bypasses the GI tract, making it a favorite for individuals with sensitive digestion or pill dysphagia.',
    howItWorks: 'Sublingual mucosal absorption delivers active Modafinil straight into the bloodstream, reaching therapeutic peak levels in half the time of swallowed tablets.',
    keyFeatures: {
      drugClass: 'Sublingual Eugeroic',
      chemicalClass: 'Diphenylmethanes',
      dosageForm: 'Mouth-dissolving tablet',
      routeOfAdministration: 'Sublingual / Buccal',
      packaging: 'Hermetic blister strip',
      packSize: '10 tablets per strip',
      strength: '200 mg Modafinil',
      usedFor: 'Rapid wakefulness onset, cognitive endurance',
      onsetOfAction: '15 to 25 minutes',
      durationOfAction: '8 to 10 hours',
      manufacturer: 'INTAS / Signature Pharmaceuticals',
      shelfLife: '24 months',
      storage: 'Store dry below 25°C'
    },
    composition: {
      active: 'Modafinil 200 mg',
      inactive: 'Mint flavoring, Mannitol, Crospovidone, Microcrystalline cellulose'
    },
    uses: [
      'Fast morning wakefulness without waiting 60 minutes',
      'Emergency shift-work fatigue mitigation'
    ],
    dosageInformation: [
      'Place 1 tablet under the tongue until dissolved',
      'Take in the morning'
    ],
    sideEffects: {
      common: ['Dry mouth', 'Mild headache'],
      serious: ['Allergic reaction']
    },
    interactions: ['Hormonal contraceptives', 'CYP3A4 substrates'],
    precautions: ['Stay well hydrated'],
    conclusion: 'A top-tier sublingual Modafinil choice providing rapid cognitive activation and digestive comfort.',
    faqs: [
      {
        question: 'How fast does Modafil MD 200 mg dissolve?',
        answer: 'It dissolves completely in your mouth within 30 to 60 seconds.'
      }
    ],
    relatedProducts: ['modvigil-md-200-mg', 'modalert-200-mg'],
    variants: [
      { id: 'var-modafilmd200-30', tablets: 30, priceEur: 70.00, pricePerPill: 2.33, inStock: true },
      { id: 'var-modafilmd200-60', tablets: 60, priceEur: 125.00, pricePerPill: 2.08, inStock: true },
      { id: 'var-modafilmd200-100', tablets: 100, priceEur: 175.00, pricePerPill: 1.75, inStock: true },
      { id: 'var-modafilmd200-200', tablets: 200, priceEur: 295.00, pricePerPill: 1.48, inStock: true },
      { id: 'var-modafilmd200-500', tablets: 500, priceEur: 749.00, pricePerPill: 1.50, inStock: true }
    ]
  },

  // 9. Vilafinil 200 mg
  {
    id: 'prod-vilafinil-200',
    slug: 'vilafinil-200-mg',
    name: 'Vilafinil 200 mg',
    category: 'Modafinil Tablet',
    rating: 5.0,
    reviewCount: 92,
    featured: false,
    priceRange: '€69.00 – €449.00',
    images: [
      'https://modaineurope.com/wp-content/uploads/2026/02/Vilafinil-200-mg-300x300.webp',
      'https://modaineurope.com/wp-content/uploads/2026/02/Vilafinil-200-mg.webp'
    ],
    shortDescription: 'Centurion Laboratories certified Modafinil 200 mg offering powerful wakefulness support on an economical budget.',
    fullDescription: 'Vilafinil 200 mg is manufactured by Centurion Laboratories, a renowned Indian pharmaceutical exporter. It offers full 200 mg Modafinil potency with consistent batch quality, making it a favorite for long-term daily users looking for dependable value.',
    overview: 'Delivers full 200 mg Modafinil potency under strict ISO compliance, keeping European professionals and students alert throughout demanding work shifts.',
    howItWorks: 'Standard dopamine transporter inhibition and orexinergic hypothalamic stimulation for 9 to 11 hours of wakefulness.',
    keyFeatures: {
      drugClass: 'Wakefulness promoter',
      chemicalClass: 'Diphenylmethanes',
      dosageForm: 'Oral tablet',
      routeOfAdministration: 'Oral',
      packaging: 'Sealed blister foil',
      packSize: '10 tablets per strip',
      strength: '200 mg Modafinil',
      usedFor: 'Daytime alertness, Narcolepsy, Shift work',
      onsetOfAction: '45 to 60 minutes',
      durationOfAction: '9 to 11 hours',
      manufacturer: 'Centurion Laboratories',
      shelfLife: '36 months',
      storage: 'Room temperature below 25°C'
    },
    composition: {
      active: 'Modafinil 200 mg',
      inactive: 'Lactose, Povidone, Microcrystalline cellulose, Magnesium stearate'
    },
    uses: ['Daytime sleepiness', 'Focus and productivity support'],
    dosageInformation: ['Take 1 tablet in the morning with water'],
    sideEffects: {
      common: ['Headache', 'Dry mouth'],
      serious: ['Allergic reaction']
    },
    interactions: ['Hormonal contraceptives'],
    precautions: ['Stay hydrated'],
    conclusion: 'An exceptional value per pill for certified 200 mg Modafinil.',
    faqs: [
      {
        question: 'Is Vilafinil as strong as Modalert?',
        answer: 'Yes, both contain exactly 200 mg of pharmaceutical-grade Modafinil.'
      }
    ],
    relatedProducts: ['modalert-200-mg', 'modvigil-200mg'],
    variants: [
      { id: 'var-vilafinil-30', tablets: 30, priceEur: 69.00, pricePerPill: 2.30, inStock: true },
      { id: 'var-vilafinil-60', tablets: 60, priceEur: 109.00, pricePerPill: 1.82, inStock: true },
      { id: 'var-vilafinil-100', tablets: 100, priceEur: 155.00, pricePerPill: 1.55, inStock: true },
      { id: 'var-vilafinil-200', tablets: 200, priceEur: 249.00, pricePerPill: 1.25, inStock: true },
      { id: 'var-vilafinil-500', tablets: 500, priceEur: 449.00, pricePerPill: 0.90, inStock: true }
    ]
  },

  // 10. Modavinil 200 mg
  {
    id: 'prod-modavinil-200',
    slug: 'modavinil-200mg',
    name: 'Modavinil 200 mg',
    category: 'Modafinil Tablet',
    rating: 5.0,
    reviewCount: 74,
    featured: false,
    priceRange: '€69.00 – €449.00',
    images: [
      'https://modaineurope.com/wp-content/uploads/2026/02/Modavinil-200-mg_3-300x300.webp',
      'https://modaineurope.com/wp-content/uploads/2026/02/Modavinil-200-mg.webp'
    ],
    shortDescription: 'Signature Pharmaceuticals Modafinil 200 mg featuring enteric coating for smooth, gastro-friendly absorption.',
    fullDescription: 'Modavinil 200 mg is manufactured by Signature Pharmaceuticals. It is formulated with advanced enteric tablet coating to ensure gentle gastric passage and steady systemic release.',
    overview: 'Engineered specifically for individuals who experience mild digestive sensitivity from standard uncoated tablets.',
    howItWorks: 'Slow gastric dissolution ensures smooth plasma uptake of 200 mg Modafinil, stimulating central histamine and orexin pathways with minimal gastrointestinal disruption.',
    keyFeatures: {
      drugClass: 'Eugeroic',
      chemicalClass: 'Diphenylmethanes',
      dosageForm: 'Enteric coated oral tablet',
      routeOfAdministration: 'Oral',
      packaging: 'High-barrier blister foil',
      packSize: '10 tablets per strip',
      strength: '200 mg Modafinil',
      usedFor: 'Gastric-sensitive daytime wakefulness and focus',
      onsetOfAction: '40 to 60 minutes',
      durationOfAction: '10 to 12 hours',
      manufacturer: 'Signature Pharmaceuticals',
      shelfLife: '36 months',
      storage: 'Store in a cool dry place'
    },
    composition: {
      active: 'Modafinil 200 mg',
      inactive: 'Enteric coating polymers, Microcrystalline cellulose, Magnesium stearate'
    },
    uses: ['Daytime sleepiness management for sensitive stomachs', '10-12 hour focus'],
    dosageInformation: ['Swallow whole with water; do not crush enteric coated tablets'],
    sideEffects: {
      common: ['Headache if dehydrated', 'Dry mouth'],
      serious: ['Severe rash']
    },
    interactions: ['Birth control pills'],
    precautions: ['Do not crush or chew enteric coated tablets'],
    conclusion: 'A gastro-friendly, premium Modafinil option for clean, steady alertness.',
    faqs: [
      {
        question: 'Can I crush or split Modavinil 200 mg?',
        answer: 'No. Modavinil features an enteric coating designed to protect the stomach, so it should be swallowed whole.'
      }
    ],
    relatedProducts: ['modaxl-200mg-modafinil', 'modalert-200-mg'],
    variants: [
      { id: 'var-modavinil-30', tablets: 30, priceEur: 69.00, pricePerPill: 2.30, inStock: true },
      { id: 'var-modavinil-60', tablets: 60, priceEur: 115.00, pricePerPill: 1.92, inStock: true },
      { id: 'var-modavinil-100', tablets: 100, priceEur: 165.00, pricePerPill: 1.65, inStock: true },
      { id: 'var-modavinil-200', tablets: 200, priceEur: 269.00, pricePerPill: 1.35, inStock: true },
      { id: 'var-modavinil-500', tablets: 500, priceEur: 449.00, pricePerPill: 0.90, inStock: true }
    ]
  },

  // 11. ModaXL 200 mg
  {
    id: 'prod-modaxl-200',
    slug: 'modaxl-200mg-modafinil',
    name: 'Modaxl 200 mg',
    category: 'Modafinil Tablet',
    rating: 5.0,
    reviewCount: 65,
    featured: false,
    priceRange: '€129.00 – €779.00',
    images: [
      'https://modaineurope.com/wp-content/uploads/2026/02/ModaXL-200-mg.webp',
      'https://modaineurope.com/wp-content/uploads/2026/02/ModaXL-200-mg_2.webp'
    ],
    shortDescription: 'Signature Pharma\'s next-generation Modafinil 200 mg featuring enhanced bioavailability and 12-hour sustained release.',
    fullDescription: 'ModaXL 200 mg is an upgraded formulation incorporating specialized absorption promoters that increase Modafinil bioavailability by approximately 5%, ensuring a seamless 12-hour concentration plateau.',
    overview: 'The choice for experienced nootropic users seeking the most refined, plateau-sustained Modafinil experience available in Europe.',
    howItWorks: 'Enhanced bioavailability matrix delivers higher consistent free plasma Modafinil, providing uninterrupted hypothalamic alertness.',
    keyFeatures: {
      drugClass: 'Advanced Eugeroic',
      chemicalClass: 'Diphenylmethanes',
      dosageForm: 'Oral tablet',
      routeOfAdministration: 'Oral',
      packaging: 'Premium Alu-Alu strip',
      packSize: '10 tablets per strip',
      strength: '200 mg Modafinil with bioavailability matrix',
      usedFor: 'Elite professional focus, complex analytical endurance',
      onsetOfAction: '30 to 45 minutes',
      durationOfAction: '12 hours',
      manufacturer: 'Signature Pharmaceuticals',
      shelfLife: '36 months',
      storage: 'Room temperature below 25°C'
    },
    composition: {
      active: 'Modafinil 200 mg',
      inactive: 'Absorption enhancers, Microcrystalline cellulose, Magnesium stearate'
    },
    uses: ['12-hour uninterrupted cognitive endurance', 'Professional shift work'],
    dosageInformation: ['Take 1 tablet in the morning with water'],
    sideEffects: {
      common: ['Headache if dehydrated', 'Mild dry mouth'],
      serious: ['Allergic reaction']
    },
    interactions: ['Oral contraceptives', 'Warfarin'],
    precautions: ['Stay well hydrated with water'],
    conclusion: 'A next-generation Modafinil formulation designed for maximum biological absorption and stamina.',
    faqs: [
      {
        question: 'How is ModaXL different from Modalert?',
        answer: 'ModaXL contains a specialized excipient matrix that improves bioavailability and delivers a smoother 12-hour concentration plateau.'
      }
    ],
    relatedProducts: ['modalert-200-mg', 'waklert-150mg', 'modavinil-200mg'],
    variants: [
      { id: 'var-modaxl-30', tablets: 30, priceEur: 129.00, pricePerPill: 4.30, inStock: true },
      { id: 'var-modaxl-60', tablets: 60, priceEur: 199.00, pricePerPill: 3.32, inStock: true },
      { id: 'var-modaxl-100', tablets: 100, priceEur: 279.00, pricePerPill: 2.79, inStock: true },
      { id: 'var-modaxl-200', tablets: 200, priceEur: 449.00, pricePerPill: 2.25, inStock: true },
      { id: 'var-modaxl-500', tablets: 500, priceEur: 779.00, pricePerPill: 1.56, inStock: true }
    ]
  },

  // 12. Modafresh 200 mg
  {
    id: 'prod-modafresh-200',
    slug: 'modafresh-200-mg',
    name: 'Modafresh 200 mg',
    category: 'Modafinil Tablet',
    rating: 4.0,
    reviewCount: 51,
    featured: false,
    priceRange: '€69.00 – €449.00',
    images: [
      'https://modaineurope.com/wp-content/uploads/2026/02/Modafresh-200-mg.webp',
      'https://modaineurope.com/wp-content/uploads/2026/02/Modafresh-200-mg_2.webp'
    ],
    shortDescription: 'Sunrise Remedies certified Modafinil 200 mg for clean daytime alertness, fatigue resistance, and mental focus.',
    fullDescription: 'Modafresh 200 mg is manufactured by Sunrise Remedies under strict GMP certification. It offers reliable, batch-tested Modafinil wakefulness trusted across Europe.',
    overview: 'Delivers steady, dependable cognitive wakefulness for professionals, night-shift workers, and students.',
    howItWorks: 'Increases central dopamine and orexin neurotransmission for 9 to 11 hours of wakefulness.',
    keyFeatures: {
      drugClass: 'Eugeroic',
      chemicalClass: 'Diphenylmethanes',
      dosageForm: 'Oral tablet',
      routeOfAdministration: 'Oral',
      packaging: 'Sealed blister foil',
      packSize: '10 tablets per strip',
      strength: '200 mg Modafinil',
      usedFor: 'Daytime sleepiness, Narcolepsy, Shift work',
      onsetOfAction: '45 minutes',
      durationOfAction: '9 to 11 hours',
      manufacturer: 'Sunrise Remedies Pvt. Ltd.',
      shelfLife: '36 months',
      storage: 'Room temperature below 25°C'
    },
    composition: {
      active: 'Modafinil 200 mg',
      inactive: 'Lactose, Povidone, Microcrystalline cellulose, Magnesium stearate'
    },
    uses: ['Daytime fatigue', 'Shift work sleep disorder'],
    dosageInformation: ['Take 1 tablet in the morning with water'],
    sideEffects: {
      common: ['Headache', 'Dry mouth'],
      serious: ['Allergic rash']
    },
    interactions: ['Hormonal contraceptives'],
    precautions: ['Drink plenty of water'],
    conclusion: 'A solid, dependable 200 mg Modafinil option from Sunrise Remedies.',
    faqs: [
      {
        question: 'Who makes Modafresh 200 mg?',
        answer: 'It is manufactured by Sunrise Remedies Pvt. Ltd., an established GMP-certified pharmaceutical manufacturer.'
      }
    ],
    relatedProducts: ['modalert-200-mg', 'modvigil-200mg', 'vilafinil-200-mg'],
    variants: [
      { id: 'var-modafresh-30', tablets: 30, priceEur: 69.00, pricePerPill: 2.30, inStock: true },
      { id: 'var-modafresh-60', tablets: 60, priceEur: 109.00, pricePerPill: 1.82, inStock: true },
      { id: 'var-modafresh-100', tablets: 100, priceEur: 155.00, pricePerPill: 1.55, inStock: true },
      { id: 'var-modafresh-200', tablets: 200, priceEur: 249.00, pricePerPill: 1.25, inStock: true },
      { id: 'var-modafresh-500', tablets: 500, priceEur: 449.00, pricePerPill: 0.90, inStock: true }
    ]
  }
];

export class ProductKnowledgeService {
  public static getAll(): ProductItem[] {
    return PRODUCTS_CATALOG;
  }

  public static getBySlug(slug: string): ProductItem | undefined {
    const cleanSlug = slug.toLowerCase().trim().replace(/^\/|\/$/g, '').replace('product/', '');
    return PRODUCTS_CATALOG.find((p) => p.slug === cleanSlug);
  }

  public static getById(id: string): ProductItem | undefined {
    return PRODUCTS_CATALOG.find((p) => p.id === id);
  }

  public static findByQuery(query: string): ProductItem | undefined {
    const q = query.toLowerCase().trim();
    if (!q) return undefined;

    // 1. Exact slug or name match
    const exact = PRODUCTS_CATALOG.find(
      (p) => p.slug.toLowerCase() === q || p.name.toLowerCase() === q
    );
    if (exact) return exact;

    // 2. Specific strength token matching (e.g. 200mg vs 100mg, 150mg)
    const strengthMatch = q.match(/\b(100|150|200|250)\s*(?:mg)?\b/);
    if (strengthMatch) {
      const strengthNum = strengthMatch[1];
      const matchedWithStrength = PRODUCTS_CATALOG.find((p) => {
        const pNameLower = p.name.toLowerCase();
        const pSlugLower = p.slug.toLowerCase();
        const firstWord = pNameLower.split(' ')[0];
        const hasBrand = firstWord.length > 2 && q.includes(firstWord);
        const hasStrength = pNameLower.includes(strengthNum) || pSlugLower.includes(strengthNum);
        return hasBrand && hasStrength;
      });
      if (matchedWithStrength) return matchedWithStrength;
    }

    // 3. Normalized slug or full name match
    const cleanQ = q.replace(/[^a-z0-9]/g, '');
    const cleanMatch = PRODUCTS_CATALOG.find((p) => {
      const pCleanName = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const pCleanSlug = p.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
      return cleanQ.includes(pCleanName) || cleanQ.includes(pCleanSlug);
    });
    if (cleanMatch) return cleanMatch;

    // 4. Fallback to brand name matching
    return PRODUCTS_CATALOG.find((p) => {
      const matchSlug = p.slug.toLowerCase().includes(q) || q.includes(p.slug.toLowerCase());
      const firstWord = p.name.toLowerCase().split(' ')[0];
      const matchName = p.name.toLowerCase().includes(q) || (firstWord.length > 2 && q.includes(firstWord));
      return matchSlug || matchName;
    });
  }

  public static getRelated(slug: string): ProductItem[] {
    const prod = this.getBySlug(slug);
    if (!prod) return PRODUCTS_CATALOG.slice(0, 4);

    const related = prod.relatedProducts
      .map((relSlug) => this.getBySlug(relSlug))
      .filter((p): p is ProductItem => p !== undefined);

    if (related.length < 3) {
      const others = PRODUCTS_CATALOG.filter((p) => p.slug !== slug && !prod.relatedProducts.includes(p.slug));
      return [...related, ...others].slice(0, 4);
    }
    return related.slice(0, 4);
  }

  public static compareProducts(p1: ProductItem, p2: ProductItem): string {
    return `Comparison between ${p1.name} and ${p2.name}:
• Category: ${p1.name} is a ${p1.category}, whereas ${p2.name} is a ${p2.category}.
• Duration: ${p1.name} provides ${p1.keyFeatures.durationOfAction}, compared to ${p2.name} which lasts ${p2.keyFeatures.durationOfAction}.
• Onset: ${p1.name} activates in ${p1.keyFeatures.onsetOfAction}, while ${p2.name} activates in ${p2.keyFeatures.onsetOfAction}.
• Manufacturer: ${p1.name} is made by ${p1.keyFeatures.manufacturer}, and ${p2.name} is produced by ${p2.keyFeatures.manufacturer}.
• Starting Price: ${p1.name} starts at €${p1.variants[0].priceEur.toFixed(2)} for 30 pills, while ${p2.name} starts at €${p2.variants[0].priceEur.toFixed(2)} for 30 pills.`;
  }
}
