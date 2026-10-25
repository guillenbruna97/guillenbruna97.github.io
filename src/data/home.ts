// Textos de la home en los dos idiomas (2026-10-25). La estructura y los
// estilos están en components/Home.astro. El español es el original: la home
// está congelada (seo-geo/paginas-congeladas.md), no cambiar sin mirar allí.
export const HOME = {
  es: {
    seoTitle: 'GBT Consultoría, marketing y marca en Zaragoza | Guillén Bruna',
    seoDescription: 'Red de especialistas senior en marketing en Zaragoza, dirigida por Guillén Bruna: estrategia, marca, web, SEO y GEO, publicidad, redes y eventos. Un solo interlocutor.',
    h1: 'Todo tu marketing, de principio a fin, con un solo <span class="accent">responsable</span>.',
    desc: 'Somos una red de especialistas senior en estrategia, marca, web, posicionamiento, publicidad, redes y eventos, orquestada por Guillén Bruna. Tú hablas con una persona. Nosotros montamos el equipo que necesita tu proyecto.',
    llamada: 'Reservar llamada de 15 minutos',
    casos: 'Ver casos reales',
    logo: (m: string) => `Logo de ${m}`,
    manifiesto: 'Mientras una agencia vende lo que tiene en plantilla, nosotros montamos el equipo que necesita tu negocio',
    manifiesto1: 'No sumamos servicios sueltos. Llevamos tu marketing completo con una misma lógica: la estrategia decide y lo ejecutan los especialistas de nuestra red que mejor encajan con tu proyecto.',
    manifiesto2: 'Una sola persona coordina a todo el equipo y revisa cada entrega antes de que te llegue. Un interlocutor, una factura y ningún junior aprendiendo con tu presupuesto.',
    red: 'Cómo elegimos a la red',
    areas: 'Lo que hacemos por tu marketing',
    stats: [['Marcas gestionadas', 'en paralelo'], ['Casos reales', 'trabajados de principio a fin'], ['Años liderando', 'marketing y marca']],
    contactoTitulo: '¿Hablamos de tu marketing?',
    contactoTexto: 'Cuéntanos tu caso y en 5 días laborables tienes una propuesta cerrada.',
  },
  en: {
    seoTitle: 'GBT Consultoría, marketing and brand consultancy in Zaragoza',
    seoDescription: 'Senior marketing specialists in Zaragoza, Spain, led by Guillén Bruna: strategy, brand, web, SEO and GEO, ads, social media and events. One point of contact.',
    h1: 'All your marketing, from start to finish, with one person <span class="accent">accountable</span>.',
    desc: 'We are a network of senior specialists in strategy, brand, web, search, advertising, social media and events, orchestrated by Guillén Bruna. You talk to one person. We build the team your project needs.',
    llamada: 'Book a 15-minute call',
    casos: 'See case studies',
    logo: (m: string) => `${m} logo`,
    manifiesto: 'While an agency sells whatever it has on staff, we build the team your business needs',
    manifiesto1: 'We don’t bolt services together. We run your whole marketing with one logic: strategy decides, and the specialists in our network who best fit your project carry it out.',
    manifiesto2: 'One person coordinates the whole team and reviews every deliverable before it reaches you. One point of contact, one invoice and no juniors learning on your budget.',
    red: 'How we choose the network',
    areas: 'What we do for your marketing',
    stats: [['Brands managed', 'at the same time'], ['Real cases', 'handled from start to finish'], ['Years leading', 'marketing and brand']],
    contactoTitulo: 'Shall we talk about your marketing?',
    contactoTexto: 'Tell us about your case and within 5 working days you get a firm proposal.',
  },
};
