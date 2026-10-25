// Recomendador de servicios (/recomendador/), definido con Dirección el
// 2026-10-25. Este archivo es lo único que hay que tocar para ajustarlo:
// preguntas, opciones, ramas y baremo. La página solo lo pinta.
//
// Cómo decide:
// - Cada opción suma puntos a una o varias áreas (slugs de data/areas.ts) y,
//   si procede, a «dme» (director de marketing externo).
// - La pregunta 1 abre una rama: la pregunta 2 depende de lo que se elija.
// - Resultado: si 3 o más áreas llegan a UMBRAL_FUERTE, o «dme» llega a
//   UMBRAL_DME, el principal es «Director de marketing externo»; si no, el
//   área con más puntos. Debajo, hasta 2 complementarias con al menos
//   UMBRAL_COMPLEMENTO puntos.
// - La pregunta del plazo no puntúa: solo viaja a HubSpot para priorizar.

export type AreaSlug = 'estrategia-y-marca' | 'diseno-web' | 'seo-geo' | 'publicidad-online' | 'redes-sociales' | 'eventos';
export type Puntos = Partial<Record<AreaSlug | 'dme', number>>;

export interface Opcion {
  id: string;
  titulo: string;
  texto: string;
  puntos: Puntos;
  /** Solo en la pregunta 1: qué pregunta 2 se enseña. */
  rama?: string;
}

export interface Pregunta {
  id: string;
  titulo: string;
  ayuda?: string;
  opciones: Opcion[];
}

export const UMBRAL_FUERTE = 5;
export const UMBRAL_DME = 4;
export const UMBRAL_COMPLEMENTO = 2;

export const OBJETIVO: Pregunta = {
  id: 'objetivo',
  titulo: '¿Qué quieres conseguir ahora mismo?',
  opciones: [
    { id: 'visibilidad', titulo: 'Que nos conozcan y nos encuentren', texto: 'Aparecer cuando buscan lo que hacemos y que el sector sepa quiénes somos', puntos: { 'seo-geo': 2, 'redes-sociales': 2, 'publicidad-online': 1 }, rama: 'canales' },
    { id: 'clientes', titulo: 'Más contactos y clientes', texto: 'Que el marketing traiga oportunidades de venta, no solo visitas', puntos: { 'publicidad-online': 3, 'seo-geo': 2, 'diseno-web': 1 }, rama: 'canales' },
    { id: 'marca', titulo: 'Una marca que se entienda y se diferencie', texto: 'Explicar qué nos hace distintos sin competir solo por precio', puntos: { 'estrategia-y-marca': 3, 'diseno-web': 1 }, rama: 'marca' },
    { id: 'web', titulo: 'Una web nueva o que funcione', texto: 'La web no nos representa, no trae contactos o no podemos tocarla', puntos: { 'diseno-web': 3, 'seo-geo': 1 }, rama: 'web' },
    { id: 'lanzar', titulo: 'Lanzar algo', texto: 'Un producto, un servicio, una marca nueva o un evento', puntos: { 'estrategia-y-marca': 2, 'eventos': 2, 'publicidad-online': 1 }, rama: 'lanzar' },
    { id: 'ordenar', titulo: 'Ordenar todo el marketing', texto: 'Hacemos cosas pero sin dirección, y no sé por dónde empezar', puntos: { dme: 3, 'estrategia-y-marca': 1 }, rama: 'ordenar' },
  ],
};

export const RAMAS: Record<string, Pregunta> = {
  canales: {
    id: 'canales',
    titulo: '¿Qué canales usáis hoy?',
    ayuda: 'Elige el que mejor describe tu situación.',
    opciones: [
      { id: 'nada', titulo: 'Casi ninguno', texto: 'Empezamos prácticamente de cero', puntos: { 'estrategia-y-marca': 1, 'redes-sociales': 1, 'seo-geo': 1 } },
      { id: 'redes', titulo: 'Redes sociales', texto: 'Publicamos, pero no se nota en el negocio', puntos: { 'redes-sociales': 2, 'publicidad-online': 1 } },
      { id: 'anuncios', titulo: 'Anuncios', texto: 'Invertimos en Google o Meta y no sabemos qué retorno dan', puntos: { 'publicidad-online': 2, 'estrategia-y-marca': 1 } },
      { id: 'web-seo', titulo: 'Web y Google', texto: 'Tenemos web, pero apenas nos encuentran', puntos: { 'seo-geo': 2, 'diseno-web': 1 } },
      { id: 'varios', titulo: 'Varios, sin control', texto: 'Un poco de todo y nadie que lo mida en conjunto', puntos: { dme: 2, 'estrategia-y-marca': 1 } },
    ],
  },
  marca: {
    id: 'marca',
    titulo: '¿Cómo describirías tu marca hoy?',
    opciones: [
      { id: 'no-hay', titulo: 'No tenemos marca como tal', texto: 'Un nombre y poco más', puntos: { 'estrategia-y-marca': 3, 'diseno-web': 1 } },
      { id: 'anticuada', titulo: 'Se ha quedado anticuada', texto: 'Ya no representa lo que somos hoy', puntos: { 'estrategia-y-marca': 2, 'diseno-web': 1 } },
      { id: 'no-se-entiende', titulo: 'No se entiende lo que hacemos', texto: 'Nos cuesta explicarlo en una frase', puntos: { 'estrategia-y-marca': 3 } },
      { id: 'cada-uno', titulo: 'Cada uno la cuenta a su manera', texto: 'Dirección, comerciales y web dicen cosas distintas', puntos: { 'estrategia-y-marca': 2, dme: 1 } },
    ],
  },
  web: {
    id: 'web-estado',
    titulo: '¿Qué pasa con tu web?',
    opciones: [
      { id: 'no-hay', titulo: 'No tenemos web', texto: 'O es una página provisional', puntos: { 'diseno-web': 3 } },
      { id: 'anticuada', titulo: 'Está anticuada', texto: 'No nos representa y da mala imagen', puntos: { 'diseno-web': 2, 'estrategia-y-marca': 1 } },
      { id: 'no-trae', titulo: 'No trae contactos', texto: 'Está bien, pero nadie llega a ella o nadie escribe', puntos: { 'diseno-web': 2, 'seo-geo': 2 } },
      { id: 'no-tocar', titulo: 'No podemos tocarla', texto: 'Dependemos de alguien para cualquier cambio', puntos: { 'diseno-web': 2 } },
    ],
  },
  lanzar: {
    id: 'lanzamiento',
    titulo: '¿Qué vas a lanzar?',
    opciones: [
      { id: 'producto', titulo: 'Un producto o servicio', texto: 'Nuevo, o para un mercado nuevo', puntos: { 'estrategia-y-marca': 2, 'publicidad-online': 1, 'diseno-web': 1 } },
      { id: 'marca', titulo: 'Una marca nueva', texto: 'Empresa, línea de negocio o rebranding', puntos: { 'estrategia-y-marca': 3, 'diseno-web': 1 } },
      { id: 'evento', titulo: 'Un evento', texto: 'Presentación, activación o evento corporativo', puntos: { eventos: 3, 'redes-sociales': 1 } },
      { id: 'no-se', titulo: 'Aún no lo tengo claro', texto: 'Hay una idea, falta definirla', puntos: { 'estrategia-y-marca': 2 } },
    ],
  },
  ordenar: {
    id: 'quien-lleva',
    titulo: '¿Quién lleva hoy el marketing?',
    opciones: [
      { id: 'nadie', titulo: 'Nadie en concreto', texto: 'Se hace cuando hay tiempo', puntos: { dme: 3 } },
      { id: 'a-ratos', titulo: 'Alguien a ratos', texto: 'Una persona que también hace otras cosas', puntos: { dme: 2, 'estrategia-y-marca': 1 } },
      { id: 'equipo', titulo: 'Un equipo sin dirección', texto: 'Ejecutan mucho, pero sin un plan claro', puntos: { dme: 3 } },
      { id: 'agencia', titulo: 'Una agencia', texto: 'Y no tenemos claro si funciona', puntos: { dme: 2, 'estrategia-y-marca': 1 } },
    ],
  },
};

export const COMUNES: Pregunta[] = [
  {
    id: 'web-vende',
    titulo: '¿Tu web te ayuda a vender hoy?',
    opciones: [
      { id: 'no-hay', titulo: 'No tenemos web', texto: 'O casi', puntos: { 'diseno-web': 3 } },
      { id: 'no', titulo: 'No', texto: 'Está, pero no aporta', puntos: { 'diseno-web': 2 } },
      { id: 'regular', titulo: 'Regular', texto: 'Algo aporta, se podría sacar mucho más', puntos: { 'diseno-web': 1, 'seo-geo': 1 } },
      { id: 'si', titulo: 'Sí', texto: 'Nos trae contactos', puntos: { 'seo-geo': 1 } },
    ],
  },
  {
    id: 'ejecucion',
    titulo: '¿Quién va a ejecutar el trabajo?',
    ayuda: 'Así sabemos si necesitas solo dirección o también manos.',
    opciones: [
      { id: 'nadie', titulo: 'No tenemos a nadie', texto: 'Necesitamos que alguien lo haga', puntos: { 'redes-sociales': 1, 'publicidad-online': 1, 'diseno-web': 1 } },
      { id: 'equipo', titulo: 'Tenemos equipo', texto: 'Pero le falta dirección y criterio', puntos: { dme: 2, 'estrategia-y-marca': 1 } },
      { id: 'proveedores', titulo: 'Tenemos agencia o proveedores', texto: 'Necesitamos a alguien que decida y coordine', puntos: { 'estrategia-y-marca': 2, dme: 1 } },
    ],
  },
  {
    id: 'empresa',
    titulo: '¿Cómo es tu empresa?',
    opciones: [
      { id: 'b2b', titulo: 'Vendemos a otras empresas', texto: 'B2B', puntos: { 'estrategia-y-marca': 1, 'seo-geo': 1 } },
      { id: 'b2c', titulo: 'Vendemos a particulares', texto: 'B2C, tienda o servicio', puntos: { 'redes-sociales': 1, 'publicidad-online': 1 } },
      { id: 'local', titulo: 'Negocio local', texto: 'Clientes de nuestra zona', puntos: { 'seo-geo': 1, 'redes-sociales': 1 } },
      { id: 'startup', titulo: 'Startup', texto: 'Producto nuevo y ganas de crecer rápido', puntos: { 'estrategia-y-marca': 1, 'publicidad-online': 1 } },
    ],
  },
  {
    id: 'plazo',
    titulo: '¿Para cuándo lo necesitas?',
    opciones: [
      { id: 'ya', titulo: 'Cuanto antes', texto: 'Es una prioridad ahora', puntos: {} },
      { id: '3-meses', titulo: 'En los próximos 3 meses', texto: 'Lo estamos planificando', puntos: {} },
      { id: 'explorando', titulo: 'Estoy explorando', texto: 'Quiero saber qué opciones hay', puntos: {} },
    ],
  },
];

export const TOTAL_PASOS = 1 + 1 + COMUNES.length;

/** Texto del principal cuando sale «Director de marketing externo». */
export const DME = {
  nombre: 'Director de marketing externo',
  texto: 'Necesitas varias cosas a la vez, y lo que más te falta es alguien que decida qué va primero y coordine al resto. Guillén Bruna dirige tu marketing a tiempo parcial y los especialistas de la red ejecutan.',
  href: '/servicios/estrategia-y-marca/',
};
