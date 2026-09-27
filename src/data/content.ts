/**
 * Educational Sleep & Wakefulness Resources for /content page
 * Factual guides on sleep-wake cycles, conditions, and nootropic pharmacology.
 */

export interface ContentSection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  sections: {
    heading: string;
    body: string;
    bulletPoints?: string[];
  }[];
}

export const EDUCATIONAL_CONTENT: ContentSection[] = [
  {
    id: 'wakefulness-overview',
    title: 'Understanding Modern Wakefulness Medications',
    subtitle: 'European Pharmacological Standards & Cognitive Wakefulness',
    description: 'A clinical primer on how wakefulness-promoting agents differ from traditional amphetamine stimulants, their neurochemical actions, and indications for daytime fatigue.',
    sections: [
      {
        heading: 'How Wakefulness Promoting Agents Differ from Stimulants',
        body: 'Unlike traditional psychostimulants (such as dextroamphetamine or methylphenidate), eugeroics like Modafinil and Armodafinil selectively modulate the wake-active circuitry of the hypothalamus without causing generalized sympathetic nervous system overactivation.',
        bulletPoints: [
          'No significant cardiovascular jitteriness or heart rate spikes under recommended dosing',
          'Absence of rapid rebound exhaustion or "crash" as the active medication clears',
          'Low affinity for peripheral adrenergic receptors, reducing physical tremors',
          'Selective activation of orexinergic and histaminergic arousal pathways'
        ]
      },
      {
        heading: 'Clinical Indications Under European Medical Supervision',
        body: 'Eugeroic medications are indicated across European clinical settings for three principal medical sleep conditions:',
        bulletPoints: [
          'Narcolepsy: Treating excessive daytime sleepiness with or without cataplexy',
          'Obstructive Sleep Apnea (OSA): Adjunct therapy for residual daytime fatigue when CPAP is already in use',
          'Shift Work Sleep Disorder (SWSD): Mitigating cognitive dips in night-shift and rotating-shift professionals'
        ]
      }
    ]
  },
  {
    id: 'sleep-health-guide',
    title: 'Circadian Biology and Restorative Sleep Hygiene',
    subtitle: 'Optimizing the 24-Hour Cycle',
    description: 'Actionable protocols for maintaining neurological alertness during the day while preserving the restorative slow-wave architecture of nocturnal sleep.',
    sections: [
      {
        heading: 'The Dual-Process Model of Sleep Regulation',
        body: 'Sleep and wakefulness are governed by two independent forces: Process C (the 24-hour circadian clock governed by light input to the suprachiasmatic nucleus) and Process S (the homeostatic sleep drive that accumulates adenosine with each hour of wakefulness).',
        bulletPoints: [
          'Morning light exposure (within 30 minutes of waking) sets the circadian timer for evening melatonin release',
          'Adenosine accumulation is temporarily blocked by eugeroics and caffeine, but metabolic clearance requires physical sleep',
          'Consistent wake times anchor circadian rhythms far more effectively than variable sleep times'
        ]
      },
      {
        heading: 'Safe Usage and Professional Consultation',
        body: 'Wakefulness agents should always be viewed as an adjunct to healthy sleep hygiene, not a permanent replacement for natural rest. Individuals with underlying cardiovascular conditions, uncontrolled hypertension, or those taking hormonal contraceptives must consult a physician prior to starting treatment.'
      }
    ]
  }
];

export class ContentKnowledgeService {
  public static getAll(): ContentSection[] {
    return EDUCATIONAL_CONTENT;
  }
}
