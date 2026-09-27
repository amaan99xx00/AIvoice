/**
 * Structured Medical Journal & Blog Articles for Moda In Europe
 * Educational publications covering sleep disorders, circadian neuroscience,
 * and cognitive performance management.
 */

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  publishDate: string;
  readTime: string;
  author: string;
  authorTitle: string;
  summary: string;
  content: string[];
  keyTakeaways: string[];
  tags: string[];
  image: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-narcolepsy-management',
    slug: 'narcolepsy-symptoms-causes-management',
    title: 'Narcolepsy: Symptoms, Causes, and Modern Management in Europe',
    category: 'Sleep Health',
    publishDate: 'September 18, 2026',
    readTime: '6 min read',
    author: 'Dr. Elena Rostova',
    authorTitle: 'Neurologist & Sleep Medicine Fellow',
    summary: 'An in-depth medical guide examining Type 1 and Type 2 narcolepsy, the neurobiological loss of orexin/hypocretin neurons, and non-amphetamine wakefulness interventions.',
    content: [
      'Narcolepsy is a chronic neurological condition that compromises the brain\'s capacity to regulate sleep-wake transitions. Affecting approximately 1 in 2,000 individuals across Europe, it is frequently underdiagnosed or mistaken for chronic depression or general fatigue.',
      'At its physiological root, Type 1 narcolepsy is characterized by the autoimmune depletion of hypocretin (orexin) producing neurons in the lateral hypothalamus. Without adequate hypocretin, the brain cannot maintain stable cortical arousal during daylight hours, resulting in sudden sleep attacks and muscle weakness known as cataplexy.',
      'Modern therapeutic management pairs behavioral interventions (scheduled short naps, strict circadian routines) with wakefulness-promoting agents like Modafinil, which selectively stimulate hypothalamic histamine and dopamine neurotransmission without cardiovascular overstimulation.'
    ],
    keyTakeaways: [
      'Narcolepsy is caused by an autoimmune deficiency in orexin neurotransmission.',
      'Symptoms include severe daytime sleepiness, cataplexy, sleep paralysis, and disrupted night sleep.',
      'First-line pharmacological intervention utilizes non-amphetamine wakefulness agents under medical guidance.'
    ],
    tags: ['Narcolepsy', 'Orexin', 'Sleep Disorders', 'Modafinil'],
    image: 'https://modaineurope.com/wp-content/uploads/2026/09/Discreet-Packaging-1.webp'
  },
  {
    id: 'blog-shift-work-sleep-disorder',
    slug: 'shift-work-sleep-disorder-coping-strategies',
    title: 'Shift Work Sleep Disorder (SWSD): Clinical Strategies for European Workers',
    category: 'Workplace Wellness',
    publishDate: 'September 10, 2026',
    readTime: '5 min read',
    author: 'Dr. Marcus Vance',
    authorTitle: 'Occupational Health Specialist',
    summary: 'Evidence-based advice for doctors, emergency personnel, pilots, and night-shift workers facing circadian rhythm misalignment and excessive daytime somnolence.',
    content: [
      'Over 20% of the European workforce participates in night or rotating shifts. When work hours conflict with the body\'s master circadian clock in the suprachiasmatic nucleus (SCN), Shift Work Sleep Disorder (SWSD) frequently develops.',
      'SWSD leads to both insomnia when attempting daytime sleep and severe alertness dips during active work hours. This mismatch increases occupational accident risks and suppresses natural melatonin rhythms.',
      'Effective management involves complete light shielding (blackout blinds, blue-blocker glasses on morning commutes), melatonin supplementation before day-sleep, and timed wakefulness medications taken 30-60 minutes before the start of a night shift.'
    ],
    keyTakeaways: [
      'SWSD stems from desynchronization between shift hours and the suprachiasmatic circadian pacemaker.',
      'Bright light exposure during the shift and complete darkness during post-shift sleep stabilizes rhythms.',
      'Wakefulness agents should be timed precisely 1 hour prior to active work shifts.'
    ],
    tags: ['Shift Work', 'Circadian Biology', 'Occupational Health', 'Night Shift'],
    image: 'https://modaineurope.com/wp-content/uploads/2026/09/Quality-products-1.webp'
  },
  {
    id: 'blog-modafinil-vs-armodafinil',
    slug: 'modafinil-vs-armodafinil-chemical-duration-comparison',
    title: 'Modafinil vs Armodafinil: Understanding the Chemical and Duration Differences',
    category: 'Pharmacology',
    publishDate: 'August 28, 2026',
    readTime: '7 min read',
    author: 'Dr. Sarah Jenkins',
    authorTitle: 'Clinical Pharmacologist',
    summary: 'A molecular breakdown of racemic Modafinil versus pure R-enantiomer Armodafinil, examining half-life differences, peak plasma concentrations, and dosage requirements.',
    content: [
      'While often grouped together as eugeroic smart medications, Modafinil and Armodafinil exhibit meaningful stereochemical differences. Modafinil is a racemic compound containing equal parts (50/50) of the S-enantiomer and the R-enantiomer.',
      'The S-enantiomer has a relatively brief half-life of 3 to 4 hours, whereas the R-enantiomer possesses a half-life of roughly 12 to 15 hours. Armodafinil (available as Waklert or Artvigil) consists solely of the isolated R-enantiomer.',
      'As a consequence, Armodafinil requires a lower dosage (150 mg compared to 200 mg of Modafinil) to produce equivalent or longer-lasting wakefulness. It maintains higher plasma concentrations late in the afternoon, making it preferable for extended 12+ hour concentration requirements.'
    ],
    keyTakeaways: [
      'Modafinil is racemic (S- and R-enantiomers); Armodafinil is pure R-enantiomer.',
      'Armodafinil offers longer plasma persistence (12-14 hours vs 10-12 hours).',
      'Standard clinical dosing is 150 mg for Armodafinil and 200 mg for Modafinil.'
    ],
    tags: ['Pharmacology', 'Modafinil', 'Armodafinil', 'Nootropics'],
    image: 'https://modaineurope.com/wp-content/uploads/2026/09/Authenticity-Guaranteed-1.webp'
  },
  {
    id: 'blog-sleep-hygiene-science',
    slug: 'sleep-hygiene-and-cognitive-performance',
    title: 'Sleep Hygiene and Cognitive Performance: The Science of Restful Nights',
    category: 'Cognitive Science',
    publishDate: 'August 14, 2026',
    readTime: '5 min read',
    author: 'Dr. Liam O\'Connor',
    authorTitle: 'Cognitive Neuroscientist',
    summary: 'Practical sleep architecture protocols: temperature regulation, adenosine clearance, caffeine half-life management, and optimizing slow-wave deep sleep.',
    content: [
      'High-performing professionals often seek wakefulness agents while neglecting foundational sleep architecture. True sustained focus requires synergizing daytime alertness with regenerative slow-wave and REM sleep.',
      'Adenosine builds up progressively throughout waking hours, creating homeostatic sleep pressure. While eugeroics and caffeine block adenosine receptors or stimulate wakefulness pathways, only quality sleep physically clears metabolic waste through the glymphatic system.',
      'Maintaining a bedroom temperature between 18°C and 19°C, eliminating artificial blue light 90 minutes before bed, and ceasing stimulants at least 8 to 10 hours prior to bedtime ensure optimal restorative rest.'
    ],
    keyTakeaways: [
      'The glymphatic system requires deep slow-wave sleep to clear neurological waste.',
      'Stimulant use must be scheduled to avoid interfering with evening sleep onset.',
      'Core body temperature drop of ~1°C is biologically essential for deep sleep initiation.'
    ],
    tags: ['Sleep Hygiene', 'Cognitive Stamina', 'Glymphatic System', 'Wellness'],
    image: 'https://modaineurope.com/wp-content/uploads/2026/09/Moda_Eup_Banner_MV.webp'
  }
];

export class BlogKnowledgeService {
  public static getAll(): BlogPost[] {
    return BLOG_POSTS;
  }

  public static getBySlug(slug: string): BlogPost | undefined {
    return BLOG_POSTS.find((b) => b.slug === slug);
  }

  public static getLatest(): BlogPost {
    return BLOG_POSTS[0];
  }

  public static searchBlog(query: string): BlogPost[] {
    const q = query.toLowerCase().trim();
    if (!q) return BLOG_POSTS;
    return BLOG_POSTS.filter((b) => {
      return (
        b.title.toLowerCase().includes(q) ||
        b.summary.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }

  public static searchArticles(query: string): BlogPost[] {
    return this.searchBlog(query);
  }
}
