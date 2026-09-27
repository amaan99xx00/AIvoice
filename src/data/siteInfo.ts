/**
 * Verified Site Information for Moda In Europe (modaineurope.com)
 * Centralized source of truth for company background, contact details,
 * logistics facilities, operational hours, and European guarantees.
 */

export interface SiteInfo {
  companyName: string;
  tagline: string;
  websiteUrl: string;
  email: string;
  phone: string;
  headquarters: string;
  logisticsHubs: string;
  operatingHours: string;
  specialistSupportHours: string;
  establishedYear: number;
  mission: string;
  guarantees: {
    customs: string;
    packaging: string;
    authenticity: string;
    shippingTime: string;
  };
  acceptedPayments: string[];
}

export const SITE_INFO: SiteInfo = {
  companyName: 'Moda In Europe',
  tagline: 'Trusted Wakefulness Medication Across Europe',
  websiteUrl: 'https://modaineurope.com',
  email: 'Info@modaineurope.com',
  phone: '+1 (734) 274-6420',
  headquarters: 'European Operations Logistics Network',
  logisticsHubs: 'Domestic European dispatch facilities across the EU (including Germany, France, Poland) and the United Kingdom.',
  operatingHours: '24/7 Digital Concierge & Online Ordering',
  specialistSupportHours: 'Monday to Friday, 09:00 – 18:00 Central European Time (CET)',
  establishedYear: 2021,
  mission: 'To provide transparent, lab-certified access to genuine wakefulness medications (Modafinil and Armodafinil) with discreet European dispatch and 100% customs clearance guarantee.',
  guarantees: {
    customs: '100% European customs delivery guarantee with free reshipment or refund if held.',
    packaging: '100% plain, tamper-evident discreet brown padded envelopes with no medical markings.',
    authenticity: 'Direct manufacturer sourcing from WHO-GMP and ISO certified pharmaceutical labs.',
    shippingTime: 'Standard delivery in 3 to 7 business days with online tracking; express EU options available.'
  },
  acceptedPayments: [
    'Visa & Mastercard Credit/Debit Cards',
    'SEPA European Bank Wire Transfers',
    'Cryptocurrency (Bitcoin, USDT, Ethereum with an extra 15% discount)'
  ]
};

export class SiteInfoService {
  public static get(): SiteInfo {
    return SITE_INFO;
  }
}
