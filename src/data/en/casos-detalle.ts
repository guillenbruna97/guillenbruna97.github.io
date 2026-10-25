import { DETALLES, type DetalleCaso } from '../casos-detalle';

// Contenido de cada caso en inglés (2026-10-25). Imágenes, logos, vídeos y
// números de las comparativas salen del caso español; aquí solo van textos.
// Los casos los cuenta Guillén en primera persona, como en español.
type Textos = Pick<DetalleCaso, 'empresa' | 'cifras' | 'reto' | 'fases' | 'resultado'> & {
  comparativas?: string[];
  destacado?: { titulo: string; texto: string; imagenAlt?: string; galeria?: string[]; video?: string };
};

const EN: Record<string, Textos> = {
  'zebra-ventures': {
    empresa: 'A digital transformation company that brings artificial intelligence to SMEs.',
    cifras: [
      { valor: '2', etiqueta: 'business lines, each with its own message, brand and funnel' },
      { valor: '1', etiqueta: 'company event with a study on AI in Spanish SMEs' },
    ],
    reto: [
      'When I joined Zebra AI Transformation Company, its brand and its message in the market were not consolidated. There was a product and a clear ambition, but no precise definition of what Zebra did, for whom, and why its offer mattered.',
      'The challenge was not to run more marketing actions. We had to decide what Zebra stood for in the market, which type of customer it was really aimed at and how to communicate that value unmistakably. Without that foundation, any investment in communication would be less effective.',
    ],
    fases: [
      { titulo: 'Ideal customer and message diagnosis', texto: 'The first step was diagnosing Zebra’s real ideal customer profile, before touching any element of communication or design. Once it was clear who we served best, we rewrote the brand’s core message so it spoke directly to that audience’s needs.' },
      { titulo: 'Brand, website and channels', texto: 'With the message defined, we tackled the brand’s presence: a complete website redesign and a consistent image across every channel. A content strategy aimed at attracting that ideal customer, and a conversion funnel connecting brand visibility with the sales process.' },
      { titulo: 'A second business line from scratch', texto: 'I then led the launch of a second business line focused on artificial intelligence products. We defined a <strong>specific ideal customer</strong> for this offer, created its sales message, designed the sales process and its own funnel, and implemented an automated conversion system that works alongside the sales team.' },
      { titulo: 'Spain Innovation Summit', texto: 'To strengthen brand recognition and position Zebra as a reference, we organised the company’s own event, the Spain Innovation Summit. There we presented a <strong>study on the state of artificial intelligence in Spanish SMEs</strong> and a practical adoption guide adapted to each company’s level of digital maturity.' },
    ],
    resultado: 'Today Zebra AI Transformation Company operates with <strong>two distinct business lines</strong>. Each has its own message, brand identity and conversion systems: a clear structure on which to keep growing.',
    destacado: {
      titulo: 'Spain Innovation Summit',
      texto: 'Zebra’s own event, where the study on the state of artificial intelligence in Spanish SMEs and a practical adoption guide were presented.',
      imagenAlt: 'The Zebra AI Transformation Company team at the Spain Innovation Summit',
    },
  },
  integra: {
    empresa: 'A strategic management and business consultancy for SMEs, family businesses and mid-sized companies.',
    cifras: [
      { valor: '4-5', etiqueta: 'client companies served by the new line' },
      { valor: '1', etiqueta: 'digital services line still in its catalogue' },
    ],
    reto: [
      'Integra wanted to add a line of digital communication services to its value proposition, beyond traditional management consulting. That was the purpose of my role: to develop it and get it running.',
    ],
    fases: [
      { titulo: 'Its own digital presence', texto: 'The first step was building Integra’s digital presence from scratch, starting with its corporate website, so the consultancy had digital credibility before offering it to its clients.' },
      { titulo: 'Serving its clients', texto: 'From there I worked directly with <strong>4-5 of Integra’s client companies</strong> on digital strategy, communication planning, consulting and social media management. Each client had a different starting point, which required an individual diagnosis before any execution.' },
    ],
    resultado: 'The digital services line was not a temporary project: today it is a permanent part of Integra’s value proposition, with communication plans, social media and public relations in its official catalogue. The most valuable part was working in pure consulting, where the client is a general management team making decisions with real impact and the consultant has to earn their trust before any recommendation is heard.',
  },
  broco: {
    empresa: 'A sustainable urban fashion brand created from scratch by three friends in Zaragoza.',
    cifras: [
      { valor: '400-500', etiqueta: 'orders' },
      { valor: '5,000', etiqueta: 'followers built from scratch' },
      { valor: '€0', etiqueta: 'outside investment, up to break-even' },
    ],
    reto: [
      'Broco was born with no budget, no outside team and no instruction manual. The ambition was to become a distinctive national brand in sustainable urban fashion, with organic cotton as the product standard and a young, consistent visual line with character.',
      'The name came from merging “brother” with “co”, the nickname that defines the way people talk in Zaragoza, and the visual hero was broccoli: a deliberately bold symbol that broke with the seriousness of conventional fashion and anchored the sustainability message with a personality of its own.',
    ],
    fases: [
      { titulo: 'Everything built from scratch', texto: 'Everything Broco needed to exist had to be built: the business and feasibility plan, the complete visual identity, the brand narrative, the packaging, the product design, supplier negotiation, the eCommerce and the social media strategy. When orders came in, we packed and shipped them ourselves too.' },
      { titulo: 'Brand and business strategy', texto: 'I took on the brand strategy, the commercial decisions, the visual identity and the business architecture. I did not just design: I also thought about margins, positioning and how to build something that could scale.' },
    ],
    resultado: 'The result was real: <strong>400-500 orders</strong> and a community of <strong>5,000 followers</strong> built from scratch, with no outside investment, up to break-even. The project ended by a conscious decision: differences in commitment and vision between partners created a tension we chose to resolve before it affected what mattered most. It was one of the most honest lessons about leadership, roles and expectations, and it shapes how I work with teams and clients today.',
    destacado: {
      titulo: 'The brand',
      texto: 'Organic cotton T-shirts in soft colours, positive messages and an outdoor life: the identity we built for Broco, from the cap to the print.',
      galeria: [
        'Black cap with the Broco logo',
        'Mint green Broco T-shirt',
        'Blue Broco T-shirt with a print on the back',
        'Yellow Broco T-shirt with the message “kind people are my kinda people”',
      ],
    },
  },
  'muebles-rey': {
    empresa: 'A brand of Grupo Rey Corporación, one of the longest-established furniture retail groups in Spain.',
    cifras: [
      { valor: '25,000', etiqueta: 'followers, up from about 15,000' },
      { valor: '€20,000+', etiqueta: 'a month on Meta Ads, across Muebles Rey and Muebles Tuco' },
      { valor: '>1.5%', etiqueta: 'CTR on conversion campaigns' },
    ],
    reto: [
      'Muebles Rey is a national brand with years of history, and the group wanted to take its style and brand where it was aiming, with social media and paid media management up to date.',
    ],
    fases: [
      { titulo: 'Full social media management', texto: 'Strategy, editorial planning, production and community, with its own voice inside a group where I ended up running the digital communication of up to <strong>6 brands in parallel</strong>. In the group I also led more than 3 store opening events, coordinating the physical presence, the social media coverage and the follow-up.' },
      { titulo: 'Paid media run separately', texto: 'The Meta Ads campaigns for Muebles Rey and Muebles Tuco added up to more than <strong>€20,000 a month</strong>, segmented by brand, product and season: awareness campaigns with CPMs below the retail average, and conversion campaigns with a CTR above <strong>1.5%</strong> and positive ROAS on the main product lines.' },
      { titulo: 'A leading agency to raise the brand', texto: 'The brand needed more detailed and specialised attention than could be given entirely in-house. I identified the best communication agency, proposed it and brought it in, and we worked in a complementary way. It is still with the brand today.' },
      { titulo: 'Perspectivas, the brand’s video podcast', texto: 'Perspectivas had already been attempted with another agency without the expected result. We put it together with the production of the agency we brought in, aligned with Muebles Rey’s message, style and new identity, and ran the paid media campaigns to promote it ourselves.' },
    ],
    resultado: 'During my time, the Muebles Rey community grew from roughly <strong>15,000 to 25,000 followers</strong>, with more engagement and organic reach. And the agency we chose is still with the brand: the best decisions are the ones that keep working after you have gone.',
    comparativas: ['Muebles Rey followers'],
    destacado: {
      titulo: 'Perspectivas, the Muebles Rey video podcast',
      texto: 'Trailer of the brand’s video podcast: put together with the agency’s production and launched with our own paid media campaigns.',
      video: 'Trailer of Perspectivas, the Muebles Rey video podcast',
    },
  },
  'muebles-tuco': {
    empresa: 'A brand of Grupo Rey Corporación, one of the longest-established furniture retail groups in Spain.',
    cifras: [
      { valor: '35,000', etiqueta: 'followers, up from about 20,000' },
      { valor: '6', etiqueta: 'group brands, each with its own voice, in parallel' },
      { valor: '€20,000+', etiqueta: 'a month on Meta Ads, across Muebles Tuco and Muebles Rey' },
    ],
    reto: [
      'Muebles Tuco shared the stage with other brands in the same group. It needed to grow on social media with its own voice, one that would not be confused with <a href="/en/case-studies/muebles-rey/">Muebles Rey</a> or the rest.',
    ],
    fases: [
      { titulo: 'Full social media management', texto: 'Strategy, editorial planning, production and community. I ended up running the digital communication of up to <strong>6 group brands in parallel</strong>, including franchises, so each one needed a distinct identity and clear criteria so as not to be confused with the others.' },
      { titulo: 'Meta Ads', texto: 'The Meta Ads campaigns for Muebles Tuco and Muebles Rey added up to more than <strong>€20,000 a month</strong>, segmented by brand, product and season, with conversion campaigns above <strong>1.5%</strong> CTR and positive ROAS on the main product lines.' },
      { titulo: 'Opening workshop in Castellón', texto: 'For the opening of a new store in Castellón, I prepared and ran the opening workshop: a hands-on activity with customers in the store itself, decorating ceramic pieces around a table.' },
      { titulo: 'Brand spot', texto: 'I led the production of a spot for Muebles Tuco: creative idea, script, planning and coordination of the shoot, including proposing and hiring the band that stars in it, and final supervision to keep it consistent with the brand identity.' },
    ],
    resultado: 'During my time, the Muebles Tuco community grew from roughly <strong>20,000 to 35,000 followers</strong>, with more engagement and organic reach.',
    comparativas: ['Muebles Tuco followers'],
    destacado: {
      titulo: 'Muebles Tuco brand spot',
      texto: 'Live music, brand atmosphere and product, from idea to shoot.',
      video: 'Muebles Tuco brand spot',
    },
  },
  slm: {
    empresa: 'A brand of Grupo Rey Corporación, the same furniture retail group as Muebles Rey and Muebles Tuco.',
    cifras: [],
    reto: ['SLM, a brand from the same group, needed signage for several of its stores.'],
    fases: [
      { titulo: 'In-store signage', texto: 'As the group’s marketing team, we were in charge of developing the signage for several of its stores.' },
    ],
    resultado: 'Its own signage in several SLM stores, within the same group where I also ran <a href="/en/case-studies/muebles-rey/">Muebles Rey</a> and <a href="/en/case-studies/muebles-tuco/">Muebles Tuco</a>.',
  },
};

export const getDetalleEn = (slug: string): DetalleCaso => {
  const es = DETALLES[slug];
  const t = EN[slug];
  return {
    ...es,
    empresa: t.empresa,
    cifras: t.cifras,
    reto: t.reto,
    fases: t.fases,
    resultado: t.resultado,
    comparativas: es.comparativas?.map((c, i) => ({ ...c, etiqueta: t.comparativas?.[i] ?? c.etiqueta, unidad: 'followers' })),
    destacado: es.destacado && {
      ...es.destacado,
      titulo: t.destacado?.titulo ?? es.destacado.titulo,
      texto: t.destacado?.texto ?? es.destacado.texto,
      imagenAlt: t.destacado?.imagenAlt ?? es.destacado.imagenAlt,
      galeria: es.destacado.galeria?.map((g, i) => ({ ...g, alt: t.destacado?.galeria?.[i] ?? g.alt })),
      video: es.destacado.video && { ...es.destacado.video, titulo: t.destacado?.video ?? es.destacado.video.titulo },
    },
  };
};
