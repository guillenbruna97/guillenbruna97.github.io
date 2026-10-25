import { casos } from '../casos';

// Textos en inglés de las tarjetas de casos (2026-10-25). Mismo slug; imagen y
// áreas salen del caso español. Sin cifras nuevas.
const EN: Record<string, { role: string; sector: string; reto: string; capacidades: string; cardHighlight: string }> = {
  'zebra-ventures': {
    role: 'Head of Brand & Marketing',
    sector: 'Technology and AI, B2B',
    reto: 'Clarifying the message of an AI company and launching its second business line from scratch',
    capacidades: 'Brand strategy, Go-to-market, Web, Events',
    cardHighlight: 'Second business line launched from scratch, with its own ideal customer and funnel',
  },
  integra: {
    role: 'Consultant',
    sector: 'Consulting, B2B',
    reto: 'Turning a management consultancy into a digital services provider for its own clients',
    capacidades: 'Digital strategy, Social media, Web',
    cardHighlight: 'Service for 4-5 client companies, now a permanent part of its catalogue',
  },
  broco: {
    role: 'Founder',
    sector: 'Fashion, eCommerce, B2C',
    reto: 'Taking a fashion brand from idea to its first 400-500 orders with no outside investment',
    capacidades: 'Brand, Visual identity, eCommerce, Online advertising',
    cardHighlight: '400-500 orders and 5,000 followers built with no outside investment',
  },
  'muebles-rey': {
    role: 'Head of Social Media at Grupo Rey Corporación',
    sector: 'Furniture retail, B2C',
    reto: 'Taking Muebles Rey’s style and brand to the level the group was aiming for',
    capacidades: 'Social media, Meta Ads, Communication agency, Video podcast',
    cardHighlight: 'Community grown from 15,000 to 25,000 followers and an agency still with the brand years later',
  },
  'muebles-tuco': {
    role: 'Head of Social Media at Grupo Rey Corporación',
    sector: 'Furniture retail, B2C',
    reto: 'Growing Muebles Tuco’s community with its own voice inside a multi-brand group',
    capacidades: 'Social media, Meta Ads, Brand spot',
    cardHighlight: 'Community grown from 20,000 to 35,000 followers',
  },
  slm: {
    role: 'Grupo Rey Corporación marketing team',
    sector: 'Furniture retail, B2C',
    reto: 'Bringing SLM’s brand into its physical stores with its own signage',
    capacidades: 'Visual identity, Signage, Point of sale',
    cardHighlight: 'Signage developed for several of the brand’s stores',
  },
};

export const casosEn = casos.map((c) => ({ ...c, ...EN[c.slug] }));
