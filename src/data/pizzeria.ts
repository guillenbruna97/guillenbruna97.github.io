// Contenido del juego "La pizzería B2B" (/recursos/minijuegos/pizzeria-b2b/).
// Cada momento de la pizzería es una fase del proceso comercial B2B. El
// cliente lleva un medidor de hambre (su interés como lead) de 0 a 100:
// cada decisión lo sube o lo baja y, si llega a 0, se levanta y se va.
//
// Cada momento tiene tres opciones con el mismo patrón, para que ninguna
// respuesta sea discutible: una claramente buena, una a medias (lo que
// hace mucha gente, no es un error grave) y una claramente mala.
//
// Regla de copy: sin dos puntos ni guiones largos en los textos visibles.

export type Calidad = 'bien' | 'regular' | 'mal';

export interface Opcion {
  texto: string;
  // Cambio de hambre. En el primer momento es el hambre inicial.
  delta: number;
  // Bocadillo del cliente en la escena.
  reaccion: string;
  // Qué significa esa decisión en una empresa B2B.
  b2b: string;
  calidad: Calidad;
  // Marca que guarda la decisión para momentos posteriores.
  marca?: string;
  // Variante si antes se tomó la decisión que deja esa marca.
  siMarca?: { marca: string; delta: number; reaccion: string; b2b: string; calidad: Calidad };
  // Solo en la calle: texto del cartel, gente que atrae y qué viene buscando.
  rotulo?: string;
  gente?: number;
  interes?: string;
}

export interface Momento {
  id: string;
  nombre: string;
  b2b: string;
  pregunta: string;
  opciones: Opcion[];
  // Si el hambre llega a este umbral, el momento se resuelve solo.
  automatico?: { umbral: number; texto: string; reaccion: string; b2b: string };
}

export const HAMBRE_VUELVE = 60;
export const HAMBRE_RECOMIENDA = 85;
export const HAMBRE_POSTRE = 50;
export const PRECIO_PIZZA = 14;
export const PRECIO_POSTRE = 5.5;

export const MOMENTOS: Momento[] = [
  {
    id: 'calle',
    nombre: 'La calle',
    b2b: 'Atracción',
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
    id: 'puerta',
    nombre: 'La puerta',
    b2b: 'Captación de datos',
    pregunta: 'El cliente entra con el folleto en la mano. ¿Qué haces?',
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
        reaccion: '¿Todo esto para cenar?',
        b2b: 'Cada campo de más es una razón para irse. Si un dato no cambia lo que vas a hacer con ese contacto, no lo pidas todavía.',
        calidad: 'mal',
      },
    ],
  },
  {
    id: 'espera',
    nombre: 'La espera',
    b2b: 'Seguimiento personalizado',
    pregunta: 'Ya está en su mesa y todavía no ha pedido. ¿Qué le llevas?',
    opciones: [
      {
        texto: 'Un aperitivo relacionado con lo que vino buscando',
        delta: 25,
        reaccion: 'Justo lo que me apetecía',
        b2b: 'Es el seguimiento que conecta con lo que el contacto descargó o preguntó. Siente que le escuchas y el interés sube solo.',
        calidad: 'bien',
        siMarca: {
          marca: 'sinInteres',
          delta: 5,
          reaccion: 'Algo me han traído…',
          b2b: 'En la puerta solo apuntaste su email, así que le llevas algo al azar. Personalizar exige haber preguntado antes.',
          calidad: 'regular',
        },
      },
      {
        texto: 'El mismo aperitivo que a todas las mesas',
        delta: 5,
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
    id: 'llamada',
    nombre: 'La llamada',
    b2b: 'Paso al equipo comercial',
    pregunta: '¿Cómo llega el camarero a la mesa?',
    automatico: {
      umbral: 70,
      texto: 'El cliente levanta la mano y llama él al camarero.',
      reaccion: '¡Camarero, cuando pueda!',
      b2b: 'Cuando el seguimiento funciona, el contacto pide hablar con ventas por su cuenta. Tu equipo comercial atiende a quien ya está listo y no persigue a nadie.',
    },
    opciones: [
      {
        texto: 'Mandas al camarero a preguntar qué tal va todo',
        delta: 15,
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
      },
      {
        texto: 'El camarero llega recitando la oferta del día',
        delta: -20,
        reaccion: 'No le he preguntado nada',
        b2b: 'Es la llamada en frío con el argumentario de memoria. Hablar del producto antes de escuchar al cliente enfría la conversación.',
        calidad: 'mal',
      },
    ],
  },
  {
    id: 'pedido',
    nombre: 'El pedido',
    b2b: 'Reunión de descubrimiento',
    pregunta: 'El camarero ya está en la mesa. ¿Cómo toma nota?',
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
    id: 'carta',
    nombre: 'La carta',
    b2b: 'Propuesta',
    pregunta: 'Ahora le toca decidir. ¿Qué le enseñas?',
    opciones: [
      {
        texto: 'Una recomendación con lo que te ha contado y su precio',
        delta: 20,
        reaccion: 'Esa misma, perfecto',
        b2b: 'Una propuesta clara recoge lo que el cliente te dijo, plantea una solución y pone el precio a la vista. Así decidir resulta fácil.',
        calidad: 'bien',
      },
      {
        texto: 'La carta completa con cuarenta pizzas',
        delta: -10,
        reaccion: 'No sé ni por dónde empezar',
        b2b: 'Es la propuesta con todo tu catálogo. No engaña ni esconde nada, pero tantas opciones frenan la decisión.',
        calidad: 'regular',
      },
      {
        texto: 'La pizza que pidió, sin precio, y ya hablaremos',
        delta: -20,
        reaccion: '¿Y esto cuánto cuesta?',
        b2b: 'Esconder el precio genera desconfianza. Un decisor necesita saber qué compra y cuánto cuesta para poder decir que sí.',
        calidad: 'mal',
      },
    ],
  },
  {
    id: 'servicio',
    nombre: 'Cocina y servicio',
    b2b: 'Trabajo y entrega',
    pregunta: 'La pizza está en el horno. ¿Cómo sale a la mesa?',
    opciones: [
      {
        texto: 'Como se pidió y a su hora, y si hay retraso se avisa',
        delta: 20,
        reaccion: 'Tal cual la imaginaba',
        b2b: 'Entregar lo prometido en el plazo acordado, y avisar antes de que el cliente pregunte, convierte una venta en confianza.',
        calidad: 'bien',
      },
      {
        texto: 'Sale perfecta, pero media hora tarde y sin explicaciones',
        delta: -10,
        reaccion: 'Buenísima, pero qué espera',
        b2b: 'El trabajo es bueno, pero entregarlo tarde y en silencio deja mal sabor. Comunicar los retrasos también es parte del servicio.',
        calidad: 'regular',
      },
      {
        texto: 'Cambias un ingrediente porque se acabó y no dices nada',
        delta: -25,
        reaccion: 'Esto no es lo que pedí',
        b2b: 'Cambiar el alcance sin avisar rompe la confianza aunque el resultado sea bueno. El cliente recuerda la sorpresa, no la pizza.',
        calidad: 'mal',
      },
    ],
  },
  {
    id: 'sobremesa',
    nombre: 'La sobremesa',
    b2b: 'Posventa',
    pregunta: 'Ha terminado de comer. ¿Qué haces ahora?',
    opciones: [
      {
        texto: 'Pasas a preguntar qué tal y le ofreces el postre que va con lo que ha comido',
        delta: 15,
        marca: 'postre',
        reaccion: 'Pues sí, algo dulce',
        b2b: 'Es el seguimiento posventa. Preguntas cómo ha ido y ofreces lo siguiente que de verdad necesita. Un cliente contento es tu mejor oportunidad de venta.',
        calidad: 'bien',
      },
      {
        texto: 'Le llevas la cuenta sin pasar por la mesa',
        delta: -5,
        reaccion: 'Vale, ya me voy',
        b2b: 'No haces nada mal, pero entregar y desaparecer cierra la relación. Si no preguntas, nunca sabrás qué más podría necesitar.',
        calidad: 'regular',
      },
      {
        texto: 'Le ofreces tres postres, un licor y el menú de la semana que viene',
        delta: -15,
        reaccion: 'Solo quería la cuenta',
        b2b: 'Insistir con todo tu catálogo justo al terminar suena a que solo te interesa la siguiente factura.',
        calidad: 'mal',
      },
    ],
  },
];

// Desenlace según el hambre con la que sale el cliente.
export const DESENLACES = {
  recomienda: {
    titulo: 'Vuelve la semana que viene y trae a tres amigos',
    b2b: 'Recompra y recomendación. Es el cliente que alimenta tu pipeline sin que tengas que salir a buscar a nadie.',
  },
  vuelve: {
    titulo: 'Volverá, aunque no se lo contará a nadie',
    b2b: 'Has retenido al cliente, pero todavía no habla de ti. Una posventa más cuidada lo convierte en tu mejor comercial.',
  },
  noVuelve: {
    titulo: 'Ha cenado, pero no volverá',
    b2b: 'Has vendido una vez. Sin una buena experiencia de principio a fin, cada venta nueva te obliga a empezar desde la calle.',
  },
  seVa: {
    titulo: 'Se ha levantado y se ha ido sin pedir',
    b2b: 'Es el contacto que se pierde por el camino. Todo lo que invertiste en atraerlo se queda sin retorno.',
  },
};
