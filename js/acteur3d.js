// Le dessin en 3D (three.js) : le dessin découpé devient une feuille souple, éclairée,
// qui se courbe vraiment. Rendu dans un canevas à part, posé ensuite sur la scène 2D.
//
// corps « plat » (raie, tortue, papillon… vus de dessus) : on le voit un peu de dessus
// et ses deux côtés ondulent ensemble de haut en bas, comme des ailes.
// corps « profil » (poisson, requin, dinosaure… vus de côté) : il se courbe de gauche à
// droite, la queue plus que la tête.

import * as THREE from "./vendor/three.module.min.js";

const FOV = 35, DISTANCE = 10;

export class Acteur3D {
  // q : qualité (1 = 1280 × 720 pixels réels).
  constructor(sprite, L, H, corps = "profil", q = 1) {
    this.ok = false;
    this.corps = corps;
    this.canvas = document.createElement("canvas");
    this.L = L;
    this.H = H;
    try {
      this.rendu = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
    } catch {
      return; // pas de WebGL : le film garde le dessin en 2D
    }
    this.rendu.setPixelRatio(1);
    this.rendu.setSize(Math.round(L * q), Math.round(H * q), false);
    this.rendu.setClearColor(0x000000, 0);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(FOV, L / H, 0.1, 100);
    this.camera.position.set(0, 0, DISTANCE);
    this.visH = 2 * DISTANCE * Math.tan((FOV * Math.PI) / 360);
    this.visL = this.visH * (L / H);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const soleil = new THREE.DirectionalLight(0xffffff, 0.55);
    soleil.position.set(-2, 4, 8);
    this.scene.add(soleil);
    const dessous = new THREE.DirectionalLight(0xffffff, 0.15);
    dessous.position.set(1, -4, 3);
    this.scene.add(dessous);

    const texture = new THREE.CanvasTexture(sprite);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    this.aspect = sprite.width / sprite.height;
    this.geo = new THREE.PlaneGeometry(this.aspect, 1, 36, 24);
    this.base = Float32Array.from(this.geo.attributes.position.array);
    const matiere = new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide, alphaTest: 0.45, transparent: false });
    this.maille = new THREE.Mesh(this.geo, matiere);
    this.groupe = new THREE.Group();
    this.groupe.add(this.maille);
    this.scene.add(this.groupe);
    this.ok = true;
  }

  qualite(q) {
    if (this.ok) this.rendu.setSize(Math.round(this.L * q), Math.round(this.H * q), false);
  }

  // p : place du dessin (voir MOUVEMENTS dans libre.js) ; hauteur : sa hauteur en fraction de l'écran ;
  // deforme(u, v) : décalage 2D du mouvement en cours ; parle : il sautille un peu.
  // Renvoie null quand le dessin est passé derrière l'écran (gros plan).
  rendre(t, p, hauteur, deforme, parle) {
    const z = p.z || 0;
    if (z > 8.8) return null;
    const pos = this.geo.attributes.position.array, b = this.base, a = this.aspect;
    const plat = this.corps === "plat";
    for (let i = 0; i < pos.length; i += 3) {
      const u = b[i] / a + 0.5, v = 0.5 - b[i + 1];
      const [dx, dy] = deforme(u, v);
      let z;
      if (plat) {
        // Les deux côtés montent et descendent ensemble, vague de la tête vers la queue.
        const c = Math.abs((v - 0.5) * 2);
        z = 0.36 * c ** 1.5 * Math.sin(t * 4.2 - u * 2.4) + 0.08 * Math.sin(t * 3 - u * 6) * u;
      } else {
        // Courbe de gauche à droite, plus forte vers la queue.
        z = 0.22 * Math.sin(t * 5 - u * 4) * (0.15 + u) ** 1.5;
      }
      pos[i] = b[i] + dx * a;
      pos[i + 1] = b[i + 1] - dy;
      pos[i + 2] = z;
    }
    this.geo.attributes.position.needsUpdate = true;
    this.geo.computeVertexNormals();

    const voix = parle ? 1 + 0.035 * Math.abs(Math.sin(t * 13)) : 1;
    const s = hauteur * this.visH;
    const g = this.groupe;
    g.position.set((p.x - 0.5) * this.visL, (0.5 - p.y) * this.visH, z);
    // Le dessin regarde à gauche : retourné (échelle négative) pour aller à droite.
    g.scale.set(-p.sens * (p.sx || 1) * voix * s, (p.sy || 1) * voix * s, s);
    // Vu un peu de dessus pour un corps plat ; léger balancement en profondeur sinon.
    const penche = plat ? -0.75 + 0.12 * Math.sin(t * 0.8) : 0.08 * Math.sin(t * 0.9);
    const tourne = (plat ? 0.25 : 0.38) * Math.sin(t * 0.6) * p.sens;
    g.rotation.set(penche, tourne, -(p.rot || 0), "ZXY");
    // Un corps vu de dessus paraît plus petit : on compense.
    if (plat) g.scale.y /= Math.cos(penche) * 0.85 + 0.15;
    this.rendu.render(this.scene, this.camera);
    return this.canvas;
  }

  liberer() {
    if (!this.ok) return;
    this.geo.dispose();
    this.maille.material.map.dispose();
    this.maille.material.dispose();
    this.rendu.dispose();
    this.rendu.forceContextLoss();
  }
}

// Sujets dessinés vus de dessus.
export const CORPS_PLATS = new Set(["raie", "tortue", "papillon"]);
