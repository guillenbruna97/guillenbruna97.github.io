// Escena 3D de "La pizzería B2B". Todo se construye con primitivas de
// Three.js (sin modelos externos). La pizzería es un local a pie de calle
// abierto como una maqueta, rodeado de acera, calzada, edificios vecinos con
// sus tiendas, farolas, árboles, peatones y coches. La página del juego solo
// habla con la API que devuelve `crearEscena`; si el navegador no tiene WebGL
// devuelve una API vacía y el juego sigue funcionando sin escena.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export type Actor = 'cliente' | 'camarero' | 'pizza';
export type Objeto =
  | 'formulario' | 'aperitivo' | 'cartaCorta' | 'cartaLarga'
  | 'postre' | 'extras' | 'cuenta' | 'libreta' | 'pizza' | 'amigos' | 'caja';
export type Pose = 'normal' | 'mano' | 'cruzado' | 'reloj' | 'comer' | 'amasar' | 'escribir' | 'movil';

export interface Escena {
  ok: boolean;
  mover(actor: Actor, x: number, z: number, opts?: { ms?: number; y?: number }): Promise<void>;
  foco(id: string): void;
  mostrar(obj: Objeto, on: boolean): void;
  rotulo(texto: string): void;
  humor(hambre: number): void;
  pizzaMal(on: boolean): void;
  horno(on: boolean): void;
  gente(n: number): void;
  decir(texto: string | null): void;
  // Aspecto del cliente según su perfil (prisa, grupo, compara o esceptico).
  perfil(id: string): void;
  // El cliente se sienta en su silla (o se levanta).
  sentar(on: boolean): void;
  // Postura temporal de un personaje durante `ms` milisegundos.
  pose(actor: 'cliente' | 'camarero', pose: Pose, ms?: number): void;
  // Asentir o negar con la cabeza.
  gesto(tipo: 'si' | 'no'): void;
  // Icono de emoción sobre la cabeza del cliente.
  emocion(icono: string): void;
  // El cliente se come la pizza porción a porción.
  comer(): Promise<void>;
  // Texto que sube y se desvanece sobre la cabeza del cliente (+20, -15…).
  flotar(texto: string, tipo: 'bien' | 'regular' | 'mal'): void;
  // La cámara se acerca un momento al cliente para que se vea su reacción.
  primerPlano(ms?: number): void;
  reset(): void;
}

// Posiciones de referencia en el suelo (x, z). El cliente se sienta al
// fondo de la mesa, de cara a la cámara.
export const POS = {
  calle: [-7.2, 1.3],
  puerta: [-4.4, 0.9],
  mesa: [-0.6, -0.85],
  // Paso intermedio para rodear la silla de la izquierda.
  rodeo: [-2.0, -1.1],
  salida: [11.4, 0.9],
  fuera: [-11, 1.3],
  barra: [3, 0.7],
  mesaCamarero: [0.65, 0.9],
  hornoPizza: [6.5, 0.55],
  barraPizza: [3, -0.25],
  mesaPizza: [-0.6, 0.0],
} as const;

const Y_HORNO = 1.08;
const Y_BARRA = 1.12;
const Y_MESA = 0.84;
const MESA = { x: -0.6, z: 0.2 };

// Centro y distancia de cámara de cada momento.
const FOCOS: Record<string, [number, number]> = {
  intro: [-0.5, 22],
  calle: [-7.4, 13],
  puerta: [-4.6, 12],
  espera: [-1.4, 11.5],
  llamada: [-0.2, 12],
  pedido: [-0.6, 10.5],
  carta: [-0.6, 10.5],
  servicio: [2.6, 15],
  sobremesa: [-0.8, 10.5],
  salida: [9.6, 14],
};

// Con el tema oscuro la escena pasa a ser de noche: se encienden ventanas,
// escaparates y farolas.
const PALETAS = {
  claro: {
    fondo: 0xdfe9f7, suelo: 0xeadfce, asfalto: 0x8d939b, acera: 0xe6e0d6, bordillo: 0xd2ccc2, pintura: 0xf4f4f0,
    pared: 0xfffaf2, paredLado: 0xf3ebdf, madera: 0xc98b55, ladrillo: 0xc4603f, ventana: 0xbfd6f5, hoja: 0x5f9e4f,
    fachada: 0xffffff, lejano: 0xc5d0de, bombilla: 0xdedede,
    luzSol: 1.6, luzCielo: 1.1, lampara: 0.6, calida: 0.5, noche: false,
  },
  oscuro: {
    fondo: 0x0e1726, suelo: 0x3b342c, asfalto: 0x1b1f27, acera: 0x3a3631, bordillo: 0x4a4640, pintura: 0x8d8d88,
    pared: 0x2b2926, paredLado: 0x24221f, madera: 0x8f5f37, ladrillo: 0x8e3f28, ventana: 0x22324a, hoja: 0x3d6b33,
    fachada: 0x4c5260, lejano: 0x18202e, bombilla: 0xffd27a,
    luzSol: 0.55, luzCielo: 0.55, lampara: 2.2, calida: 1.6, noche: true,
  },
};

const noop = async () => {};
const vacia: Escena = {
  ok: false, mover: noop, foco() {}, mostrar() {}, rotulo() {}, humor() {},
  pizzaMal() {}, horno() {}, gente() {}, decir() {}, perfil() {}, sentar() {},
  pose() {}, gesto() {}, emocion() {}, comer: noop, flotar() {}, primerPlano() {}, reset() {},
};

// Generador pseudoaleatorio con semilla, para que el barrio sea siempre igual.
const aleatorio = (semilla: number) => () => (semilla = (semilla * 16807) % 2147483647) / 2147483647;
const alAzar = <T,>(lista: T[]) => lista[Math.floor(Math.random() * lista.length)];

export function crearEscena(
  contenedor: HTMLElement,
  bocadillo: HTMLElement,
  opciones: { reducirMovimiento: boolean; tarjeta: () => { ancho: number; alto: number; abajo: boolean } }
): Escena {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true });
  } catch {
    contenedor.classList.add('sin-3d');
    return vacia;
  }
  const quieto = opciones.reducirMovimiento;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  contenedor.prepend(renderer.domElement);

  const emote = document.createElement('div');
  emote.className = 'pz-emote';
  emote.hidden = true;
  emote.setAttribute('aria-hidden', 'true');
  contenedor.append(emote);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xdfe9f7, 60, 160);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 220);

  // ── Texturas pintadas en canvas ────────────────────────────────────
  const lienzo = (w: number, h: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    return [canvas, canvas.getContext('2d')!] as const;
  };
  const aTextura = (canvas: HTMLCanvasElement, rx = 1, ry = 1) => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(rx, ry);
    tex.anisotropy = 4;
    return tex;
  };
  const textura = (w: number, h: number, pintar: (ctx: CanvasRenderingContext2D) => void, rx: number, ry: number) => {
    const [canvas, ctx] = lienzo(w, h);
    pintar(ctx);
    return aTextura(canvas, rx, ry);
  };
  const baldosas = textura(128, 128, (ctx) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = '#efebe4';
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillRect(64, 64, 64, 64);
    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, 128, 128);
    ctx.beginPath(); ctx.moveTo(64, 0); ctx.lineTo(64, 128); ctx.moveTo(0, 64); ctx.lineTo(128, 64); ctx.stroke();
  }, 15, 6);
  const ladrillos = textura(256, 128, (ctx) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 256, 128);
    ctx.fillStyle = '#f1e7dc';
    for (let fila = 0; fila < 8; fila++) {
      const off = fila % 2 ? 32 : 0;
      for (let c = -1; c < 5; c++) ctx.fillRect(c * 64 + off + 2, fila * 16 + 2, 60, 12);
    }
  }, 5, 2);
  // Acera de baldosa hidráulica de tacos, 1,2 m por repetición.
  const baldosaAcera = textura(120, 120, (ctx) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 120, 120);
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) {
      for (const [a, b] of [[10, 10], [30, 10], [10, 30], [30, 30], [20, 20]]) {
        ctx.beginPath(); ctx.arc(x * 40 + a, y * 40 + b, 4, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.16)';
    ctx.lineWidth = 2;
    for (let i = 0; i <= 3; i++) {
      ctx.beginPath(); ctx.moveTo(i * 40, 0); ctx.lineTo(i * 40, 120); ctx.moveTo(0, i * 40); ctx.lineTo(120, i * 40); ctx.stroke();
    }
  }, 1, 1);
  const asfalto = textura(128, 128, (ctx) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 128, 128);
    const rnd = aleatorio(11);
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = `rgba(0,0,0,${0.03 + rnd() * 0.08})`;
      ctx.fillRect(rnd() * 128, rnd() * 128, 1.5, 1.5);
    }
  }, 1, 1);
  // Persiana metálica de un local cerrado.
  const persianaMetalica = textura(64, 64, (ctx) => {
    ctx.fillStyle = '#9aa0a6';
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    for (let y = 0; y < 64; y += 8) ctx.fillRect(0, y, 64, 2);
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    for (let y = 3; y < 64; y += 8) ctx.fillRect(0, y, 64, 1);
  }, 1, 6);
  // Barandilla de balcón con transparencia.
  const barandilla = textura(140, 100, (ctx) => {
    ctx.clearRect(0, 0, 140, 100);
    ctx.fillStyle = '#2c2d30';
    ctx.fillRect(0, 0, 140, 6);
    ctx.fillRect(0, 92, 140, 8);
    for (let x = 4; x < 140; x += 11) ctx.fillRect(x, 0, 3, 100);
  }, 1, 1);

  // Escala las coordenadas de textura para que una textura con repetición
  // mantenga su tamaño real en piezas de distinto tamaño.
  const escalarUV = <G extends THREE.BufferGeometry>(geo: G, su: number, sv: number) => {
    const uv = geo.getAttribute('uv') as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv);
    return geo;
  };

  // ── Materiales (se recolorean al cambiar de tema) ──────────────────
  const mat = (color: number, extra: THREE.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.85, flatShading: true, ...extra });
  const suave = (color: number, extra: THREE.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.75, ...extra });
  const M = {
    suelo: mat(0, { map: baldosas, flatShading: false }), pared: mat(0, { map: ladrillos, flatShading: false }),
    asfalto: mat(0, { map: asfalto, flatShading: false, roughness: 0.95 }),
    acera: mat(0, { map: baldosaAcera, flatShading: false, roughness: 0.95 }),
    bordillo: mat(0, { flatShading: false }), pintura: mat(0, { flatShading: false, roughness: 0.9 }),
    paredLado: mat(0), madera: mat(0), ladrillo: mat(0), ventana: mat(0), hoja: mat(0),
    lejano: mat(0, { flatShading: false }),
    azul: mat(0x004aad), azulClaro: mat(0x95c0fa), carton: mat(0xd8b27a),
    blanco: mat(0xffffff), negro: mat(0x1a1a1a), oscuro: mat(0x2b2b2b), piel: mat(0xf2c7a0),
    papel: mat(0xffffff), boca: mat(0x3a1f14), queso: mat(0xffd166), tomate: mat(0xd9472b),
    verde: mat(0x6b8e23), masa: mat(0xe7b86a), botella: mat(0x2e6b3a), crema: mat(0xfff6e0),
    pizarra: mat(0x2b2b2b), maceta: mat(0xb8613f),
    metal: suave(0x3a3d42, { roughness: 0.5, metalness: 0.4 }), tronco: mat(0x6b4a33), alcorque: mat(0x4a4037),
    piedra: suave(0xe2ddd3), cierre: suave(0xffffff, { map: persianaMetalica }),
    barandilla: suave(0xffffff, { map: barandilla, alphaTest: 0.5, side: THREE.DoubleSide }),
    escaparate: suave(0x6d7f93, { roughness: 0.15, metalness: 0.35, emissive: 0xffc98a, emissiveIntensity: 0 }),
    marcoTienda: suave(0x2f3237, { roughness: 0.5 }),
    cristal: suave(0x2c3a4a, { roughness: 0.1, metalness: 0.5 }), rueda: suave(0x1c1c1e, { roughness: 0.9 }),
    zapato: suave(0x1d1d1f, { roughness: 0.6 }), ojo: suave(0xfbfbf8, { roughness: 0.3 }), pupila: suave(0x2a1d16, { roughness: 0.2 }),
    labio: suave(0x7a3b2e),
    fuego: new THREE.MeshBasicMaterial({ color: 0xff9d2e }),
    lampara: new THREE.MeshBasicMaterial({ color: 0xffd166 }),
    bombilla: new THREE.MeshBasicMaterial({ color: 0xdedede }),
    faro: new THREE.MeshBasicMaterial({ color: 0xfff6d8 }),
    piloto: new THREE.MeshBasicMaterial({ color: 0xc8261b }),
    cruz: new THREE.MeshBasicMaterial({ color: 0x1fbf5a }),
    halo: new THREE.MeshBasicMaterial({ color: 0xffd9a0, transparent: true, opacity: 0.07, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }),
  };
  // Materiales del barrio que se oscurecen de noche (su color es un
  // multiplicador sobre la textura pintada) y los que se encienden.
  const fachadas: THREE.MeshStandardMaterial[] = [M.cierre];
  const soloNoche: THREE.Object3D[] = [];

  const caja = (w: number, h: number, d: number, m: THREE.Material, x = 0, y = 0, z = 0) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };
  const cilindro = (rt: number, rb: number, h: number, m: THREE.Material, x = 0, y = 0, z = 0, seg = 16) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };
  const esfera = (r: number, m: THREE.Material, x = 0, y = 0, z = 0, seg = 12) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(6, seg - 4)), m);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    return mesh;
  };

  // Texto pintado en un canvas y usado como textura (rótulos).
  const etiqueta = (w: number, h: number, pintar: (ctx: CanvasRenderingContext2D, cw: number, ch: number) => void, res = 256) => {
    const [canvas] = lienzo(Math.round(w * res), Math.round(h * res));
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    const repintar = () => {
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pintar(ctx, canvas.width, canvas.height);
      tex.needsUpdate = true;
    };
    repintar();
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
    return { mesh, repintar };
  };
  const textoCentrado = (ctx: CanvasRenderingContext2D, lineas: string[], cw: number, ch: number, size: number, color: string, fuente = 'Poppins') => {
    ctx.fillStyle = color;
    ctx.font = `600 ${size}px ${fuente}, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const alto = size * 1.25;
    lineas.forEach((l, i) => ctx.fillText(l, cw / 2, ch / 2 + (i - (lineas.length - 1) / 2) * alto));
  };
  const rotulosTienda: (() => void)[] = [];

  // ── Pizzería ───────────────────────────────────────────────────────
  const mundo = new THREE.Group();
  scene.add(mundo);

  const suelo = caja(15.2, 0.2, 6.2, M.suelo, 2.5, -0.1, 0);
  mundo.add(suelo);

  // Pared del fondo de ladrillo, laterales con hueco de puerta y rótulo superior.
  mundo.add(caja(15.2, 3.2, 0.2, M.pared, 2.5, 1.6, -3.1));
  // Paredes laterales solo hasta la puerta, como una maqueta abierta, y
  // un marco de puerta delante para que no tapen la acción.
  for (const x of [-5.1, 10.1]) {
    mundo.add(caja(0.2, 3.2, 3.0, M.paredLado, x, 1.6, -1.6));
    mundo.add(caja(0.2, 2.3, 0.14, M.madera, x, 1.15, 1.7));
    mundo.add(caja(0.2, 0.14, 1.75, M.madera, x, 2.3, 0.88));
  }
  const puertaHoja = caja(0.08, 2.1, 0.9, M.madera, -4.75, 1.05, 0.45);
  puertaHoja.rotation.y = -0.9;
  mundo.add(puertaHoja);

  mundo.add(caja(15.6, 0.7, 0.3, M.azul, 2.5, 3.5, -3.05));
  const titulo = etiqueta(4, 0.6, (ctx, cw, ch) => textoCentrado(ctx, ['La Pizzería'], cw, ch, ch * 0.62, '#ffffff', 'Newsreader'));
  titulo.mesh.position.set(2.5, 3.5, -2.89);
  mundo.add(titulo.mesh);

  const salidaTxt = etiqueta(1.2, 0.3, (ctx, cw, ch) => textoCentrado(ctx, ['SALIDA'], cw, ch, ch * 0.5, '#1a1a1a'));
  salidaTxt.mesh.position.set(10.1, 2.62, 1.85);
  mundo.add(salidaTxt.mesh);

  // Rótulo luminoso junto a la entrada.
  const neon = etiqueta(1.4, 0.5, (ctx, cw, ch) => {
    ctx.shadowColor = '#ff5fa2';
    ctx.shadowBlur = ch * 0.25;
    textoCentrado(ctx, ['Abierto'], cw, ch, ch * 0.55, '#ffd1e6', 'Newsreader');
  });
  neon.mesh.position.set(-4.0, 2.55, -2.98);
  mundo.add(neon.mesh);

  // Toldo de rayas sobre la puerta y banderola con el nombre, por fuera.
  const rayas = (colores: string[], n = 8) => textura(256, 64, (ctx) => {
    for (let i = 0; i < n; i++) {
      ctx.fillStyle = colores[i % colores.length];
      ctx.fillRect((i * 256) / n, 0, 256 / n + 1, 64);
    }
  }, 1, 1);
  const toldo = (ancho: number, fondo: number, tex: THREE.Texture, inclinacion = 0.42) => {
    const m = suave(0xffffff, { map: tex, side: THREE.DoubleSide, roughness: 0.9 });
    fachadas.push(m);
    const g = new THREE.Group();
    const lona = new THREE.Mesh(new THREE.PlaneGeometry(ancho, fondo), m);
    lona.rotation.x = -Math.PI / 2;
    lona.position.z = fondo / 2;
    lona.castShadow = true;
    lona.receiveShadow = true;
    const faldon = new THREE.Mesh(new THREE.PlaneGeometry(ancho, 0.22), m);
    faldon.position.set(0, -0.11, fondo);
    g.add(lona, faldon);
    g.rotation.x = inclinacion;
    return g;
  };
  const toldoPizzeria = toldo(1.9, 0.9, rayas(['#004aad', '#f4f1ea'], 10));
  toldoPizzeria.position.set(-5.22, 2.62, 0.88);
  toldoPizzeria.rotation.set(0.42, -Math.PI / 2, 0, 'YXZ');
  mundo.add(toldoPizzeria);
  const banderola = new THREE.Group();
  banderola.add(caja(0.9, 0.05, 0.05, M.metal, -0.45, 0.38, 0));
  banderola.add(caja(0.86, 0.62, 0.06, M.azul, -0.5, 0, 0));
  const banderolaTxt = etiqueta(0.8, 0.5, (ctx, cw, ch) => textoCentrado(ctx, ['Pizzería'], cw, ch, ch * 0.42, '#ffffff', 'Newsreader'));
  banderolaTxt.mesh.position.set(-0.5, 0, 0.035);
  banderola.add(banderolaTxt.mesh);
  banderola.position.set(-5.2, 3.0, 1.9);
  mundo.add(banderola);

  // Pizarra con la carta sobre la barra.
  mundo.add(caja(1.6, 0.9, 0.06, M.pizarra, 3, 2.25, -2.97));
  const cartaPared = etiqueta(1.5, 0.8, (ctx, cw, ch) => textoCentrado(ctx, ['Carta', 'Margarita · Diávola', 'Cuatro quesos'], cw, ch, ch * 0.13, '#f4f1ea'));
  cartaPared.mesh.position.set(3, 2.25, -2.93);
  mundo.add(cartaPared.mesh);

  for (const x of [-2.8, 0.6]) {
    mundo.add(caja(1.3, 1.0, 0.06, M.ventana, x, 2.0, -2.98));
    mundo.add(caja(1.3, 0.06, 0.08, M.madera, x, 2.0, -2.95));
    mundo.add(caja(0.06, 1.0, 0.08, M.madera, x, 2.0, -2.95));
  }

  // Lámpara sobre la mesa.
  // Alta y adelantada para que no tape la cara del cliente sentado.
  mundo.add(cilindro(0.01, 0.01, 0.5, M.negro, MESA.x, 3.45, MESA.z + 0.6, 6));
  const pantalla = cilindro(0.08, 0.32, 0.25, M.lampara, MESA.x, 3.1, MESA.z + 0.6);
  pantalla.castShadow = false;
  mundo.add(pantalla);
  const luzLampara = new THREE.PointLight(0xffc97a, 0.6, 6, 1.5);
  luzLampara.position.set(MESA.x, 2.6, MESA.z);
  mundo.add(luzLampara);

  // Cartel de la calle (pizarra en caballete).
  const cartel = new THREE.Group();
  cartel.position.set(-8.4, 0, 1.9);
  cartel.add(caja(0.06, 1.3, 0.06, M.madera, -0.5, 0.65, -0.15), caja(0.06, 1.3, 0.06, M.madera, 0.5, 0.65, -0.15));
  cartel.add(caja(1.5, 1.05, 0.08, M.madera, 0, 1.3, 0));
  cartel.add(caja(1.36, 0.92, 0.09, M.pizarra, 0, 1.3, 0.01));
  let textoCartel = ['Abrimos', 'hoy'];
  // El tamaño de letra se ajusta para que quepa la línea más larga.
  const pizarra = etiqueta(1.3, 0.86, (ctx, cw, ch) => {
    let size = ch * 0.2;
    ctx.font = `600 ${size}px Poppins, sans-serif`;
    const largo = Math.max(...textoCartel.map((l) => ctx.measureText(l).width));
    if (largo > cw * 0.9) size *= (cw * 0.9) / largo;
    textoCentrado(ctx, textoCartel, cw, ch, size, '#ffffff');
  });
  pizarra.mesh.position.set(0, 1.3, 0.06);
  cartel.add(pizarra.mesh);
  cartel.rotation.y = 0.25;
  mundo.add(cartel);

  // Plantas en maceta.
  for (const [x, z, s] of [[-4.5, -2.5, 1], [9.4, -2.5, 1], [-5.8, 2.6, 0.85], [10.8, 2.6, 0.85]]) {
    const planta = new THREE.Group();
    planta.add(cilindro(0.26, 0.2, 0.45, M.maceta, 0, 0.225, 0, 10));
    planta.add(esfera(0.34, M.hoja, 0, 0.72, 0, 7), esfera(0.26, M.hoja, 0.2, 0.95, 0.05, 7), esfera(0.24, M.hoja, -0.18, 0.92, -0.05, 7));
    planta.position.set(x, 0, z);
    planta.scale.setScalar(s);
    mundo.add(planta);
  }

  // Recepción.
  mundo.add(caja(1.1, 1.05, 0.7, M.madera, -3.5, 0.525, -0.25));
  mundo.add(caja(0.35, 0.03, 0.25, M.papel, -3.5, 1.07, -0.2));
  const formulario = new THREE.Group();
  formulario.add(caja(0.42, 1.25, 0.02, M.papel, 0, 0, 0));
  for (let i = 0; i < 9; i++) formulario.add(caja(0.3, 0.02, 0.025, M.negro, 0, 0.5 - i * 0.12, 0.005));
  formulario.position.set(-3.25, 0.5, 0.12);
  formulario.rotation.x = 0.08;
  mundo.add(formulario);

  // Mesa con sillas.
  mundo.add(cilindro(0.75, 0.75, 0.06, M.madera, MESA.x, 0.78, MESA.z, 20));
  mundo.add(cilindro(0.07, 0.07, 0.78, M.madera, MESA.x, 0.39, MESA.z, 8));
  mundo.add(cilindro(0.35, 0.35, 0.04, M.madera, MESA.x, 0.02, MESA.z, 12));
  // Cada asiento: posición y hacia dónde mira quien se sienta.
  const ASIENTOS = {
    cliente: { x: POS.mesa[0], z: POS.mesa[1], giro: 0 },
    izquierda: { x: MESA.x - 1.0, z: MESA.z - 0.1, giro: Math.PI / 2 },
    derecha: { x: MESA.x + 1.0, z: MESA.z - 0.1, giro: -Math.PI / 2 },
  };
  const silla = (x: number, z: number, giro: number) => {
    const g = new THREE.Group();
    g.add(caja(0.46, 0.05, 0.46, M.madera, 0, 0.45, 0));
    for (const [lx, lz] of [[-0.19, -0.19], [0.19, -0.19], [-0.19, 0.19], [0.19, 0.19]]) g.add(caja(0.05, 0.45, 0.05, M.madera, lx, 0.225, lz));
    g.add(caja(0.46, 0.5, 0.05, M.madera, 0, 0.72, -0.21));
    g.position.set(x, 0, z);
    g.rotation.y = giro;
    mundo.add(g);
  };
  Object.values(ASIENTOS).forEach((a) => silla(a.x, a.z, a.giro));

  const sobreMesa = (obj: THREE.Object3D, x: number, z: number, y = Y_MESA) => {
    obj.position.set(x, y, z);
    mundo.add(obj);
    return obj;
  };
  const aperitivo = new THREE.Group();
  aperitivo.add(cilindro(0.18, 0.15, 0.03, M.blanco, 0, 0, 0));
  aperitivo.add(esfera(0.045, M.verde, -0.06, 0.04, 0), esfera(0.045, M.verde, 0.04, 0.04, 0.04), esfera(0.045, M.verde, 0.03, 0.04, -0.05));
  sobreMesa(aperitivo, MESA.x - 0.4, MESA.z - 0.3);
  const cartaCorta = sobreMesa(caja(0.28, 0.38, 0.02, M.papel), MESA.x + 0.25, MESA.z - 0.25, Y_MESA + 0.19);
  cartaCorta.rotation.x = -0.25;
  const cartaLarga = new THREE.Group();
  cartaLarga.add(caja(0.42, 1.3, 0.02, M.papel, 0, 0, 0));
  for (let i = 0; i < 14; i++) cartaLarga.add(caja(0.3, 0.015, 0.025, M.negro, 0, 0.56 - i * 0.08, 0.005));
  sobreMesa(cartaLarga, MESA.x + 0.3, MESA.z - 0.15, Y_MESA + 0.65);
  cartaLarga.rotation.x = -0.15;
  const postre = new THREE.Group();
  postre.add(cilindro(0.1, 0.06, 0.16, M.blanco, 0, 0.08, 0), esfera(0.09, M.crema, 0, 0.18, 0), esfera(0.035, M.tomate, 0, 0.28, 0));
  sobreMesa(postre, MESA.x - 0.3, MESA.z - 0.25);
  const extras = new THREE.Group();
  extras.add(cilindro(0.07, 0.07, 0.4, M.botella, 0, 0.2, 0), cilindro(0.03, 0.03, 0.12, M.botella, 0, 0.46, 0));
  extras.add(caja(0.2, 0.26, 0.02, M.papel, 0.25, 0.13, 0.05));
  sobreMesa(extras, MESA.x + 0.35, MESA.z + 0.1);
  const cuenta = sobreMesa(caja(0.22, 0.01, 0.3, M.papel), MESA.x + 0.3, MESA.z - 0.1, Y_MESA + 0.01);
  const cajaPizza = sobreMesa(caja(0.5, 0.08, 0.5, M.carton), MESA.x + 0.25, MESA.z + 0.05, Y_MESA + 0.04);

  // Barra.
  mundo.add(caja(2.3, 1.05, 0.8, M.azul, 3, 0.525, -0.6));
  mundo.add(caja(2.5, 0.08, 1.0, M.madera, 3, 1.08, -0.6));

  // Horno de leña con humo saliendo por la chimenea.
  mundo.add(caja(2.6, 1.0, 2.0, M.ladrillo, 6.5, 0.5, -1.7));
  const cupula = new THREE.Mesh(new THREE.SphereGeometry(1.2, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), M.ladrillo);
  cupula.position.set(6.5, 1.0, -1.7);
  cupula.castShadow = true;
  mundo.add(cupula);
  const boca = new THREE.Mesh(new THREE.CircleGeometry(0.45, 16, 0, Math.PI), M.boca);
  boca.position.set(6.5, 1.0, -0.69);
  mundo.add(boca);
  mundo.add(cilindro(0.18, 0.18, 1.6, M.ladrillo, 6.5, 2.7, -2.1, 10));
  const fuego = esfera(0.22, M.fuego, 6.5, 1.05, -0.9, 10);
  fuego.scale.set(1.3, 0.6, 0.6);
  fuego.castShadow = false;
  mundo.add(fuego);
  const luzFuego = new THREE.PointLight(0xff8a2e, 1.2, 5, 1.6);
  luzFuego.position.set(6.5, 1.2, -0.4);
  mundo.add(luzFuego);
  const humo = Array.from({ length: 7 }, (_, i) => {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 8, 6),
      new THREE.MeshStandardMaterial({ color: 0xd8d8d8, transparent: true, opacity: 0.5, roughness: 1, flatShading: true, depthWrite: false })
    );
    m.userData.fase = i / 7;
    mundo.add(m);
    return m;
  });

  // ── Calle ──────────────────────────────────────────────────────────
  // Acera ancha delante de los edificios (de z = -0,3 al bordillo), calzada
  // de doble sentido con paso de cebra y la acera de enfrente.
  const FACHADA_Z = -0.3;
  const BORDILLO_Z = 4.6;
  const ENFRENTE_Z = 13.6;
  const CARRIL_Z = (BORDILLO_Z + ENFRENTE_Z) / 2;

  const calzada = new THREE.Mesh(escalarUV(new THREE.PlaneGeometry(400, 300), 100, 75), M.asfalto);
  calzada.rotation.x = -Math.PI / 2;
  calzada.position.y = -0.16;
  calzada.receiveShadow = true;
  mundo.add(calzada);
  const acera = (x0: number, x1: number, z0: number, z1: number) => {
    const geo = escalarUV(new THREE.BoxGeometry(x1 - x0, 0.16, z1 - z0), (x1 - x0) / 1.2, (z1 - z0) / 1.2);
    const m = new THREE.Mesh(geo, M.acera);
    m.position.set((x0 + x1) / 2, -0.08, (z0 + z1) / 2);
    m.receiveShadow = true;
    mundo.add(m);
  };
  acera(-90, -5.1, -40, BORDILLO_Z);
  acera(10.1, 90, -40, BORDILLO_Z);
  acera(-5.1, 10.1, 3.1, BORDILLO_Z);
  acera(-5.1, 10.1, -40, -3.1);
  acera(-90, 90, ENFRENTE_Z, 60);
  mundo.add(caja(180, 0.18, 0.22, M.bordillo, 0, -0.08, BORDILLO_Z));
  mundo.add(caja(180, 0.18, 0.22, M.bordillo, 0, -0.08, ENFRENTE_Z));

  // Repite una misma pieza muchas veces con una sola llamada de dibujo.
  const repetir = (geo: THREE.BufferGeometry, m: THREE.Material, posiciones: [number, number, number][], sombra = false) => {
    const im = new THREE.InstancedMesh(geo, m, posiciones.length);
    const mx = new THREE.Matrix4();
    posiciones.forEach(([x, y, z], i) => im.setMatrixAt(i, mx.makeTranslation(x, y, z)));
    im.castShadow = sombra;
    im.receiveShadow = true;
    mundo.add(im);
    return im;
  };
  // Línea discontinua central y paso de cebra.
  repetir(new THREE.BoxGeometry(1.6, 0.01, 0.12), M.pintura, Array.from({ length: 56 }, (_, i) => [-90 + i * 3.2, -0.153, CARRIL_Z] as [number, number, number]));
  repetir(new THREE.BoxGeometry(3, 0.01, 0.5), M.pintura, Array.from({ length: 9 }, (_, i) => [-16, -0.152, BORDILLO_Z + 0.55 + i * 1.0] as [number, number, number]));
  // Bolardos delante del local.
  repetir(new THREE.CylinderGeometry(0.06, 0.07, 0.8, 10), M.metal, Array.from({ length: 9 }, (_, i) => [-4.4 + i * 1.75, 0.4, 4.35] as [number, number, number]), true);

  const geoCopa = new THREE.IcosahedronGeometry(1, 1);
  const arbol = (x: number, s: number) => {
    const g = new THREE.Group();
    g.add(caja(1.0, 0.02, 1.0, M.alcorque, 0, 0.005, 0));
    g.add(cilindro(0.09, 0.13, 2.5, M.tronco, 0, 1.25, 0, 8));
    for (const [cx, cy, cz, r] of [[0, 3.0, 0, 1.0], [0.55, 2.6, 0.2, 0.72], [-0.5, 2.7, -0.15, 0.78], [0.1, 3.6, -0.1, 0.7]]) {
      const copa = new THREE.Mesh(geoCopa, M.hoja);
      copa.scale.setScalar(r);
      copa.position.set(cx, cy, cz);
      copa.castShadow = true;
      g.add(copa);
    }
    g.position.set(x, 0, 4.3);
    g.scale.setScalar(s);
    mundo.add(g);
  };
  [[-35.5, 1.1], [-26.5, 1], [-18.5, 0.95], [16.5, 1], [25, 1.1], [34, 0.95]].forEach(([x, s]) => arbol(x, s));

  const geoHalo = new THREE.ConeGeometry(1.7, 4.0, 20, 1, true);
  const farola = (x: number) => {
    const g = new THREE.Group();
    g.add(cilindro(0.12, 0.15, 0.3, M.metal, 0, 0.15, 0, 10));
    g.add(cilindro(0.05, 0.06, 4.2, M.metal, 0, 2.1, 0, 8));
    g.add(caja(0.06, 0.06, 0.8, M.metal, 0, 4.15, 0.35));
    g.add(caja(0.36, 0.14, 0.5, M.metal, 0, 4.1, 0.75));
    const bombilla = caja(0.3, 0.03, 0.42, M.bombilla, 0, 4.02, 0.75);
    bombilla.castShadow = false;
    const halo = new THREE.Mesh(geoHalo, M.halo);
    halo.position.set(0, 2.0, 0.75);
    soloNoche.push(halo);
    g.add(bombilla, halo);
    g.position.set(x, 0, 4.4);
    mundo.add(g);
  };
  [-31, -22.5, -12.8, 20.5, 29.5, 38.5].forEach(farola);

  // Banco, papelera y cajas de fruta de la frutería de al lado.
  const banco = new THREE.Group();
  banco.add(caja(1.6, 0.06, 0.42, M.madera, 0, 0.45, 0), caja(1.6, 0.36, 0.05, M.madera, 0, 0.72, -0.2));
  for (const x of [-0.65, 0.65]) banco.add(caja(0.06, 0.45, 0.4, M.metal, x, 0.225, 0));
  banco.position.set(18.5, 0, 2.6);
  mundo.add(banco);
  mundo.add(cilindro(0.18, 0.16, 0.7, M.metal, -12.2, 0.35, 4.1, 12));
  const FRUTAS = [0xf28c28, 0xd7322b, 0x7bb342, 0xf5d03b].map((c) => suave(c, { roughness: 0.5 }));
  [[-11.7, 0.15, 0.25, 0], [-11.05, 0.15, 0.25, 1], [-11.4, 0.45, 0.2, 2], [-10.4, 0.15, 0.25, 3]].forEach(([x, y, z, f]) => {
    mundo.add(caja(0.6, 0.3, 0.42, M.madera, x, y, z));
    for (let i = 0; i < 6; i++) {
      const fruta = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), FRUTAS[f]);
      fruta.position.set(x - 0.18 + (i % 3) * 0.18, y + 0.17, z - 0.09 + Math.floor(i / 3) * 0.18);
      mundo.add(fruta);
    }
  });

  // ── Edificios ──────────────────────────────────────────────────────
  // Cada edificio es un bloque con la fachada pintada en un canvas
  // (ventanas, persianas, impostas) y otro canvas con las ventanas que se
  // encienden de noche. Los balcones y las tiendas de la planta baja son
  // geometría para que tengan relieve y sombra.
  interface Tienda { nombre: string; color: string; toldo?: string[]; cruz?: boolean }
  interface Vecino { ancho: number; alto: number; fondo: string; tienda?: Tienda | 'cerrada'; balcones?: boolean; persiana?: string; semilla: number }
  const PX = 36;
  const balcones: [number, number, number][] = [];

  const pintarFachada = (w: number, h: number, planta: number, v: Vecino) => {
    const cw = Math.round(w * PX);
    const ch = Math.round(h * PX);
    const [base, c] = lienzo(cw, ch);
    const [luz, l] = lienzo(cw, ch);
    const rnd = aleatorio(v.semilla);
    const Y = (m: number) => ch - m * PX;
    c.fillStyle = v.fondo;
    c.fillRect(0, 0, cw, ch);
    // Textura de revoco con alguna mancha.
    for (let i = 0; i < 260; i++) {
      c.fillStyle = `rgba(0,0,0,${rnd() * 0.035})`;
      c.fillRect(rnd() * cw, rnd() * ch, 2 + rnd() * 6, 2 + rnd() * 6);
    }
    l.fillStyle = '#000';
    l.fillRect(0, 0, cw, ch);
    c.fillStyle = 'rgba(0,0,0,0.13)';
    c.fillRect(0, Y(planta), cw, planta * PX);
    const piso = 3.0;
    const pisos = Math.max(1, Math.floor((h - planta - 0.6) / piso));
    // Posición (x, altura del suelo del piso) de cada balcón.
    const huecos: [number, number][] = [];
    const n = Math.max(1, Math.round(w / 2.6));
    const paso = w / n;
    for (let f = 0; f < pisos; f++) {
      const y0 = planta + f * piso;
      c.fillStyle = 'rgba(0,0,0,0.09)';
      c.fillRect(0, Y(y0 + 0.14), cw, 0.14 * PX);
      for (let i = 0; i < n; i++) {
        const x = (i + 0.5) * paso;
        const balcon = !!v.balcones;
        const vw = 1.0;
        const vh = balcon ? 2.2 : 1.5;
        const vy = balcon ? y0 + 0.15 : y0 + 0.95;
        c.fillStyle = '#f3efe6';
        c.fillRect((x - vw / 2 - 0.09) * PX, Y(vy + vh + 0.09), (vw + 0.18) * PX, (vh + 0.18) * PX);
        const g = c.createLinearGradient(0, Y(vy + vh), 0, Y(vy));
        g.addColorStop(0, '#6a809c');
        g.addColorStop(1, '#2d394a');
        c.fillStyle = g;
        c.fillRect((x - vw / 2) * PX, Y(vy + vh), vw * PX, vh * PX);
        c.fillStyle = '#f3efe6';
        c.fillRect((x - 0.03) * PX, Y(vy + vh), 0.06 * PX, vh * PX);
        const ph = rnd() < 0.75 ? vh * rnd() * 0.7 : 0;
        if (ph > 0) {
          c.fillStyle = v.persiana ?? '#d8cbb0';
          c.fillRect((x - vw / 2) * PX, Y(vy + vh), vw * PX, ph * PX);
          c.fillStyle = 'rgba(0,0,0,0.14)';
          for (let k = 0; k < ph * PX; k += 3) c.fillRect((x - vw / 2) * PX, Y(vy + vh) + k, vw * PX, 1);
        }
        if (rnd() < 0.42) {
          l.fillStyle = rnd() < 0.8 ? '#ffcf8a' : '#cfe0ff';
          l.fillRect((x - vw / 2) * PX, Y(vy + vh - ph), vw * PX, (vh - ph) * PX);
        }
        if (balcon) huecos.push([x, y0]);
      }
    }
    c.fillStyle = 'rgba(0,0,0,0.14)';
    c.fillRect(0, 0, cw, 0.4 * PX);
    return { map: aTextura(base), luz: aTextura(luz), huecos };
  };

  const tienda = (xc: number, w: number, zf: number, t: Tienda | 'cerrada') => {
    const ancho = w - 1.0;
    if (t === 'cerrada') {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(ancho, 2.7), M.cierre);
      p.position.set(xc, 1.35, zf + 0.02);
      p.receiveShadow = true;
      mundo.add(p);
      mundo.add(caja(ancho + 0.2, 0.12, 0.1, M.marcoTienda, xc, 2.75, zf + 0.05));
      return;
    }
    const vidrio = new THREE.Mesh(new THREE.PlaneGeometry(ancho - 1.3, 2.05), M.escaparate);
    vidrio.position.set(xc - 0.6, 1.375, zf + 0.02);
    const puerta = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 2.35), M.escaparate);
    puerta.position.set(xc + ancho / 2 - 0.6, 1.175, zf + 0.02);
    mundo.add(vidrio, puerta);
    mundo.add(caja(ancho + 0.1, 0.1, 0.08, M.marcoTienda, xc, 2.4, zf + 0.04));
    mundo.add(caja(0.08, 2.4, 0.08, M.marcoTienda, xc + ancho / 2 - 1.15, 1.2, zf + 0.04));
    mundo.add(caja(ancho - 1.2, 0.35, 0.08, M.marcoTienda, xc - 0.6, 0.175, zf + 0.04));
    for (const x of [xc - ancho / 2, xc + ancho / 2]) mundo.add(caja(0.08, 2.45, 0.08, M.marcoTienda, x, 1.2, zf + 0.04));
    const rotulo = etiqueta(ancho, 0.55, (ctx, cw, ch) => {
      ctx.fillStyle = t.color;
      ctx.fillRect(0, 0, cw, ch);
      textoCentrado(ctx, [t.nombre], cw, ch, ch * 0.56, '#ffffff', 'Newsreader');
    }, 96);
    rotulo.mesh.position.set(xc, 2.85, zf + 0.04);
    mundo.add(rotulo.mesh);
    rotulosTienda.push(rotulo.repintar);
    if (t.toldo) {
      const tg = toldo(ancho - 0.2, 1.1, rayas(t.toldo, 12));
      tg.position.set(xc, 2.62, zf + 0.03);
      mundo.add(tg);
    }
    if (t.cruz) {
      const cruz = new THREE.Group();
      cruz.add(caja(0.5, 0.16, 0.08, M.cruz), caja(0.16, 0.5, 0.08, M.cruz));
      cruz.add(caja(0.05, 0.05, 0.3, M.metal, 0, 0, -0.18));
      cruz.position.set(xc + w / 2 - 0.4, 3.35, zf + 0.35);
      mundo.add(cruz);
    }
  };

  const edificio = (x0: number, v: Vecino, zf = FACHADA_Z, planta = 3.6, fondo = 12) => {
    const w = v.ancho;
    const h = v.alto;
    const xc = x0 + w / 2;
    const { map, luz, huecos } = pintarFachada(w, h, planta, v);
    const frente = new THREE.MeshStandardMaterial({ map, emissiveMap: luz, emissive: 0xffffff, emissiveIntensity: 0, roughness: 0.95 });
    const lado = new THREE.MeshStandardMaterial({ color: new THREE.Color(v.fondo).multiplyScalar(0.92), roughness: 0.95 });
    const tejado = new THREE.MeshStandardMaterial({ color: 0x9a8f86, roughness: 1 });
    lado.userData.claro = lado.color.getHex();
    tejado.userData.claro = tejado.color.getHex();
    fachadas.push(frente);
    edificios.push(frente, lado, tejado);
    const bloque = new THREE.Mesh(new THREE.BoxGeometry(w, h, fondo), [lado, lado, tejado, lado, frente, lado]);
    bloque.position.set(xc, h / 2, zf - fondo / 2);
    bloque.receiveShadow = true;
    mundo.add(bloque);
    mundo.add(caja(w + 0.12, 0.3, 0.42, lado, xc, h - 0.25, zf + 0.12));
    huecos.forEach(([x, y]) => balcones.push([x0 + x, y, zf]));
    if (v.tienda) tienda(xc, w, zf, v.tienda);
  };
  const edificios: THREE.MeshStandardMaterial[] = [];

  const IZQUIERDA: Vecino[] = [
    { ancho: 7.5, alto: 11, fondo: '#e9d8bf', balcones: true, semilla: 3, tienda: { nombre: 'Frutería', color: '#2e7d4f', toldo: ['#2e7d4f', '#f4f1ea'] } },
    { ancho: 6.5, alto: 14, fondo: '#c98a6b', persiana: '#5f7a5a', semilla: 5, tienda: { nombre: 'Farmacia', color: '#1f8a4c', cruz: true } },
    { ancho: 8, alto: 10, fondo: '#dcc8a8', balcones: true, semilla: 9, tienda: { nombre: 'Café Bar', color: '#7a2e2e', toldo: ['#7a2e2e', '#efe6d8'] } },
    { ancho: 7, alto: 12.5, fondo: '#b9c4c9', semilla: 13, tienda: 'cerrada' },
    { ancho: 9, alto: 11.5, fondo: '#e3c79a', balcones: true, semilla: 17, tienda: { nombre: 'Librería', color: '#1f3b63' } },
    { ancho: 8, alto: 15, fondo: '#cfa58a', semilla: 19, tienda: { nombre: 'Panadería', color: '#a0522d', toldo: ['#a0522d', '#f3e9da'] } },
    { ancho: 9, alto: 12, fondo: '#d9cdb8', balcones: true, semilla: 23, tienda: 'cerrada' },
  ];
  const DERECHA: Vecino[] = [
    { ancho: 7, alto: 12, fondo: '#dccdb6', balcones: true, semilla: 29, tienda: { nombre: 'Floristería', color: '#3d6b3a', toldo: ['#3d6b3a', '#f2efe6'] } },
    { ancho: 8, alto: 10.5, fondo: '#c7876a', persiana: '#4f6475', semilla: 31, tienda: { nombre: 'Óptica', color: '#22314f' } },
    { ancho: 6.5, alto: 13.5, fondo: '#e8dcc8', balcones: true, semilla: 37, tienda: 'cerrada' },
    { ancho: 9, alto: 11, fondo: '#b8a48c', semilla: 41, tienda: { nombre: 'Ferretería', color: '#8a3b1e', toldo: ['#8a3b1e', '#efe4d4'] } },
    { ancho: 7.5, alto: 14.5, fondo: '#d4b48c', balcones: true, semilla: 43, tienda: { nombre: 'Peluquería', color: '#5a3f6b' } },
    { ancho: 9, alto: 11.5, fondo: '#c9bfae', semilla: 47, tienda: 'cerrada' },
  ];
  let borde = -5.3;
  IZQUIERDA.forEach((v) => { borde -= v.ancho; edificio(borde, v); });
  borde = 10.3;
  DERECHA.forEach((v) => { edificio(borde, v); borde += v.ancho; });
  // Edificio de viviendas sobre la pizzería, retranqueado detrás del local.
  edificio(-5.3, { ancho: 15.6, alto: 12.5, fondo: '#ead9c0', balcones: true, semilla: 53 }, -3.25, 3.9, 9);

  // Balcones: losa y barandilla, todas en dos llamadas de dibujo.
  repetir(new THREE.BoxGeometry(1.45, 0.1, 0.55), M.piedra, balcones.map(([x, y, z]) => [x, y + 0.05, z + 0.27] as [number, number, number]), true);
  repetir(new THREE.PlaneGeometry(1.45, 1.0), M.barandilla, balcones.map(([x, y, z]) => [x, y + 0.6, z + 0.53] as [number, number, number]));

  // Segunda fila de edificios al fondo, que la niebla difumina.
  const ventanasLejos = textura(64, 64, (ctx) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = 'rgba(40,55,75,0.35)';
    ctx.fillRect(18, 14, 28, 34);
  }, 1, 1);
  M.lejano.map = ventanasLejos;
  [[-74, 14, 18], [-58, 12, 24], [-44, 16, 20], [-28, 14, 27], [-12, 18, 22], [6, 12, 25], [22, 16, 19], [38, 14, 23], [54, 12, 28], [70, 16, 21]].forEach(([x, w, h]) => {
    const b = new THREE.Mesh(escalarUV(new THREE.BoxGeometry(w, h, 10), w / 3, h / 3), M.lejano);
    b.position.set(x, h / 2, -24);
    mundo.add(b);
  });

  // ── Coches ─────────────────────────────────────────────────────────
  const G_COCHE = {
    cuerpo: new RoundedBoxGeometry(4.0, 0.62, 1.75, 3, 0.18),
    cabina: new RoundedBoxGeometry(2.2, 0.55, 1.58, 3, 0.16),
    techo: new RoundedBoxGeometry(2.0, 0.08, 1.6, 2, 0.04),
    rueda: new THREE.CylinderGeometry(0.33, 0.33, 0.24, 16).rotateX(Math.PI / 2),
  };
  const coche = (color: number) => {
    const g = new THREE.Group();
    const pintura = suave(color, { roughness: 0.35, metalness: 0.3 });
    const cuerpo = new THREE.Mesh(G_COCHE.cuerpo, pintura);
    cuerpo.position.y = 0.62;
    const cabina = new THREE.Mesh(G_COCHE.cabina, M.cristal);
    cabina.position.set(-0.25, 1.15, 0);
    const techo = new THREE.Mesh(G_COCHE.techo, pintura);
    techo.position.set(-0.25, 1.43, 0);
    [cuerpo, cabina, techo].forEach((m) => (m.castShadow = true));
    g.add(cuerpo, cabina, techo);
    const ruedas = [[-1.3, -0.8], [-1.3, 0.8], [1.3, -0.8], [1.3, 0.8]].map(([x, z]) => {
      const r = new THREE.Mesh(G_COCHE.rueda, M.rueda);
      r.position.set(x, 0.33, z);
      g.add(r);
      return r;
    });
    for (const z of [-0.58, 0.58]) {
      g.add(caja(0.06, 0.12, 0.34, M.faro, 2.0, 0.72, z), caja(0.06, 0.12, 0.3, M.piloto, -2.0, 0.74, z));
    }
    g.position.y = -0.16;
    mundo.add(g);
    return { g, ruedas };
  };
  const coches = [
    { c: coche(0xb8322c), z: CARRIL_Z - 2.25, vel: 5.5, x0: -30 },
    { c: coche(0xe9e9e6), z: CARRIL_Z - 2.25, vel: 5.5, x0: 40 },
    { c: coche(0x2f4f7a), z: CARRIL_Z + 2.25, vel: -4.5, x0: 10 },
    { c: coche(0x3d3f44), z: CARRIL_Z + 2.25, vel: -4.5, x0: -55 },
  ];

  // ── Personajes ─────────────────────────────────────────────────────
  // Proporciones de una persona de 1,79 m: cadera a 0,86, hombros a 1,42 y
  // centro de la cabeza a 1,66. Piernas y brazos tienen rodilla y codo para
  // andar, sentarse y gesticular con naturalidad.
  const PIELES = [0xf1c6a5, 0xe3b08c, 0xc68863, 0x8d5a3b, 0xf6d8c2].map((c) => suave(c, { roughness: 0.6 }));
  const PELOS = [0x2b1d14, 0x5a3a22, 0x141414, 0xa7743f, 0x9a9a9a, 0xd4b27a].map((c) => suave(c, { roughness: 0.85 }));
  const ROPAS = [0x34495e, 0x8e3b46, 0x2e6b5a, 0xc9a227, 0x5b6b8a, 0x7a4e7e, 0xd77a4a, 0x3f3f46, 0xe6e1d6, 0x6c7a3a, 0xb04a5a, 0x4f86b5].map((c) => suave(c));
  const PANTALONES = [0x2b2f3a, 0x3b5a85, 0x4a4a4a, 0x8c8f96, 0x5c4a3a, 0x1f2a44].map((c) => suave(c));
  const MEDIAS = [0x222222, 0x3a2e2a].map((c) => suave(c, { roughness: 0.5 }));
  type Peinado = 'corto' | 'largo' | 'mono' | 'calvo';
  const PEINADOS: Peinado[] = ['corto', 'largo', 'mono', 'calvo'];

  const G = {
    muslo: new THREE.CapsuleGeometry(0.07, 0.3, 4, 10).translate(0, -0.21, 0),
    espinilla: new THREE.CapsuleGeometry(0.056, 0.3, 4, 10).translate(0, -0.2, 0),
    zapato: new RoundedBoxGeometry(0.11, 0.08, 0.25, 2, 0.03),
    pelvis: new THREE.CylinderGeometry(0.16, 0.15, 0.22, 16),
    falda: new THREE.CylinderGeometry(0.17, 0.26, 0.44, 18),
    torso: new THREE.CapsuleGeometry(0.17, 0.32, 6, 16),
    cuello: new THREE.CylinderGeometry(0.048, 0.054, 0.14, 10),
    brazo: new THREE.CapsuleGeometry(0.052, 0.2, 4, 10).translate(0, -0.14, 0),
    antebrazo: new THREE.CapsuleGeometry(0.045, 0.19, 4, 10).translate(0, -0.13, 0),
    mano: new THREE.SphereGeometry(0.048, 10, 8),
    hombro: new THREE.SphereGeometry(0.075, 12, 10),
    cabeza: new THREE.SphereGeometry(0.13, 24, 18),
    ojo: new THREE.SphereGeometry(0.024, 10, 8),
    pupila: new THREE.SphereGeometry(0.013, 8, 6),
    nariz: new THREE.SphereGeometry(0.022, 8, 6),
    oreja: new THREE.SphereGeometry(0.032, 8, 6),
    ceja: new THREE.BoxGeometry(0.056, 0.013, 0.012),
    boca: new THREE.TorusGeometry(0.03, 0.008, 6, 12, Math.PI),
    bocaRecta: new THREE.BoxGeometry(0.055, 0.012, 0.01),
    gafa: new THREE.TorusGeometry(0.03, 0.005, 6, 16),
    pelo: new THREE.SphereGeometry(0.138, 22, 12, 0, Math.PI * 2, 0, 1.3),
    peloLargo: new THREE.SphereGeometry(0.138, 22, 12, 0, Math.PI * 2, 0, 1.5),
    melena: new THREE.CapsuleGeometry(0.12, 0.22, 4, 12),
    mono: new THREE.SphereGeometry(0.062, 12, 10),
    coronilla: new THREE.SphereGeometry(0.136, 20, 6, Math.PI - 0.5, Math.PI + 1.0, 1.05, 0.65),
  };

  type Hueco = 'ropa' | 'mangas' | 'antebrazos' | 'pantalon' | 'piel' | 'pelo';
  interface Look {
    ropa: THREE.Material; mangas?: THREE.Material; antebrazos?: THREE.Material; pantalon?: THREE.Material;
    piel?: THREE.Material; pelo?: THREE.Material; peinado?: Peinado; falda?: THREE.Material | null;
    delantal?: boolean; gorro?: boolean; pajarita?: boolean; caras?: boolean; bajo?: boolean;
  }
  interface Persona {
    grupo: THREE.Group;
    cuerpo: THREE.Group;
    cabeza: THREE.Group;
    piernas: THREE.Object3D[];
    rodillas: THREE.Object3D[];
    brazos: THREE.Object3D[];
    codos: THREE.Object3D[];
    manos: THREE.Object3D[];
    partes: Record<Hueco, THREE.Mesh[]>;
    peinados: Record<Peinado, THREE.Object3D>;
    falda: THREE.Mesh;
    cejas: THREE.Mesh[];
    ojos: THREE.Object3D[];
    bocas?: { feliz: THREE.Mesh; normal: THREE.Mesh; triste: THREE.Mesh };
    pose: Pose;
    poseHasta: number;
    poseBase: Pose;
    sentado: boolean;
    mirar: number;
    gesto?: { tipo: 'si' | 'no'; inicio: number };
    paso: number;
    parpadeo: number;
  }

  const vestir = (p: Persona, look: Partial<Record<Hueco, THREE.Material>>) => {
    (Object.keys(look) as Hueco[]).forEach((h) => { const m = look[h]; if (m) p.partes[h].forEach((x) => (x.material = m)); });
  };
  const peinar = (p: Persona, estilo: Peinado) => PEINADOS.forEach((k) => (p.peinados[k].visible = k === estilo));
  const ponerFalda = (p: Persona, m: THREE.Material | null) => {
    p.falda.visible = !!m;
    if (m) p.falda.material = m;
  };

  const persona = (look: Look): Persona => {
    const partes: Record<Hueco, THREE.Mesh[]> = { ropa: [], mangas: [], antebrazos: [], pantalon: [], piel: [], pelo: [] };
    const pieza = (geo: THREE.BufferGeometry, hueco: Hueco | null, m: THREE.Material, sombra = true) => {
      const mesh = new THREE.Mesh(geo, m);
      mesh.castShadow = sombra;
      if (hueco) partes[hueco].push(mesh);
      return mesh;
    };
    const piel = look.piel ?? PIELES[0];
    const pantalon = look.pantalon ?? PANTALONES[0];
    const mangas = look.mangas ?? look.ropa;
    const pelo = look.pelo ?? PELOS[0];
    const grupo = new THREE.Group();
    const cuerpo = new THREE.Group();
    grupo.add(cuerpo);

    const piernas: THREE.Object3D[] = [];
    const rodillas: THREE.Object3D[] = [];
    for (const x of [-0.09, 0.09]) {
      const cadera = new THREE.Group();
      cadera.position.set(x, 0.86, 0);
      cadera.add(pieza(G.muslo, 'pantalon', pantalon));
      const rodilla = new THREE.Group();
      rodilla.position.y = -0.42;
      rodilla.add(pieza(G.espinilla, 'pantalon', pantalon));
      const zapato = pieza(G.zapato, null, M.zapato);
      zapato.position.set(0, -0.39, 0.05);
      rodilla.add(zapato);
      cadera.add(rodilla);
      cuerpo.add(cadera);
      piernas.push(cadera);
      rodillas.push(rodilla);
    }
    const pelvis = pieza(G.pelvis, 'pantalon', pantalon);
    pelvis.position.y = 0.92;
    pelvis.scale.z = 0.72;
    const falda = pieza(G.falda, null, look.falda ?? ROPAS[0]);
    falda.position.y = 0.74;
    falda.scale.z = 0.8;
    falda.visible = !!look.falda;
    const torso = pieza(G.torso, 'ropa', look.ropa);
    torso.position.y = 1.17;
    torso.scale.set(1.18, 1, 0.68);
    const cuello = pieza(G.cuello, 'piel', piel);
    cuello.position.y = 1.52;
    cuerpo.add(pelvis, falda, torso, cuello);

    const brazos: THREE.Object3D[] = [];
    const codos: THREE.Object3D[] = [];
    const manos: THREE.Object3D[] = [];
    for (const sx of [-1, 1]) {
      const hombro = new THREE.Group();
      hombro.position.set(sx * 0.205, 1.41, 0);
      // Hombro redondeado para que el brazo nazca del torso y no parezca pegado.
      const deltoides = pieza(G.hombro, 'mangas', mangas);
      deltoides.position.set(-sx * 0.01, -0.01, 0);
      deltoides.scale.set(1, 0.9, 0.85);
      hombro.add(deltoides, pieza(G.brazo, 'mangas', mangas));
      const codo = new THREE.Group();
      codo.position.y = -0.29;
      codo.add(pieza(G.antebrazo, 'antebrazos', look.antebrazos ?? mangas));
      const mano = pieza(G.mano, 'piel', piel);
      mano.position.y = -0.29;
      mano.scale.set(0.85, 1.15, 0.65);
      const agarre = new THREE.Group();
      agarre.position.y = -0.3;
      codo.add(mano, agarre);
      hombro.add(codo);
      cuerpo.add(hombro);
      brazos.push(hombro);
      codos.push(codo);
      manos.push(agarre);
    }

    const cabeza = new THREE.Group();
    cabeza.position.y = 1.66;
    cuerpo.add(cabeza);
    const craneo = pieza(G.cabeza, 'piel', piel);
    craneo.scale.set(0.9, 1.07, 0.97);
    cabeza.add(craneo);
    const cejas: THREE.Mesh[] = [];
    const ojos: THREE.Object3D[] = [];
    for (const sx of [-1, 1]) {
      const ojo = new THREE.Group();
      ojo.position.set(sx * 0.045, 0.015, 0);
      if (!look.bajo) {
        const blanco = pieza(G.ojo, null, M.ojo, false);
        blanco.position.z = 0.104;
        blanco.scale.z = 0.6;
        ojo.add(blanco);
        const ceja = pieza(G.ceja, 'pelo', pelo, false);
        ceja.position.set(sx * 0.047, 0.062, 0.114);
        cejas.push(ceja);
        cabeza.add(ceja);
        const oreja = pieza(G.oreja, 'piel', piel, false);
        oreja.position.set(sx * 0.118, -0.005, -0.005);
        oreja.scale.set(0.45, 1, 0.8);
        cabeza.add(oreja);
      }
      const pupila = pieza(G.pupila, null, M.pupila, false);
      pupila.position.z = look.bajo ? 0.112 : 0.119;
      pupila.scale.z = 0.5;
      ojo.add(pupila);
      cabeza.add(ojo);
      ojos.push(ojo);
    }
    if (!look.bajo) {
      const nariz = pieza(G.nariz, 'piel', piel, false);
      nariz.position.set(0, -0.02, 0.121);
      nariz.scale.set(0.8, 1.1, 1.1);
      cabeza.add(nariz);
    }

    // Peinados: se construyen todos y se enseña uno.
    const capa = (geo: THREE.BufferGeometry, inclinacion: number) => {
      const m = pieza(geo, 'pelo', pelo);
      m.rotation.x = inclinacion;
      m.scale.set(0.93, 1.07, 1.0);
      m.position.y = 0.005;
      return m;
    };
    const corto = new THREE.Group();
    corto.add(capa(G.pelo, -0.3));
    const largo = new THREE.Group();
    const melena = pieza(G.melena, 'pelo', pelo);
    melena.position.set(0, -0.12, -0.06);
    melena.scale.set(1.05, 1, 0.55);
    largo.add(capa(G.peloLargo, -0.25), melena);
    const mono = new THREE.Group();
    const mono2 = pieza(G.mono, 'pelo', pelo);
    mono2.position.set(0, 0.1, -0.13);
    mono.add(capa(G.pelo, -0.3), mono2);
    const calvo = new THREE.Group();
    const corona = pieza(G.coronilla, 'pelo', pelo);
    corona.scale.set(0.93, 1.07, 1);
    calvo.add(corona);
    const peinados = { corto, largo, mono, calvo };
    PEINADOS.forEach((k) => { peinados[k].visible = k === (look.peinado ?? 'corto'); cabeza.add(peinados[k]); });

    if (look.delantal) {
      const d = caja(0.34, 0.62, 0.02, M.blanco, 0, 0.98, 0.128);
      d.castShadow = false;
      cuerpo.add(d);
    }
    if (look.pajarita) cuerpo.add(caja(0.13, 0.05, 0.03, M.tomate, 0, 1.47, 0.075));
    if (look.gorro) {
      cabeza.add(cilindro(0.12, 0.12, 0.16, M.blanco, 0, 0.17, 0, 14));
      cabeza.add(esfera(0.16, M.blanco, 0, 0.3, 0, 14));
    }
    let bocas: Persona['bocas'];
    if (look.caras !== false && !look.bajo) {
      const feliz = pieza(G.boca, null, M.labio, false);
      feliz.rotation.z = Math.PI;
      feliz.position.set(0, -0.045, 0.112);
      const triste = pieza(G.boca, null, M.labio, false);
      triste.position.set(0, -0.085, 0.11);
      const normal = pieza(G.bocaRecta, null, M.labio, false);
      normal.position.set(0, -0.065, 0.114);
      cabeza.add(feliz, triste, normal);
      bocas = { feliz, normal, triste };
      triste.visible = false;
      normal.visible = false;
    }
    mundo.add(grupo);
    return {
      grupo, cuerpo, cabeza, piernas, rodillas, brazos, codos, manos, partes, peinados, falda, cejas, ojos, bocas,
      pose: 'normal', poseHasta: 0, poseBase: 'normal', sentado: false, mirar: 0.15, paso: 0, parpadeo: 2 + Math.random() * 3,
    };
  };

  // Ropa, piel y peinado al azar para la gente de la calle.
  const vestirAlAzar = (p: Persona) => {
    const conFalda = Math.random() < 0.3;
    const ropa = alAzar(ROPAS);
    const piel = alAzar(PIELES);
    vestir(p, {
      ropa, mangas: ropa, antebrazos: Math.random() < 0.4 ? piel : ropa, piel, pelo: alAzar(PELOS),
      pantalon: conFalda ? alAzar(MEDIAS) : alAzar(PANTALONES),
    });
    ponerFalda(p, conFalda ? alAzar(ROPAS) : null);
    peinar(p, conFalda ? alAzar<Peinado>(['largo', 'mono', 'largo']) : alAzar<Peinado>(['corto', 'corto', 'largo', 'calvo', 'mono']));
  };

  // El cliente cambia de ropa, peinado y complementos según su perfil.
  const ropaCliente = suave(0x004aad);
  const pantalonCliente = suave(0x8c8f96);
  const peloCliente = suave(0x5a3a22, { roughness: 0.85 });
  const cliente = persona({ ropa: ropaCliente, pantalon: pantalonCliente, pelo: peloCliente, piel: PIELES[0], peinado: 'mono' });
  const camisa = caja(0.11, 0.15, 0.012, M.blanco, 0, 1.38, 0.108);
  camisa.castShadow = false;
  const corbata = caja(0.06, 0.28, 0.02, M.tomate, 0, 1.25, 0.122);
  corbata.castShadow = false;
  cliente.cuerpo.add(camisa, corbata);
  const maletin = new THREE.Group();
  maletin.add(caja(0.38, 0.28, 0.09, M.oscuro, 0, -0.15, 0), caja(0.12, 0.03, 0.03, M.oscuro, 0, 0.0, 0));
  cliente.manos[1].add(maletin);
  const maletinSuelo = caja(0.38, 0.28, 0.09, M.oscuro, ASIENTOS.cliente.x + 0.42, 0.14, ASIENTOS.cliente.z + 0.05);
  maletinSuelo.rotation.y = 0.3;
  mundo.add(maletinSuelo);
  const movil = caja(0.075, 0.15, 0.012, M.negro, 0, -0.05, 0.03);
  cliente.manos[0].add(movil);
  const gafas = new THREE.Group();
  for (const sx of [-1, 1]) {
    const aro = new THREE.Mesh(G.gafa, M.negro);
    aro.position.set(sx * 0.045, 0.015, 0.128);
    gafas.add(aro);
  }
  gafas.add(caja(0.03, 0.006, 0.006, M.negro, 0, 0.02, 0.13));
  cliente.cabeza.add(gafas);
  const ESTILOS: Record<string, { ropa: number; pantalon: number; pelo: number; peinado: Peinado; piel: number }> = {
    prisa: { ropa: 0x22314f, pantalon: 0x22314f, pelo: 0x2b1d14, peinado: 'corto', piel: 1 },
    grupo: { ropa: 0x004aad, pantalon: 0x8c8f96, pelo: 0x5a3a22, peinado: 'mono', piel: 0 },
    compara: { ropa: 0x2f8a5b, pantalon: 0x3b5a85, pelo: 0x141414, peinado: 'largo', piel: 2 },
    esceptico: { ropa: 0x7a5a44, pantalon: 0x4a4a4a, pelo: 0x9a9a9a, peinado: 'calvo', piel: 4 },
  };

  // Compañeros del perfil "grupo": siguen al cliente y se sientan a los lados.
  const acompanantes = [
    { p: persona({ ropa: suave(0x95c0fa), pantalon: PANTALONES[0], pelo: PELOS[2], piel: PIELES[3], peinado: 'corto' }), off: new THREE.Vector3(-0.8, 0, -0.65), asiento: ASIENTOS.izquierda },
    { p: persona({ ropa: suave(0xd9a441), pantalon: MEDIAS[0], pelo: PELOS[3], piel: PIELES[1], peinado: 'largo', falda: PANTALONES[3] }), off: new THREE.Vector3(0.15, 0, 0.95), asiento: ASIENTOS.derecha },
  ];
  acompanantes.forEach((a) => (a.p.grupo.visible = false));
  const anfitrion = persona({ ropa: M.azulClaro, pantalon: PANTALONES[0], pelo: PELOS[1], piel: PIELES[1], peinado: 'largo', delantal: true });
  anfitrion.grupo.position.set(-3.5, 0, -0.95);
  const chef = persona({ ropa: suave(0xf7f7f5), pantalon: PANTALONES[2], pelo: PELOS[0], piel: PIELES[2], delantal: true, gorro: true });
  chef.grupo.position.set(8.4, 0, -0.9);
  chef.poseBase = 'amasar';
  mundo.add(caja(0.9, 0.9, 0.6, M.madera, 8.4, 0.45, -0.3));
  mundo.add(cilindro(0.22, 0.22, 0.05, M.masa, 8.4, 0.93, -0.25, 12));
  const camarero = persona({ ropa: suave(0x1f1f22), mangas: suave(0xf7f7f5), pantalon: suave(0x1f1f22), pelo: PELOS[2], piel: PIELES[0], peinado: 'corto', delantal: true, pajarita: true });
  const libreta = caja(0.2, 0.26, 0.03, M.papel, 0, -0.02, 0.05);
  camarero.manos[0].add(libreta);

  // Gente que se para a mirar el cartel de la calle.
  const fantasmas = Array.from({ length: 6 }, (_, i) => {
    const p = persona({ ropa: ROPAS[0], bajo: true });
    p.grupo.position.set(-10.2 + (i % 3) * 0.8, 0, 2.4 + Math.floor(i / 3) * 0.7 + (i % 2) * 0.15);
    p.grupo.rotation.y = Math.atan2(cartel.position.x - p.grupo.position.x, cartel.position.z - p.grupo.position.z) * 0.6 + 0.4;
    p.grupo.scale.setScalar(0.001);
    return p;
  });
  const amigos = [0, 1, 2].map((i) => {
    const p = persona({ ropa: ROPAS[0] });
    p.grupo.position.set(12.2 + i * 0.7, 0, 1.6 + (i % 2) * 0.5);
    p.grupo.visible = false;
    return p;
  });
  // Peatones que pasan por la acera, para dar vida a la calle.
  const peatones = [
    { z: 3.85, vel: 1.25, x0: -40 }, { z: 3.3, vel: -1.1, x0: 30 }, { z: 3.85, vel: 1.05, x0: 6 },
    { z: 3.3, vel: -1.3, x0: -12 }, { z: 3.85, vel: 1.15, x0: 45 }, { z: 3.3, vel: -0.95, x0: -50 },
  ].map((w) => ({ ...w, p: persona({ ropa: ROPAS[0], bajo: true }) }));
  const variarCalle = () => [...fantasmas, ...amigos, ...peatones.map((w) => w.p)].forEach(vestirAlAzar);
  variarCalle();

  // Pizza en seis porciones para poder comérsela.
  const pizza = new THREE.Group();
  const porciones = Array.from({ length: 6 }, (_, i) => {
    const g = new THREE.Group();
    const a0 = (i / 6) * Math.PI * 2;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.05, 6, 1, false, a0, Math.PI / 3), M.masa);
    const queso = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.02, 6, 1, false, a0, Math.PI / 3), M.queso);
    queso.position.y = 0.03;
    base.castShadow = true;
    g.add(base, queso);
    const am = a0 + Math.PI / 6;
    const top = cilindro(0.035, 0.035, 0.015, M.tomate, Math.sin(am) * 0.15, 0.045, Math.cos(am) * 0.15, 8);
    g.add(top);
    pizza.add(g);
    return { g, top };
  });
  mundo.add(pizza);

  // ── Luces ──────────────────────────────────────────────────────────
  const cielo = new THREE.HemisphereLight(0xffffff, 0xb8a58c, 1.1);
  scene.add(cielo);
  const sol = new THREE.DirectionalLight(0xffffff, 1.6);
  sol.position.set(4, 12, 9);
  sol.castShadow = true;
  sol.shadow.mapSize.set(2048, 2048);
  Object.assign(sol.shadow.camera, { left: -22, right: 22, top: 12, bottom: -12, near: 1, far: 50 });
  sol.shadow.bias = -0.0005;
  sol.shadow.normalBias = 0.02;
  scene.add(sol);
  // Luz cálida dentro del local, para que se note la diferencia con la calle.
  const calida = new THREE.PointLight(0xffd29a, 0.5, 14, 1.2);
  calida.position.set(2.5, 2.8, 0.2);
  mundo.add(calida);

  // ── Tema claro/oscuro (día y noche) ────────────────────────────────
  const aplicarTema = () => {
    const p = document.body.classList.contains('dark') ? PALETAS.oscuro : PALETAS.claro;
    scene.background = new THREE.Color(p.fondo);
    (scene.fog as THREE.Fog).color.setHex(p.fondo);
    M.suelo.color.setHex(p.suelo);
    M.asfalto.color.setHex(p.asfalto);
    M.acera.color.setHex(p.acera);
    M.bordillo.color.setHex(p.bordillo);
    M.pintura.color.setHex(p.pintura);
    M.pared.color.setHex(p.pared);
    M.paredLado.color.setHex(p.paredLado);
    M.madera.color.setHex(p.madera);
    M.ladrillo.color.setHex(p.ladrillo);
    M.ventana.color.setHex(p.ventana);
    M.hoja.color.setHex(p.hoja);
    M.lejano.color.setHex(p.lejano);
    M.bombilla.color.setHex(p.bombilla);
    fachadas.forEach((m) => {
      m.color.setHex(p.fachada);
      m.emissiveIntensity = p.noche ? 0.9 : 0;
    });
    edificios.forEach((m) => {
      if (m.userData.claro != null) m.color.setHex(m.userData.claro).multiply(new THREE.Color(p.fachada));
    });
    M.escaparate.emissiveIntensity = p.noche ? 0.5 : 0;
    soloNoche.forEach((o) => (o.visible = p.noche));
    sol.intensity = p.luzSol;
    cielo.intensity = p.luzCielo;
    luzLampara.intensity = p.lampara;
    calida.intensity = p.calida;
  };
  aplicarTema();
  new MutationObserver(aplicarTema).observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // ── Animación de personajes ────────────────────────────────────────
  let t = 0;
  const acercar = (actual: number, meta: number, dt: number, vel = 10) => actual + (meta - actual) * Math.min(1, dt * vel);
  // Ángulos objetivo de los brazos por postura:
  // [izq hombro x, izq hombro z, izq codo, der hombro x, der hombro z, der codo].
  // Hombro x negativo lleva el brazo hacia delante; codo negativo lo dobla.
  const angulosPose = (p: Persona, pose: Pose, andando: boolean, s: number): number[] => {
    switch (pose) {
      case 'mano': return [0.03, -0.1, -0.15, 0, 2.7 + Math.sin(t * 9) * 0.12, -0.35];
      case 'cruzado': return [-0.35, 0.32, -1.75, -0.35, -0.32, -1.75];
      case 'reloj': return [-0.75, 0.35, -1.35, 0, 0.1, -0.15];
      case 'comer': {
        const o = (Math.sin(t * 6) + 1) / 2;
        return p.sentado
          ? [-0.4, -0.1, -1.2, -0.5 - o * 0.25, -0.3, -2.2 - o * 0.25]
          : [0.03, -0.1, -0.12, -0.5 - o * 0.25, -0.3, -2.2 - o * 0.25];
      }
      case 'amasar': return [-0.7 + Math.sin(t * 7) * 0.2, 0.2, -0.7, -0.7 - Math.sin(t * 7) * 0.2, -0.2, -0.7];
      case 'escribir': return [-0.45, 0.3, -1.25, -0.55, -0.3, -1.05 + Math.sin(t * 14) * 0.08];
      case 'movil': return [-0.55, 0.3, -1.45, andando ? s * 0.4 : 0.03, 0.1, andando ? -0.35 : -0.12];
      default:
        if (andando) return [-s * 0.45, -0.1, -0.35, s * 0.45, 0.1, -0.35];
        return p.sentado ? [-0.4, -0.1, -1.2, -0.4, 0.1, -1.2] : [0.03, -0.1, -0.12, 0.03, 0.1, -0.12];
    }
  };
  const animar = (p: Persona, dt: number, andando: boolean) => {
    p.paso = andando ? p.paso + dt * 9 : p.paso * 0.8;
    const s = Math.sin(p.paso);
    const c = Math.cos(p.paso);
    if (p.sentado && !andando) {
      p.piernas.forEach((l) => (l.rotation.x = acercar(l.rotation.x, -Math.PI / 2, dt)));
      p.rodillas.forEach((r) => (r.rotation.x = acercar(r.rotation.x, Math.PI / 2, dt)));
      p.cuerpo.position.y = acercar(p.cuerpo.position.y, -0.315, dt);
    } else if (andando) {
      p.piernas[0].rotation.x = s * 0.5;
      p.piernas[1].rotation.x = -s * 0.5;
      // La rodilla se dobla cuando la pierna avanza en el aire.
      p.rodillas[0].rotation.x = 0.1 + Math.max(0, -c) * 0.7;
      p.rodillas[1].rotation.x = 0.1 + Math.max(0, c) * 0.7;
      p.cuerpo.position.y = Math.abs(s) * 0.03;
    } else {
      p.piernas.forEach((l) => (l.rotation.x = acercar(l.rotation.x, 0, dt)));
      p.rodillas.forEach((r) => (r.rotation.x = acercar(r.rotation.x, 0, dt)));
      p.cuerpo.position.y = acercar(p.cuerpo.position.y, 0, dt);
    }
    if (p.pose !== p.poseBase && t > p.poseHasta) p.pose = p.poseBase;
    const [lx, lz, lc, rx, rz, rc] = angulosPose(p, p.pose, andando, s);
    p.brazos[0].rotation.x = acercar(p.brazos[0].rotation.x, lx, dt);
    p.brazos[0].rotation.z = acercar(p.brazos[0].rotation.z, lz, dt);
    p.codos[0].rotation.x = acercar(p.codos[0].rotation.x, lc, dt);
    p.brazos[1].rotation.x = acercar(p.brazos[1].rotation.x, rx, dt);
    p.brazos[1].rotation.z = acercar(p.brazos[1].rotation.z, rz, dt);
    p.codos[1].rotation.x = acercar(p.codos[1].rotation.x, rc, dt);
    // Cabeza: gestos de sí y no, y mirar abajo al consultar el reloj o el móvil.
    let hx = p.pose === 'reloj' || (p.pose === 'movil' && !andando) ? 0.35 : 0;
    let hy = 0;
    if (p.gesto) {
      const e = t - p.gesto.inicio;
      if (e > 0.9) p.gesto = undefined;
      else if (p.gesto.tipo === 'si') hx = Math.sin(e * 14) * 0.25 * (1 - e / 0.9);
      else hy = Math.sin(e * 14) * 0.4 * (1 - e / 0.9);
    }
    p.cabeza.rotation.x = p.gesto?.tipo === 'si' ? hx : acercar(p.cabeza.rotation.x, hx, dt);
    p.cabeza.rotation.y = p.gesto?.tipo === 'no' ? hy : acercar(p.cabeza.rotation.y, hy, dt);
    // Parpadeo cada pocos segundos.
    if (!quieto && t > p.parpadeo) {
      const cerrado = t - p.parpadeo < 0.12;
      p.ojos.forEach((o) => (o.scale.y = cerrado ? 0.1 : 1));
      if (!cerrado) p.parpadeo = t + 2.5 + Math.random() * 3.5;
    }
  };
  const girarHacia = (p: Persona, angulo: number, dt: number, vel = 8) => {
    // Gira por el camino más corto.
    let d = angulo - p.grupo.rotation.y;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    p.grupo.rotation.y += d * Math.min(1, dt * vel);
  };

  // ── Movimiento ─────────────────────────────────────────────────────
  interface Movil { obj: THREE.Object3D; persona?: Persona; destino: THREE.Vector3; velocidad: number; fin?: () => void }
  const moviles: Record<Actor, Movil> = {
    cliente: { obj: cliente.grupo, persona: cliente, destino: new THREE.Vector3(), velocidad: 1 },
    camarero: { obj: camarero.grupo, persona: camarero, destino: new THREE.Vector3(), velocidad: 1 },
    pizza: { obj: pizza, destino: new THREE.Vector3(), velocidad: 1 },
  };

  const mover: Escena['mover'] = (actor, x, z, opts = {}) => {
    const m = moviles[actor];
    if (m.persona) m.persona.sentado = false;
    const y = opts.y ?? 0;
    m.destino.set(x, y, z);
    m.fin?.();
    const ms = opts.ms ?? 1100;
    const distancia = m.obj.position.distanceTo(m.destino);
    if (quieto || ms <= 0 || distancia < 0.01) {
      m.obj.position.copy(m.destino);
      m.fin = undefined;
      return Promise.resolve();
    }
    m.velocidad = distancia / (ms / 1000);
    return new Promise((resolve) => (m.fin = () => { m.fin = undefined; resolve(); }));
  };

  // ── Cámara ─────────────────────────────────────────────────────────
  const direccion = new THREE.Vector3(0.12, 0.62, 1).normalize();
  const objetivo = { x: FOCOS.intro[0], d: FOCOS.intro[1] };
  const actual = { ...objetivo };
  let focoId = 'intro';
  // Cada cambio de foco invalida la vuelta pendiente de un primer plano.
  let turnoFoco = 0;
  const foco: Escena['foco'] = (id) => {
    focoId = id;
    turnoFoco++;
    const f = FOCOS[id] ?? FOCOS.intro;
    objetivo.x = f[0];
    objetivo.d = f[1];
    if (quieto) Object.assign(actual, objetivo);
  };

  // La tarjeta de preguntas tapa parte del lienzo: se desplaza el centro
  // óptico para que la acción quede en la zona libre.
  let ancho = 1;
  let alto = 1;
  let inclinacion = 0;
  let alejamiento = 1;
  const encuadre = () => {
    ancho = Math.max(1, contenedor.clientWidth);
    alto = Math.max(1, contenedor.clientHeight);
    renderer.setSize(ancho, alto, false);
    // La vista completa es más grande que el lienzo y se recorta la parte
    // que queda bajo la tarjeta. El aspecto tiene que ser el de la vista
    // completa o la imagen se deforma.
    const tj = opciones.tarjeta();
    let libre = ancho / alto;
    if (tj.abajo) {
      // En móvil la tarjeta va abajo: en vez de agrandar la vista, la
      // cámara mira un poco más hacia abajo para subir la acción.
      const dy = Math.min(tj.alto, alto * 0.6) / 2;
      camera.aspect = ancho / alto;
      camera.clearViewOffset();
      inclinacion = Math.atan((dy / (alto / 2)) * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    } else {
      const dx = Math.min(tj.ancho, ancho * 0.5) / 2;
      camera.aspect = (ancho + dx * 2) / alto;
      camera.setViewOffset(ancho + dx * 2, alto, dx * 2, 0, ancho, alto);
      inclinacion = 0;
      libre = (ancho - dx * 2) / alto;
    }
    // Cuanto más estrecha la zona libre, más se aleja la cámara para que
    // quepa la acción (con un tope para que los personajes no queden enanos).
    alejamiento = Math.min(2.4, Math.max(1, Math.pow(1.35 / libre, 0.8)));
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(encuadre).observe(contenedor);
  encuadre();

  // ── Bocadillo e icono (HTML proyectado sobre la cabeza del cliente) ─
  const punto = new THREE.Vector3();
  const aPantalla = (x: number, y: number, z: number) => {
    punto.set(x, y, z).project(camera);
    return [(punto.x + 1) / 2 * ancho, (1 - punto.y) / 2 * alto];
  };
  let hablando = false;
  let emoteHasta = 0;
  // Textos flotantes: suben 60 px y se desvanecen en 1,6 s.
  const flotantes: { el: HTMLElement; inicio: number }[] = [];
  const colocarOverlays = () => {
    const c = cliente.grupo.position;
    const altura = cliente.sentado ? 1.72 : 2.05;
    for (let i = flotantes.length - 1; i >= 0; i--) {
      const f = flotantes[i];
      const e = (t - f.inicio) / 1.6;
      if (e >= 1) { f.el.remove(); flotantes.splice(i, 1); continue; }
      const [x, y] = aPantalla(c.x + 0.35, altura + 0.1, c.z);
      f.el.style.transform = `translate(${x}px, ${y - e * 60}px) translate(-50%, -100%) scale(${0.8 + Math.min(e * 4, 1) * 0.3})`;
      f.el.style.opacity = String(e < 0.7 ? 1 : 1 - (e - 0.7) / 0.3);
    }
    if (hablando) {
      const [x, y] = aPantalla(c.x, altura, c.z);
      const w = bocadillo.offsetWidth;
      const bx = Math.max(w / 2 + 8, Math.min(ancho - w / 2 - 8, x));
      bocadillo.style.transform = `translate(${bx - w / 2}px, ${y}px) translateY(-100%)`;
      bocadillo.style.setProperty('--cola', `${x - bx + w / 2}px`);
    }
    if (!emote.hidden) {
      if (t > emoteHasta) emote.hidden = true;
      const [x, y] = aPantalla(c.x - 0.45, altura - 0.35, c.z);
      emote.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    }
  };

  // ── Bucle ──────────────────────────────────────────────────────────
  let previo = performance.now();
  let muestras = 0;
  let tiempoTotal = 0;
  let aligerado = false;
  let visible = true;
  let cocinando = false;
  let gentePendiente = 0;
  let perfilActual = '';
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(contenedor);

  const tmp = new THREE.Vector3();
  const vuelta = (x: number, desde: number, largo: number) => ((((x - desde) % largo) + largo) % largo) + desde;
  const frame = () => {
    requestAnimationFrame(frame);
    const ahora = performance.now();
    // Tiempo real aunque haya pocos fotogramas (móviles lentos): así las
    // animaciones duran lo previsto y las promesas de movimiento se cumplen.
    const dt = Math.min((ahora - previo) / 1000, 0.25);
    previo = ahora;
    if (!visible || document.hidden) return;
    t += dt;
    // En equipos lentos se baja la resolución y se quitan las sombras.
    if (!aligerado && muestras < 90) {
      muestras++;
      tiempoTotal += dt;
      if (muestras === 90 && tiempoTotal / muestras > 1 / 30) {
        aligerado = true;
        renderer.setPixelRatio(1);
        renderer.shadowMap.enabled = false;
        scene.traverse((o) => {
          const m = (o as THREE.Mesh).material;
          if (m) (Array.isArray(m) ? m : [m]).forEach((x) => (x.needsUpdate = true));
        });
        encuadre();
      }
    }

    for (const m of Object.values(moviles)) {
      tmp.subVectors(m.destino, m.obj.position);
      const dist = tmp.length();
      const andando = dist > 0.005;
      if (andando) {
        const paso = Math.min(dist, m.velocidad * dt);
        m.obj.position.addScaledVector(tmp.normalize(), paso);
        if (m.persona && Math.abs(tmp.x) + Math.abs(tmp.z) > 0.01) girarHacia(m.persona, Math.atan2(tmp.x, tmp.z), dt, 10);
        if (dist - paso <= 0.005) { m.obj.position.copy(m.destino); m.fin?.(); }
      } else if (m.persona) {
        // Parado, mira hacia la cámara para que se le vea la cara.
        girarHacia(m.persona, m.persona.sentado ? m.persona.mirar : 0.15, dt, 6);
      }
      if (m.persona) animar(m.persona, dt, andando);
    }
    // El maletín va en la mano y, al sentarse, se deja junto a la silla.
    maletin.visible = perfilActual === 'prisa' && !cliente.sentado;
    maletinSuelo.visible = perfilActual === 'prisa' && cliente.sentado;

    // Los acompañantes siguen al cliente y, cuando se sienta, ocupan su silla.
    acompanantes.forEach((a) => {
      if (!a.p.grupo.visible) return;
      const meta = cliente.sentado
        ? tmp.set(a.asiento.x, 0, a.asiento.z)
        : tmp.copy(cliente.grupo.position).add(a.off);
      const dir = meta.sub(a.p.grupo.position);
      const dist = dir.length();
      const andando = dist > 0.05;
      a.p.sentado = cliente.sentado && !andando;
      if (andando) {
        a.p.grupo.position.addScaledVector(dir.normalize(), Math.min(dist, Math.max(2.2, dist * 2) * dt));
        girarHacia(a.p, Math.atan2(dir.x, dir.z), dt, 10);
      } else {
        girarHacia(a.p, a.p.sentado ? a.asiento.giro : 0.15, dt, 6);
      }
      animar(a.p, dt, andando);
    });

    // Respiración y tareas de los personajes de fondo.
    [anfitrion, chef].forEach((p, i) => { animar(p, dt, false); p.cuerpo.position.y = Math.sin(t * 2 + i) * 0.008; });

    fantasmas.forEach((p, i) => {
      const meta = i < gentePendiente ? 1 : 0.001;
      const s = p.grupo.scale.x + (meta - p.grupo.scale.x) * Math.min(1, dt * 6);
      p.grupo.scale.setScalar(s);
      if (meta === 1) animar(p, dt, false);
    });
    amigos.forEach((p, i) => { if (p.grupo.visible) { animar(p, dt, false); p.cuerpo.position.y = Math.abs(Math.sin(t * 4 + i)) * 0.04; } });
    peatones.forEach((w) => {
      w.p.grupo.position.set(vuelta(w.x0 + w.vel * t, -60, 120), 0, w.z);
      w.p.grupo.rotation.y = w.vel > 0 ? Math.PI / 2 : -Math.PI / 2;
      animar(w.p, dt, true);
    });
    coches.forEach(({ c, z, vel, x0 }) => {
      const x = quieto ? x0 : vuelta(x0 + vel * t, -75, 150);
      c.g.position.set(x, -0.16, z);
      c.g.rotation.y = vel > 0 ? 0 : Math.PI;
      if (!quieto) c.ruedas.forEach((r) => (r.rotation.z = -Math.abs(vel) * t / 0.33));
    });

    // Humo de la chimenea: sube, crece y se desvanece.
    humo.forEach((h) => {
      const f = (t * 0.25 + h.userData.fase) % 1;
      h.position.set(6.5 + Math.sin(f * 4 + h.userData.fase * 6) * 0.15 + f * 0.4, 3.55 + f * 2.2, -2.1);
      h.scale.setScalar(0.6 + f * 1.6);
      (h.material as THREE.MeshStandardMaterial).opacity = (cocinando ? 0.6 : 0.35) * (1 - f);
    });

    const llama = cocinando ? 1 + Math.sin(t * 22) * 0.12 + Math.sin(t * 13) * 0.1 : 0.55;
    fuego.scale.set(1.3 * llama, 0.6 * llama * (cocinando ? 1.4 : 1), 0.6);
    luzFuego.intensity = cocinando ? 2.4 * llama : 0.8;

    const k = quieto ? 1 : 1 - Math.exp(-dt * 3.2);
    actual.x += (objetivo.x - actual.x) * k;
    actual.d += (objetivo.d - actual.d) * k;
    const mira = new THREE.Vector3(actual.x, 0.9, -0.6);
    camera.position.copy(mira).addScaledVector(direccion, actual.d * alejamiento);
    camera.lookAt(mira);
    if (inclinacion) camera.rotateX(-inclinacion);

    renderer.render(scene, camera);
    colocarOverlays();
  };

  // ── API ────────────────────────────────────────────────────────────
  const objetos: Record<Objeto, THREE.Object3D[]> = {
    formulario: [formulario], aperitivo: [aperitivo], cartaCorta: [cartaCorta], cartaLarga: [cartaLarga],
    postre: [postre], extras: [extras], cuenta: [cuenta], libreta: [libreta], pizza: [pizza], amigos: amigos.map((a) => a.grupo),
    caja: [cajaPizza],
  };
  const mostrar: Escena['mostrar'] = (obj, on) => objetos[obj].forEach((o) => (o.visible = on));
  let hambreActual = 60;
  const poseBaseCliente = (): Pose =>
    hambreActual < 30 || (perfilActual === 'esceptico' && hambreActual < 45 && !cliente.sentado)
      ? 'cruzado'
      : perfilActual === 'compara' && !cliente.sentado ? 'movil' : 'normal';

  const escena: Escena = {
    ok: true,
    mover,
    foco,
    mostrar,
    rotulo(texto) {
      // Parte el rótulo en dos líneas por el espacio más cercano al centro.
      const palabras = texto.split(' ');
      let mejor = 1;
      let dif = Infinity;
      for (let i = 1; i < palabras.length; i++) {
        const d = Math.abs(palabras.slice(0, i).join(' ').length - palabras.slice(i).join(' ').length);
        if (d < dif) { dif = d; mejor = i; }
      }
      textoCartel = palabras.length > 1 ? [palabras.slice(0, mejor).join(' '), palabras.slice(mejor).join(' ')] : [texto];
      pizarra.repintar();
    },
    humor(hambre) {
      hambreActual = hambre;
      cliente.poseBase = poseBaseCliente();
      // Cejas fruncidas cuando se enfría, relajadas cuando está a gusto.
      cliente.cejas.forEach((c, i) => {
        const sx = i === 0 ? -1 : 1;
        c.rotation.z = hambre < 30 ? sx * 0.35 : hambre < 60 ? 0 : -sx * 0.12;
        c.position.y = hambre >= 60 ? 0.068 : 0.062;
      });
      if (!cliente.bocas) return;
      cliente.bocas.feliz.visible = hambre >= 60;
      cliente.bocas.normal.visible = hambre >= 30 && hambre < 60;
      cliente.bocas.triste.visible = hambre < 30;
    },
    pizzaMal(on) {
      porciones.forEach((p) => (p.top.material = on ? M.verde : M.tomate));
    },
    horno(on) { cocinando = on; },
    gente(n) { gentePendiente = n; },
    perfil(id) {
      perfilActual = id;
      const e = ESTILOS[id] ?? ESTILOS.grupo;
      ropaCliente.color.setHex(e.ropa);
      pantalonCliente.color.setHex(e.pantalon);
      peloCliente.color.setHex(e.pelo);
      vestir(cliente, { piel: PIELES[e.piel] });
      peinar(cliente, e.peinado);
      corbata.visible = camisa.visible = id === 'prisa';
      movil.visible = id === 'compara';
      gafas.visible = id === 'esceptico';
      cliente.poseBase = poseBaseCliente();
      acompanantes.forEach((a) => {
        a.p.grupo.visible = id === 'grupo';
        a.p.sentado = false;
        a.p.grupo.position.copy(cliente.grupo.position).add(a.off);
      });
    },
    sentar(on) {
      cliente.sentado = on;
      cliente.mirar = ASIENTOS.cliente.giro;
      cliente.poseBase = poseBaseCliente();
      if (on) cliente.grupo.position.set(ASIENTOS.cliente.x, 0, ASIENTOS.cliente.z);
    },
    pose(actor, pose, ms = 2500) {
      const p = actor === 'cliente' ? cliente : camarero;
      p.pose = pose;
      p.poseHasta = t + ms / 1000;
    },
    gesto(tipo) {
      if (quieto) return;
      cliente.gesto = { tipo, inicio: t };
      acompanantes.forEach((a) => a.p.grupo.visible && (a.p.gesto = { tipo, inicio: t + 0.15 }));
    },
    emocion(icono) {
      emote.textContent = icono;
      emote.hidden = false;
      emote.classList.remove('is-pop');
      void emote.offsetWidth;
      emote.classList.add('is-pop');
      emoteHasta = t + 1.8;
    },
    async comer() {
      escena.pose('cliente', 'comer', 4000);
      for (const p of porciones) {
        await new Promise((r) => setTimeout(r, quieto ? 0 : 600));
        p.g.visible = false;
      }
    },
    flotar(texto, tipo) {
      const el = document.createElement('div');
      el.className = 'pz-flota';
      el.dataset.tipo = tipo;
      el.textContent = texto;
      el.setAttribute('aria-hidden', 'true');
      contenedor.append(el);
      flotantes.push({ el, inicio: t });
      colocarOverlays();
    },
    primerPlano(ms = 1300) {
      if (quieto) return;
      const turno = ++turnoFoco;
      objetivo.x = cliente.grupo.position.x;
      objetivo.d = (FOCOS[focoId] ?? FOCOS.intro)[1] * 0.75;
      setTimeout(() => {
        if (turno !== turnoFoco) return;
        const f = FOCOS[focoId] ?? FOCOS.intro;
        objetivo.x = f[0];
        objetivo.d = f[1];
      }, ms);
    },
    decir(texto) {
      hablando = !!texto;
      bocadillo.hidden = !texto;
      if (texto) {
        bocadillo.textContent = texto;
        colocarOverlays();
      }
    },
    reset() {
      (Object.keys(objetos) as Objeto[]).forEach((o) => mostrar(o, false));
      porciones.forEach((p) => (p.g.visible = true));
      escena.pizzaMal(false);
      cocinando = false;
      gentePendiente = 0;
      escena.decir(null);
      emote.hidden = true;
      flotantes.splice(0).forEach((f) => f.el.remove());
      textoCartel = ['Abrimos', 'hoy'];
      pizarra.repintar();
      cliente.sentado = false;
      cliente.pose = 'normal';
      camarero.pose = camarero.poseBase = 'normal';
      // Cada partida pasa gente distinta por la calle.
      variarCalle();
      escena.humor(60);
      mover('cliente', POS.fuera[0], POS.fuera[1], { ms: 0 });
      mover('camarero', POS.barra[0], POS.barra[1], { ms: 0 });
      mover('pizza', POS.hornoPizza[0], POS.hornoPizza[1], { ms: 0, y: Y_HORNO });
    },
  };

  escena.reset();
  escena.perfil('');
  mover('cliente', POS.calle[0], POS.calle[1], { ms: 0 });
  // Con la fuente web ya cargada, los rótulos se repintan con sus fuentes.
  document.fonts?.ready.then(() => {
    [titulo, pizarra, salidaTxt, neon, cartaPared, banderolaTxt].forEach((r) => r.repintar());
    rotulosTienda.forEach((r) => r());
  });
  frame();
  return escena;
}

export const ALTURAS = { horno: Y_HORNO, barra: Y_BARRA, mesa: Y_MESA };
