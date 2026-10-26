// Les dessins en 3D (three.js) : chaque dessin découpé devient une feuille souple, éclairée,
// qui se courbe vraiment. Tous les dessins d'un film sont dans la même scène 3D, rendue dans
// un canevas à part, posé ensuite sur la scène 2D.
//
// corps « plat » (raie, tortue, papillon… vus de dessus) : on le voit un peu de dessus
// et ses deux côtés ondulent ensemble de haut en bas, comme des ailes.
// corps « profil » (poisson, requin, dinosaure… vus de côté) : il se courbe de gauche à
// droite, la queue plus que la tête.

import * as THREE from "./vendor/three.module.min.js";

const FOV = 35, DISTANCE = 10;

export class Acteur3D {
  // q : qualité (1 = 1280 × 720 pixels réels).
  constructor(L, H, q = 1) {
    this.ok = false;
    this.acteurs = [];
    this.canvas = document.createElement("canvas");
    this.L = L;
    this.H = H;
    try {
      this.rendu = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
    } catch {
      return; // pas de WebGL : le film garde les dessins en 2D
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
    this.ok = true;
  }

  // Ajoute un dessin à la scène ; renvoie son numéro.
  ajouter(sprite, corps = "profil") {
    if (!this.ok) return -1;
    const texture = new THREE.CanvasTexture(sprite);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    const aspect = sprite.width / sprite.height;
    const geo = new THREE.PlaneGeometry(aspect, 1, 36, 24);
    const matiere = new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide, alphaTest: 0.45, transparent: true });
    const groupe = new THREE.Group();
    groupe.add(new THREE.Mesh(geo, matiere));
    this.scene.add(groupe);
    this.acteurs.push({ geo, matiere, texture, groupe, aspect, corps, base: Float32Array.from(geo.attributes.position.array) });
    return this.acteurs.length - 1;
  }

  qualite(q) {
    if (this.ok) this.rendu.setSize(Math.round(this.L * q), Math.round(this.H * q), false);
  }

  // poses[i] pour le dessin i : { p, hauteur, deforme, parle } ou null pour le cacher.
  // p : place (voir MOUVEMENTS dans libre.js) ; hauteur : en fraction de l'écran ;
  // deforme(u, v) : décalage 2D du mouvement en cours ; parle : il sautille un peu.
  // Renvoie null quand aucun dessin n'est visible.
  rendre(t, poses) {
    let visibles = 0;
    this.acteurs.forEach((a, i) => {
      const pose = poses[i];
      const z = pose ? pose.p.z || 0 : 0;
      // Caché, ou passé derrière l'écran pendant un gros plan.
      a.groupe.visible = !!pose && z <= 8.8 && (pose.p.alpha ?? 1) > 0.01;
      if (!a.groupe.visible) return;
      visibles++;
      this.placer(a, t + i * 0.37, pose, z);
    });
    if (!visibles) return null;
    this.rendu.render(this.scene, this.camera);
    return this.canvas;
  }

  placer(a, t, { p, hauteur, deforme, parle }, z) {
    const pos = a.geo.attributes.position.array, b = a.base, asp = a.aspect;
    const plat = a.corps === "plat";
    for (let i = 0; i < pos.length; i += 3) {
      const u = b[i] / asp + 0.5, v = 0.5 - b[i + 1];
      const [dx, dy] = deforme(u, v);
      let pz;
      if (plat) {
        // Les deux côtés montent et descendent ensemble, vague de la tête vers la queue.
        const c = Math.abs((v - 0.5) * 2);
        pz = 0.36 * c ** 1.5 * Math.sin(t * 4.2 - u * 2.4) + 0.08 * Math.sin(t * 3 - u * 6) * u;
      } else {
        // Courbe de gauche à droite, plus forte vers la queue.
        pz = 0.22 * Math.sin(t * 5 - u * 4) * (0.15 + u) ** 1.5;
      }
      pos[i] = b[i] + dx * asp;
      pos[i + 1] = b[i + 1] - dy;
      pos[i + 2] = pz;
    }
    a.geo.attributes.position.needsUpdate = true;
    a.geo.computeVertexNormals();
    a.matiere.opacity = Math.max(0, Math.min(1, p.alpha ?? 1));

    const voix = parle ? 1 + 0.035 * Math.abs(Math.sin(t * 13)) : 1;
    const s = hauteur * this.visH;
    const g = a.groupe;
    g.position.set((p.x - 0.5) * this.visL, (0.5 - p.y) * this.visH, z);
    // Le dessin regarde à gauche : retourné (échelle négative) pour aller à droite.
    g.scale.set(-p.sens * (p.sx || 1) * voix * s, (p.sy || 1) * voix * s, s);
    // Vu un peu de dessus pour un corps plat ; léger balancement en profondeur sinon.
    const penche = plat ? -0.75 + 0.12 * Math.sin(t * 0.8) : 0.08 * Math.sin(t * 0.9);
    const tourne = (plat ? 0.25 : 0.38) * Math.sin(t * 0.6) * p.sens;
    g.rotation.set(penche, tourne, -(p.rot || 0), "ZXY");
    // Un corps vu de dessus paraît plus petit : on compense.
    if (plat) g.scale.y /= Math.cos(penche) * 0.85 + 0.15;
  }

  liberer() {
    if (!this.ok) return;
    for (const a of this.acteurs) { a.geo.dispose(); a.texture.dispose(); a.matiere.dispose(); }
    this.rendu.dispose();
    this.rendu.forceContextLoss();
  }
}

// Sujets dessinés vus de dessus.
export const CORPS_PLATS = new Set(["raie", "tortue", "papillon"]);
