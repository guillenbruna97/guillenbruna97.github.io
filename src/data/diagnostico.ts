// Contenido del autodiagnóstico de /recursos/minijuegos/diagnostico-marketing/.
//
// Enfoque: el directivo no ve causas, ve síntomas. Las preguntas piden
// hechos observables (no autoevaluación) y cada respuesta suma "puntos de
// problema" a una de las tres áreas, que son los tres servicios activos
// (la mentoría de comunicación está en pausa). Gana el área con más
// puntos; si ninguna pasa de UMBRAL_SOLIDO se muestra "solido". En empate
// gana el orden de AREAS.
//
// Las preguntas con `contexto: true` no puntúan: van al final, se guardan
// en HubSpot y sirven para priorizar a quién llamar primero.

export type Area = 'pipeline' | 'gtm' | 'posicionamiento';

export const AREAS: Area[] = ['pipeline', 'gtm', 'posicionamiento'];

export const AREA_NAMES: Record<Area, string> = {
  pipeline: 'Proceso comercial',
  gtm: 'Cliente ideal y canales',
  posicionamiento: 'Mensaje y posicionamiento',
};

export const UMBRAL_SOLIDO = 2;

export interface Opcion {
  texto: string;
  puntos?: Partial<Record<Area, number>>;
}

export interface Pregunta {
  id: string;
  pregunta: string;
  opciones: Opcion[];
  contexto?: boolean;
}

export const TRANSICION_CONTEXTO = 'Ya casi está. Cuatro preguntas rápidas sobre tu empresa.';

export const PREGUNTAS: Pregunta[] = [
  {
    id: 'sintoma',
    pregunta: '¿Cuál de estas frases has dicho o pensado este año?',
    opciones: [
      { texto: 'No vendemos lo suficiente y el equipo no sabe por qué', puntos: { pipeline: 1, gtm: 1 } },
      { texto: 'Siempre acabamos bajando el precio para cerrar ventas', puntos: { posicionamiento: 2 } },
      { texto: 'Gastamos en marketing digital y no sé qué retorno obtenemos', puntos: { gtm: 2 } },
      { texto: 'Todo depende de que venda yo o el comercial estrella', puntos: { pipeline: 2 } },
      { texto: 'Nuestra web podría ser la de cualquier competidor sin que nadie lo notase', puntos: { posicionamiento: 2 } },
    ],
  },
  {
    id: 'equipo',
    pregunta: 'Si pregunto a tres personas de tu equipo a quién vendéis, ¿qué me dirían?',
    opciones: [
      { texto: 'Lo mismo, tenemos un perfil claro' },
      { texto: 'Tendrían algunas diferencias, pero la idea general es similar', puntos: { gtm: 1 } },
      { texto: 'Cada uno diría algo distinto', puntos: { gtm: 2 } },
    ],
  },
  {
    id: 'logo',
    pregunta: 'Si quitas el logo de tu web, ¿un cliente te distinguiría de tu competidor?',
    opciones: [
      { texto: 'Sí, nuestra propuesta es muy diferente y clara' },
      { texto: 'Quizás en algunos puntos, pero costaría', puntos: { posicionamiento: 1 } },
      { texto: 'Difícilmente, nos parecemos mucho a los demás', puntos: { posicionamiento: 2 } },
    ],
  },
  {
    id: 'perdida',
    pregunta: 'La última vez que perdisteis una venta importante, ¿supisteis exactamente por qué?',
    opciones: [
      { texto: 'Sí, analizamos cada venta perdida' },
      { texto: 'Teníamos una idea, pero sin analizarlo de verdad', puntos: { pipeline: 1 } },
      { texto: 'No, no supimos el motivo real', puntos: { pipeline: 2 } },
    ],
  },
  {
    id: 'vacaciones',
    pregunta: '¿Qué ocurre si tu mejor comercial o tú os vais un mes de vacaciones?',
    opciones: [
      { texto: 'El proceso sigue funcionando y las ventas no se resienten' },
      { texto: 'Las ventas bajan, pero el equipo cubre lo básico', puntos: { pipeline: 1 } },
      { texto: 'Las ventas se paralizan casi por completo', puntos: { pipeline: 2 } },
    ],
  },
  {
    id: 'precio',
    pregunta: '¿En qué momento de la venta suele salir el precio, y quién lo saca?',
    opciones: [
      { texto: 'Al final, cuando el cliente ya entiende el valor' },
      { texto: 'A mitad de la conversación, a veces lo sacamos nosotros', puntos: { posicionamiento: 1 } },
      { texto: 'Es lo primero que nos preguntan, o lo damos enseguida', puntos: { posicionamiento: 2 } },
    ],
  },
  {
    id: 'leads',
    pregunta: '¿Con qué frecuencia llegan contactos que claramente no encajan con lo que vendéis?',
    opciones: [
      { texto: 'Rara vez, la mayoría encajan' },
      { texto: 'Algunos, pero son minoría', puntos: { gtm: 1 } },
      { texto: 'Con bastante frecuencia, perdemos tiempo con ellos', puntos: { gtm: 2, posicionamiento: 1 } },
    ],
  },
  {
    id: 'presupuesto',
    pregunta: 'Si mañana tuvieras que recortar la mitad del presupuesto de marketing, ¿sabrías qué cortar?',
    opciones: [
      { texto: 'Sí, sabemos qué canal trae clientes y cuál no' },
      { texto: 'Lo intuimos, pero sin datos', puntos: { gtm: 1 } },
      { texto: 'No, sería a ciegas', puntos: { gtm: 2, pipeline: 1 } },
    ],
  },
  {
    id: 'cargo',
    contexto: true,
    pregunta: '¿Cuál es tu cargo?',
    opciones: [
      { texto: 'CEO o dirección general' },
      { texto: 'COO o dirección de operaciones' },
      { texto: 'CFO o dirección financiera' },
      { texto: 'CEO de holding' },
      { texto: 'Dirección comercial o de marketing' },
      { texto: 'Otro cargo directivo' },
    ],
  },
  {
    id: 'tamano',
    contexto: true,
    pregunta: '¿Cuántas personas trabajan en tu empresa?',
    opciones: [
      { texto: 'De 1 a 10' },
      { texto: 'De 11 a 50' },
      { texto: 'De 51 a 200' },
      { texto: 'De 201 a 500' },
      { texto: 'Más de 500' },
    ],
  },
  {
    id: 'urgencia',
    contexto: true,
    pregunta: 'Si esto sigue igual 12 meses, ¿qué supondría para tu empresa?',
    opciones: [
      { texto: 'Perderíamos terreno frente a la competencia' },
      { texto: 'Creceríamos más despacio de lo que queremos' },
      { texto: 'Una oportunidad perdida, pero nada grave' },
      { texto: 'Ningún impacto relevante' },
    ],
  },
  {
    id: 'intentos',
    contexto: true,
    pregunta: '¿Has intentado resolverlo antes?',
    opciones: [
      { texto: 'Sí, con una agencia' },
      { texto: 'Sí, contratando a alguien' },
      { texto: 'Sí, con alguna herramienta nueva' },
      { texto: 'He probado varias de esas' },
      { texto: 'No, todavía no le he puesto foco' },
    ],
  },
];

export interface Resultado {
  titulo: string;
  loQueVes: string;
  loQueHayDetras: string;
  pasos: string[];
  servicio: string;
  servicioSlug?: string;
}

export const RESULTADOS: Record<Area | 'solido', Resultado> = {
  pipeline: {
    titulo: 'Un proceso de venta que no dependa de ti',
    loQueVes: 'Las ventas dependen de dos o tres personas clave y, cuando se pierde una oportunidad, nadie sabe decir exactamente por qué.',
    loQueHayDetras: 'No es un problema de esfuerzo comercial. Falta un proceso repetible, con etapas claras y criterios para saber qué oportunidad merece tiempo. Sin eso, el conocimiento se queda en la cabeza de quien vende y la empresa no puede crecer más allá de esas personas.',
    pasos: [
      'Escribe las etapas reales de una venta, del primer contacto a la firma.',
      'Revisa tus tres últimas ventas perdidas y anota en qué etapa se cayeron.',
      'Define tres preguntas que toda oportunidad debe responder antes de preparar una propuesta.',
    ],
    servicio: 'Te ayudamos a construir un proceso comercial con etapas claras y datos fiables, para que las ventas no dependan de una sola persona.',
    servicioSlug: 'pipeline',
  },
  gtm: {
    titulo: 'Saber a quién vender y por dónde llegar',
    loQueVes: 'Inviertes en marketing, también digital, sin saber qué canal trae clientes. Y llegan contactos que le hacen perder tiempo al equipo.',
    loQueHayDetras: 'El problema no suele estar en el canal ni en los anuncios. Cuando no está definido a quién vendes, cualquier canal parece razonable y ninguno rinde. Primero se decide el cliente, después el canal, y solo entonces tiene sentido invertir.',
    pasos: [
      'Elige a tus tres mejores clientes del último año y apunta qué tienen en común.',
      'Pregunta a dos de ellos cómo te encontraron y qué les hizo decidir.',
      'Señala qué canal no te ha traído ningún cliente en seis meses.',
    ],
    servicio: 'Construimos contigo tu estrategia go to market, con cliente ideal, canales y mensajes, para que cada euro de marketing vaya donde retorna.',
    servicioSlug: 'gtm-icp',
  },
  posicionamiento: {
    titulo: 'Que se vea por qué elegirte',
    loQueVes: 'Acabas negociando precio y tu web podría ser la de cualquier competidor. Cuesta explicar en una frase qué os hace distintos.',
    loQueHayDetras: 'Cuando el cliente no percibe una diferencia, compara lo único que puede comparar, el precio. No es que tu producto no valga más. Es que el mensaje no le da motivos para pensarlo, y cada persona de tu equipo lo cuenta a su manera.',
    pasos: [
      'Pregunta a cinco clientes por qué te eligieron y apunta sus palabras exactas.',
      'Pon tu web al lado de la de tres competidores y tacha lo que diríais todos.',
      'Escribe en una frase lo que solo tú puedes decir.',
    ],
    servicio: 'Construimos contigo un posicionamiento y un mensaje que muestren tu valor, para que el precio deje de ser la conversación principal.',
    servicioSlug: 'posicionamiento',
  },
  solido: {
    titulo: 'Tienes bases sólidas para crecer',
    loQueVes: 'Sabes a quién vendes, las ventas no dependen de una sola persona y tu propuesta se distingue de la competencia.',
    loQueHayDetras: 'Es una buena base. El riesgo aparece al escalar, cuando entran personas, mercados o productos nuevos y la coherencia se diluye sin que nadie lo note.',
    pasos: [
      'Documenta lo que hoy funciona para que no dependa de la memoria de nadie.',
      'Revisa cada seis meses si tu cliente ideal sigue siendo el mismo.',
      'Antes de abrir un mercado nuevo, comprueba que tu mensaje sigue siendo distinto allí.',
    ],
    servicio: 'Si preparas una nueva etapa de crecimiento, podemos ayudarte a revisar la estrategia y mensaje antes de invertir más.',
  },
};
