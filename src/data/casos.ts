import brocoCaseImage from '../assets/casos/broco-producto.jpeg';
import zebraCaseImage from '../assets/casos/zebra-sis.jpg';
import integraCaseImage from '../assets/casos/integra.jpeg';
import grupoReyCaseImage from '../assets/casos/grupo-rey.jpeg';
import slmCaseImage from '../assets/sobre-mi/momento-slm.png';
import tucoCaseImage from '../assets/casos/tuco-taller-castellon.jpg';

// Fuente única para los datos de cada caso que se repetían, sin control del
// compilador, entre el listado (/trabajo/) y cada página de detalle
// (/trabajo/<slug>/). El cuerpo largo de cada caso (la narrativa, los
// bloques de resultados, el vídeo de Grupo Rey, etc.) sigue viviendo en su
// propia página: eso es contenido único, no un dato repetido.
//
// El orden del array es el orden del listado: primero el caso que prueba
// los servicios actuales. `services` usa los slugs de SERVICES (consts.ts):
// enlaza el caso con su ficha de servicio y la ficha con el caso. Vacío a
// propósito cuando el caso es trayectoria y no prueba de un servicio.
// `areas` usa los slugs de AREAS (data/areas.ts) y enlaza el caso desde la
// página de cada área que prueba.
export const casos = [
  {
    slug: 'zebra-ventures',
    company: 'Zebra AI Transformation Company',
    role: 'Head of Brand & Marketing',
    services: ['gtm-icp', 'posicionamiento'],
    areas: ['estrategia-y-marca', 'diseno-web', 'eventos'],
    sector: 'Tecnología e IA, B2B',
    // Titular de la pestaña en la home: el reto del cliente, como los casos de elogia.net.
    reto: 'Ordenar el mensaje de una empresa de IA y lanzar desde cero su segunda línea de negocio',
    capacidades: 'Estrategia de marca, Go to market, Web, Eventos',
    ariaLabel: 'Ver caso de Zebra AI Transformation Company',
    image: zebraCaseImage as ImageMetadata | undefined,
    imageAlt: 'Equipo de Zebra AI Transformation Company en el Spain Innovation Summit, evento organizado por Guillén Bruna Tricas',
    cardTags: ['Estrategia de marca', 'Go-to-market'],
    cardHeadline: 'Construcción de marca y estrategia GTM',
    cardDesc: 'Diagnóstico de ICP, reescritura del mensaje de marca, rediseño de la web, estrategia de contenidos, funnel de conversión y lanzamiento de una segunda línea de negocio desde cero. Incluye el Spain Innovation Summit, evento propio con estudio sectorial.',
    cardHighlight: 'Segunda línea de negocio lanzada desde cero, con ICP y funnel propios',
    detailTitle: 'Zebra AI Transformation Company — Marca y GTM | GBT Consultoría',
    detailDescription: 'Caso real de estrategia de marca, mensaje y go-to-market para una empresa de IA. Diagnóstico, lanzamiento de producto y evento propio.',
    detailTags: ['Estrategia de marca', 'Go-to-market'],
    detailHeading: 'Construcción de marca y estrategia GTM',
    skills: ['Diagnóstico de ICP', 'Posicionamiento', 'Mensaje de marca', 'Go-to-market', 'Estrategia de contenidos', 'CRM y funnel', 'Web', 'Eventos'],
  },
  {
    slug: 'integra',
    company: 'Integra Consultoría Gerencial',
    role: 'Consultor',
    services: [] as string[],
    areas: ['estrategia-y-marca', 'redes-sociales'],
    sector: 'Consultoría, B2B',
    reto: 'Convertir una consultoría gerencial en proveedora de servicios digitales para sus propios clientes',
    capacidades: 'Estrategia digital, Redes sociales, Web',
    ariaLabel: 'Ver caso de Integra Consultoría Gerencial',
    image: integraCaseImage as ImageMetadata | undefined,
    imageAlt: 'Congreso y proyecto de comunicación de Integra Consultoría Gerencial con Guillén Bruna Tricas',
    cardTags: ['Consultoría'],
    cardHeadline: 'Acompañamiento estratégico a dirección',
    cardDesc: 'Diagnóstico y acompañamiento a dirección en procesos de transformación organizativa y redefinición de modelo comercial.',
    cardHighlight: 'Servicio para 4-5 empresas cliente, hoy integrado de forma permanente en su catálogo',
    detailTitle: 'Integra — Consultoría Digital | GBT Consultoría',
    detailDescription: 'Caso real de desarrollo de línea de servicios digitales dentro de una consultoría gerencial. Estrategia, redes sociales y web para PYMEs y empresas medianas.',
    detailTags: ['Consultoría', 'Estrategia digital'],
    detailHeading: 'Expansión digital',
    skills: [
      'Estrategia digital',
      'Planificación de comunicación',
      'Consultoría',
      'Redes sociales',
      'Desarrollo web',
      'Ampliación de línea de servicios',
    ],
  },
  {
    slug: 'broco',
    company: 'Broco',
    role: 'Fundador',
    services: [] as string[],
    areas: ['estrategia-y-marca', 'diseno-web', 'publicidad-online'],
    sector: 'Moda, eCommerce, B2C',
    reto: 'Llevar una marca de moda de la idea a sus primeros 400-500 pedidos sin inversión externa',
    capacidades: 'Marca, Identidad visual, eCommerce, Publicidad online',
    ariaLabel: 'Ver caso de Broco',
    image: brocoCaseImage as ImageMetadata | undefined,
    imageAlt: 'Colección de prendas de Broco, marca de moda sostenible creada por Guillén Bruna Tricas',
    cardTags: ['Lanzamiento de marca'],
    cardHeadline: 'Lanzamiento y crecimiento de una marca de moda',
    cardDesc: 'Creación de una marca de moda desde la idea hasta las primeras ventas. Identidad, canal digital, publicidad y operaciones. Aprendizaje de negocio real sin red ni equipo grande.',
    cardHighlight: '400-500 pedidos y 5.000 seguidores construidos sin inversión externa',
    detailTitle: 'Broco — Marca y eCommerce | GBT Consultoría',
    detailDescription: 'Caso real de lanzamiento de marca de moda urbana desde cero. 400-500 pedidos y 5.000 seguidores sin inversión externa.',
    detailTags: ['Lanzamiento de marca', 'eCommerce'],
    detailHeading: 'Lanzamiento y construcción de marca',
    skills: [
      'Estrategia de marca',
      'Naming',
      'Identidad visual',
      'eCommerce',
      'Publicidad de pago',
      'Redes sociales',
      'Negociación con proveedores',
      'Plan de negocio',
      'Packaging',
      'Gestión de operaciones',
    ],
  },
  {
    slug: 'muebles-rey',
    company: 'Muebles Rey',
    role: 'Head of Social Media en Grupo Rey Corporación',
    services: [] as string[],
    areas: ['redes-sociales', 'publicidad-online', 'estrategia-y-marca'],
    sector: 'Retail de muebles, B2C',
    reto: 'Llevar el estilo y la marca de Muebles Rey al nivel que buscaba el grupo',
    capacidades: 'Redes sociales, Meta Ads, Agencia de comunicación, Videopodcast',
    ariaLabel: 'Ver caso de Muebles Rey',
    image: grupoReyCaseImage as ImageMetadata | undefined,
    imageAlt: 'Equipo y campañas omnicanal de Grupo Rey Corporación con Guillén Bruna Tricas',
    cardTags: ['Redes sociales', 'Paid media'],
    cardHeadline: 'Redes, paid media y una agencia de referencia para elevar la marca',
    cardDesc: 'Gestión completa de redes sociales, paid media gestionado por separado y trabajo complementario con una agencia de comunicación de referencia, que sigue con la marca años después. Incluye Perspectivas, el videopodcast de la marca.',
    cardHighlight: 'Comunidad de 15.000 a 25.000 seguidores y una agencia que sigue con la marca años después',
    detailTitle: 'Muebles Rey, redes, paid media y marca | GBT Consultoría',
    detailDescription: 'Caso real de redes sociales, Meta Ads y marca para Muebles Rey: comunidad de 15.000 a 25.000 seguidores, agencia de referencia y videopodcast de marca.',
    detailTags: ['Redes sociales', 'Retail'],
    detailHeading: 'Redes, paid media y una agencia de referencia para elevar la marca',
    skills: ['Estrategia en redes sociales', 'Gestión de comunidad', 'Meta Ads', 'Selección y gestión de agencias', 'Videopodcast de marca'],
  },
  {
    slug: 'muebles-tuco',
    company: 'Muebles Tuco',
    role: 'Head of Social Media en Grupo Rey Corporación',
    services: [] as string[],
    areas: ['redes-sociales', 'publicidad-online', 'eventos'],
    sector: 'Retail de muebles, B2C',
    reto: 'Hacer crecer la comunidad de Muebles Tuco con voz propia dentro de un grupo de varias marcas',
    capacidades: 'Redes sociales, Meta Ads, Spot de marca, Inauguración de tienda',
    ariaLabel: 'Ver caso de Muebles Tuco',
    image: tucoCaseImage as ImageMetadata | undefined,
    // Foto vertical: el recorte apaisado se centra en Guillén.
    imagePos: '62% 32%',
    imageAlt: 'Guillén Bruna Tricas dirige el taller de inauguración de una tienda de Muebles Tuco en Castellón',
    cardTags: ['Redes sociales'],
    cardHeadline: 'Gestión completa de redes con voz propia',
    cardDesc: 'Gestión completa de las redes sociales de Muebles Tuco con una identidad diferenciada del resto de marcas del grupo, campañas de Meta Ads segmentadas por producto y temporada, y el spot de marca.',
    cardHighlight: 'Comunidad de 20.000 a 35.000 seguidores',
    detailTitle: 'Muebles Tuco, gestión de redes sociales | GBT Consultoría',
    detailDescription: 'Caso real de redes sociales y spot de marca para Muebles Tuco: comunidad de 20.000 a 35.000 seguidores con voz propia dentro de un grupo multimarca.',
    detailTags: ['Redes sociales', 'Retail'],
    detailHeading: 'Gestión completa de redes con voz propia',
    skills: ['Estrategia en redes sociales', 'Planificación editorial', 'Gestión de comunidad', 'Meta Ads', 'Producción de spot', 'Eventos de inauguración'],
  },
  {
    slug: 'slm',
    company: 'SLM',
    role: 'Equipo de marketing de Grupo Rey Corporación',
    services: [] as string[],
    areas: ['estrategia-y-marca'],
    sector: 'Retail de muebles, B2C',
    reto: 'Llevar la marca de SLM a la tienda física con cartelería propia',
    capacidades: 'Identidad visual, Cartelería, Punto de venta',
    ariaLabel: 'Ver caso de SLM',
    image: slmCaseImage as ImageMetadata | undefined,
    imageAlt: 'Guillén Bruna Tricas frente a una tienda de SLM',
    cardTags: ['Punto de venta'],
    cardHeadline: 'Cartelería de tienda para SLM',
    cardDesc: 'Desarrollo de la cartelería de varias tiendas de SLM, marca del mismo grupo que Muebles Rey y Muebles Tuco.',
    cardHighlight: 'Cartelería desarrollada para varias tiendas de la marca',
    detailTitle: 'SLM, cartelería de tienda | GBT Consultoría',
    detailDescription: 'Caso real de cartelería de punto de venta para varias tiendas de SLM, marca de Grupo Rey Corporación.',
    detailTags: ['Punto de venta', 'Retail'],
    detailHeading: 'Cartelería de tienda para SLM',
    skills: ['Identidad visual', 'Cartelería', 'Punto de venta'],
  },
];

export const getCaso = (slug: string) => casos.find((c) => c.slug === slug);
export const casosForService = (serviceSlug: string) => casos.filter((c) => c.services.includes(serviceSlug));
export const casosForArea = (areaSlug: string) => casos.filter((c) => c.areas.includes(areaSlug));
