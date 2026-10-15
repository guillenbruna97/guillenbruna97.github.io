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
//   azar, evitando los que el jugador ha visto en sus últimas partidas.
//   Los que llevan `evento` son imprevistos (como mucho uno por partida).
// - Cada planteamiento tiene tres opciones con el mismo patrón, una
//   claramente buena, una a medias (lo habitual, no un error grave) y una
//   claramente mala.
//
// Regla de copy: sin dos puntos ni guiones largos en los textos visibles.

export type Calidad = 'bien' | 'regular' | 'mal';
export type PerfilId = 'prisa' | 'grupo' | 'compara' | 'esceptico';
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
  // Lo que hay que tener claro en esta fase. Se enseña al final en las
  // fases donde el jugador flaquea, como la clave que se le escapa.
  clave: string;
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
  {
    id: 'esceptico',
    nombre: 'El que viene escarmentado',
    pizza: 'Entra mirándolo todo con lupa. La última pizzería le falló y no piensa dejar que le vuelva a pasar.',
    b2b: 'Es el cliente que ya tuvo un mal proveedor y desconfía de cualquier promesa.',
    pista: 'No le prometas, demuéstralo. Pregunta qué falló la otra vez y dale pruebas.',
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
    clave: 'Atrae a quien tiene el problema que resuelves, no a cualquiera que pase por delante.',
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
            porPerfil: {
              esceptico: { delta: 5, reaccion: 'Eso me dijeron en la otra', b2b: 'Al que viene escarmentado, una promesa sin pruebas le recuerda justo a quien le falló.' },
            },
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
            porPerfil: {
              esceptico: { delta: 60, reaccion: 'Probarlo antes, eso me gusta', b2b: 'Al que viene escarmentado nada le convence tanto como probar antes de comprometerse. La demo le quita el miedo.' },
            },
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
      {
        id: 'calle-competencia',
        pregunta: 'Han abierto otra pizzería en tu misma calle y regalan la bebida. ¿Qué pones en tu cartel?',
        evento: 'Imprevisto',
        opciones: [
          {
            texto: 'Para qué tipo de comida es tu pizza, con un ejemplo concreto',
            rotulo: 'Pizza para comidas de equipo',
            gente: 3,
            interes: 'una comida con su equipo',
            delta: 50,
            reaccion: 'Justo lo que buscaba para el viernes',
            b2b: 'Es posicionarte en un nicho. En vez de competir por todo el mundo, hablas a quien tiene un problema concreto y te conviertes en la opción obvia para él.',
            calidad: 'bien',
          },
          {
            texto: 'Bebida gratis también, para no quedarte atrás',
            rotulo: 'Bebida gratis con tu pizza',
            gente: 5,
            interes: 'la bebida gratis',
            delta: 30,
            reaccion: 'Pues aquí también la regalan',
            b2b: 'Copiar la oferta del competidor te mantiene en la carrera, pero quien pasa ya no ve ninguna diferencia entre los dos.',
            calidad: 'regular',
          },
          {
            texto: 'Un cartel que dice que la de al lado es peor',
            rotulo: 'Aquí no somos como esos',
            gente: 2,
            interes: 'ver el lío entre pizzerías',
            delta: 10,
            reaccion: 'Qué mal rollo',
            b2b: 'Definirte por oposición al competidor le da todo el protagonismo a él. Quien pasa por delante sigue sin saber qué haces tú mejor.',
            calidad: 'mal',
          },
        ],
      },
      {
        id: 'calle-escaparate',
        pregunta: 'Tienes un escaparate que da a la calle. ¿Qué pones en él?',
        opciones: [
          {
            texto: 'Fotos de clientes como él comiendo y lo que dijeron',
            rotulo: 'Lo que dicen nuestros clientes',
            gente: 3,
            interes: 'ver qué opinan otros como él',
            delta: 50,
            reaccion: 'Si a ellos les gustó…',
            b2b: 'Son los casos de éxito y los testimonios. Ver que alguien parecido ya confió en ti quita el miedo a equivocarse.',
            calidad: 'bien',
            porPerfil: {
              esceptico: { delta: 60, reaccion: 'Vale, esto ya es otra cosa', b2b: 'Al que viene escarmentado no le convencen tus promesas, le convencen otros clientes. Los casos reales son su mejor puerta de entrada.' },
            },
          },
          {
            texto: 'La carta completa pegada en el cristal',
            rotulo: 'Nuestra carta',
            gente: 4,
            interes: 'mirar la carta',
            delta: 30,
            reaccion: 'Mucha cosa, ya veré',
            b2b: 'Es la web que enseña todo el catálogo. Informa, pero no ayuda a quien pasa a ver qué le encaja a él.',
            calidad: 'regular',
          },
          {
            texto: 'Fotos del equipo con los premios que habéis ganado',
            rotulo: 'Premio a la mejor masa',
            gente: 2,
            interes: 'saber de qué es el premio',
            delta: 15,
            reaccion: '¿Y eso a mí qué me aporta?',
            b2b: 'Hablar de tus logros en vez de los problemas del cliente es el error más habitual en la web de una empresa B2B.',
            calidad: 'mal',
          },
        ],
      },
    ],
  },
  {
    id: 'puerta',
    nombre: 'La puerta',
    b2b: 'Captación de datos',
    clave: 'Pide solo los datos que vas a usar y pregunta siempre qué le ha traído.',
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
      {
        id: 'puerta-reserva',
        pregunta: 'El cliente llama por teléfono para reservar. ¿Qué le preguntas?',
        opciones: [
          {
            texto: 'Para cuántos, a qué hora y si es por algo especial',
            delta: 10,
            reaccion: 'Es una comida de trabajo, sí',
            b2b: 'Tres preguntas que cambian lo que harás después. Un formulario corto con una pregunta sobre el motivo vale más que diez campos.',
            calidad: 'bien',
          },
          {
            texto: 'Solo el nombre y la hora',
            delta: 0,
            marca: 'sinInteres',
            reaccion: 'Vale, apuntado',
            b2b: 'Tienes el contacto, pero no sabes para qué viene. Le podrás atender, pero no preparar nada pensando en él.',
            calidad: 'regular',
          },
          {
            texto: 'Que reserve por la web, que por teléfono no se puede',
            delta: -20,
            reaccion: '¿En serio? Si ya estoy hablando contigo',
            b2b: 'Obligar al contacto a usar tu canal y no el suyo es una barrera más. Si ya tienes su atención, no le mandes a otro sitio.',
            calidad: 'mal',
            porPerfil: {
              prisa: { delta: -30, reaccion: 'No tengo tiempo para webs', b2b: 'Al decisor con prisa cada paso de más le hace buscar a otro. Si te llama, atiéndele ahí.' },
            },
          },
        ],
      },
      {
        id: 'puerta-escarmentado',
        pregunta: 'Nada más entrar te cuenta que en la última pizzería le sirvieron la pizza fría. ¿Qué haces?',
        soloPerfiles: ['esceptico'],
        opciones: [
          {
            texto: 'Le preguntas qué pasó y apuntas lo que no quiere que se repita',
            delta: 15,
            reaccion: 'Pues mira, te cuento',
            b2b: 'Las malas experiencias anteriores son información valiosa. Saber qué falló con el proveedor anterior te dice exactamente qué tienes que cuidar.',
            calidad: 'bien',
          },
          {
            texto: 'Le aseguras que aquí eso no pasa',
            delta: 0,
            marca: 'sinInteres',
            reaccion: 'Eso me dijeron allí también',
            b2b: 'Prometer sin preguntar no convence a quien ya se ha quemado. Y además te quedas sin saber qué le importa.',
            calidad: 'regular',
          },
          {
            texto: 'Le dices que esa pizzería no tiene nada que ver con la tuya y le sientas',
            delta: -20,
            reaccion: 'No me has escuchado',
            b2b: 'Pasar por encima de la objeción para seguir con tu proceso le confirma que aquí tampoco le van a escuchar.',
            calidad: 'mal',
          },
        ],
      },
    ],
  },
  {
    id: 'espera',
    nombre: 'La espera',
    b2b: 'Seguimiento personalizado',
    clave: 'Responde rápido y con algo conectado con lo que el contacto vino buscando.',
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
      {
        id: 'espera-retraso',
        pregunta: 'Hay mucho lío en cocina y el cliente lleva diez minutos sin que nadie le atienda. ¿Qué haces?',
        evento: 'Imprevisto',
        opciones: [
          {
            texto: 'Te acercas, le dices cuándo le atienden y le dejas algo de picar',
            delta: 15,
            escena: ['aperitivo'],
            reaccion: 'Gracias, así sí espero',
            b2b: 'Es la primera respuesta bien hecha. Confirma que le has visto, le dice cuándo le atenderán y le da algo útil mientras tanto.',
            calidad: 'bien',
          },
          {
            texto: 'Mandas al camarero en cuanto quede uno libre',
            delta: -5,
            reaccion: 'Por fin alguien',
            b2b: 'Le atiendes, pero tarde. En B2B, las primeras horas después de que alguien contacta son las que más pesan para que acabe comprando.',
            calidad: 'regular',
            porPerfil: {
              prisa: { delta: -15, calidad: 'mal', reaccion: 'Ya no me da tiempo', b2b: 'Con un decisor con prisa, responder tarde es lo mismo que no responder.' },
            },
          },
          {
            texto: 'Nada, ya se dará cuenta de que hay mucho lío',
            delta: -25,
            reaccion: '¿Se habrán olvidado de mí?',
            b2b: 'El silencio se interpreta como desinterés. Un contacto que no recibe respuesta da por hecho que no le quieres como cliente.',
            calidad: 'mal',
          },
        ],
      },
      {
        id: 'espera-mesa',
        pregunta: 'Los tres de la mesa miran el móvil y nadie ha cogido la carta. ¿Qué haces?',
        soloPerfiles: ['grupo'],
        opciones: [
          {
            texto: 'Les llevas algo para compartir y preguntas a cada uno qué le apetece',
            delta: 25,
            escena: ['aperitivo'],
            reaccion: 'Oye, pues sí',
            b2b: 'Con un comité de compra, el seguimiento tiene que llegar a cada persona con lo que le importa a ella. Lo que convence a dirección no convence a finanzas.',
            calidad: 'bien',
          },
          {
            texto: 'Le hablas solo al que entró primero',
            delta: 0,
            reaccion: 'Ya se lo comento a ellos',
            b2b: 'Tener un único contacto en la empresa es cómodo, pero dependes de que él convenza a los demás por ti.',
            calidad: 'regular',
          },
          {
            texto: 'Les pones en la pantalla un vídeo de cómo hacéis la pizza',
            delta: -15,
            reaccion: 'Estamos hablando de lo nuestro',
            b2b: 'Es el webinar que nadie ha pedido. Contenido sobre ti cuando el cliente está pensando en sus cosas.',
            calidad: 'mal',
          },
        ],
      },
      {
        id: 'espera-pruebas',
        pregunta: 'El cliente pregunta si la masa es casera de verdad o congelada. ¿Qué haces?',
        soloPerfiles: ['esceptico', 'compara'],
        opciones: [
          {
            texto: 'Le invitas a ver cómo el pizzero estira la masa',
            delta: 25,
            escena: ['aperitivo'],
            reaccion: 'Vale, esto me deja tranquilo',
            b2b: 'Ante un cliente desconfiado, enseñar vale más que contar. Es la demo, la visita a un cliente actual o el caso real con datos.',
            calidad: 'bien',
          },
          {
            texto: 'Le dices que sí, que es casera de toda la vida',
            delta: 5,
            reaccion: 'Ya, eso dicen todos',
            b2b: 'Puede ser verdad, pero sin pruebas suena igual que lo que dice cualquier competidor.',
            calidad: 'regular',
          },
          {
            texto: 'Le dices que no se preocupe por esas cosas',
            delta: -20,
            reaccion: 'Pues a mí sí me preocupa',
            b2b: 'Quitar importancia a la duda del cliente es decirle que su criterio no cuenta. La desconfianza crece.',
            calidad: 'mal',
          },
        ],
      },
    ],
  },
  {
    id: 'llamada',
    nombre: 'La llamada',
    b2b: 'Paso al equipo comercial',
    clave: 'Ventas entra cuando el cliente está listo y llega sabiendo lo que ya contó.',
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
      {
        id: 'llamada-momento',
        pregunta: 'El cliente acaba de cerrar la carta. ¿Cuándo va el camarero?',
        opciones: [
          {
            texto: 'En cuanto la cierra, que es la señal de que ya ha decidido',
            delta: 15,
            escena: ['camarero'],
            reaccion: 'Justo a tiempo',
            b2b: 'Es leer las señales de compra. Algunas acciones del contacto indican que está listo, como mirar la página de precios. Ventas tiene que llegar en ese momento, ni antes ni después.',
            calidad: 'bien',
          },
          {
            texto: 'Cuando termine con las otras mesas que tiene asignadas',
            delta: -10,
            escena: ['camarero'],
            reaccion: 'Llevo un rato con la carta cerrada',
            b2b: 'Seguir tu turno y no las señales del cliente hace que llegues tarde a quien ya estaba listo para comprar.',
            calidad: 'regular',
            porPerfil: {
              prisa: { delta: -20, calidad: 'mal', reaccion: 'Me voy a tener que ir', b2b: 'Al decisor con prisa no le puedes hacer esperar a que te venga bien. Su ventana de decisión es muy corta.' },
            },
          },
          {
            texto: 'Antes de que la abra, para tomar nota cuanto antes',
            delta: -15,
            escena: ['camarero'],
            reaccion: 'Si aún no he mirado nada',
            b2b: 'Pasar el contacto a ventas antes de tiempo es la llamada comercial a quien solo se ha descargado una guía. Le espantas.',
            calidad: 'mal',
          },
        ],
      },
      {
        id: 'llamada-turno',
        pregunta: 'El camarero que le atendió acaba su turno justo ahora. ¿Qué haces?',
        evento: 'Imprevisto',
        opciones: [
          {
            texto: 'Le presenta al compañero que entra y le cuenta lo que ya sabe del cliente',
            delta: 10,
            escena: ['camarero'],
            reaccion: 'Perfecto, encantado',
            b2b: 'Cuando cambia la persona que lleva la cuenta, un traspaso con contexto evita que el cliente sienta que empieza de cero. Que el CRM recoja lo hablado lo hace posible.',
            calidad: 'bien',
            siMarca: {
              marca: 'sinInteres',
              delta: 0,
              b2b: 'El traspaso se hace, pero no hay nada que contar porque en la puerta no se apuntó qué buscaba. Sin datos, no hay contexto que pasar.',
              calidad: 'regular',
            },
          },
          {
            texto: 'Entra el compañero y empieza desde cero',
            delta: -10,
            escena: ['camarero'],
            reaccion: '¿Otra vez lo mismo?',
            b2b: 'Al cliente no le importa vuestro cambio de turno. Para él es repetir todo lo que ya contó.',
            calidad: 'regular',
          },
          {
            texto: 'Nadie va a la mesa hasta que alguien se dé cuenta',
            delta: -25,
            reaccion: 'Aquí no me hace caso nadie',
            b2b: 'Es el contacto que se queda sin dueño en el CRM cuando alguien cambia de cartera o deja la empresa. Nadie le llama y se enfría del todo.',
            calidad: 'mal',
          },
        ],
      },
    ],
  },
  {
    id: 'pedido',
    nombre: 'El pedido',
    b2b: 'Reunión de descubrimiento',
    clave: 'Escucha antes de proponer. Entiende qué necesita, quién decide y con qué urgencia.',
    variantes: [
      {
        id: 'pedido-nota',
        pregunta: 'El camarero ya está en la mesa. ¿Cómo toma nota?',
        soloPerfiles: ['grupo', 'compara', 'esceptico'],
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
      {
        id: 'pedido-objetivo',
        pregunta: 'El camarero ya está en la mesa. ¿Por dónde empieza?',
        opciones: [
          {
            texto: 'Pregunta para qué es la comida de hoy',
            delta: 20,
            reaccion: 'Celebramos un cierre, algo especial',
            b2b: 'Entender el motivo de la compra cambia lo que vas a proponer. Es la pregunta por el objetivo de negocio, la que casi nadie hace.',
            calidad: 'bien',
            porPerfil: {
              prisa: { delta: 15, reaccion: 'Comer rápido, tengo una reunión', b2b: 'Con un decisor con prisa la pregunta por el objetivo también funciona, siempre que sea una sola y vaya al grano.' },
            },
          },
          {
            texto: 'Pregunta qué quiere tomar',
            delta: 0,
            reaccion: 'Pues no sé, ¿qué tenéis?',
            b2b: 'Ir directo al pedido es rápido, pero te quedas sin entender qué necesita y la propuesta será genérica.',
            calidad: 'regular',
          },
          {
            texto: 'Le cuenta todas las ofertas del día antes de que diga nada',
            delta: -20,
            reaccion: 'Uf, cuánta información',
            b2b: 'Es la presentación comercial de cuarenta diapositivas en la primera reunión. El cliente aún no ha dicho nada y ya está saturado.',
            calidad: 'mal',
          },
        ],
      },
      {
        id: 'pedido-garantia',
        pregunta: 'El cliente pregunta qué pasa si la pizza no le gusta. ¿Qué responde el camarero?',
        soloPerfiles: ['esceptico'],
        opciones: [
          {
            texto: 'Que se la cambian sin coste, y le pregunta qué no le gustó la última vez',
            delta: 25,
            reaccion: 'Así sí me atrevo',
            b2b: 'Quitar riesgo con una garantía clara es clave con quien ya se quemó. Y de paso descubres qué le importa de verdad.',
            calidad: 'bien',
          },
          {
            texto: 'Que a todo el mundo le gusta',
            delta: -5,
            reaccion: 'Eso no responde a mi pregunta',
            b2b: 'La opinión de otros ayuda, pero no responde a su miedo. Necesita saber qué pasa si sale mal.',
            calidad: 'regular',
          },
          {
            texto: 'Que eso aquí nunca ha pasado',
            delta: -20,
            reaccion: 'Seguro que sí',
            b2b: 'Negar el riesgo ante alguien desconfiado destruye tu credibilidad. Es mejor reconocerlo y explicar cómo lo resuelves.',
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
    clave: 'Una recomendación clara y con el precio a la vista hace fácil decir que sí.',
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
              esceptico: { delta: -30, reaccion: 'Esto ya me pasó una vez', b2b: 'Al que ya se quemó, un precio que no se dice le suena a sorpresa en la factura. Es lo que más teme.' },
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
            porPerfil: {
              esceptico: { delta: -25, reaccion: 'Lo mismo dirán ellos de ti' },
            },
          },
        ],
      },
      {
        id: 'carta-opciones',
        pregunta: 'Ya sabes lo que necesita. ¿Cómo le presentas lo que le recomiendas?',
        opciones: [
          {
            texto: 'La que le recomiendas y otra más sencilla, cada una con su precio',
            delta: 20,
            escena: ['cartaCorta'],
            reaccion: 'Me quedo con la primera',
            b2b: 'Una recomendación y una alternativa ayudan a decidir sin sentir que te imponen nada. Es la propuesta con dos opciones bien escogidas.',
            calidad: 'bien',
          },
          {
            texto: 'La recomendación y tres alternativas más por si acaso',
            delta: -5,
            escena: ['cartaLarga'],
            reaccion: 'Déjame pensarlo',
            b2b: 'Cada opción de más alarga la decisión. Quieres cubrirlo todo y acabas frenando el sí.',
            calidad: 'regular',
            porPerfil: {
              prisa: { delta: -15, calidad: 'mal', reaccion: 'No tengo tiempo para comparar', b2b: 'Un decisor con prisa quiere que decidas por él. Darle cuatro opciones es devolverle el trabajo.' },
            },
          },
          {
            texto: 'La que más margen te deja, aunque no encaje del todo',
            delta: -20,
            escena: ['cartaCorta'],
            reaccion: 'Esto no es lo que te he dicho',
            b2b: 'Proponer lo que te conviene a ti y no lo que necesita el cliente se nota enseguida y rompe la confianza que ganaste escuchando.',
            calidad: 'mal',
          },
        ],
      },
      {
        id: 'carta-mesa',
        pregunta: 'Cada uno de la mesa quiere una pizza distinta y no se ponen de acuerdo. ¿Qué propones?',
        soloPerfiles: ['grupo'],
        opciones: [
          {
            texto: 'Una pizza por mitades y otra para compartir, explicando qué se lleva cada uno',
            delta: 25,
            escena: ['cartaCorta'],
            reaccion: 'Así estamos todos contentos',
            b2b: 'Una buena propuesta para un comité resuelve la prioridad de cada persona y deja claro qué gana cada una. Así nadie la bloquea.',
            calidad: 'bien',
          },
          {
            texto: 'La que quiere el que parece que manda',
            delta: -5,
            escena: ['cartaCorta'],
            reaccion: 'Bueno, si ella lo dice…',
            b2b: 'Convences a quien decide, pero los demás no se sienten escuchados y pueden frenar la compra más adelante.',
            calidad: 'regular',
          },
          {
            texto: 'Les dejas la carta y que lo decidan entre ellos',
            delta: -15,
            escena: ['cartaLarga'],
            reaccion: 'Esto va para largo',
            b2b: 'Dejar al comité a solas con tu catálogo es la propuesta que se queda en un cajón porque nadie la defiende dentro.',
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
    clave: 'Entrega lo prometido y avisa de cualquier cambio antes de que el cliente pregunte.',
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
              esceptico: { delta: -20, calidad: 'mal', reaccion: 'Lo que me temía', b2b: 'Al cliente escarmentado, un retraso sin aviso le confirma su miedo. Con él, avisar a tiempo es todavía más importante.' },
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
      {
        id: 'servicio-cambio',
        pregunta: 'Con la pizza ya en el horno, el cliente pide que le añadas burrata. ¿Qué haces?',
        opciones: [
          {
            texto: 'Le dices que sí, lo que cuesta y cuánto tarda, y esperas a su visto bueno',
            delta: 15,
            escena: ['pizza'],
            reaccion: 'Perfecto, adelante',
            b2b: 'Es gestionar un cambio de alcance. Se puede hacer, pero con precio y plazo claros antes de empezar. Así nadie se lleva sorpresas en la factura.',
            calidad: 'bien',
          },
          {
            texto: 'Se la añades sin decir nada y la cobras al final',
            delta: -5,
            escena: ['pizza'],
            reaccion: 'Ah, ¿y esto me lo cobras?',
            b2b: 'Aceptar cambios sin hablar de coste parece buen servicio, pero la sorpresa en la factura estropea la relación.',
            calidad: 'regular',
            porPerfil: {
              compara: { delta: -15, calidad: 'mal', reaccion: 'Esto no estaba en el precio', b2b: 'Al que compara, un coste que no esperaba le hace sentir engañado. Para él el precio cerrado es sagrado.' },
            },
          },
          {
            texto: 'Le dices que no, que el pedido ya está cerrado',
            delta: -15,
            escena: ['pizza'],
            reaccion: 'Qué poca flexibilidad',
            b2b: 'Negarte a cualquier cambio protege tu margen, pero el cliente siente que el contrato te importa más que él.',
            calidad: 'mal',
          },
        ],
      },
      {
        id: 'servicio-control',
        pregunta: 'La pizza sale hacia la mesa. ¿Qué hace el camarero mientras el cliente come?',
        opciones: [
          {
            texto: 'Pasa una vez a los cinco minutos a preguntar si está como esperaba',
            delta: 15,
            escena: ['pizza'],
            reaccion: 'Todo perfecto, gracias',
            b2b: 'Comprobar la satisfacción durante la entrega, y no solo al final, permite corregir a tiempo. Es la reunión de seguimiento del proyecto.',
            calidad: 'bien',
          },
          {
            texto: 'No pasa por la mesa, para no molestar',
            delta: 0,
            escena: ['pizza'],
            reaccion: 'Me falta el aceite picante…',
            b2b: 'No molestar está bien, pero si algo falla durante la entrega te enterarás cuando ya no tenga arreglo.',
            calidad: 'regular',
          },
          {
            texto: 'Pasa cada poco a contarle cómo hacen cada ingrediente',
            delta: -15,
            escena: ['pizza'],
            reaccion: 'Déjame comer tranquilo',
            b2b: 'Es el informe semanal de cuarenta páginas que nadie lee. Mucha comunicación sobre ti y poca sobre lo que le importa al cliente.',
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
    clave: 'Después de la venta empieza la siguiente. Pregunta cómo ha ido, cuida y pide la recomendación.',
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
      {
        id: 'sobremesa-queja',
        pregunta: 'El cliente comenta que la pizza estaba algo salada. ¿Qué haces?',
        evento: 'Imprevisto',
        opciones: [
          {
            texto: 'Le das las gracias por decirlo, preguntas qué cambiaría y le invitas al café',
            delta: 15,
            escena: ['cuenta'],
            reaccion: 'Así da gusto volver',
            b2b: 'Una queja bien atendida fideliza más que un servicio sin fallos. Escuchar, agradecer y compensar convierte al cliente en defensor.',
            calidad: 'bien',
            porPerfil: {
              esceptico: { delta: 20, reaccion: 'Esto en la otra no me pasó', b2b: 'Al cliente escarmentado le demuestras con hechos que aquí sí le escuchan. Es justo lo que no encontró en su proveedor anterior.' },
            },
          },
          {
            texto: 'Le pides perdón y le llevas la cuenta',
            delta: -5,
            escena: ['cuenta'],
            reaccion: 'Vale, no pasa nada',
            b2b: 'Reconoces el fallo, pero no aprovechas para entender qué pasó ni para reparar la relación.',
            calidad: 'regular',
          },
          {
            texto: 'Le explicas que la receta es así y que a todos les gusta',
            delta: -20,
            escena: ['cuenta'],
            reaccion: 'Pues a mí no',
            b2b: 'Defenderte ante una queja le dice al cliente que su opinión no cuenta. Es el cliente que no renueva y no te dice por qué.',
            calidad: 'mal',
          },
        ],
      },
      {
        id: 'sobremesa-referido',
        pregunta: 'El cliente ha comido muy a gusto. ¿Cómo consigues que vuelva y lo cuente?',
        opciones: [
          {
            texto: 'Le preguntas si conoce a alguien a quien le encantaría y le das una invitación para esa persona',
            delta: 15,
            escena: ['postre'],
            venta: { concepto: 'Café de la casa', precio: 2.5 },
            reaccion: 'Se la doy a mi socia',
            b2b: 'Es el programa de recomendaciones. Pedirla en el momento de más satisfacción, y facilitarla con algo concreto, multiplica las que llegan.',
            calidad: 'bien',
          },
          {
            texto: 'Le das una tarjeta de fidelización de diez sellos',
            delta: 0,
            escena: ['cuenta'],
            reaccion: 'Otra tarjeta más',
            b2b: 'Los programas de puntos genéricos retienen algo, pero no generan recomendaciones ni conversación.',
            calidad: 'regular',
          },
          {
            texto: 'Le pides que suba una foto a redes antes de traerle la cuenta',
            delta: -15,
            escena: ['cuenta'],
            reaccion: '¿Y si no lo hago qué?',
            b2b: 'Condicionar el servicio a que el cliente te promocione suena a que su experiencia solo te interesa como anuncio.',
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
