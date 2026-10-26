// Compagnons : d'autres petits personnages dessinés qui s'animent autour du dessin de
// l'enfant. Chacun est dessiné centré en (0, 0), sur environ 100 unités, regardant à gauche.

const TAU = Math.PI * 2;
const TRAIT = "#1d1d2b";

function forme(c, couleur, chemin, epaisseur = 4) {
  c.beginPath();
  chemin();
  if (couleur) { c.fillStyle = couleur; c.fill(); }
  c.lineWidth = epaisseur;
  c.strokeStyle = TRAIT;
  c.stroke();
}

function oeil(c, x, y, r = 6) {
  forme(c, "#fff", () => c.arc(x, y, r, 0, TAU), 2.5);
  c.fillStyle = TRAIT;
  c.beginPath(); c.arc(x - r * 0.25, y, r * 0.5, 0, TAU); c.fill();
}

function sourire(c, x, y, l) {
  c.beginPath(); c.arc(x, y - l * 0.6, l, Math.PI * 0.2, Math.PI * 0.8); c.lineWidth = 3; c.strokeStyle = TRAIT; c.stroke();
}

export const DESSINS = {
  poisson(c, t, couleur = "#ff8a3d") {
    const q = Math.sin(t * 10) * 0.35;
    c.save(); c.translate(34, 0); c.rotate(q);
    forme(c, "#ff5d5d", () => { c.moveTo(0, 0); c.lineTo(28, -20); c.lineTo(28, 20); c.closePath(); });
    c.restore();
    forme(c, couleur, () => c.ellipse(-4, -26, 14, 10, -0.3, Math.PI, 0));
    forme(c, couleur, () => c.ellipse(0, 0, 42, 27, 0, 0, TAU));
    c.strokeStyle = TRAIT; c.lineWidth = 2.5;
    c.beginPath(); c.arc(-14, 0, 22, -0.9, 0.9); c.stroke();
    oeil(c, -24, -6);
    sourire(c, -33, 12, 6);
  },

  meduse(c, t, couleur = "#ff8fd0") {
    const p = 1 + 0.1 * Math.sin(t * 4);
    c.save(); c.scale(1 / p, p);
    for (let k = 0; k < 4; k++) {
      const x = -24 + k * 16;
      c.beginPath(); c.moveTo(x, 0);
      for (let y = 0; y <= 60; y += 6) c.lineTo(x + Math.sin(t * 5 + y / 10 + k) * 6, y);
      c.lineWidth = 4; c.strokeStyle = couleur; c.stroke();
    }
    forme(c, couleur, () => { c.arc(0, 0, 36, Math.PI, 0); c.closePath(); });
    oeil(c, -12, -14, 5); oeil(c, 12, -14, 5);
    sourire(c, 0, -2, 6);
    c.restore();
  },

  crabe(c, t, couleur = "#ff4d4d") {
    const pince = Math.abs(Math.sin(t * 6)) * 0.5;
    for (let k = 0; k < 3; k++) for (const s of [-1, 1]) {
      c.beginPath(); c.moveTo(s * 20, 8 + k * 5);
      c.lineTo(s * (38 + Math.sin(t * 12 + k) * 4), 20 + k * 6);
      c.lineWidth = 4; c.strokeStyle = TRAIT; c.stroke();
    }
    for (const s of [-1, 1]) {
      c.save(); c.translate(s * 36, -18);
      forme(c, couleur, () => c.arc(0, 0, 12, s > 0 ? -Math.PI / 2 + pince : Math.PI / 2 + pince, s > 0 ? Math.PI * 1.5 - pince : Math.PI * 2.5 - pince), 3);
      c.restore();
    }
    forme(c, couleur, () => c.ellipse(0, 4, 34, 22, 0, 0, TAU));
    for (const s of [-1, 1]) {
      c.beginPath(); c.moveTo(s * 9, -14); c.lineTo(s * 11, -28); c.lineWidth = 3; c.strokeStyle = TRAIT; c.stroke();
      oeil(c, s * 11, -32, 6);
    }
    sourire(c, 0, 10, 8);
  },

  tortue(c, t, couleur = "#4caf50") {
    const r = Math.sin(t * 3) * 0.5;
    for (const [x, y, a] of [[-24, 18, r], [24, 18, -r], [-20, -18, -r], [22, -18, r]]) {
      c.save(); c.translate(x, y); c.rotate(a);
      forme(c, "#a5d66b", () => c.ellipse(0, 0, 14, 7, x < 0 ? -0.5 : 0.5, 0, TAU), 3);
      c.restore();
    }
    forme(c, "#a5d66b", () => c.arc(-46, -2, 13, 0, TAU));
    oeil(c, -50, -5, 4);
    forme(c, couleur, () => c.ellipse(0, 0, 38, 28, 0, 0, TAU));
    c.strokeStyle = "#2e7d32"; c.lineWidth = 3;
    for (const [x, y] of [[0, 0], [-18, -8], [18, -8], [-18, 10], [18, 10]]) { c.beginPath(); c.arc(x, y, 7, 0, TAU); c.stroke(); }
  },

  oiseau(c, t, couleur = "#4fc3ff") {
    const aile = Math.sin(t * 14);
    forme(c, "#ffb300", () => { c.moveTo(-40, -14); c.lineTo(-56, -8); c.lineTo(-40, -4); c.closePath(); }, 3);
    forme(c, couleur, () => { c.moveTo(28, 0); c.lineTo(48, -12); c.lineTo(46, 10); c.closePath(); }, 3);
    forme(c, couleur, () => c.ellipse(0, 0, 32, 20, 0, 0, TAU));
    forme(c, couleur, () => c.arc(-30, -10, 15, 0, TAU));
    oeil(c, -34, -13, 5);
    c.save(); c.translate(4, -4); c.scale(1, aile);
    forme(c, couleur, () => c.ellipse(0, -16, 18, 24, 0.2, 0, TAU), 3);
    c.restore();
  },

  papillon(c, t, couleur = "#ff6bd6") {
    const a = 0.25 + 0.75 * Math.abs(Math.sin(t * 10));
    for (const s of [-1, 1]) {
      c.save(); c.scale(s * a, 1);
      forme(c, couleur, () => c.ellipse(22, -16, 22, 18, -0.4, 0, TAU), 3);
      forme(c, "#ffd23f", () => c.ellipse(18, 14, 14, 12, 0.4, 0, TAU), 3);
      c.restore();
    }
    forme(c, TRAIT, () => c.ellipse(0, 0, 5, 26, 0, 0, TAU), 1);
    c.strokeStyle = TRAIT; c.lineWidth = 2.5;
    c.beginPath(); c.moveTo(-2, -24); c.quadraticCurveTo(-8, -40, -14, -42); c.moveTo(2, -24); c.quadraticCurveTo(8, -40, 14, -42); c.stroke();
  },

  ballon(c, t, couleur = "#ff4d6d") {
    c.beginPath(); c.moveTo(0, 36);
    for (let y = 36; y < 90; y += 6) c.lineTo(Math.sin(t * 4 + y / 9) * 5, y);
    c.lineWidth = 2.5; c.strokeStyle = TRAIT; c.stroke();
    forme(c, couleur, () => { c.moveTo(-5, 40); c.lineTo(5, 40); c.lineTo(0, 32); c.closePath(); }, 2.5);
    forme(c, couleur, () => c.ellipse(0, 0, 30, 36, 0, 0, TAU));
    c.fillStyle = "rgba(255,255,255,0.6)";
    c.beginPath(); c.ellipse(-11, -14, 6, 10, 0.4, 0, TAU); c.fill();
  },

  fusee(c, t, couleur = "#e8eef7") {
    // Pointe vers la gauche.
    const flamme = 18 + Math.random() * 14;
    forme(c, "#ffb300", () => { c.moveTo(40, -10); c.lineTo(40 + flamme, 0); c.lineTo(40, 10); c.closePath(); }, 2);
    for (const s of [-1, 1]) forme(c, "#ff4d4d", () => { c.moveTo(18, s * 14); c.lineTo(42, s * 30); c.lineTo(40, s * 10); c.closePath(); }, 3);
    forme(c, couleur, () => { c.moveTo(-50, 0); c.quadraticCurveTo(-30, -20, 40, -16); c.lineTo(40, 16); c.quadraticCurveTo(-30, 20, -50, 0); });
    forme(c, "#4fc3ff", () => c.arc(-8, 0, 9, 0, TAU), 3);
  },

  ovni(c, t, couleur = "#9be15d") {
    forme(c, "rgba(180,240,255,0.8)", () => { c.arc(0, -10, 22, Math.PI, 0); c.closePath(); }, 3);
    forme(c, couleur, () => c.arc(0, -16, 8, 0, TAU), 2);
    forme(c, "#b8c2d6", () => c.ellipse(0, 0, 52, 15, 0, 0, TAU));
    ["#ff4d6d", "#ffd23f", "#4fc3ff", "#ff4d6d", "#ffd23f"].forEach((col, k) => {
      c.fillStyle = Math.floor(t * 6 + k) % 2 ? col : "#fff";
      c.beginPath(); c.arc(-34 + k * 17, 3, 4, 0, TAU); c.fill();
    });
  },

  etoile(c, t, couleur = "#ffd23f") {
    c.rotate(Math.sin(t * 2) * 0.2);
    forme(c, couleur, () => {
      for (let i = 0; i < 10; i++) { const r = i % 2 ? 18 : 40, a = -Math.PI / 2 + (i * Math.PI) / 5; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
      c.closePath();
    });
    oeil(c, -8, -2, 4); oeil(c, 8, -2, 4);
    sourire(c, 0, 10, 5);
  },

  pingouin(c, t) {
    c.rotate(Math.sin(t * 8) * 0.12);
    for (const s of [-1, 1]) forme(c, "#ffb300", () => c.ellipse(s * 12, 46, 12, 5, 0, 0, TAU), 2.5);
    forme(c, "#26323f", () => c.ellipse(0, 4, 30, 42, 0, 0, TAU));
    forme(c, "#fff", () => c.ellipse(-4, 10, 20, 30, 0, 0, TAU), 2);
    for (const s of [-1, 1]) {
      c.save(); c.translate(s * 28, 4); c.rotate(s * (0.3 + 0.3 * Math.sin(t * 8)));
      forme(c, "#26323f", () => c.ellipse(0, 12, 7, 18, 0, 0, TAU), 2.5);
      c.restore();
    }
    oeil(c, -14, -20, 5); oeil(c, 4, -20, 5);
    forme(c, "#ffb300", () => { c.moveTo(-14, -10); c.lineTo(-24, -6); c.lineTo(-12, -4); c.closePath(); }, 2);
  },

  bonhommeNeige(c, t) {
    const bras = Math.sin(t * 5) * 0.4;
    for (const [s, a] of [[-1, -bras], [1, bras]]) {
      c.save(); c.translate(s * 24, -8); c.rotate(s * -0.6 + a);
      c.strokeStyle = "#6b4a2b"; c.lineWidth = 4;
      c.beginPath(); c.moveTo(0, 0); c.lineTo(s * 34, 0); c.moveTo(s * 24, 0); c.lineTo(s * 32, -8); c.stroke();
      c.restore();
    }
    forme(c, "#fff", () => c.arc(0, 32, 30, 0, TAU));
    forme(c, "#fff", () => c.arc(0, -8, 22, 0, TAU));
    forme(c, "#fff", () => c.arc(0, -40, 16, 0, TAU));
    forme(c, "#26323f", () => c.rect(-14, -70, 28, 20), 2);
    forme(c, "#26323f", () => c.rect(-20, -54, 40, 5), 2);
    forme(c, "#ff8a3d", () => { c.moveTo(-2, -38); c.lineTo(-20, -34); c.lineTo(-2, -32); c.closePath(); }, 2);
    c.fillStyle = TRAIT;
    for (const [x, y] of [[-7, -45], [6, -45], [0, -12], [0, 0]]) { c.beginPath(); c.arc(x, y, 2.6, 0, TAU); c.fill(); }
  },

  dino(c, t, couleur = "#7cc576") {
    const pas = Math.sin(t * 10);
    for (const [x, s] of [[-14, 1], [14, -1]]) {
      c.save(); c.translate(x, 20); c.rotate(pas * 0.4 * s);
      forme(c, couleur, () => c.rect(-6, 0, 12, 24), 3);
      c.restore();
    }
    forme(c, couleur, () => { c.moveTo(30, 0); c.quadraticCurveTo(60, 0, 74, 20 + pas * 4); c.quadraticCurveTo(50, 18, 28, 16); c.closePath(); });
    for (let k = 0; k < 4; k++) forme(c, "#ffb300", () => { c.moveTo(-14 + k * 12, -22); c.lineTo(-8 + k * 12, -34); c.lineTo(-2 + k * 12, -22); c.closePath(); }, 2.5);
    forme(c, couleur, () => c.ellipse(0, 0, 34, 24, 0, 0, TAU));
    forme(c, couleur, () => { c.moveTo(-22, -10); c.quadraticCurveTo(-36, -36, -46, -44); c.lineTo(-30, -48); c.quadraticCurveTo(-18, -24, -8, -14); c.closePath(); });
    forme(c, couleur, () => c.ellipse(-46, -48, 18, 12, 0, 0, TAU));
    oeil(c, -50, -52, 4.5);
    sourire(c, -56, -40, 6);
  },

  singe(c, t) {
    const bras = Math.sin(t * 7);
    c.strokeStyle = "#8a5a2b"; c.lineWidth = 6; c.lineCap = "round";
    c.beginPath(); c.moveTo(20, 30); c.quadraticCurveTo(50, 40, 44, 10); c.quadraticCurveTo(40, -2, 50, -4); c.stroke();
    for (const [s, a] of [[-1, bras], [1, -bras]]) {
      c.save(); c.translate(s * 18, 6); c.rotate(s * (0.6 + 0.7 * a));
      forme(c, "#8a5a2b", () => c.ellipse(0, 18, 6, 18, 0, 0, TAU), 2.5);
      c.restore();
    }
    forme(c, "#8a5a2b", () => c.ellipse(0, 22, 22, 26, 0, 0, TAU));
    for (const s of [-1, 1]) forme(c, "#e8c39e", () => c.arc(s * 24, -22, 9, 0, TAU), 3);
    forme(c, "#8a5a2b", () => c.arc(0, -20, 22, 0, TAU));
    forme(c, "#e8c39e", () => c.ellipse(0, -14, 15, 12, 0, 0, TAU), 2.5);
    oeil(c, -8, -24, 4.5); oeil(c, 8, -24, 4.5);
    sourire(c, 0, -8, 6);
  },

  ours(c, t, couleur = "#c98b52") {
    const b = Math.sin(t * 8);
    for (const [s, a] of [[-1, b], [1, -b]]) {
      c.save(); c.translate(s * 22, 0); c.rotate(s * (2.2 + 0.6 * a));
      forme(c, couleur, () => c.ellipse(0, 16, 8, 18, 0, 0, TAU), 3);
      c.restore();
    }
    forme(c, couleur, () => c.ellipse(0, 22, 26, 30, 0, 0, TAU));
    for (const s of [-1, 1]) forme(c, couleur, () => c.arc(s * 18, -40, 9, 0, TAU), 3);
    forme(c, couleur, () => c.arc(0, -24, 22, 0, TAU));
    forme(c, "#f2d1a8", () => c.ellipse(0, -16, 10, 8, 0, 0, TAU), 2.5);
    c.fillStyle = TRAIT; c.beginPath(); c.arc(0, -20, 3.5, 0, TAU); c.fill();
    oeil(c, -9, -30, 4); oeil(c, 9, -30, 4);
  },

  note(c, t, couleur = "#ff4d6d") {
    c.rotate(Math.sin(t * 6) * 0.25);
    c.strokeStyle = TRAIT; c.lineWidth = 6;
    c.beginPath(); c.moveTo(10, 16); c.lineTo(10, -36); c.lineTo(32, -26); c.stroke();
    forme(c, couleur, () => c.ellipse(-2, 18, 14, 10, -0.4, 0, TAU));
  },

  fee(c, t) {
    const halo = c.createRadialGradient(0, 0, 0, 0, 0, 50);
    halo.addColorStop(0, "rgba(255,250,170,0.6)"); halo.addColorStop(1, "rgba(255,250,170,0)");
    c.fillStyle = halo; c.beginPath(); c.arc(0, 0, 50, 0, TAU); c.fill();
    const a = 0.4 + 0.6 * Math.abs(Math.sin(t * 12));
    for (const s of [-1, 1]) {
      c.save(); c.scale(s * a, 1);
      forme(c, "rgba(190,240,255,0.85)", () => c.ellipse(18, -10, 18, 12, -0.5, 0, TAU), 2);
      c.restore();
    }
    forme(c, "#ff9ff3", () => { c.moveTo(-10, 26); c.lineTo(10, 26); c.lineTo(0, -2); c.closePath(); }, 2.5);
    forme(c, "#ffe0c2", () => c.arc(0, -10, 10, 0, TAU), 2.5);
    forme(c, "#ffd23f", () => { c.arc(0, -16, 10, Math.PI, 0); c.closePath(); }, 2);
  },
};

// ---------- Trajets ----------

// Taille d'affichage : un compagnon de « taille 100 » mesure 180 pixels (sur 1280).
const ECHELLE = 1.8;

const limiter = (v, a, b) => Math.max(a, Math.min(b, v));
const etape = (t, a, b) => limiter((t - a) / (b - a), 0, 1);
const entre = (a, b, x) => a + (b - a) * x;

// Place d'un compagnon au temps t : { x, y, sens (-1 = vers la gauche), rot } ou null s'il n'est pas là.
function place(k, t, f) {
  const e = etape(t, k.debut ?? 0, (k.debut ?? 0) + (k.duree ?? 30));
  if (t < (k.debut ?? 0) || e >= 1) return null;
  const ph = (k.phase ?? 0) + t;
  switch (k.trajet) {
    case "traverse": {
      const x = entre(k.de, k.a, e);
      return { x, y: k.y + (k.ondule ?? 0.02) * Math.sin(ph * 2), sens: k.a > k.de ? 1 : -1, rot: (k.penche ?? 0.06) * Math.sin(ph * 2) };
    }
    case "cote": // marche de côté (crabe) : ne se retourne pas
      return { x: entre(k.de, k.a, e), y: k.y + 0.008 * Math.sin(ph * 12), sens: -1, rot: 0.08 * Math.sin(ph * 6) };
    case "monte":
      return { x: k.x + 0.03 * Math.sin(ph * 1.5), y: entre(k.de, k.a, e), sens: -1, rot: 0.1 * Math.sin(ph * 1.5) };
    case "flotte":
      return { x: k.x + 0.04 * Math.sin(ph * 0.9), y: k.y + 0.03 * Math.sin(ph * 1.3), sens: Math.cos(ph * 0.9) > 0 ? 1 : -1, rot: 0.1 * Math.sin(ph) };
    case "saut": {
      const n = (t - k.debut) / (k.periode ?? 0.6), p = n % 1;
      if (f) f.signal("saut-" + k.dessin + k.debut, Math.floor(n), k.son ?? null);
      return { x: entre(k.de, k.a, e), y: k.y - (k.hauteur ?? 0.06) * Math.sin(Math.PI * p), sens: k.a > k.de ? 1 : -1, rot: 0 };
    }
    case "danse": {
      const b = (t * (f ? f.scene.musique.bpm : 120)) / 60;
      return { x: k.x + 0.02 * Math.sin(b * Math.PI / 2), y: k.y - 0.04 * Math.abs(Math.sin(Math.PI * b)), sens: Math.floor(b / 2) % 2 ? 1 : -1, rot: 0.15 * Math.sin(Math.PI * b) };
    }
    case "orbite": {
      const p = f && f.posEcran ? f.posEcran : { x: 0.5, y: 0.5 };
      const a = ph * (k.vitesse ?? 1.2);
      return { x: p.x + (k.rayon ?? 0.22) * Math.cos(a), y: p.y + (k.rayon ?? 0.22) * 0.6 * Math.sin(a), sens: Math.sin(a) > 0 ? 1 : -1, rot: 0 };
    }
    case "pente": { // glisse sur la piste de « Sur la neige » : y = 0,40 + 0,38 x
      const x = entre(k.de, k.a, e);
      return { x, y: 0.4 + 0.38 * x - (k.dy ?? 0.07), sens: 1, rot: 0.28 + 0.05 * Math.sin(ph * 8) };
    }
    case "pose":
      return { x: k.x, y: k.y, sens: k.sens ?? -1, rot: 0.04 * Math.sin(ph * 2) };
    case "fusee": { // traverse en suivant sa direction
      const x = entre(k.de[0], k.a[0], e), y = entre(k.de[1], k.a[1], e);
      const ang = Math.atan2((k.a[1] - k.de[1]) * 9, (k.a[0] - k.de[0]) * 16);
      return { x, y, sens: -1, rot: ang + Math.PI };
    }
  }
  return null;
}

// Dessine les compagnons d'un plan (« derriere » ou « devant » le dessin de l'enfant).
export function dessinerCompagnons(c, t, f, liste, plan) {
  for (const k of liste) {
    if ((k.plan ?? "derriere") !== plan) continue;
    const p = place(k, t, f);
    if (!p) continue;
    const s = ((k.taille ?? 70) / 100) * ECHELLE;
    c.save();
    c.translate(p.x * f.L, p.y * f.H);
    c.rotate(p.rot || 0);
    c.scale(-p.sens * s, s); // dessinés vers la gauche : retournés pour aller à droite
    c.lineJoin = "round";
    c.lineCap = "round";
    DESSINS[k.dessin](c, t + (k.phase ?? 0), k.couleur);
    c.restore();
  }
}
