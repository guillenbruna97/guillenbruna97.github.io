// Las 6 áreas del catálogo de GBT Consultoría (decididas el 2026-10-22). Cada
// una vive en /servicios/<slug>/ con AreaLayout. Los 4 servicios de
// consultoría (SERVICES en consts.ts) siguen en sus URLs de siempre y cuelgan
// de «Estrategia y marca». Sin precios: todo va por propuesta.
//
// `seoTitle` es el título de la página (lleva « | GBT Consultoría» detrás) y
// usa el término que se busca con «Zaragoza» (autocompletado de Google
// España, 2026-10-22). `name` es el nombre que se ve en menús y tarjetas.

export interface AreaServicio {
  name: string;
  text: string;
  /** Página propia del servicio, si la tiene. */
  href?: string;
}

export interface AreaFaq {
  question: string;
  answer: string;
}

export interface Area {
  slug: string;
  name: string;
  seoTitle: string;
  description: string;
  tagline: string;
  intro: string;
  paraQuien: string;
  servicios: AreaServicio[];
  faqs: AreaFaq[];
}

const PROPUESTA = 'Tras una llamada de 15 minutos, en 5 días laborables recibes una propuesta con el alcance, el equipo, los plazos y el precio cerrado.';

export const AREAS: Area[] = [
  {
    slug: 'estrategia-y-marca',
    name: 'Estrategia y marca',
    seoTitle: 'Consultoría de marketing en Zaragoza',
    description: 'Consultoría de marketing y marca en Zaragoza: director de marketing externo, estrategia de marca, go to market, diagnóstico comercial e identidad visual.',
    tagline: 'A quién te diriges, qué te hace distinto y cómo lo cuentas, antes de invertir en canales.',
    intro: 'Antes de invertir en canales hay que saber a quién te diriges, qué te hace distinto y cómo lo cuentas. Definimos la estrategia contigo y, si quieres, la ejecutamos con nuestra red de especialistas.',
    paraQuien: 'Empresas medianas y B2B con un directivo que quiere ordenar su marketing. Porque van a lanzar algo, porque compiten solo por precio o porque invierten en marketing sin saber qué funciona.',
    servicios: [
      { name: 'Director de marketing externo', text: 'Dirección de marketing a tiempo parcial y mes a mes. Guillén Bruna marca el rumbo, coordina a la red y rinde cuentas ante la dirección.' },
      { name: 'Consultoría estratégica de marca', text: 'Posicionamiento, propuesta de valor y mensajes para que tu empresa se entienda a la primera.', href: '/servicios/posicionamiento/' },
      { name: 'Plan de marketing y go to market', text: 'Cliente ideal, canales, mensajes y calendario para lanzar o crecer con criterio.', href: '/servicios/gtm-icp/' },
      { name: 'Diagnóstico comercial', text: 'Dónde se pierden las ventas de tu proceso comercial, con datos de tu propio CRM.', href: '/servicios/pipeline/' },
      { name: 'Media training para directivos', text: 'Preparación de CEO, COO y CFO para hablar ante medios, consejos, inversores o en una crisis.', href: '/servicios/mentoria-comunicacion/' },
      { name: 'Identidad visual y rebranding', text: 'Logotipo, paleta, tipografía, manual de marca y aplicaciones, o la renovación de una marca que se ha quedado atrás.' },
    ],
    faqs: [
      { question: '¿Qué es un director de marketing externo?', answer: 'Un profesional senior, también llamado fractional CMO, que dirige tu marketing a tiempo parcial, sin incorporarlo a plantilla. Define la estrategia, prioriza, coordina a quien ejecuta y rinde cuentas ante la dirección. Encaja cuando necesitas dirección pero no un director a jornada completa.' },
      { question: '¿Cuánto cuesta una consultoría de marketing?', answer: `Depende del alcance: no cuesta lo mismo un diagnóstico de tres semanas que dirigir el marketing cada mes. ${PROPUESTA}` },
      { question: '¿Hacéis también el logotipo y la identidad visual?', answer: 'Sí. Los diseñadores de la red se encargan de la identidad visual, siempre a partir de la estrategia de marca, para que el diseño exprese algo ya decidido y no al revés.' },
      { question: '¿Y si después quiero que lo ejecute mi equipo?', answer: 'Sin problema. Los entregables están pensados para que tu equipo o tus proveedores los apliquen. Si lo prefieres, los ejecuta nuestra red.' },
    ],
  },
  {
    slug: 'diseno-web',
    name: 'Diseño y desarrollo web',
    seoTitle: 'Diseño web en Zaragoza para empresas',
    description: 'Diseño y desarrollo web en Zaragoza para empresas: webs corporativas con diseño UX/UI, landing pages, tiendas online y mantenimiento. Precio cerrado.',
    tagline: 'Webs que explican qué haces, convierten visitas en contactos y están listas para posicionar.',
    intro: 'Tu web es lo primero que revisa un cliente antes de llamarte. La diseñamos a partir de lo que tiene que conseguir, la construimos rápida y medible, y la dejamos lista para posicionar.',
    paraQuien: 'Empresas cuya web ya no explica lo que hacen, no trae contactos o no se puede tocar sin llamar a alguien.',
    servicios: [
      { name: 'Web corporativa', text: 'Arquitectura, diseño UX/UI y desarrollo de una web que explica qué haces y convierte visitas en contactos.' },
      { name: 'Landing pages', text: 'Páginas de campaña pensadas para una sola acción, con medición y pruebas A/B.' },
      { name: 'Tienda online', text: 'Catálogo, pago y envíos conectados para vender en internet sin complicarte.' },
      { name: 'Mantenimiento técnico', text: 'Actualizaciones, seguridad y cambios bajo petición. La web, el dominio y el alojamiento son siempre tuyos.' },
    ],
    faqs: [
      { question: '¿Cuánto cuesta una web para una empresa?', answer: `Depende del número de páginas, de las funcionalidades y de quién prepara los contenidos. ${PROPUESTA}` },
      { question: '¿La web será mía?', answer: 'Sí. El dominio, el alojamiento y los accesos están a tu nombre desde el primer día. Te recomendamos dónde y cómo contratarlos.' },
      { question: '¿La web incluye SEO?', answer: 'Toda web sale con la base técnica de SEO: velocidad, estructura, títulos y datos estructurados. El posicionamiento continuo es un servicio aparte, el de SEO y GEO.' },
      { question: '¿Os encargáis del mantenimiento?', answer: 'Solo si lo pides. Muchas empresas prefieren gestionar la web ellas mismas una vez entregada. Si quieres que nos ocupemos de las actualizaciones y los cambios, va como servicio mensual.' },
    ],
  },
  {
    slug: 'seo-geo',
    name: 'Posicionamiento SEO y GEO',
    seoTitle: 'Posicionamiento SEO y GEO en Zaragoza',
    description: 'Posicionamiento SEO y GEO en Zaragoza: aparece en Google y en las respuestas de ChatGPT y Gemini. Auditoría, SEO mensual, SEO local y ficha de Google.',
    tagline: 'Que te encuentren en Google y que ChatGPT y Gemini te citen cuando preguntan por lo que haces.',
    intro: 'Tus clientes te buscan en Google y, cada vez más, le preguntan a ChatGPT o a Gemini. Trabajamos para que aparezcas en los dos sitios, con contenido que responde a lo que de verdad buscan.',
    paraQuien: 'Empresas que dependen de que las encuentren. Las que no aparecen cuando alguien busca su servicio en su ciudad, o las que sí aparecían y han perdido tráfico.',
    servicios: [
      { name: 'Auditoría SEO y GEO', text: 'Estado técnico, contenidos, competencia y visibilidad en buscadores de IA, con un plan priorizado.' },
      { name: 'Posicionamiento SEO mensual', text: 'Palabras clave con datos, contenidos, mejoras técnicas y enlaces, con un informe cada mes.' },
      { name: 'Posicionamiento en ChatGPT y buscadores de IA', text: 'Que los asistentes de IA citen tu empresa cuando alguien pregunta por lo que haces.' },
      { name: 'SEO local y ficha de Google', text: 'Ficha de empresa, reseñas y presencia en Maps para las búsquedas de tu zona.' },
    ],
    faqs: [
      { question: '¿Qué es el GEO?', answer: 'GEO (generative engine optimization) es el trabajo para que los buscadores de IA, como ChatGPT, Gemini o Perplexity, citen tu empresa en sus respuestas. Se apoya en la misma base que el SEO, pero pide contenido más directo, datos verificables y presencia en las fuentes que esos sistemas consultan.' },
      { question: '¿Cuánto tarda en notarse el SEO?', answer: 'Los arreglos técnicos se notan en semanas. El contenido nuevo suele tardar varios meses en posicionar. Desconfía de quien te prometa la primera posición de Google en un plazo concreto.' },
      { question: '¿Cuánto cuesta el posicionamiento SEO?', answer: `Depende de tu punto de partida, de la competencia en tu sector y del contenido que haga falta. El SEO mensual va sin permanencia. ${PROPUESTA}` },
      { question: '¿Aplicáis el método en vuestra propia web?', answer: 'Sí. Esta web se trabaja igual: palabras clave con datos de Search Console, una rutina semanal de contenidos y medición de la visibilidad en buscadores de IA.' },
    ],
  },
  {
    slug: 'publicidad-online',
    name: 'Publicidad online',
    seoTitle: 'Google Ads y Meta Ads en Zaragoza',
    description: 'Gestión de campañas de Google Ads, Meta Ads y LinkedIn Ads en Zaragoza, con medición del coste por cliente. Auditoría de cuentas y gestión mensual.',
    tagline: 'Campañas en Google, Meta y LinkedIn, medidas por lo que cuesta cada cliente y no por los clics.',
    intro: 'La publicidad funciona cuando sabes a quién le hablas y qué pasa después del clic. Planificamos, lanzamos y optimizamos tus campañas en Google, Meta y LinkedIn, y medimos lo que te cuesta cada cliente.',
    paraQuien: 'Empresas que ya invierten en anuncios sin tener claro qué retorno les dan, y las que quieren empezar sin gastar el presupuesto en pruebas a ciegas.',
    servicios: [
      { name: 'Google Ads', text: 'Búsqueda, Performance Max y YouTube para llegar a quien ya busca lo que vendes.' },
      { name: 'Meta Ads', text: 'Campañas en Instagram y Facebook para generar demanda y vender.' },
      { name: 'LinkedIn Ads', text: 'Para llegar a decisores B2B por cargo, sector y tamaño de empresa.' },
      { name: 'Auditoría de cuentas publicitarias', text: 'Revisamos tus campañas actuales y te decimos dónde se va el presupuesto y qué cambiar.' },
    ],
    faqs: [
      { question: '¿Cuánto hay que invertir en publicidad?', answer: `Depende del sector, de la zona y del objetivo. En la propuesta separamos siempre la inversión en medios de la gestión, para que sepas qué va a cada sitio. ${PROPUESTA}` },
      { question: '¿Las cuentas publicitarias son mías?', answer: 'Sí. Las cuentas y sus datos están a tu nombre. Nosotros trabajamos con acceso de gestión, así que si un día dejamos de trabajar juntos, todo se queda contigo.' },
      { question: '¿Cómo medís los resultados?', answer: 'Con conversiones configuradas desde el principio, como llamadas, formularios o ventas, y un informe mensual con el coste por contacto o por venta. No solo clics e impresiones.' },
      { question: '¿Hay permanencia?', answer: 'No. La gestión de campañas va mes a mes. Si no funciona, lo verás en los informes antes que nadie.' },
    ],
  },
  {
    slug: 'redes-sociales',
    name: 'Redes sociales y contenido',
    seoTitle: 'Gestión de redes sociales en Zaragoza',
    description: 'Gestión de redes sociales para empresas en Zaragoza: estrategia, contenido, vídeo y LinkedIn para directivos, con la voz de tu marca y un calendario mensual.',
    tagline: 'Qué contar, para quién y con qué tono, producido y gestionado por especialistas.',
    intro: 'Publicar por publicar no construye marca. Definimos qué contar y para quién, y la red produce y gestiona el contenido con la voz de tu empresa.',
    paraQuien: 'Empresas con las redes abandonadas o que publican sin rumbo, y directivos que quieren que su sector los conozca.',
    servicios: [
      { name: 'Estrategia y gestión de redes sociales', text: 'Líneas editoriales, calendario, publicación y gestión de la comunidad.' },
      { name: 'Producción de vídeo y contenido', text: 'Vídeo corto, fotografía y piezas para redes, web y campañas.' },
      { name: 'LinkedIn para directivos y empresas', text: 'Perfil y contenido del directivo y de la página de empresa, para ganar autoridad en tu sector.' },
    ],
    faqs: [
      { question: '¿Cuánto cuesta la gestión de redes sociales?', answer: `Depende de cuántas redes, cuántas piezas al mes y si hace falta producción de vídeo o fotografía. ${PROPUESTA}` },
      { question: '¿Tengo que aprobar cada publicación?', answer: 'Al principio, sí. Trabajamos con un calendario mensual que apruebas antes de publicar. Con el tiempo puedes delegar la aprobación de lo rutinario.' },
      { question: '¿Qué redes gestionáis?', answer: 'Instagram, LinkedIn, TikTok, Facebook y YouTube. Te recomendamos solo las que tienen sentido para tu cliente, no todas.' },
      { question: '¿También hacéis la publicidad en redes?', answer: 'Sí, desde el área de publicidad online. Si llevamos las dos, el contenido y los anuncios se planifican juntos.' },
    ],
  },
  {
    slug: 'eventos',
    name: 'Eventos',
    seoTitle: 'Eventos corporativos en Zaragoza',
    description: 'Organización de eventos corporativos, lanzamientos y activaciones de marca en Zaragoza y donde los necesites, del concepto a la producción.',
    tagline: 'Lanzamientos, activaciones y eventos corporativos, del concepto a la producción.',
    intro: 'Un evento bien hecho concentra en un día lo que una marca tarda meses en construir. Diseñamos el concepto contigo y la red se encarga de la producción, de principio a fin.',
    paraQuien: 'Empresas que lanzan algo, celebran un hito o quieren reunir a su sector alrededor de su marca.',
    servicios: [
      { name: 'Lanzamientos y presentaciones', text: 'Presentación de un producto, una marca o una empresa ante clientes, prensa o socios.' },
      { name: 'Activaciones de marca', text: 'Experiencias en punto de venta, ferias o espacios públicos para que tu marca se viva.' },
      { name: 'Eventos corporativos', text: 'Congresos, jornadas, aniversarios y encuentros de empresa.' },
    ],
    faqs: [
      { question: '¿Qué incluye la organización de un evento?', answer: 'Concepto, espacio, producción, proveedores, comunicación antes y después, y coordinación el día del evento. Lo que no necesites, no entra.' },
      { question: '¿Cuánto cuesta organizar un evento?', answer: `Depende del aforo, del espacio y de la producción. ${PROPUESTA}` },
      { question: '¿Solo trabajáis en Zaragoza?', answer: 'Nuestra base está en Zaragoza, pero producimos eventos donde los necesites.' },
    ],
  },
];

export const getArea = (slug: string) => AREAS.find((a) => a.slug === slug);
