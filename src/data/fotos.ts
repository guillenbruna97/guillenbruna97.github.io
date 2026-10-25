import estrategia from '../assets/fotos/estrategia-pizarra.jpg';
import web from '../assets/fotos/web-revision.jpg';
import seo from '../assets/fotos/seo-especialista.jpg';
import publicidad from '../assets/fotos/publicidad-movil.jpg';
import redes from '../assets/fotos/redes-edicion.jpg';
import eventos from '../assets/casos/zebra-sis.jpg';
import sesion from '../assets/fotos/quienes-sesion.jpg';

// Fotos de las áreas y de Quiénes somos (2026-10-25), según
// marca-personal/ux-ui/prompts-fotos.md. Las de Guillén están generadas con IA a
// partir de sus fotos; Eventos es la foto real del Spain Innovation Summit.
// SEO y GEO y Redes muestran a especialistas de la red, sin cara reconocible
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
    alt: { es: 'Guillén Bruna revisa una web en el portátil y su versión móvil', en: 'Guillén Bruna reviews a website on the laptop and its mobile version' },
    foco: '45% 28%',
  },
  'seo-geo': {
    img: seo,
    alt: { es: 'Especialista en SEO toma notas junto a un monitor con datos de posicionamiento', en: 'SEO specialist taking notes next to a monitor with search data' },
    foco: '60% 45%',
  },
  'publicidad-online': {
    img: publicidad,
    alt: { es: 'Guillén Bruna revisa un anuncio en el móvil con el panel de campañas detrás', en: 'Guillén Bruna reviews an ad on his phone with the campaign dashboard behind' },
    foco: '50% 25%',
  },
  'redes-sociales': {
    img: redes,
    alt: { es: 'Especialista en contenido edita un vídeo para redes sociales en su puesto', en: 'Content specialist editing a social media video at his desk' },
    foco: '55% 40%',
  },
  eventos: {
    img: eventos,
    alt: { es: 'Equipo en el Spain Innovation Summit, evento organizado por Guillén Bruna', en: 'Team at the Spain Innovation Summit, an event organised by Guillén Bruna' },
    foco: '50% 40%',
  },
};

export const FOTO_QUIENES: Foto = {
  img: sesion,
  alt: { es: 'Guillén Bruna dirige una sesión de trabajo con el equipo alrededor de una mesa', en: 'Guillén Bruna leads a working session with the team around a table' },
  foco: '50% 12%',
};
