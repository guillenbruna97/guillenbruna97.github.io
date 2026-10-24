import zebraSisImage from '../assets/casos/zebra-sis.jpg';
import zebraWebImage from '../assets/casos/zebra-web.jpg';
import brocoIg1 from '../assets/casos/broco-ig-1.jpg';
import brocoIg2 from '../assets/casos/broco-ig-2.jpg';
import brocoIg3 from '../assets/casos/broco-ig-3.jpg';
import brocoIg4 from '../assets/casos/broco-ig-4.jpg';

// Contenido de la página de cada caso (/trabajo/<slug>/), pintado por
// CaseLayout con la estructura de los casos de siegemedia.com (2026-10-24):
// cabecera con cifras, ficha de la empresa y el reto, resultados, qué se hizo,
// trabajo destacado y casos relacionados. Los datos de tarjeta y SEO siguen en
// data/casos.ts. Texto sacado de las páginas que había; sin cifras nuevas.
// Los textos admiten <strong> y <a> (se pintan con set:html).

export interface Cifra {
  valor: string;
  etiqueta: string;
}
export interface Fase {
  titulo: string;
  texto: string;
}
export interface Comparativa {
  etiqueta: string;
  antes: number;
  despues: number;
  unidad: string;
}
export interface Destacado {
  titulo: string;
  texto: string;
  video?: { id: string; titulo: string };
  imagen?: ImageMetadata;
  imagenAlt?: string;
  /** Varias piezas en rejilla (como el «Featured content» de Siege). */
  galeria?: { imagen: ImageMetadata; alt: string }[];
  enlace?: { texto: string; href: string };
}
export interface DetalleCaso {
  /** Qué es la empresa, para la ficha. */
  empresa: string;
  logo?: string;
  web?: string;
  cifras: Cifra[];
  /** Párrafos de «El reto». */
  reto: string[];
  fases: Fase[];
  resultado: string;
  comparativas?: Comparativa[];
  destacado?: Destacado;
}

export const DETALLES: Record<string, DetalleCaso> = {
  'zebra-ventures': {
    empresa: 'Empresa de transformación digital con inteligencia artificial para pymes.',
    logo: '/logos/zebra.png',
    web: 'https://zebraventures.eu',
    cifras: [
      { valor: '2', etiqueta: 'líneas de negocio, cada una con su mensaje, su marca y su funnel' },
      { valor: '1', etiqueta: 'evento propio con un estudio sobre la IA en las pymes españolas' },
    ],
    reto: [
      'Cuando llegué a Zebra AI Transformation Company, la marca y el mensaje en el mercado no estaban consolidados. Había producto y una ambición clara, pero faltaba una definición precisa de qué hacía Zebra, para quién y por qué su propuesta era relevante.',
      'El desafío no era ejecutar más acciones de marketing. Había que decidir qué representaba Zebra en el mercado, a qué tipo de cliente se dirigía realmente y cómo comunicar ese valor de forma inequívoca. Sin esa base, cualquier inversión en comunicación sería menos efectiva.',
    ],
    fases: [
      { titulo: 'Diagnóstico de cliente ideal y mensaje', texto: 'El primer paso fue un diagnóstico del perfil de cliente ideal real de Zebra, antes de tocar cualquier elemento de comunicación o diseño. Una vez claro a quién servíamos mejor, reescribimos el mensaje central de la marca para que respondiera directamente a las necesidades de ese público.' },
      { titulo: 'Marca, web y canales', texto: 'Con el mensaje definido, abordamos la presencia de marca: rediseño completo de la web y homogeneización de la imagen en todos los canales. Una estrategia de contenidos orientada a atraer a ese cliente ideal y un funnel de conversión que conecta la visibilidad de la marca con el proceso de ventas.' },
      { titulo: 'Una segunda línea de negocio desde cero', texto: 'Después lideré el lanzamiento de una segunda línea de negocio centrada en productos de inteligencia artificial. Definimos un <strong>cliente ideal específico</strong> para esta oferta, creamos su mensaje comercial, diseñamos el proceso de venta y un funnel propio, e implantamos un sistema de conversión automático que trabaja en paralelo con el equipo comercial.' },
      { titulo: 'Spain Innovation Summit', texto: 'Para reforzar el reconocimiento de marca y situar a Zebra como referente, organizamos un evento propio, el Spain Innovation Summit. En él presentamos un <strong>estudio sobre el estado de la inteligencia artificial en las pymes españolas</strong> y un manual práctico de adopción adaptado al nivel de madurez digital de cada empresa.' },
    ],
    resultado: 'Hoy Zebra AI Transformation Company opera con <strong>dos líneas de negocio diferenciadas</strong>. Cada una cuenta con su propio mensaje, su identidad de marca y sus sistemas de conversión: una estructura clara sobre la que seguir creciendo.',
    destacado: {
      titulo: 'Spain Innovation Summit',
      texto: 'Evento propio de Zebra en el que se presentó el estudio sobre el estado de la inteligencia artificial en las pymes españolas y un manual práctico de adopción.',
      imagen: zebraSisImage,
      imagenAlt: 'Equipo de Zebra AI Transformation Company en el Spain Innovation Summit',
    },
  },
  integra: {
    empresa: 'Consultora de dirección estratégica y gestión empresarial para pymes, empresas familiares y empresas medianas.',
    logo: '/logos/integra.png',
    web: 'https://www.integracg.es/',
    cifras: [
      { valor: '4-5', etiqueta: 'empresas cliente atendidas con la nueva línea' },
      { valor: '1', etiqueta: 'línea de servicios digitales que sigue en su catálogo' },
    ],
    reto: [
      'Integra quería añadir a su propuesta de valor una línea de servicios de comunicación digital, más allá de la consultoría gerencial tradicional. Mi incorporación tenía ese objetivo: desarrollarla y ponerla en marcha.',
    ],
    fases: [
      { titulo: 'Presencia digital propia', texto: 'El primer paso fue construir la presencia digital de Integra desde cero, con su web corporativa como punto de partida, para que la consultora tuviera credibilidad digital antes de ofrecérsela a sus clientes.' },
      { titulo: 'Servicio a sus clientes', texto: 'A partir de ahí trabajé directamente con <strong>4-5 empresas cliente</strong> de Integra, con estrategia digital, planificación de comunicación, consultoría y gestión de redes sociales. Cada cliente tenía un punto de partida distinto, lo que requería un diagnóstico individualizado antes de cualquier ejecución.' },
    ],
    resultado: 'La línea de servicios digitales no fue un proyecto temporal: hoy forma parte permanente de la propuesta de valor de Integra, con planes de comunicación, social media y relaciones públicas en su catálogo oficial. Lo más valioso fue trabajar en consultoría pura, donde el cliente es una dirección general que toma decisiones con impacto real y el consultor tiene que ganarse la confianza antes de que se escuche cualquier recomendación.',
  },
  broco: {
    logo: '/logos/broco.png',
    empresa: 'Marca de moda urbana sostenible creada desde cero por tres amigos en Zaragoza.',
    cifras: [
      { valor: '400-500', etiqueta: 'pedidos' },
      { valor: '5.000', etiqueta: 'seguidores construidos desde cero' },
      { valor: '0 €', etiqueta: 'de inversión externa, hasta el punto de equilibrio' },
    ],
    reto: [
      'Broco nació sin presupuesto, sin equipo externo y sin manual de instrucciones. La ambición era ser una marca diferencial a nivel nacional en moda urbana sostenible, con algodón orgánico como estándar de producto y una línea visual juvenil, coherente y con carácter.',
      'El nombre salió de fusionar «brother» con «co», el apelativo que define la forma de hablar en Zaragoza, y el protagonista visual fue el brócoli: un símbolo deliberadamente atrevido que rompía con la seriedad de la moda convencional y anclaba el mensaje de sostenibilidad con personalidad propia.',
    ],
    fases: [
      { titulo: 'Todo construido desde cero', texto: 'Todo lo que Broco necesitaba para existir había que construirlo: el plan de negocio y de viabilidad, la identidad visual completa, la narrativa de marca, el packaging, el diseño de producto, la negociación con proveedores, el eCommerce y la estrategia de redes sociales. Cuando llegaban los pedidos, también los preparábamos y enviábamos nosotros.' },
      { titulo: 'Estrategia de marca y negocio', texto: 'Asumí la estrategia de marca, las decisiones comerciales, la identidad visual y la arquitectura de negocio. No solo diseñaba: también pensaba en márgenes, en posicionamiento y en cómo construir algo que pudiera escalar.' },
    ],
    resultado: 'El resultado fue real: <strong>400-500 pedidos</strong> y una comunidad de <strong>5.000 seguidores</strong> construida desde cero, sin inversión externa, hasta llegar al punto de equilibrio económico. El proyecto terminó por una decisión consciente: las diferencias de implicación y de visión entre socios generaron una tensión que decidimos resolver antes de que afectara a lo que más importaba. Fue una de las lecciones más honestas sobre liderazgo, roles y expectativas, y define cómo trabajo hoy con equipos y clientes.',
    destacado: {
      titulo: 'La marca',
      texto: 'Camisetas de algodón orgánico en colores suaves, mensajes positivos y una vida al aire libre: la identidad que construimos para Broco, de la gorra al estampado.',
      galeria: [
        { imagen: brocoIg1, alt: 'Gorra negra con el logotipo de Broco' },
        { imagen: brocoIg2, alt: 'Camiseta verde menta de Broco' },
        { imagen: brocoIg3, alt: 'Camiseta azul de Broco con estampado en la espalda' },
        { imagen: brocoIg4, alt: 'Camiseta amarilla de Broco con el mensaje «kind people are my kinda people»' },
      ],
    },
  },
  'muebles-rey': {
    empresa: 'Marca de Grupo Rey Corporación, uno de los grupos de retail de muebles con mayor recorrido en España.',
    logo: '/logos/rey.png',
    cifras: [
      { valor: '25.000', etiqueta: 'seguidores, desde unos 15.000' },
      { valor: '+20.000 €', etiqueta: 'al mes en Meta Ads, entre Muebles Rey y Muebles Tuco' },
      { valor: '>1,5 %', etiqueta: 'de CTR en las campañas de conversión' },
    ],
    reto: [
      'Muebles Rey es una marca nacional con años de historia, y el grupo quería llevar su estilo y su marca al punto que buscaba, con la gestión de redes y de paid media al día.',
    ],
    fases: [
      { titulo: 'Gestión completa de redes sociales', texto: 'Estrategia, planificación editorial, producción y comunidad, con una voz propia dentro de un grupo en el que llegué a llevar la comunicación digital de hasta <strong>6 marcas en paralelo</strong>. En el grupo lideré además más de 3 eventos de inauguración de tiendas, coordinando la presencia física, la cobertura en redes y el seguimiento posterior.' },
      { titulo: 'Paid media gestionado por separado', texto: 'Las campañas de Meta Ads de Muebles Rey y Muebles Tuco sumaban más de <strong>20.000 € al mes</strong>, segmentadas por marca, producto y temporada: campañas de awareness con CPM por debajo de la media del retail y de conversión con CTR por encima del <strong>1,5 %</strong> y ROAS positivo en las líneas de producto principales.' },
      { titulo: 'Una agencia de referencia para elevar la marca', texto: 'La marca necesitaba una atención más detallada y especializada de la que se podía dar íntegramente desde dentro. Identifiqué la mejor agencia de comunicación, la propuse y la incorporé, y trabajamos de forma complementaria. Sigue con la marca a día de hoy.' },
      { titulo: 'Perspectivas, el videopodcast de la marca', texto: 'Perspectivas ya se había intentado con otra agencia sin el resultado esperado. Lo montamos todo junto con la producción de la agencia que incorporamos, alineado con el mensaje, el estilo y la nueva identidad de Muebles Rey, y las campañas de paid media para darlo a conocer las hicimos por nuestra cuenta.' },
    ],
    resultado: 'Durante mi etapa, la comunidad de Muebles Rey pasó de aproximadamente <strong>15.000 a 25.000 seguidores</strong>, con más engagement y alcance orgánico. Y la agencia que elegimos sigue con la marca: las mejores decisiones son las que siguen funcionando cuando ya no estás.',
    comparativas: [{ etiqueta: 'Seguidores de Muebles Rey', antes: 15000, despues: 25000, unidad: 'seguidores' }],
    destacado: {
      titulo: 'Perspectivas, el videopodcast de Muebles Rey',
      texto: 'Tráiler del videopodcast de la marca: montado junto con la producción de la agencia y lanzado con nuestras propias campañas de paid media.',
      video: { id: 'rHpAE7U9OEs', titulo: 'Tráiler de Perspectivas, el videopodcast de Muebles Rey' },
    },
  },
  'muebles-tuco': {
    empresa: 'Marca de Grupo Rey Corporación, uno de los grupos de retail de muebles con mayor recorrido en España.',
    logo: '/logos/tuco.png',
    cifras: [
      { valor: '35.000', etiqueta: 'seguidores, desde unos 20.000' },
      { valor: '6', etiqueta: 'marcas del grupo con voz propia en paralelo' },
      { valor: '+20.000 €', etiqueta: 'al mes en Meta Ads, entre Muebles Tuco y Muebles Rey' },
    ],
    reto: [
      'Muebles Tuco convivía con otras marcas del mismo grupo. Necesitaba crecer en redes con una voz propia, que no se confundiera con la de <a href="/trabajo/muebles-rey/">Muebles Rey</a> ni con el resto.',
    ],
    fases: [
      { titulo: 'Gestión completa de redes sociales', texto: 'Estrategia, planificación editorial, producción y comunidad. Llegué a llevar la comunicación digital de hasta <strong>6 marcas del grupo en paralelo</strong>, incluidas franquicias, así que cada una necesitaba una identidad diferenciada y un criterio claro para no confundirse con las demás.' },
      { titulo: 'Meta Ads', texto: 'Las campañas de Meta Ads de Muebles Tuco y Muebles Rey sumaban más de <strong>20.000 € al mes</strong>, segmentadas por marca, producto y temporada, con campañas de conversión por encima del <strong>1,5 %</strong> de CTR y ROAS positivo en las líneas de producto principales.' },
      { titulo: 'Spot de marca', texto: 'Lideré la producción de un spot para Muebles Tuco: idea creativa, guion, planificación y coordinación del rodaje, incluida la propuesta y contratación del grupo musical que lo protagoniza, y supervisión final para mantener la coherencia con la identidad de la marca.' },
    ],
    resultado: 'Durante mi etapa, la comunidad de Muebles Tuco pasó de aproximadamente <strong>20.000 a 35.000 seguidores</strong>, con más engagement y alcance orgánico.',
    comparativas: [{ etiqueta: 'Seguidores de Muebles Tuco', antes: 20000, despues: 35000, unidad: 'seguidores' }],
    destacado: {
      titulo: 'Spot de marca de Muebles Tuco',
      texto: 'Música en directo, atmósfera de marca y producto, de la idea al rodaje.',
      video: { id: 'i6RH0EIlEus', titulo: 'Spot de marca Muebles Tuco' },
    },
  },
  slm: {
    empresa: 'Marca de Grupo Rey Corporación, el mismo grupo de retail de muebles que Muebles Rey y Muebles Tuco.',
    logo: '/logos/slm.png',
    cifras: [],
    reto: [
      'SLM, marca del mismo grupo, necesitaba cartelería para varias de sus tiendas.',
    ],
    fases: [
      { titulo: 'Cartelería de tienda', texto: 'Desde el equipo de marketing del grupo fuimos los encargados de desarrollar la cartelería de varias de sus tiendas.' },
    ],
    resultado: 'Cartelería propia en varias tiendas de SLM, dentro del mismo grupo en el que llevaba también <a href="/trabajo/muebles-rey/">Muebles Rey</a> y <a href="/trabajo/muebles-tuco/">Muebles Tuco</a>.',
  },
};

export const getDetalle = (slug: string) => DETALLES[slug];
