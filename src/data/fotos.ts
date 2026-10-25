import estrategia from '../assets/fotos/estrategia-pizarra.jpg';
import web from '../assets/fotos/web-disenadora.jpg';
import seo from '../assets/fotos/seo-especialista.jpg';
import publicidad from '../assets/fotos/publicidad-especialista.jpg';
import redes from '../assets/fotos/redes-edicion.jpg';
import eventos from '../assets/fotos/eventos-auditorio.jpg';
import sesion from '../assets/fotos/quienes-sesion.jpg';

// Fotos de las áreas y de Quiénes somos (2026-10-25), según
// marca-personal/ux-ui/prompts-fotos.md. Las de Guillén están generadas con IA a
// partir de sus fotos. Eventos es una escena genérica creada con IA, sin
// nombre ni logotipos, para no repetir la foto real del caso de Zebra.
// Web, SEO y GEO, Publicidad y Redes muestran a especialistas de la red, sin cara reconocible
// (decisión de Dirección: Guillén solo sale donde el trabajo es suyo).
// `foco` es el object-position: qué parte se queda al recortar a 4:3 o 16:7.
export interface Foto {
  img: ImageMetadata;
  alt: { es: string; en: string };
  foco: string;
}

export const FOTOS_AREA: Record<string, Foto> = {
  'estrategia-y-marca': {
    img: estrategia,
    alt: { es: 'Guillén Bruna explica un esquema de estrategia en la pizarra a dos personas de dirección', en: 'Guillén Bruna explains a strategy diagram on the whiteboard to two members of the leadership team' },
    foco: '55% 30%',
  },
  'diseno-web': {
    img: web,
    alt: { es: 'Diseñadora web ajusta el diseño de una página en una tableta, con las pantallas de la web en el monitor y en la pared', en: 'Web designer adjusting a page design on a tablet, with the website screens on the monitor and the wall' },
    foco: '55% 25%',
  },
  'seo-geo': {
    img: seo,
    alt: { es: 'Especialista en SEO toma notas junto a un monitor con datos de posicionamiento', en: 'SEO specialist taking notes next to a monitor with search data' },
    foco: '60% 45%',
  },
  'publicidad-online': {
    img: publicidad,
    alt: { es: 'Especialista en publicidad gestiona campañas en el administrador de anuncios, con la vista previa de un anuncio en el móvil', en: 'Advertising specialist managing campaigns in the ads manager, with an ad preview on the phone' },
    foco: '60% 60%',
  },
  'redes-sociales': {
    img: redes,
    alt: { es: 'Especialista en contenido edita un vídeo para redes sociales en su puesto', en: 'Content specialist editing a social media video at his desk' },
    foco: '55% 40%',
  },
  eventos: {
    img: eventos,
    alt: { es: 'Evento corporativo en un auditorio visto desde la mesa de control, con una ponente en el escenario', en: 'Corporate event in an auditorium seen from the control desk, with a speaker on stage' },
    foco: '62% 40%',
  },
};

export const FOTO_QUIENES: Foto = {
  img: sesion,
  alt: { es: 'Guillén Bruna dirige una sesión de trabajo con el equipo alrededor de una mesa', en: 'Guillén Bruna leads a working session with the team around a table' },
  foco: '50% 12%',
};
