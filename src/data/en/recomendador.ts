import { OBJETIVO, RAMAS, COMUNES, DME, type Pregunta } from '../recomendador';

// Recomendador en inglés (2026-10-25): solo textos. Ids, ramas y puntos salen
// de data/recomendador.ts, así que el baremo es el mismo en los dos idiomas.
type Textos = { titulo: string; ayuda?: string; opciones: Record<string, [string, string]> };

const EN: Record<string, Textos> = {
  objetivo: {
    titulo: 'What do you want to achieve right now?',
    opciones: {
      visibilidad: ['Get known and get found', 'Show up when people search for what we do, and have the sector know who we are'],
      clientes: ['More leads and customers', 'Marketing that brings sales opportunities, not just visits'],
      marca: ['A brand that is understood and stands out', 'Explain what makes us different without competing on price alone'],
      web: ['A new website, or one that works', 'The website does not represent us, brings no leads or we cannot change it'],
      lanzar: ['Launch something', 'A product, a service, a new brand or an event'],
      ordenar: ['Put all our marketing in order', 'We do things but without direction, and I do not know where to start'],
    },
  },
  canales: {
    titulo: 'Which channels do you use today?',
    ayuda: 'Choose the one that best describes your situation.',
    opciones: {
      nada: ['Hardly any', 'We are starting practically from scratch'],
      redes: ['Social media', 'We post, but it does not show in the business'],
      anuncios: ['Ads', 'We invest in Google or Meta and do not know what return we get'],
      'web-seo': ['Website and Google', 'We have a website, but people barely find us'],
      varios: ['Several, without control', 'A bit of everything and nobody measuring it as a whole'],
    },
  },
  marca: {
    titulo: 'How would you describe your brand today?',
    opciones: {
      'no-hay': ['We do not really have a brand', 'A name and little else'],
      anticuada: ['It has become outdated', 'It no longer represents who we are today'],
      'no-se-entiende': ['People do not understand what we do', 'We struggle to explain it in one sentence'],
      'cada-uno': ['Everyone tells it their own way', 'Leadership, sales and the website all say different things'],
    },
  },
  'web-estado': {
    titulo: 'What is going on with your website?',
    opciones: {
      'no-hay': ['We do not have a website', 'Or it is a temporary page'],
      anticuada: ['It is outdated', 'It does not represent us and gives a bad impression'],
      'no-trae': ['It brings no leads', 'It is fine, but nobody reaches it or nobody writes'],
      'no-tocar': ['We cannot change it', 'We depend on someone for every change'],
    },
  },
  lanzamiento: {
    titulo: 'What are you going to launch?',
    opciones: {
      producto: ['A product or service', 'New, or for a new market'],
      marca: ['A new brand', 'A company, a business line or a rebrand'],
      evento: ['An event', 'A presentation, an activation or a corporate event'],
      'no-se': ['I am not sure yet', 'There is an idea that needs defining'],
    },
  },
  'quien-lleva': {
    titulo: 'Who runs marketing today?',
    opciones: {
      nadie: ['Nobody in particular', 'It gets done when there is time'],
      'a-ratos': ['Someone, part of the time', 'A person who also does other things'],
      equipo: ['A team without direction', 'They do a lot, but without a clear plan'],
      agencia: ['An agency', 'And we are not sure whether it works'],
    },
  },
  'web-vende': {
    titulo: 'Does your website help you sell today?',
    opciones: {
      'no-hay': ['We do not have a website', 'Or almost'],
      no: ['No', 'It is there, but it adds nothing'],
      regular: ['Somewhat', 'It helps a bit; we could get much more out of it'],
      si: ['Yes', 'It brings us leads'],
    },
  },
  ejecucion: {
    titulo: 'Who is going to do the work?',
    ayuda: 'This tells us whether you only need direction or also hands.',
    opciones: {
      nadie: ['We have nobody', 'We need someone to do it'],
      equipo: ['We have a team', 'But it lacks direction and criteria'],
      proveedores: ['We have an agency or suppliers', 'We need someone to decide and coordinate'],
    },
  },
  empresa: {
    titulo: 'What is your company like?',
    opciones: {
      b2b: ['We sell to other companies', 'B2B'],
      b2c: ['We sell to consumers', 'B2C, a shop or a service'],
      local: ['A local business', 'Customers in our area'],
      startup: ['A startup', 'A new product and the drive to grow fast'],
    },
  },
  plazo: {
    titulo: 'When do you need it?',
    opciones: {
      ya: ['As soon as possible', 'It is a priority now'],
      '3-meses': ['In the next 3 months', 'We are planning it'],
      explorando: ['I am exploring', 'I want to know what options there are'],
    },
  },
};

const traducir = (p: Pregunta): Pregunta => {
  const t = EN[p.id];
  return {
    ...p,
    titulo: t.titulo,
    ayuda: t.ayuda,
    opciones: p.opciones.map((o) => ({ ...o, titulo: t.opciones[o.id][0], texto: t.opciones[o.id][1] })),
  };
};

export const OBJETIVO_EN = traducir(OBJETIVO);
export const RAMAS_EN = Object.fromEntries(Object.entries(RAMAS).map(([k, p]) => [k, traducir(p)]));
export const COMUNES_EN = COMUNES.map(traducir);
export const DME_EN = {
  ...DME,
  nombre: 'Fractional CMO',
  texto: 'You need several things at once, and what you are missing most is someone to decide what comes first and coordinate the rest. Guillén Bruna leads your marketing part-time and the network’s specialists carry it out.',
};
