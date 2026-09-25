import brocoCaseImage from '../assets/casos/broco-producto.jpeg';
import zebraCaseImage from '../assets/casos/zebra-sis.jpg';
import integraCaseImage from '../assets/casos/integra.jpeg';
import grupoReyCaseImage from '../assets/casos/grupo-rey.jpeg';

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
export const casos = [
  {
    slug: 'zebra-ventures',
    company: 'Zebra Ventures',
    role: 'Head of Brand & Marketing',
    services: ['gtm-icp', 'posicionamiento'],
    ariaLabel: 'Ver caso de Zebra Ventures',
    image: zebraCaseImage,
    imageAlt: 'Equipo de Zebra Ventures en el Spain Innovation Summit, evento organizado por Guillén Bruna Tricas',
    cardTags: ['Estrategia de marca', 'Go-to-market'],
    cardHeadline: 'Construcción de marca y estrategia GTM',
    cardDesc: 'Diagnóstico de ICP, reescritura del mensaje de marca, rediseño de la web, estrategia de contenidos, funnel de conversión y lanzamiento de una segunda línea de negocio desde cero. Incluye el Spain Innovation Summit, evento propio con estudio sectorial.',
    cardHighlight: 'Segunda línea de negocio lanzada desde cero, con ICP y funnel propios',
    detailTitle: 'Zebra Ventures — Marca y GTM | Guillén Bruna Tricas',
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
    ariaLabel: 'Ver caso de Integra Consultoría Gerencial',
    image: integraCaseImage,
    imageAlt: 'Congreso y proyecto de comunicación de Integra Consultoría Gerencial con Guillén Bruna Tricas',
    cardTags: ['Consultoría'],
    cardHeadline: 'Acompañamiento estratégico a dirección',
    cardDesc: 'Diagnóstico y acompañamiento a dirección en procesos de transformación organizativa y redefinición de modelo comercial.',
    cardHighlight: 'Servicio para 4-5 empresas cliente, hoy integrado de forma permanente en su catálogo',
    detailTitle: 'Integra — Consultoría Digital | Guillén Bruna Tricas',
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
    ariaLabel: 'Ver caso de Broco',
    image: brocoCaseImage,
    imageAlt: 'Colección de prendas de Broco, marca de moda sostenible creada por Guillén Bruna Tricas',
    cardTags: ['Lanzamiento de marca'],
    cardHeadline: 'Lanzamiento y crecimiento de una marca de moda',
    cardDesc: 'Creación de una marca de moda desde la idea hasta las primeras ventas. Identidad, canal digital, publicidad y operaciones. Aprendizaje de negocio real sin red ni equipo grande.',
    cardHighlight: '400-500 pedidos y 5.000 seguidores construidos sin inversión externa',
    detailTitle: 'Broco — Marca y eCommerce | Guillén Bruna Tricas',
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
    slug: 'grupo-rey',
    company: 'Muebles Rey & Muebles Tuco',
    role: 'Head of Social Media',
    services: [] as string[],
    ariaLabel: 'Ver caso de Grupo Rey Corporación',
    image: grupoReyCaseImage,
    imageAlt: 'Equipo y campañas omnicanal de Grupo Rey Corporación con Guillén Bruna Tricas',
    cardTags: ['Comunicación de marca'],
    cardHeadline: 'Campañas omnicanal de temporada',
    cardDesc: 'Gestión de campañas de gran volumen en retail de muebles. Coordinación de canal online y offline, creatividad y activaciones, con resultados medibles en ambas marcas.',
    cardHighlight: '+20.000€/mes en Meta Ads · comunidades de 15k→25k y 20k→35k seguidores',
    detailTitle: 'Grupo Rey — Paid Media y Marca | Guillén Bruna Tricas',
    detailDescription: 'Caso real de comunicación digital y Meta Ads para marcas nacionales de retail. Head of Social Media en Grupo Rey Corporación.',
    detailTags: ['Comunicación de marca', 'Retail'],
    detailHeading: 'Estrategia social, paid media y comunicación de marca',
    skills: [
      'Estrategia en redes sociales',
      'Meta Ads',
      'Selección y gestión de agencias',
      'Eventos e inauguraciones',
      'Comunicación de marca',
      'Planificación editorial',
      'Gestión de comunidad',
      'Producción audiovisual',
      'Producción de spot',
    ],
  },
];

export const getCaso = (slug: string) => casos.find((c) => c.slug === slug);
export const casosForService = (serviceSlug: string) => casos.filter((c) => c.services.includes(serviceSlug));
