import estrategia from '../assets/fotos/estrategia-pizarra.jpg';
import web from '../assets/fotos/web-revision.jpg';
import seo from '../assets/fotos/seo-analisis.jpg';
import publicidad from '../assets/fotos/publicidad-movil.jpg';
import redes from '../assets/fotos/redes-rodaje.jpg';
import eventos from '../assets/casos/zebra-sis.jpg';
import sesion from '../assets/fotos/quienes-sesion.jpg';

// Fotos de las áreas y de Quiénes somos (2026-10-25), según
// marca-personal/ux-ui/prompts-fotos.md. Las de Guillén están generadas con IA a
// partir de sus fotos; Eventos es la foto real del Spain Innovation Summit.
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
    alt: { es: 'Guillén Bruna analiza datos de posicionamiento en un monitor y toma notas', en: 'Guillén Bruna analyses search data on a monitor and takes notes' },
    foco: '50% 28%',
  },
  'publicidad-online': {
    img: publicidad,
    alt: { es: 'Guillén Bruna revisa un anuncio en el móvil con el panel de campañas detrás', en: 'Guillén Bruna reviews an ad on his phone with the campaign dashboard behind' },
    foco: '50% 25%',
  },
  'redes-sociales': {
    img: redes,
    alt: { es: 'Guillén Bruna graba contenido para redes con un móvil y un aro de luz', en: 'Guillén Bruna records social media content with a phone and a ring light' },
    foco: '55% 27%',
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
