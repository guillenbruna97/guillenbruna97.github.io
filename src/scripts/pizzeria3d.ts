// Escena 3D de "La pizzería B2B". Todo se construye con primitivas de
// Three.js (sin modelos externos) en estilo low-poly. La página del juego
// solo habla con la API que devuelve `crearEscena`; si el navegador no
// tiene WebGL devuelve una API vacía y el juego sigue funcionando sin escena.
import * as THREE from 'three';

export type Actor = 'cliente' | 'camarero' | 'pizza';
export type Objeto =
  | 'formulario' | 'aperitivo' | 'cartaCorta' | 'cartaLarga'
  | 'postre' | 'extras' | 'cuenta' | 'libreta' | 'pizza' | 'amigos';

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
  reset(): void;
}

// Posiciones de referencia en el suelo (x, z).
export const POS = {
  calle: [-7.2, 1.3],
  puerta: [-4.4, 0.9],
  mesa: [-1.75, 0.55],
  salida: [11.4, 0.9],
  fuera: [-11, 1.3],
  barra: [3, 0.7],
  mesaCamarero: [0.55, 0.9],
  hornoPizza: [6.5, 0.55],
  barraPizza: [3, -0.25],
  mesaPizza: [-0.6, 0.25],
} as const;

const Y_HORNO = 1.08;
const Y_BARRA = 1.12;
const Y_MESA = 0.84;

// Centro y distancia de cámara de cada momento.
const FOCOS: Record<string, [number, number]> = {
  intro: [-0.5, 22],
  calle: [-7.4, 13],
  puerta: [-4.6, 12],
  espera: [-1.8, 12],
  llamada: [-0.4, 12.5],
  pedido: [-0.8, 11],
  carta: [-0.8, 11],
  servicio: [2.6, 15],
  sobremesa: [-1, 11],
  salida: [9.6, 14],
};

const PALETAS = {
  claro: {
    fondo: 0xdfe9f7, suelo: 0xeadfce, calle: 0xd9dee6, pared: 0xfffaf2, paredLado: 0xf3ebdf,
    madera: 0xc98b55, ladrillo: 0xc4603f, ventana: 0xbfd6f5, fantasma: 0x8a9bb4,
    luzSol: 1.6, luzCielo: 1.1, lampara: 0.6,
  },
  oscuro: {
    fondo: 0x0e1726, suelo: 0x3b342c, calle: 0x1f252e, pared: 0x2b2926, paredLado: 0x24221f,
    madera: 0x8f5f37, ladrillo: 0x8e3f28, ventana: 0x22324a, fantasma: 0x5d6b80,
    luzSol: 0.55, luzCielo: 0.55, lampara: 2.2,
  },
};

const noop = async () => {};
const vacia: Escena = {
  ok: false, mover: noop, foco() {}, mostrar() {}, rotulo() {}, humor() {},
  pizzaMal() {}, horno() {}, gente() {}, decir() {}, reset() {},
};

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

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);

  // ── Materiales (se recolorean al cambiar de tema) ──────────────────
  const mat = (color: number, extra: THREE.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.85, flatShading: true, ...extra });
  const M = {
    suelo: mat(0), calle: mat(0), pared: mat(0), paredLado: mat(0), madera: mat(0),
    ladrillo: mat(0), ventana: mat(0), fantasma: mat(0),
    azul: mat(0x004aad), azulClaro: mat(0x95c0fa), blanco: mat(0xffffff), negro: mat(0x1a1a1a),
    oscuro: mat(0x2b2b2b), piel: mat(0xf2c7a0), papel: mat(0xffffff), boca: mat(0x3a1f14),
    queso: mat(0xffd166), tomate: mat(0xd9472b), verde: mat(0x6b8e23), masa: mat(0xe7b86a),
    botella: mat(0x2e6b3a), crema: mat(0xfff6e0), pizarra: mat(0x2b2b2b),
    fuego: new THREE.MeshBasicMaterial({ color: 0xff9d2e }),
    lampara: new THREE.MeshBasicMaterial({ color: 0xffd166 }),
  };

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
  const etiqueta = (w: number, h: number, pintar: (ctx: CanvasRenderingContext2D, cw: number, ch: number) => void) => {
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(w * 256);
    canvas.height = Math.round(h * 256);
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

  // ── Escenario ──────────────────────────────────────────────────────
  const mundo = new THREE.Group();
  scene.add(mundo);

  const suelo = caja(15.2, 0.2, 6.2, M.suelo, 2.5, -0.1, 0);
  // Calle alrededor del local, amplia para que nunca se vea el vacío.
  const calle = new THREE.Mesh(new THREE.PlaneGeometry(120, 80), M.calle);
  calle.rotation.x = -Math.PI / 2;
  calle.position.y = -0.2;
  calle.receiveShadow = true;
  mundo.add(suelo, calle);

  // Pared del fondo, laterales con hueco de puerta y rótulo superior.
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

  for (const x of [-2.8, 0.6]) {
    mundo.add(caja(1.3, 1.0, 0.06, M.ventana, x, 2.0, -2.98));
    mundo.add(caja(1.3, 0.06, 0.08, M.madera, x, 2.0, -2.95));
    mundo.add(caja(0.06, 1.0, 0.08, M.madera, x, 2.0, -2.95));
  }

  // Lámpara sobre la mesa.
  mundo.add(cilindro(0.01, 0.01, 0.9, M.negro, -0.6, 2.75, 0.2, 6));
  const pantalla = cilindro(0.08, 0.32, 0.25, M.lampara, -0.6, 2.2, 0.2);
  pantalla.castShadow = false;
  mundo.add(pantalla);
  const luzLampara = new THREE.PointLight(0xffc97a, 0.6, 6, 1.5);
  luzLampara.position.set(-0.6, 2.0, 0.2);
  mundo.add(luzLampara);

  // Cartel de la calle (pizarra en caballete).
  const cartel = new THREE.Group();
  cartel.position.set(-8.4, 0, 1.9);
  cartel.add(caja(0.06, 1.3, 0.06, M.madera, -0.5, 0.65, -0.15), caja(0.06, 1.3, 0.06, M.madera, 0.5, 0.65, -0.15));
  cartel.add(caja(1.5, 1.05, 0.08, M.madera, 0, 1.3, 0));
  cartel.add(caja(1.36, 0.92, 0.09, M.pizarra, 0, 1.3, 0.01));
  let textoCartel = ['Abrimos', 'hoy'];
  const pizarra = etiqueta(1.3, 0.86, (ctx, cw, ch) => textoCentrado(ctx, textoCartel, cw, ch, ch * 0.2, '#ffffff'));
  pizarra.mesh.position.set(0, 1.3, 0.06);
  cartel.add(pizarra.mesh);
  cartel.rotation.y = 0.25;
  mundo.add(cartel);

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
  mundo.add(cilindro(0.75, 0.75, 0.06, M.madera, -0.6, 0.78, 0.2, 20));
  mundo.add(cilindro(0.07, 0.07, 0.78, M.madera, -0.6, 0.39, 0.2, 8));
  mundo.add(cilindro(0.35, 0.35, 0.04, M.madera, -0.6, 0.02, 0.2, 12));

  const aperitivo = new THREE.Group();
  aperitivo.add(cilindro(0.18, 0.15, 0.03, M.blanco, 0, 0, 0));
  aperitivo.add(esfera(0.045, M.verde, -0.06, 0.04, 0), esfera(0.045, M.verde, 0.04, 0.04, 0.04), esfera(0.045, M.verde, 0.03, 0.04, -0.05));
  aperitivo.position.set(-1.05, Y_MESA, 0.45);
  const cartaCorta = caja(0.28, 0.38, 0.02, M.papel, -0.15, Y_MESA + 0.19, 0.55);
  cartaCorta.rotation.x = -0.25;
  const cartaLarga = new THREE.Group();
  cartaLarga.add(caja(0.42, 1.3, 0.02, M.papel, 0, 0, 0));
  for (let i = 0; i < 14; i++) cartaLarga.add(caja(0.3, 0.015, 0.025, M.negro, 0, 0.56 - i * 0.08, 0.005));
  cartaLarga.position.set(-0.1, Y_MESA + 0.65, 0.5);
  cartaLarga.rotation.x = -0.15;
  const postre = new THREE.Group();
  postre.add(cilindro(0.1, 0.06, 0.16, M.blanco, 0, 0.08, 0), esfera(0.09, M.crema, 0, 0.18, 0), esfera(0.035, M.tomate, 0, 0.28, 0));
  postre.position.set(-1.0, Y_MESA, 0.45);
  const extras = new THREE.Group();
  extras.add(cilindro(0.07, 0.07, 0.4, M.botella, 0, 0.2, 0), cilindro(0.03, 0.03, 0.12, M.botella, 0, 0.46, 0));
  extras.add(caja(0.2, 0.26, 0.02, M.papel, 0.25, 0.13, 0.05));
  extras.position.set(-0.25, Y_MESA, 0.05);
  const cuenta = caja(0.22, 0.01, 0.3, M.papel, -0.3, Y_MESA + 0.01, 0.55);
  mundo.add(aperitivo, cartaCorta, cartaLarga, postre, extras, cuenta);

  // Barra.
  mundo.add(caja(2.3, 1.05, 0.8, M.azul, 3, 0.525, -0.6));
  mundo.add(caja(2.5, 0.08, 1.0, M.madera, 3, 1.08, -0.6));

  // Horno de leña.
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

  // ── Personajes ─────────────────────────────────────────────────────
  interface Persona {
    grupo: THREE.Group;
    cuerpo: THREE.Group;
    piernas: THREE.Mesh[];
    bocas?: { feliz: THREE.Mesh; normal: THREE.Mesh; triste: THREE.Mesh };
  }
  const persona = (ropa: THREE.Material, extras: { delantal?: boolean; gorro?: boolean; pajarita?: boolean; caras?: boolean } = {}): Persona => {
    const grupo = new THREE.Group();
    const cuerpo = new THREE.Group();
    grupo.add(cuerpo);
    const piernas = [-0.1, 0.1].map((x) => {
      const pierna = cilindro(0.075, 0.07, 0.5, M.negro, x, 0, 0, 8);
      pierna.geometry.translate(0, -0.25, 0);
      pierna.position.y = 0.5;
      cuerpo.add(pierna);
      return pierna;
    });
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.27, 0.42, 4, 10), ropa);
    torso.position.y = 0.88;
    torso.castShadow = true;
    cuerpo.add(torso);
    cuerpo.add(esfera(0.23, M.piel, 0, 1.45, 0, 14));
    cuerpo.add(esfera(0.03, M.negro, -0.08, 1.49, 0.2, 6), esfera(0.03, M.negro, 0.08, 1.49, 0.2, 6));
    if (extras.delantal) cuerpo.add(caja(0.4, 0.42, 0.03, M.blanco, 0, 0.78, 0.26));
    if (extras.pajarita) cuerpo.add(caja(0.16, 0.06, 0.04, M.tomate, 0, 1.17, 0.25));
    if (extras.gorro) {
      cuerpo.add(cilindro(0.17, 0.17, 0.22, M.blanco, 0, 1.73, 0, 12));
      cuerpo.add(esfera(0.2, M.blanco, 0, 1.88, 0, 10));
    }
    let bocas: Persona['bocas'];
    if (extras.caras !== false) {
      const arco = new THREE.TorusGeometry(0.065, 0.016, 6, 12, Math.PI);
      const feliz = new THREE.Mesh(arco, M.negro);
      feliz.rotation.z = Math.PI;
      feliz.position.set(0, 1.4, 0.215);
      const triste = new THREE.Mesh(arco, M.negro);
      triste.position.set(0, 1.35, 0.215);
      const normal = caja(0.12, 0.022, 0.02, M.negro, 0, 1.37, 0.222);
      normal.castShadow = false;
      cuerpo.add(feliz, triste, normal);
      bocas = { feliz, normal, triste };
      triste.visible = false;
      normal.visible = false;
    }
    mundo.add(grupo);
    return { grupo, cuerpo, piernas, bocas };
  };

  const cliente = persona(M.azul);
  const anfitrion = persona(M.azulClaro, { delantal: true });
  anfitrion.grupo.position.set(-3.5, 0, -0.95);
  const chef = persona(M.blanco, { delantal: true, gorro: true });
  chef.grupo.position.set(8.4, 0, -0.9);
  const camarero = persona(M.oscuro, { delantal: true, pajarita: true });
  const libreta = caja(0.2, 0.26, 0.03, M.papel, 0.32, 0.95, 0.22);
  libreta.rotation.set(-0.4, 0, 0.2);
  camarero.cuerpo.add(libreta);

  const fantasmas = Array.from({ length: 6 }, (_, i) => {
    const p = persona(M.fantasma, { caras: false });
    p.grupo.position.set(-10.2 + (i % 3) * 0.75, 0, 2.7 + Math.floor(i / 3) * 0.75 + (i % 2) * 0.15);
    p.grupo.scale.setScalar(0.001);
    return p;
  });
  const amigos = [0, 1, 2].map((i) => {
    const p = persona(M.azulClaro);
    p.grupo.position.set(12.2 + i * 0.7, 0, 1.6 + (i % 2) * 0.5);
    p.grupo.visible = false;
    return p;
  });

  // Pizza.
  const pizza = new THREE.Group();
  pizza.add(cilindro(0.3, 0.3, 0.05, M.masa, 0, 0, 0, 20));
  pizza.add(cilindro(0.25, 0.25, 0.02, M.queso, 0, 0.03, 0, 20));
  const toppings = [[-0.1, 0.05], [0.09, -0.06], [0.02, 0.12], [0.12, 0.08], [-0.08, -0.1]].map(([x, z]) => {
    const t = cilindro(0.04, 0.04, 0.015, M.tomate, x, 0.045, z, 8);
    pizza.add(t);
    return t;
  });
  mundo.add(pizza);

  // ── Luces ──────────────────────────────────────────────────────────
  const cielo = new THREE.HemisphereLight(0xffffff, 0xb8a58c, 1.1);
  scene.add(cielo);
  const sol = new THREE.DirectionalLight(0xffffff, 1.6);
  sol.position.set(4, 12, 9);
  sol.castShadow = true;
  sol.shadow.mapSize.set(1024, 1024);
  Object.assign(sol.shadow.camera, { left: -16, right: 16, top: 10, bottom: -10, near: 1, far: 40 });
  sol.shadow.bias = -0.0005;
  sol.shadow.normalBias = 0.02;
  scene.add(sol);

  // ── Tema claro/oscuro ──────────────────────────────────────────────
  const aplicarTema = () => {
    const p = document.body.classList.contains('dark') ? PALETAS.oscuro : PALETAS.claro;
    scene.background = new THREE.Color(p.fondo);
    M.suelo.color.setHex(p.suelo);
    M.calle.color.setHex(p.calle);
    M.pared.color.setHex(p.pared);
    M.paredLado.color.setHex(p.paredLado);
    M.madera.color.setHex(p.madera);
    M.ladrillo.color.setHex(p.ladrillo);
    M.ventana.color.setHex(p.ventana);
    M.fantasma.color.setHex(p.fantasma);
    sol.intensity = p.luzSol;
    cielo.intensity = p.luzCielo;
    luzLampara.intensity = p.lampara;
  };
  aplicarTema();
  new MutationObserver(aplicarTema).observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // ── Movimiento ─────────────────────────────────────────────────────
  interface Movil { obj: THREE.Object3D; persona?: Persona; destino: THREE.Vector3; velocidad: number; fin?: () => void; paso: number }
  const moviles: Record<Actor, Movil> = {
    cliente: { obj: cliente.grupo, persona: cliente, destino: new THREE.Vector3(), velocidad: 1, paso: 0 },
    camarero: { obj: camarero.grupo, persona: camarero, destino: new THREE.Vector3(), velocidad: 1, paso: 0 },
    pizza: { obj: pizza, destino: new THREE.Vector3(), velocidad: 1, paso: 0 },
  };

  const mover: Escena['mover'] = (actor, x, z, opts = {}) => {
    const m = moviles[actor];
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
  const foco: Escena['foco'] = (id) => {
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
    const t = opciones.tarjeta();
    let libre = ancho / alto;
    if (t.abajo) {
      // En móvil la tarjeta va abajo: en vez de agrandar la vista, la
      // cámara mira un poco más hacia abajo para subir la acción.
      const dy = Math.min(t.alto, alto * 0.6) / 2;
      camera.aspect = ancho / alto;
      camera.clearViewOffset();
      inclinacion = Math.atan((dy / (alto / 2)) * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    } else {
      const dx = Math.min(t.ancho, ancho * 0.5) / 2;
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

  // ── Bocadillo (HTML proyectado sobre la cabeza del cliente) ───────
  const cabeza = new THREE.Vector3();
  let hablando = false;
  const colocarBocadillo = () => {
    if (!hablando) return;
    cabeza.copy(cliente.grupo.position).add(new THREE.Vector3(0, 2.0, 0)).project(camera);
    const x = (cabeza.x + 1) / 2 * ancho;
    const y = (1 - cabeza.y) / 2 * alto;
    const w = bocadillo.offsetWidth;
    const bx = Math.max(w / 2 + 8, Math.min(ancho - w / 2 - 8, x));
    bocadillo.style.transform = `translate(${bx - w / 2}px, ${y}px) translateY(-100%)`;
    bocadillo.style.setProperty('--cola', `${x - bx + w / 2}px`);
  };

  // ── Bucle ──────────────────────────────────────────────────────────
  let previo = performance.now();
  let muestras = 0;
  let tiempoTotal = 0;
  let aligerado = false;
  let t = 0;
  let visible = true;
  let cocinando = false;
  let gentePendiente = 0;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(contenedor);

  const tmp = new THREE.Vector3();
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
        scene.traverse((o) => { if ((o as THREE.Mesh).material) ((o as THREE.Mesh).material as THREE.Material).needsUpdate = true; });
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
        if (m.persona && Math.abs(tmp.x) + Math.abs(tmp.z) > 0.01) {
          const giro = Math.atan2(tmp.x, tmp.z);
          m.obj.rotation.y += (giro - m.obj.rotation.y) * Math.min(1, dt * 10);
        }
        if (dist - paso <= 0.005) { m.obj.position.copy(m.destino); m.fin?.(); }
      } else if (m.persona) {
        // Parado, mira hacia la cámara para que se le vea la cara.
        m.obj.rotation.y += (0.15 - m.obj.rotation.y) * Math.min(1, dt * 6);
      }
      if (m.persona) {
        m.paso = andando ? m.paso + dt * 11 : m.paso * 0.8;
        const s = Math.sin(m.paso);
        m.persona.piernas[0].rotation.x = andando ? s * 0.55 : 0;
        m.persona.piernas[1].rotation.x = andando ? -s * 0.55 : 0;
        m.persona.cuerpo.position.y = andando ? Math.abs(s) * 0.05 : 0;
      }
    }

    // Respiración suave de los personajes quietos.
    [anfitrion, chef].forEach((p, i) => (p.cuerpo.position.y = Math.sin(t * 2 + i) * 0.012));

    fantasmas.forEach((p, i) => {
      const meta = i < gentePendiente ? 1 : 0.001;
      const s = p.grupo.scale.x + (meta - p.grupo.scale.x) * Math.min(1, dt * 6);
      p.grupo.scale.setScalar(s);
      p.grupo.position.y = meta === 1 ? Math.abs(Math.sin(t * 3 + i)) * 0.04 : 0;
    });
    amigos.forEach((p, i) => (p.cuerpo.position.y = Math.abs(Math.sin(t * 4 + i)) * 0.04));

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
    colocarBocadillo();
  };

  // ── API ────────────────────────────────────────────────────────────
  const objetos: Record<Objeto, THREE.Object3D[]> = {
    formulario: [formulario], aperitivo: [aperitivo], cartaCorta: [cartaCorta], cartaLarga: [cartaLarga],
    postre: [postre], extras: [extras], cuenta: [cuenta], libreta: [libreta], pizza: [pizza], amigos: amigos.map((a) => a.grupo),
  };
  const mostrar: Escena['mostrar'] = (obj, on) => objetos[obj].forEach((o) => (o.visible = on));

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
      if (!cliente.bocas) return;
      cliente.bocas.feliz.visible = hambre >= 60;
      cliente.bocas.normal.visible = hambre >= 30 && hambre < 60;
      cliente.bocas.triste.visible = hambre < 30;
    },
    pizzaMal(on) {
      toppings.forEach((t) => (t.material = on ? M.verde : M.tomate));
    },
    horno(on) { cocinando = on; },
    gente(n) { gentePendiente = n; },
    decir(texto) {
      hablando = !!texto;
      bocadillo.hidden = !texto;
      if (texto) {
        bocadillo.textContent = texto;
        colocarBocadillo();
      }
    },
    reset() {
      (Object.keys(objetos) as Objeto[]).forEach((o) => mostrar(o, false));
      escena.pizzaMal(false);
      cocinando = false;
      gentePendiente = 0;
      escena.decir(null);
      textoCartel = ['Abrimos', 'hoy'];
      pizarra.repintar();
      escena.humor(60);
      mover('cliente', POS.fuera[0], POS.fuera[1], { ms: 0 });
      mover('camarero', POS.barra[0], POS.barra[1], { ms: 0 });
      mover('pizza', POS.hornoPizza[0], POS.hornoPizza[1], { ms: 0, y: Y_HORNO });
    },
  };

  escena.reset();
  mover('cliente', POS.calle[0], POS.calle[1], { ms: 0 });
  // Con la fuente web ya cargada, los rótulos se repintan con Poppins.
  document.fonts?.ready.then(() => { titulo.repintar(); pizarra.repintar(); salidaTxt.repintar(); });
  frame();
  return escena;
}

export const ALTURAS = { horno: Y_HORNO, barra: Y_BARRA, mesa: Y_MESA };
