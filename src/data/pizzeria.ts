// Contenido del juego "La pizzería B2B" (/recursos/minijuegos/pizzeria-b2b/).
// Cada momento de la pizzería es una fase del proceso comercial B2B. El
// cliente lleva un medidor de hambre (su interés como lead) de 0 a 100:
// cada decisión lo sube o lo baja y, si llega a 0, se levanta y se va.
//
// Para que cada partida sea distinta:
// - Entra un perfil de cliente al azar y algunas respuestas puntúan
//   distinto según el perfil (porPerfil), como en B2B no se vende igual
//   a un CEO con prisa que a un comité de compra.
// - Cada momento tiene varios planteamientos (variantes) y sale uno al
//   azar. Los que llevan `evento` son imprevistos (como mucho uno por
//   partida).
// - Cada planteamiento tiene tres opciones con el mismo patrón, una
//   claramente buena, una a medias (lo habitual, no un error grave) y una
//   claramente mala.
//
// Regla de copy: sin dos puntos ni guiones largos en los textos visibles.

export type Calidad = 'bien' | 'regular' | 'mal';
export type PerfilId = 'prisa' | 'grupo' | 'compara';
export type NivelId = 'facil' | 'normal' | 'dificil';

// Lo que cambia de una opción para un perfil concreto.
export interface Ajuste {
  delta?: number;
  calidad?: Calidad;
  reaccion?: string;
  b2b?: string;
}

// Claves de lo que se ve en la escena 3D al elegir una opción.
export type ClaveEscena =
  | 'formulario' | 'aperitivo' | 'camarero' | 'cartaCorta' | 'cartaLarga'
  | 'pizza' | 'pizzaTarde' | 'pizzaMal' | 'postre' | 'cuenta' | 'extras' | 'caja';

export interface Opcion {
  texto: string;
  // Cambio de hambre. En el primer momento es el hambre inicial.
  delta: number;
  // Bocadillo del cliente en la escena.
  reaccion: string;
  // Qué significa esa decisión en una empresa B2B.
  b2b: string;
  calidad: Calidad;
  escena?: ClaveEscena[];
  // Venta adicional que aparece en el ticket si el cliente sale contento.
  venta?: { concepto: string; precio: number };
  // Marca que guarda la decisión para momentos posteriores.
  marca?: string;
  // Variante si antes se tomó la decisión que deja esa marca.
  siMarca?: { marca: string } & Ajuste;
  porPerfil?: Partial<Record<PerfilId, Ajuste>>;
  // Solo en la calle: texto del cartel, gente que atrae y qué viene buscando.
  rotulo?: string;
  gente?: number;
  interes?: string;
}

export interface Variante {
  id: string;
  pregunta: string;
  // Etiqueta de imprevisto. Como mucho sale uno por partida.
  evento?: string;
  // Si existe, el planteamiento solo sale con estos perfiles.
  soloPerfiles?: PerfilId[];
  opciones: Opcion[];
}

export interface Momento {
  id: string;
  nombre: string;
  b2b: string;
  variantes: Variante[];
  // Si el hambre llega al umbral del nivel, el momento se resuelve solo.
  automatico?: { texto: string; reaccion: string; b2b: string };
}

export interface Perfil {
  id: PerfilId;
  nombre: string;
  // Cómo se presenta en la pizzería y qué es en B2B.
  pizza: string;
  b2b: string;
  // Consejo que se enseña antes de empezar.
  pista: string;
}

export interface Nivel {
  id: NivelId;
  nombre: string;
  descripcion: string;
  // Se ve el número exacto del hambre.
  numero: boolean;
  // Se ve la explicación B2B después de cada decisión.
  explicacion: boolean;
  // Segundos de margen antes de que el cliente se impaciente y cada
  // cuántos segundos pierde un punto de hambre después.
  paciencia: { margen: number; cada: number } | null;
  // Multiplicadores de lo que suma y lo que resta cada decisión.
  multSuma: number;
  multResta: number;
  // Hambre a partir de la cual el cliente llama solo al camarero.
  umbralAuto: number;
}

export const NIVELES: Nivel[] = [
  {
    id: 'facil',
    nombre: 'Fácil',
    descripcion: 'Ves el hambre exacta y la explicación de cada decisión.',
    numero: true,
    explicacion: true,
    paciencia: null,
    multSuma: 1,
    multResta: 1,
    umbralAuto: 70,
  },
  {
    id: 'normal',
    nombre: 'Normal',
    descripcion: 'El cliente se impacienta si tardas en decidir y ya no ves el número exacto.',
    numero: false,
    explicacion: true,
    paciencia: { margen: 14, cada: 1.5 },
    multSuma: 1,
    multResta: 1.1,
    umbralAuto: 75,
  },
  {
    id: 'dificil',
    nombre: 'Difícil',
    descripcion: 'Se impacienta antes, los errores pesan más y las explicaciones llegan al final.',
    numero: false,
    explicacion: false,
    paciencia: { margen: 8, cada: 1 },
    multSuma: 0.85,
    multResta: 1.3,
    umbralAuto: 80,
  },
];

export const PERFILES: Perfil[] = [
  {
    id: 'prisa',
    nombre: 'El que tiene prisa',
    pizza: 'Viene en traje, mira el reloj y tiene media hora para comer.',
    b2b: 'Es el CEO o el director general que decide solo y tiene muy poco tiempo.',
    pista: 'Ve al grano. Valora que le ahorres tiempo y le propongas algo concreto.',
  },
  {
    id: 'grupo',
    nombre: 'La mesa de cuatro',
    pizza: 'Viene con dos compañeros de trabajo y cada uno quiere una cosa.',
    b2b: 'Es el comité de compra, donde varias personas opinan y deciden juntas.',
    pista: 'Aquí no decide una sola persona. Escucha a todos antes de proponer.',
  },
  {
    id: 'compara',
    nombre: 'El que compara',
    pizza: 'Llega con el móvil en la mano mirando la carta de la pizzería de enfrente.',
    b2b: 'Es el cliente que pide tres presupuestos y compara antes de decidir.',
    pista: 'Necesita saber por qué tú y cuánto cuesta. No escondas el precio.',
  },
];

export const HAMBRE_VUELVE = 60;
export const HAMBRE_RECOMIENDA = 85;
export const HAMBRE_POSTRE = 50;
export const PRECIO_PIZZA = 14;

const PIZZA_TARDE: ClaveEscena[] = ['pizzaTarde'];

export const MOMENTOS: Momento[] = [
  {
    id: 'calle',
    nombre: 'La calle',
    b2b: 'Atracción',
    variantes: [
      {
        id: 'calle-cartel',
        pregunta: '¿Qué pones en la calle para que entre gente con ganas de comer?',
        opciones: [
          {
            texto: 'Un cartel que pregunta qué pizza va contigo',
            rotulo: '¿Qué pizza va contigo?',
            gente: 3,
            interes: 'saber qué pizza le encaja',
            delta: 55,
            reaccion: 'A ver qué me sale',
            b2b: 'Es el autodiagnóstico. Entra menos gente, pero cada uno llega pensando en su problema y con ganas de resolverlo. Además ya sabes qué le interesa.',
            calidad: 'bien',
          },
          {
            texto: 'Folletos con una guía de recetas gratis',
            rotulo: 'Guía de recetas gratis',
            gente: 6,
            interes: 'la guía de recetas',
            delta: 35,
            reaccion: 'Me llevo la guía y ya veré',
            b2b: 'Es el ebook o la guía descargable. Atrae a mucha gente, pero buena parte viene a por el regalo y no a comprar. Sirve, siempre que después hagas seguimiento.',
            calidad: 'regular',
            porPerfil: {
              prisa: { delta: 25, reaccion: 'No tengo tiempo para leer esto', b2b: 'Un decisor con prisa no va a leerse una guía. Le has hecho entrar, pero con muy poco interés.' },
            },
          },
          {
            texto: 'Un cartel que dice que tienes la mejor pizza de la ciudad',
            rotulo: 'La mejor pizza de la ciudad',
            gente: 2,
            interes: 'comprobar si es verdad',
            delta: 15,
            reaccion: 'Eso lo dicen todos',
            b2b: 'Es el anuncio que habla de ti y no de quien lo lee. No le da nada al que pasa por delante y tampoco te dice quién es ni qué busca.',
            calidad: 'mal',
          },
        ],
      },
      {
        id: 'calle-presupuesto',
        pregunta: 'Este mes solo puedes pagar una acción en la calle. ¿Cuál eliges?',
        opciones: [
          {
            texto: 'Dar a probar una porción a quien pase por delante',
            rotulo: 'Prueba una porción gratis',
            gente: 4,
            interes: 'probar antes de pedir',
            delta: 50,
            reaccion: 'Esto está buenísimo',
            b2b: 'Es la demo o la prueba gratuita. Quien prueba sabe lo que se lleva y entra con ganas. Atraes menos gente que con un anuncio masivo, pero más interesada.',
            calidad: 'bien',
          },
          {
            texto: 'Una cuña en la radio local',
            rotulo: 'Escúchanos en la radio',
            gente: 5,
            interes: 'conocer el sitio del anuncio',
            delta: 30,
            reaccion: 'Me sonaba el nombre',
            b2b: 'Es la publicidad masiva sin segmentar. Te conoce mucha gente, pero no sabes quién ha venido por ella ni qué busca.',
            calidad: 'regular',
          },
          {
            texto: 'Un cartel con un 50 % de descuento solo hoy',
            rotulo: '50 % de descuento hoy',
            gente: 6,
            interes: 'el descuento',
            delta: 20,
            reaccion: '¿Seguro que es la mitad?',
            b2b: 'Atraer por precio llena el local de gente que viene por la oferta y no por ti. Cuando quites el descuento, se irán a la siguiente.',
            calidad: 'mal',
            porPerfil: {
              compara: { delta: 35, calidad: 'regular', reaccion: 'Esto sí me interesa', b2b: 'Al que compara le atrae, pero entra pensando en el descuento y no en tu pizza. Te costará venderle algo más.' },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'puerta',
    nombre: 'La puerta',
    b2b: 'Captación de datos',
    variantes: [
      {
        id: 'puerta-datos',
        pregunta: 'El cliente entra por la puerta. ¿Qué haces?',
        opciones: [
          {
            texto: 'Le preguntas su nombre y qué le ha traído hasta aquí',
            delta: 10,
            reaccion: 'Qué detalle',
            b2b: 'Pide solo los datos que vas a usar. Con el nombre y lo que le interesó ya puedes personalizar todo lo que viene después.',
            calidad: 'bien',
          },
          {
            texto: 'Le pides el email para mandarle las ofertas de la semana',
            delta: 0,
            marca: 'sinInteres',
            reaccion: 'Vale, toma',
            b2b: 'Entra en tu base de datos, pero solo como un email más. Sin saber qué le interesó, todo lo que le mandes después será genérico.',
            calidad: 'regular',
          },
          {
            texto: 'Le das un formulario de quince campos antes de sentarse',
            delta: -25,
            escena: ['formulario'],
            reaccion: '¿Todo esto para cenar?',
            b2b: 'Cada campo de más es una razón para irse. Si un dato no cambia lo que vas a hacer con ese contacto, no lo pidas todavía.',
            calidad: 'mal',
            porPerfil: {
              prisa: { delta: -35, reaccion: 'No tengo tiempo para esto', b2b: 'A un decisor con prisa, un formulario largo le echa directamente. Cada minuto que le haces perder cuenta.' },
            },
          },
        ],
      },
      {
        id: 'puerta-cola',
        pregunta: 'Hay cola en la puerta y el cliente duda si esperar. ¿Qué haces?',
        evento: 'Imprevisto',
        opciones: [
          {
            texto: 'Le saludas, le dices cuánto tardará la mesa y apuntas su nombre',
            delta: 10,
            reaccion: 'Vale, espero',
            b2b: 'Cuando hay más demanda que capacidad, la transparencia retiene. Decir cuánto tarda y apuntar el contacto evita que se vaya a la competencia.',
            calidad: 'bien',
          },
          {
            texto: 'Le das un número y que espere su turno',
            delta: -5,
            marca: 'sinInteres',
            reaccion: '¿Y cuánto será?',
            b2b: 'Lo retienes, pero no sabes nada de él ni le das ninguna certeza. Es como un formulario que solo pide el email.',
            calidad: 'regular',
          },
          {
            texto: 'Le dices que hoy no hay sitio y que vuelva otro día',
            delta: -25,
            reaccion: 'Pues me voy enfrente',
            b2b: 'Rechazar a un contacto interesado porque no tienes capacidad es regalárselo a la competencia. Siempre hay forma de retenerlo.',
            calidad: 'mal',
            porPerfil: {
              prisa: { delta: -35, b2b: 'A un decisor con prisa no le puedes pedir que vuelva. Si hoy no le atiendes, buscará a otro.' },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'espera',
    nombre: 'La espera',
    b2b: 'Seguimiento personalizado',
    variantes: [
      {
        id: 'espera-aperitivo',
        pregunta: 'Ya está en su mesa y todavía no ha pedido. ¿Qué le llevas?',
        opciones: [
          {
            texto: 'Un aperitivo relacionado con lo que vino buscando',
            delta: 25,
            escena: ['aperitivo'],
            reaccion: 'Justo lo que me apetecía',
            b2b: 'Es el seguimiento que conecta con lo que el contacto descargó o preguntó. Siente que le escuchas y el interés sube solo.',
            calidad: 'bien',
            siMarca: {
              marca: 'sinInteres',
              delta: 5,
              reaccion: 'Algo me han traído…',
              b2b: 'En la puerta no apuntaste qué le interesaba, así que le llevas algo al azar. Personalizar exige haber preguntado antes.',
              calidad: 'regular',
            },
          },
          {
            texto: 'El mismo aperitivo que a todas las mesas',
            delta: 5,
            escena: ['aperitivo'],
            reaccion: 'Está bien, sin más',
            b2b: 'Es la newsletter genérica que recibe toda la base de datos. No molesta, pero tampoco acerca a nadie a la compra.',
            calidad: 'regular',
          },
          {
            texto: 'Nada, ya pedirá cuando quiera',
            delta: -20,
            reaccion: '¿Se han olvidado de mí?',
            b2b: 'Un contacto sin seguimiento se enfría. Cuando vuelvas a escribirle quizá ya ni recuerde por qué entró.',
            calidad: 'mal',
          },
        ],
      },
      {
        id: 'espera-insistir',
        pregunta: 'Han pasado unos minutos y el cliente sigue sin pedir. ¿Qué haces?',
        opciones: [
          {
            texto: 'Pasas una vez a contarle la especialidad que va con lo que busca',
            delta: 20,
            escena: ['aperitivo'],
            reaccion: 'Pues eso suena bien',
            b2b: 'Es el seguimiento con contenido útil. Una vez, en el momento justo y con algo que le interesa de verdad.',
            calidad: 'bien',
            siMarca: {
              marca: 'sinInteres',
              delta: 5,
              reaccion: 'No es lo que buscaba',
              b2b: 'Como no sabes qué le interesaba, le cuentas la especialidad que no es. El seguimiento útil empieza por preguntar.',
              calidad: 'regular',
            },
          },
          {
            texto: 'Le dejas una tarjeta con la web por si quiere mirar la carta',
            delta: 0,
            reaccion: 'Ya la miraré',
            b2b: 'Es mandar al contacto a tu web y esperar. No molesta, pero dejas el siguiente paso en sus manos.',
            calidad: 'regular',
            porPerfil: {
              prisa: { delta: -10, reaccion: 'No tengo tiempo de mirar webs', b2b: 'Un decisor con prisa no va a investigar por su cuenta. Si no le facilitas el paso, no lo dará.' },
            },
          },
          {
            texto: 'Pasas cada dos minutos a preguntar si ya sabe qué quiere',
            delta: -15,
            reaccion: 'Que sí, que ya le aviso',
            b2b: 'Es la secuencia de emails diaria que acaba en spam. Insistir sin aportar nada agota al contacto.',
            calidad: 'mal',
            porPerfil: {
              grupo: { delta: -20, reaccion: 'Nos estamos poniendo de acuerdo', b2b: 'Un comité necesita tiempo para hablarlo. Presionar mientras deliberan solo genera rechazo.' },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'llamada',
    nombre: 'La llamada',
    b2b: 'Paso al equipo comercial',
    automatico: {
      texto: 'El cliente levanta la mano y llama él al camarero.',
      reaccion: '¡Camarero, cuando pueda!',
      b2b: 'Cuando el seguimiento funciona, el contacto pide hablar con ventas por su cuenta. Tu equipo comercial atiende a quien ya está listo y no persigue a nadie.',
    },
    variantes: [
      {
        id: 'llamada-como',
        pregunta: '¿Cómo llega el camarero a la mesa?',
        opciones: [
          {
            texto: 'Mandas al camarero a preguntar qué tal va todo',
            delta: 15,
            escena: ['camarero'],
            reaccion: 'Ahora que lo dice, sí',
            b2b: 'Si el contacto no da el paso solo, tu equipo comercial se acerca con contexto y sin presión. Sabe qué le trajo y por dónde empezar.',
            calidad: 'bien',
          },
          {
            texto: 'Esperas a que levante la mano',
            delta: -10,
            reaccion: 'Llevo un rato aquí…',
            b2b: 'No molestas, pero un contacto tibio rara vez pide una reunión por su cuenta. Mientras esperas, se enfría.',
            calidad: 'regular',
            porPerfil: {
              prisa: { delta: -20, calidad: 'mal', reaccion: 'Me voy a tener que ir', b2b: 'Con un decisor con prisa, esperar a que te llame es perderlo. Su tiempo vale más que tu comodidad.' },
            },
          },
          {
            texto: 'El camarero llega recitando la oferta del día',
            delta: -20,
            escena: ['camarero'],
            reaccion: 'No le he preguntado nada',
            b2b: 'Es la llamada en frío con el argumentario de memoria. Hablar del producto antes de escuchar al cliente enfría la conversación.',
            calidad: 'mal',
          },
        ],
      },
      {
        id: 'llamada-quien',
        pregunta: 'Hay tres camareros libres. ¿Quién va a la mesa?',
        opciones: [
          {
            texto: 'El que le atendió en la puerta, que ya sabe qué busca',
            delta: 15,
            escena: ['camarero'],
            reaccion: 'Ah, hola otra vez',
            b2b: 'Es el traspaso de marketing a ventas con contexto. Quien llega sabe qué le interesó y no le hace repetir nada.',
            calidad: 'bien',
            siMarca: {
              marca: 'sinInteres',
              delta: 5,
              b2b: 'Va quien le atendió, pero en la puerta solo apuntó su email. El traspaso a ventas solo sirve si hay contexto que traspasar.',
              calidad: 'regular',
            },
          },
          {
            texto: 'El primero que quede libre',
            delta: -5,
            escena: ['camarero'],
            reaccion: '¿Otra vez desde el principio?',
            b2b: 'Atender rápido está bien, pero sin contexto el cliente tiene que contarlo todo de nuevo.',
            calidad: 'regular',
          },
          {
            texto: 'El encargado, que aprovecha para enseñarle el local',
            delta: -15,
            escena: ['camarero'],
            reaccion: 'Muy bonito, pero quería pedir',
            b2b: 'Mandar a alguien a lucirse en vez de a ayudar es la reunión comercial que habla de la empresa y no del cliente.',
            calidad: 'mal',
            porPerfil: {
              prisa: { delta: -25, reaccion: 'No he venido a hacer turismo', b2b: 'Al decisor con prisa, el paseo por el local le cuesta tiempo que no tiene. Es justo lo contrario de lo que necesita.' },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'pedido',
    nombre: 'El pedido',
    b2b: 'Reunión de descubrimiento',
    variantes: [
      {
        id: 'pedido-nota',
        pregunta: 'El camarero ya está en la mesa. ¿Cómo toma nota?',
        soloPerfiles: ['grupo', 'compara'],
        opciones: [
          {
            texto: 'Pregunta qué le apetece, con quién viene y cuánto tiempo tiene',
            delta: 20,
            reaccion: 'Por fin alguien que pregunta',
            b2b: 'Es la reunión de descubrimiento. Antes de proponer nada entiendes qué necesita, quién decide y con qué urgencia.',
            calidad: 'bien',
          },
          {
            texto: 'Le cuenta cómo hacen la masa y de dónde traen la harina',
            delta: -5,
            reaccion: 'Muy bonito, pero tengo hambre',
            b2b: 'Enseñar cómo trabajas suma, pero no en el primer minuto. Si hablas de ti antes de escuchar, el cliente desconecta.',
            calidad: 'regular',
            porPerfil: {
              compara: { delta: 5, reaccion: 'Vale, eso no lo tienen enfrente', b2b: 'Al que compara le sirve saber qué te diferencia, aunque mejor después de escucharle. Aquí te ha salido bien.' },
            },
          },
          {
            texto: 'Le recomienda directamente la pizza más cara',
            delta: -20,
            reaccion: 'Ya, claro, la más cara',
            b2b: 'Vender lo que más te conviene a ti antes de entender al cliente se nota. Pierdes confianza justo cuando más la necesitas.',
            calidad: 'mal',
          },
        ],
      },
      {
        id: 'pedido-comite',
        pregunta: 'El cliente dice que tiene que consultarlo con quienes vienen con él. ¿Qué hace el camarero?',
        soloPerfiles: ['grupo'],
        opciones: [
          {
            texto: 'Pregunta qué le gusta a cada uno y quién tiene la última palabra',
            delta: 25,
            reaccion: 'Buena pregunta, eso lo decide ella',
            b2b: 'Es mapear el comité de compra. En B2B casi nunca decide una sola persona y cada una tiene sus prioridades.',
            calidad: 'bien',
          },
          {
            texto: 'Les deja hablarlo y vuelve en un rato',
            delta: -10,
            reaccion: 'Danos un momento…',
            b2b: 'Dejar que el comité decida solo alarga el ciclo de venta y tú pierdes el control de la conversación.',
            calidad: 'regular',
          },
          {
            texto: 'Insiste al que tiene delante para que pida ya',
            delta: -25,
            reaccion: 'Que no decido yo solo',
            b2b: 'Presionar a un interlocutor que no decide solo genera rechazo, y además le dejas mal delante de los suyos.',
            calidad: 'mal',
          },
        ],
      },
      {
        id: 'pedido-prisa',
        pregunta: 'El cliente avisa de que tiene veinte minutos. ¿Cómo toma nota el camarero?',
        soloPerfiles: ['prisa'],
        opciones: [
          {
            texto: 'Le hace dos preguntas clave y le propone algo que salga rápido',
            delta: 25,
            reaccion: 'Perfecto, así sí',
            b2b: 'Con un decisor sin tiempo, el descubrimiento se hace corto y al grano. Dos preguntas bien elegidas valen más que veinte.',
            calidad: 'bien',
          },
          {
            texto: 'Le hace todas las preguntas de siempre, como a cualquier cliente',
            delta: -10,
            reaccion: '¿Queda mucho?',
            b2b: 'Descubrir está bien, pero adaptado a quien tienes delante. Un proceso rígido desespera a quien tiene prisa.',
            calidad: 'regular',
          },
          {
            texto: 'Le recomienda el menú degustación de siete platos',
            delta: -25,
            reaccion: '¿Siete platos? Tengo veinte minutos',
            b2b: 'Proponer algo que no encaja con el tiempo ni con la necesidad del cliente demuestra que no le has escuchado.',
            calidad: 'mal',
          },
        ],
      },
    ],
  },
  {
    id: 'carta',
    nombre: 'La carta',
    b2b: 'Propuesta',
    variantes: [
      {
        id: 'carta-ensenar',
        pregunta: 'Ahora le toca decidir. ¿Qué le enseñas?',
        opciones: [
          {
            texto: 'Una recomendación con lo que te ha contado y su precio',
            delta: 20,
            escena: ['cartaCorta'],
            reaccion: 'Esa misma, perfecto',
            b2b: 'Una propuesta clara recoge lo que el cliente te dijo, plantea una solución y pone el precio a la vista. Así decidir resulta fácil.',
            calidad: 'bien',
          },
          {
            texto: 'La carta completa con cuarenta pizzas',
            delta: -10,
            escena: ['cartaLarga'],
            reaccion: 'No sé ni por dónde empezar',
            b2b: 'Es la propuesta con todo tu catálogo. No engaña ni esconde nada, pero tantas opciones frenan la decisión.',
            calidad: 'regular',
            porPerfil: {
              prisa: { delta: -20, calidad: 'mal', reaccion: 'No tengo tiempo de leer esto', b2b: 'Un decisor con prisa no va a leer cuarenta opciones. Si no le das una recomendación, la decisión se aplaza.' },
            },
          },
          {
            texto: 'La pizza que pidió, sin precio, y ya hablaremos',
            delta: -20,
            escena: ['cartaCorta'],
            reaccion: '¿Y esto cuánto cuesta?',
            b2b: 'Esconder el precio genera desconfianza. Un decisor necesita saber qué compra y cuánto cuesta para poder decir que sí.',
            calidad: 'mal',
            porPerfil: {
              compara: { delta: -30, reaccion: 'Pues enfrente sí ponen precio', b2b: 'Al que compara, si no le das precio, se lo pedirá a otro. Es lo primero que necesita para decidir.' },
            },
          },
        ],
      },
      {
        id: 'carta-precio',
        pregunta: 'Te pide el precio antes de decidir. ¿Qué le dices?',
        opciones: [
          {
            texto: 'Le das el precio y le explicas qué incluye y por qué lo vale',
            delta: 20,
            escena: ['cartaCorta'],
            reaccion: 'Tiene sentido',
            b2b: 'Es defender el precio con el valor que aporta. El cliente entiende qué compra y lo puede comparar con criterio.',
            calidad: 'bien',
          },
          {
            texto: 'Le ofreces un descuento antes de que lo pida',
            delta: -5,
            escena: ['cartaCorta'],
            reaccion: 'Ah, pues mejor',
            b2b: 'Rebajar sin que te lo pidan resta valor a tu propuesta y enseña al cliente que siempre hay margen.',
            calidad: 'regular',
            porPerfil: {
              compara: { delta: 5, reaccion: 'Así sí te gano a los de enfrente', b2b: 'Al que compara le gusta, pero ya sabe que contigo siempre hay margen. La próxima vez pedirá más.' },
            },
          },
          {
            texto: 'Le dices que depende y que ya lo verá en la cuenta',
            delta: -25,
            reaccion: 'Así no puedo decidir',
            b2b: 'La opacidad en el precio es la forma más rápida de perder la confianza de un decisor.',
            calidad: 'mal',
          },
        ],
      },
      {
        id: 'carta-competencia',
        pregunta: 'El cliente te enseña en el móvil la carta de la pizzería de enfrente, que es más barata. ¿Qué haces?',
        evento: 'Imprevisto',
        opciones: [
          {
            texto: 'Le explicas qué diferencia tu pizza y le dejas decidir',
            delta: 15,
            escena: ['cartaCorta'],
            reaccion: 'Vale, entiendo la diferencia',
            b2b: 'Ante la competencia, explica tu diferencia con hechos y no entres en una guerra de precios.',
            calidad: 'bien',
            porPerfil: {
              compara: { delta: 20 },
            },
          },
          {
            texto: 'Igualas el precio de enfrente',
            delta: -5,
            escena: ['cartaCorta'],
            reaccion: 'Bueno, si cuesta lo mismo…',
            b2b: 'Igualar el precio cierra la venta, pero te convierte en uno más y te quita margen.',
            calidad: 'regular',
          },
          {
            texto: 'Le dices que la de enfrente es mala',
            delta: -20,
            reaccion: 'Eso es lo que diría cualquiera',
            b2b: 'Hablar mal de la competencia resta credibilidad. El cliente quiere saber por qué tú, no por qué ellos no.',
            calidad: 'mal',
          },
        ],
      },
    ],
  },
  {
    id: 'servicio',
    nombre: 'Cocina y servicio',
    b2b: 'Trabajo y entrega',
    variantes: [
      {
        id: 'servicio-salida',
        pregunta: 'La pizza está en el horno. ¿Cómo sale a la mesa?',
        opciones: [
          {
            texto: 'Como se pidió y a su hora, y si hay retraso se avisa',
            delta: 20,
            escena: ['pizza'],
            reaccion: 'Tal cual la imaginaba',
            b2b: 'Entregar lo prometido en el plazo acordado, y avisar antes de que el cliente pregunte, convierte una venta en confianza.',
            calidad: 'bien',
          },
          {
            texto: 'Sale perfecta, pero media hora tarde y sin explicaciones',
            delta: -10,
            escena: PIZZA_TARDE,
            reaccion: 'Buenísima, pero qué espera',
            b2b: 'El trabajo es bueno, pero entregarlo tarde y en silencio deja mal sabor. Comunicar los retrasos también es parte del servicio.',
            calidad: 'regular',
            porPerfil: {
              prisa: { delta: -20, calidad: 'mal', reaccion: 'Ya llego tarde a mi reunión', b2b: 'Para un decisor con prisa, el plazo es parte del producto. Un buen trabajo fuera de tiempo le falla igual.' },
            },
          },
          {
            texto: 'Cambias un ingrediente porque se acabó y no dices nada',
            delta: -25,
            escena: ['pizzaMal'],
            reaccion: 'Esto no es lo que pedí',
            b2b: 'Cambiar el alcance sin avisar rompe la confianza aunque el resultado sea bueno. El cliente recuerda la sorpresa, no la pizza.',
            calidad: 'mal',
          },
        ],
      },
      {
        id: 'servicio-horno',
        pregunta: 'Se ha apagado el horno y la pizza va a tardar veinte minutos más. ¿Qué haces?',
        evento: 'Imprevisto',
        opciones: [
          {
            texto: 'Se lo dices ya, le das el nuevo plazo y le invitas a la bebida',
            delta: 15,
            escena: PIZZA_TARDE,
            reaccion: 'Gracias por avisar',
            b2b: 'Las incidencias pasan. Avisar antes de que el cliente pregunte, con un plazo nuevo y un gesto, convierte el problema en confianza.',
            calidad: 'bien',
          },
          {
            texto: 'Esperas a ver si se arregla antes de decir nada',
            delta: -10,
            escena: PIZZA_TARDE,
            reaccion: '¿Pasa algo con lo mío?',
            b2b: 'Callar mientras intentas arreglarlo parece prudente, pero el cliente nota el retraso y no sabe por qué.',
            calidad: 'regular',
            porPerfil: {
              prisa: { delta: -20, calidad: 'mal', reaccion: 'Me tengo que ir ya', b2b: 'Al decisor con prisa le ocultas justo el dato que más le importa, el plazo. Es lo peor que puedes hacer con él.' },
            },
          },
          {
            texto: 'Sacas una pizza congelada para cumplir el plazo',
            delta: -25,
            escena: ['pizzaMal'],
            reaccion: 'Esto sabe raro',
            b2b: 'Entregar a tiempo algo peor de lo prometido y sin decirlo es cambiar el alcance a escondidas.',
            calidad: 'mal',
          },
        ],
      },
    ],
  },
  {
    id: 'sobremesa',
    nombre: 'La sobremesa',
    b2b: 'Posventa',
    variantes: [
      {
        id: 'sobremesa-postre',
        pregunta: 'Ha terminado de comer. ¿Qué haces ahora?',
        opciones: [
          {
            texto: 'Pasas a preguntar qué tal y le ofreces el postre que va con lo que ha comido',
            delta: 15,
            escena: ['postre'],
            venta: { concepto: 'Postre', precio: 5.5 },
            reaccion: 'Pues sí, algo dulce',
            b2b: 'Es el seguimiento posventa. Preguntas cómo ha ido y ofreces lo siguiente que de verdad necesita. Un cliente contento es tu mejor oportunidad de venta.',
            calidad: 'bien',
            porPerfil: {
              prisa: { reaccion: 'Me lo pongo para llevar', b2b: 'Incluso con prisa, un cliente contento acepta lo que le facilita la vida. La posventa consiste en adaptar la oferta.' },
            },
          },
          {
            texto: 'Le llevas la cuenta sin pasar por la mesa',
            delta: -5,
            escena: ['cuenta'],
            reaccion: 'Vale, ya me voy',
            b2b: 'No haces nada mal, pero entregar y desaparecer cierra la relación. Si no preguntas, nunca sabrás qué más podría necesitar.',
            calidad: 'regular',
          },
          {
            texto: 'Le ofreces tres postres, un licor y el menú de la semana que viene',
            delta: -15,
            escena: ['postre', 'extras'],
            reaccion: 'Solo quería la cuenta',
            b2b: 'Insistir con todo tu catálogo justo al terminar suena a que solo te interesa la siguiente factura.',
            calidad: 'mal',
          },
        ],
      },
      {
        id: 'sobremesa-relacion',
        pregunta: 'El cliente ha terminado y parece contento. ¿Qué haces antes de que se vaya?',
        opciones: [
          {
            texto: 'Le preguntas qué tal y le ofreces llevarse una pizza para la cena',
            delta: 15,
            escena: ['caja'],
            venta: { concepto: 'Pizza para llevar', precio: 12 },
            reaccion: 'Buena idea, así ceno resuelto',
            b2b: 'Es la venta cruzada bien hecha. Partes de cómo ha ido y le ofreces algo que encaja con su vida, no con tu objetivo del mes.',
            calidad: 'bien',
            porPerfil: {
              grupo: { reaccion: 'Nos llevamos una para la oficina', b2b: 'Con un comité contento, la venta cruzada se multiplica porque cada uno ve una necesidad distinta.' },
            },
          },
          {
            texto: 'Le pides que deje una reseña de cinco estrellas antes de irse',
            delta: -5,
            escena: ['cuenta'],
            reaccion: 'Bueno, ya veré',
            b2b: 'Pedir el testimonio está bien, pero exigirlo antes de saber si está contento suena interesado.',
            calidad: 'regular',
          },
          {
            texto: 'Le apuntas a la newsletter sin preguntarle',
            delta: -15,
            escena: ['cuenta'],
            reaccion: 'Yo no he pedido esto',
            b2b: 'Meter a un cliente en comunicaciones que no ha pedido estropea una buena experiencia justo al final del camino.',
            calidad: 'mal',
          },
        ],
      },
    ],
  },
];

// Se usa cuando el cliente se va porque has tardado demasiado en decidir.
export const IMPACIENCIA = {
  texto: 'Tardaste demasiado en decidir',
  b2b: 'Un lead que espera sin respuesta se enfría solo. En B2B la velocidad de respuesta es parte de la experiencia.',
};

// Desenlace según el hambre con la que sale el cliente.
export const DESENLACES = {
  recomienda: {
    titulo: 'Vuelve la semana que viene y trae a tres amigos',
    b2b: 'Recompra y recomendación. Es el cliente que alimenta tu pipeline sin que tengas que salir a buscar a nadie.',
    estrellas: 3,
  },
  vuelve: {
    titulo: 'Volverá, aunque no se lo contará a nadie',
    b2b: 'Has retenido al cliente, pero todavía no habla de ti. Una posventa más cuidada lo convierte en tu mejor comercial.',
    estrellas: 2,
  },
  noVuelve: {
    titulo: 'Ha cenado, pero no volverá',
    b2b: 'Has vendido una vez. Sin una buena experiencia de principio a fin, cada venta nueva te obliga a empezar desde la calle.',
    estrellas: 1,
  },
  seVa: {
    titulo: 'Se ha levantado y se ha ido sin pedir',
    b2b: 'Es el contacto que se pierde por el camino. Todo lo que invertiste en atraerlo se queda sin retorno.',
    estrellas: 0,
  },
};

// Modo jornada: varios clientes seguidos y una caja final del día.
export const CLIENTES_JORNADA = 3;

// Balance de la jornada según las estrellas sumadas (máximo 9).
export const JORNADA = [
  {
    minimo: 8,
    titulo: 'Jornada redonda',
    b2b: 'Has adaptado tu proceso comercial a cada tipo de cliente. Es justo lo que separa a una empresa que vende de vez en cuando de una que vende siempre.',
  },
  {
    minimo: 5,
    titulo: 'Buena jornada, con margen de mejora',
    b2b: 'Tu proceso funciona con algunos clientes y se resiente con otros. Fíjate en qué momento se te enfrían más, porque ahí está tu siguiente mejora.',
  },
  {
    minimo: 0,
    titulo: 'Jornada floja',
    b2b: 'Los clientes se enfrían en varios puntos del camino. El problema no es que falten clientes, es un proceso que no los acompaña hasta el final.',
  },
];

// Informe que se desbloquea al dejar los datos al final del juego: el
// punto débil traducido a una empresa B2B, tres acciones para empezar y el
// servicio que encaja. `general` se usa si no hay ningún punto débil.
export interface Informe {
  titulo: string;
  diagnostico: string;
  pasos: [string, string, string];
  servicio: 'pipeline' | 'gtm-icp' | 'posicionamiento';
}

export const INFORMES: Record<string, Informe> = {
  calle: {
    titulo: 'Atraes, pero no a quien te compra',
    diagnostico: 'Tu marketing genera contactos, pero muchos llegan por curiosidad o por el regalo y no porque tengan el problema que resuelves. El resto del proceso comercial carga con leads que nunca iban a comprar.',
    pasos: [
      'Escribe en una frase quién es tu cliente ideal. Sector, tamaño, cargo que decide y el problema que más le preocupa.',
      'Revisa tus últimos diez contactos y marca cuántos encajan con esa frase. Esa proporción es la calidad real de tu atracción.',
      'Cambia un lead magnet genérico por uno que solo interese a quien tiene el problema, como un diagnóstico o una calculadora.',
    ],
    servicio: 'gtm-icp',
  },
  puerta: {
    titulo: 'Captas contactos, pero no lo que necesitas saber de ellos',
    diagnostico: 'Tus formularios piden demasiado o demasiado poco. O el contacto abandona antes de enviarlo, o llega a tu CRM sin el dato que te permitiría hacerle un seguimiento útil.',
    pasos: [
      'Repasa cada campo de tus formularios y quita los que no cambian lo que haces con ese contacto.',
      'Añade una sola pregunta sobre qué le ha traído o qué problema quiere resolver.',
      'Comprueba que ese dato llega a tu CRM y que alguien lo usa en el primer seguimiento.',
    ],
    servicio: 'pipeline',
  },
  espera: {
    titulo: 'Tus contactos se enfrían mientras esperan',
    diagnostico: 'Entre que alguien te deja sus datos y que habla con tu equipo pasa demasiado tiempo, o le llegan comunicaciones genéricas que no conectan con lo que buscaba.',
    pasos: [
      'Mide cuántos días pasan de media entre el primer contacto y la primera respuesta personalizada.',
      'Prepara un primer seguimiento distinto para cada motivo de entrada, aunque sean solo dos o tres versiones.',
      'Sustituye un envío masivo de este mes por un mensaje útil a los contactos que más encajan.',
    ],
    servicio: 'pipeline',
  },
  llamada: {
    titulo: 'El paso de marketing a ventas se pierde por el camino',
    diagnostico: 'Ventas llega tarde, llega sin contexto o llega hablando del producto. El contacto tiene que repetirlo todo o siente que le persiguen.',
    pasos: [
      'Define qué tiene que pasar para que un contacto pase a ventas, por ejemplo una acción concreta o una respuesta.',
      'Haz que cada traspaso incluya qué le interesó y qué ha visto, en una nota de tres líneas.',
      'Fija un plazo máximo para el primer contacto comercial y revísalo cada semana.',
    ],
    servicio: 'pipeline',
  },
  pedido: {
    titulo: 'Propones antes de entender',
    diagnostico: 'Tus reuniones comerciales empiezan contando quién eres y qué haces. Cuando llega la propuesta, todavía no sabes quién decide, con qué urgencia ni qué pasa si no hace nada.',
    pasos: [
      'Prepara cinco preguntas de descubrimiento y úsalas antes de enseñar nada.',
      'Apunta en cada oportunidad quién decide, quién influye y para cuándo lo necesitan.',
      'En tu próxima reunión, fíjate en cuánto tiempo habla el cliente y cuánto tu equipo.',
    ],
    servicio: 'pipeline',
  },
  carta: {
    titulo: 'Tus propuestas no ayudan a decidir',
    diagnostico: 'Envías catálogos, opciones de más o precios poco claros. El cliente no ve por qué tú y lo deja para otro día, o te compara solo por precio.',
    pasos: [
      'Abre tu última propuesta y comprueba si en la primera página aparece lo que el cliente te contó.',
      'Reduce las opciones a una recomendación clara y, como mucho, una alternativa.',
      'Escribe en dos frases por qué tú y no la alternativa más barata, y llévalas a todas las propuestas.',
    ],
    servicio: 'posicionamiento',
  },
  servicio: {
    titulo: 'La entrega no está a la altura de lo que vendiste',
    diagnostico: 'Cambios de alcance sin avisar, retrasos que el cliente descubre por su cuenta o expectativas que nadie fijó. Lo que vendió tu equipo comercial se resiente en el día a día.',
    pasos: [
      'Escribe qué se entrega, cuándo y cómo se mide, y compártelo con el cliente al empezar.',
      'Acuerda una regla interna para avisar de cualquier retraso antes de que el cliente pregunte.',
      'Pregunta a tus tres últimos clientes qué les sorprendió para mal durante el proyecto.',
    ],
    servicio: 'pipeline',
  },
  sobremesa: {
    titulo: 'Vendes una vez y desapareces',
    diagnostico: 'Cuando termina el proyecto, se acaba la relación. No preguntas cómo ha ido, no detectas nuevas necesidades y las recomendaciones dependen de la suerte.',
    pasos: [
      'Programa una llamada de seguimiento a las dos semanas de cada entrega, sin intención de vender.',
      'Apunta en el CRM qué otra necesidad detectas en esa conversación.',
      'Pide una recomendación concreta solo a los clientes que te dicen que están contentos.',
    ],
    servicio: 'pipeline',
  },
  general: {
    titulo: 'Tu proceso aguanta con todos los clientes',
    diagnostico: 'En la pizzería has acompañado bien a cada cliente. La pregunta es si tu empresa lo hace igual de bien cuando hay más volumen, más equipo o menos tiempo.',
    pasos: [
      'Escribe las fases de tu proceso comercial tal y como funcionan hoy, no como deberían funcionar.',
      'Marca en cuál pierdes más oportunidades según tu CRM de los últimos seis meses.',
      'Elige una sola mejora para ese punto y revísala dentro de un mes.',
    ],
    servicio: 'pipeline',
  },
};
