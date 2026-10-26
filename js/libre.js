// « N'importe quel dessin » : on découpe le dessin sur la photo (tout ce qui n'est pas
// du papier), puis il nage dans une mer dessinée par l'application.

const limiter = (v, a, b) => Math.max(a, Math.min(b, v));
const etape = (t, a, b) => limiter((t - a) / (b - a), 0, 1);
const doux = (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);
const entre = (a, b, x) => a + (b - a) * x;


// ---------- Découpe ----------

// Couleur du papier partout sur la photo : surface lisse (degré 2) ajustée sur les pixels clairs,
// pour tenir compte d'une lumière jaune ou d'une ombre d'un côté.
function couleurDuPapier(px, w, h) {
  const termes = (x, y) => { const u = x / w - 0.5, v = y / h - 0.5; return [1, u, v, u * u, u * v, v * v]; };
  const lum = (i) => (px[i] + px[i + 1] + px[i + 2]) / 3;
  // Premier tri : les pixels parmi les plus clairs de leur voisinage large.
  const pas = Math.max(2, Math.round(Math.max(w, h) / 300));
  const points = [];
  for (let y = 0; y < h; y += pas) for (let x = 0; x < w; x += pas) points.push([x, y, (y * w + x) * 4]);
  const seuil = [...points.map((p) => lum(p[2]))].sort((a, b) => a - b)[Math.floor(points.length * 0.5)];
  let gardes = points.filter((p) => lum(p[2]) >= seuil);
  let coef = null;
  for (let tour = 0; tour < 3; tour++) {
    coef = [0, 1, 2].map((k) => moindresCarres(gardes.map(([x, y, i]) => [termes(x, y), px[i + k]])));
    // On écarte ce qui est nettement plus sombre que le papier attendu (dessin, texte, ombre nette).
    gardes = points.filter(([x, y, i]) => {
      const t = termes(x, y);
      return [0, 1, 2].every((k) => px[i + k] > 0.88 * t.reduce((s, v, j) => s + v * coef[k][j], 0));
    });
  }
  return (x, y) => { const t = termes(x, y); return coef.map((c) => Math.max(40, t.reduce((s, v, j) => s + v * c[j], 0))); };
}

function moindresCarres(lignes) {
  const n = 6;
  const A = Array.from({ length: n }, () => new Array(n + 1).fill(0));
  for (const [t, v] of lignes) for (let a = 0; a < n; a++) { for (let b = 0; b < n; b++) A[a][b] += t[a] * t[b]; A[a][n] += t[a] * v; }
  for (let a = 0; a < n; a++) A[a][a] += 1e-6;
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let i = c + 1; i < n; i++) if (Math.abs(A[i][c]) > Math.abs(A[p][c])) p = i;
    [A[c], A[p]] = [A[p], A[c]];
    for (let i = 0; i < n; i++) {
      if (i === c) continue;
      const f = A[i][c] / A[c][c];
      for (let j = c; j <= n; j++) A[i][j] -= f * A[c][j];
    }
  }
  return A.map((l, i) => l[n] / l[i]);
}

function dilater(m, w, h, r) {
  const t = new Uint8Array(w * h), s = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let v = 0;
    for (let d = -r; d <= r && !v; d++) { const xx = x + d; if (xx >= 0 && xx < w && m[y * w + xx]) v = 1; }
    t[y * w + x] = v;
  }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let v = 0;
    for (let d = -r; d <= r && !v; d++) { const yy = y + d; if (yy >= 0 && yy < h && t[yy * w + x]) v = 1; }
    s[y * w + x] = v;
  }
  return s;
}

function eroder(m, w, h, r) {
  const inv = m.map((v) => 1 - v);
  return dilater(inv, w, h, r).map((v) => 1 - v);
}

// Garde la plus grande tache et bouche ses trous (parties blanches non coloriées).
function plusGrandeTache(m, w, h) {
  const lab = new Int32Array(w * h), pile = new Int32Array(w * h);
  let meilleur = 0, taille = 0, n = 0;
  for (let d = 0; d < w * h; d++) {
    if (!m[d] || lab[d]) continue;
    n++;
    let haut = 0, compte = 0;
    pile[haut++] = d; lab[d] = n;
    while (haut) {
      const i = pile[--haut]; compte++;
      const x = i % w;
      for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w]) {
        if (j >= 0 && j < w * h && m[j] && !lab[j]) { lab[j] = n; pile[haut++] = j; }
      }
    }
    if (compte > taille) { taille = compte; meilleur = n; }
  }
  const garde = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) garde[i] = lab[i] === meilleur ? 1 : 0;
  // Trous : le fond qu'on n'atteint pas depuis le bord de l'image.
  const dehors = new Uint8Array(w * h);
  let haut = 0;
  const pousser = (i) => { if (!garde[i] && !dehors[i]) { dehors[i] = 1; pile[haut++] = i; } };
  for (let x = 0; x < w; x++) { pousser(x); pousser((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { pousser(y * w); pousser(y * w + w - 1); }
  while (haut) {
    const i = pile[--haut], x = i % w;
    if (x > 0) pousser(i - 1);
    if (x < w - 1) pousser(i + 1);
    if (i >= w) pousser(i - w);
    if (i < w * (h - 1)) pousser(i + w);
  }
  for (let i = 0; i < w * h; i++) garde[i] = dehors[i] ? 0 : 1;
  return { masque: garde, taille };
}

// Photo -> personnage découpé (canevas transparent autour), ou null si rien trouvé.
export function decouperDessin(photo) {
  const r = Math.min(1, 900 / Math.max(photo.width, photo.height));
  const w = Math.round(photo.width * r), h = Math.round(photo.height * r);
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(photo, 0, 0, w, h);
  const img = ctx.getImageData(0, 0, w, h);
  const px = img.data;
  const papier = couleurDuPapier(px, w, h);

  // Couleurs remises comme sur papier blanc, et « encre » = écart au papier.
  let m = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4, p = papier(x, y);
    let mini = 1;
    for (let k = 0; k < 3; k++) {
      const v = px[i + k] / p[k];
      mini = Math.min(mini, v);
      px[i + k] = limiter(v * 245, 0, 255);
    }
    if (mini < 0.72) m[y * w + x] = 1;
  }
  const r0 = Math.max(2, Math.round(Math.max(w, h) / 220));
  m = eroder(dilater(m, w, h, r0), w, h, r0);
  const { masque, taille } = plusGrandeTache(m, w, h);
  if (taille < w * h * 0.01) return null;

  let x0 = w, y0 = h, x1 = 0, y1 = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (masque[y * w + x]) {
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  // Couleurs un peu plus vives, bord adouci.
  for (let i = 0; i < w * h; i++) {
    const o = i * 4, moy = (px[o] + px[o + 1] + px[o + 2]) / 3;
    for (let k = 0; k < 3; k++) px[o + k] = limiter(moy + (px[o + k] - moy) * 1.3, 0, 255);
    px[o + 3] = masque[i] ? 255 : 0;
  }
  ctx.putImageData(img, 0, 0);
  const marge = 4;
  const s = document.createElement("canvas");
  s.width = x1 - x0 + 1 + 2 * marge;
  s.height = y1 - y0 + 1 + 2 * marge;
  s.getContext("2d").drawImage(c, x0 - marge, y0 - marge, s.width, s.height, 0, 0, s.width, s.height);
  return s;
}

// Quart de tour vers la gauche, ou miroir.
export function tournerSprite(sprite, miroir = false) {
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  if (miroir) {
    c.width = sprite.width; c.height = sprite.height;
    ctx.translate(c.width, 0);
    ctx.scale(-1, 1);
  } else {
    c.width = sprite.height; c.height = sprite.width;
    ctx.translate(0, c.height);
    ctx.rotate(-Math.PI / 2);
  }
  ctx.drawImage(sprite, 0, 0);
  return c;
}

// ---------- Film ----------

export const DUREE_LIBRE = 22;

// Façons de bouger : chaque fonction donne, au temps t, la place du dessin
// (x, y en fraction de l'écran), sa taille, son sens (-1 = vers la gauche) et ses effets.
// Le dessin est au centre entre 15,5 et 17,8 s : c'est là qu'il parle.
const MOUVEMENTS = {
  nage(t) {
    const o = (a) => 0.04 * Math.sin(t * 1.6 + a);
    const base = { onde: true, rot: 0.05 * Math.sin(t * 1.3) };
    if (t < 9) return { ...base, x: entre(1.35, -0.35, etape(t, 3, 9)), y: 0.48 + o(0), taille: 1, sens: -1 };
    if (t < 13.5) return { ...base, x: entre(-0.25, 1.25, etape(t, 9, 13.5)), y: 0.3 + o(1), taille: 0.55, sens: 1 };
    if (t < 15.5) return { ...base, x: entre(1.5, 0.5, doux(etape(t, 13.5, 15.5))), y: 0.52 + o(2), taille: 1.3, sens: -1 };
    if (t < 17.8) return { ...base, x: 0.5 + 0.02 * Math.sin((t - 15.5) * 3), y: 0.52 + o(2), taille: 1.3, sens: -1 };
    return { ...base, x: entre(0.5, -0.6, doux(etape(t, 17.8, 19.6))), y: 0.52 + o(2), taille: 1.3, sens: -1 };
  },

  vol(t) {
    const ailes = { sy: 1 + 0.1 * Math.sin(t * 9), sx: 1 - 0.03 * Math.sin(t * 9) };
    if (t < 8.5) return { ...ailes, x: entre(1.3, -0.3, etape(t, 3, 8.5)), y: 0.35 + 0.08 * Math.sin(t * 2), taille: 0.9, sens: -1, rot: 0.1 * Math.cos(t * 2) };
    if (t < 13) return { ...ailes, x: entre(-0.3, 1.3, etape(t, 8.5, 13)), y: 0.62 + 0.05 * Math.sin(t * 2.5), taille: 0.55, sens: 1 };
    if (t < 15.5) { const e = doux(etape(t, 13, 15.5)); return { ...ailes, x: entre(1.4, 0.5, e), y: entre(0.2, 0.45, e), taille: 1.2, sens: -1 }; }
    if (t < 17.8) return { ...ailes, x: 0.5 + 0.03 * Math.sin(t * 1.5), y: 0.45 + 0.04 * Math.sin(t * 2.2), taille: 1.2, sens: -1, rot: 0.06 * Math.sin(t * 2) };
    const e = etape(t, 17.8, 19.6);
    return { ...ailes, x: entre(0.5, -0.5, doux(e)), y: entre(0.45, 0.1, e), taille: 1.2, sens: -1, rot: 0.2 * e };
  },

  flotte(t, f) {
    if (t < 9) { const e = doux(etape(t, 3, 9)); return { x: entre(1.3, 0.3, e), y: entre(0.25, 0.6, e), taille: 0.85, sens: -1, rot: (t - 3) * 0.5 }; }
    if (t < 13) { const e = doux(etape(t, 9, 13)); return { x: entre(0.3, 0.75, e), y: entre(0.6, 0.3, e) + 0.05 * Math.sin(t * 2), taille: 0.7 + 0.15 * Math.sin(t * 1.5), sens: 1, rot: (t - 3) * 0.5 }; }
    if (t < 15.5) { const e = doux(etape(t, 13, 15.5)); return { x: entre(0.75, 0.5, e), y: entre(0.3, 0.5, e), taille: entre(0.7 + 0.15 * Math.sin(13 * 1.5), 1.25, e), sens: -1, rot: entre(5, 2 * Math.PI, e) }; }
    if (t < 17.8) return { x: 0.5, y: 0.5 + 0.03 * Math.sin(t * 1.6), taille: 1.25, sens: -1, rot: 0.1 * Math.sin(t * 1.5) };
    f.signal("depart", 1, "zap");
    const e = etape(t, 17.8, 19.6);
    return { x: entre(0.5, 0.86, e), y: entre(0.5, 0.18, e), taille: entre(1.25, 0.02, e), sens: -1, rot: e * 6 };
  },

  saut(t, f) {
    const bond = (t0, periode, hauteur, nom) => {
      const n = Math.floor((t - t0) / periode), ph = ((t - t0) / periode) % 1;
      f.signal(nom, n, "boing");
      const ecrase = ph < 0.12 ? 1 - (0.12 - ph) * 1.3 : 1;
      return { dy: -hauteur * Math.sin(Math.PI * ph), sy: ecrase, sx: 2 - ecrase };
    };
    const sol = (taille, ligne = 0.86) => ligne - f.hauteurRel(taille) / 2;
    if (t < 10) { const b = bond(3, 0.7, 0.2, "s1"); return { x: entre(1.3, -0.3, etape(t, 3, 10)), y: sol(0.9) + b.dy, sx: b.sx, sy: b.sy, taille: 0.9, sens: -1 }; }
    if (t < 13.5) { const b = bond(10, 0.5, 0.1, "s2"); return { x: entre(-0.3, 1.3, etape(t, 10, 13.5)), y: sol(0.5, 0.72) + b.dy, sx: b.sx, sy: b.sy, taille: 0.5, sens: 1 }; }
    if (t < 15.5) { const b = bond(13.5, 0.7, 0.18, "s3"); return { x: entre(1.3, 0.5, etape(t, 13.5, 15.5)), y: sol(1.2) + b.dy, sx: b.sx, sy: b.sy, taille: 1.2, sens: -1 }; }
    if (t < 17.8) { const b = bond(15.5, 0.55, 0.12, "s4"); return { x: 0.5, y: sol(1.2) + b.dy, sx: b.sx, sy: b.sy, taille: 1.2, sens: -1 }; }
    const b = bond(17.8, 0.6, 0.2, "s5");
    return { x: entre(0.5, -0.5, etape(t, 17.8, 19.6)), y: sol(1.2) + b.dy, sx: b.sx, sy: b.sy, taille: 1.2, sens: -1 };
  },

  glisse(t, f) {
    // Même piste que le décor « Sur la neige » : y = 0,40 + 0,38 x.
    const pente = Math.atan2(0.38 * f.H, f.L);
    const sur = (x, taille, saut = 0) => ({ x, y: 0.4 + 0.38 * x - (f.hauteurRel(taille) / 2) * Math.cos(pente) - saut, rot: pente, taille, sens: 1 });
    if (t < 8.5) { f.signal("piste", 1, "whoosh"); return sur(entre(-0.3, 1.3, etape(t, 3, 8.5)), 0.8); }
    if (t < 13) {
      f.signal("piste", 2, "whoosh");
      const x = entre(-0.3, 1.3, etape(t, 8.5, 13));
      const s = x > 0.4 && x < 0.7 ? Math.sin((Math.PI * (x - 0.4)) / 0.3) : 0;
      if (s > 0) f.signal("tremplin", 1, "boing");
      return { ...sur(x, 0.8, 0.2 * s), rot: pente - 0.5 * s };
    }
    if (t < 15.5) { f.signal("piste", 3, "whoosh"); return sur(entre(-0.3, 0.5, doux(etape(t, 13, 15.5))), 1.1); }
    if (t < 17.8) return { ...sur(0.5, 1.1), rot: pente + 0.12 * Math.sin(t * 6) };
    f.signal("piste", 4, "whoosh");
    return sur(entre(0.5, 1.5, etape(t, 17.8, 19.6) ** 1.5), 1.1);
  },

  danse(t, f) {
    const b = (t * f.scene.musique.bpm) / 60, rebond = Math.abs(Math.sin(Math.PI * b));
    const calme = 1 - 0.85 * fenetre(t, 15, 15.5, 17.8, 18.3);
    let y = 0.6 - 0.1 * rebond;
    if (t < 4.5) { y = entre(-0.6, 0.6, doux(etape(t, 3, 4.5))); if (t > 4.3) f.signal("arrivee", 1, "boing"); }
    if (t > 18.3) { f.signal("saut-final", 1, "tada"); y = entre(y, -0.8, etape(t, 18.3, 19.6)); }
    return {
      x: 0.5 + 0.28 * Math.sin((TAU * (t - 3)) / 7) * calme, y,
      taille: 1 + 0.06 * rebond, sens: Math.floor(b / 2) % 2 ? 1 : -1,
      rot: 0.18 * Math.sin(Math.PI * b), sx: 1 + 0.05 * (1 - rebond), sy: 1 - 0.05 * (1 - rebond),
    };
  },

  magie(t, f) {
    const points = [[0.25, 0.55], [0.72, 0.35], [0.45, 0.62], [0.28, 0.3], [0.75, 0.6], [0.5, 0.4]];
    if (t < 13) {
      const u = Math.max(0, t - 3) / 1.6, k = Math.floor(u), ph = u % 1;
      const [x, y] = points[k % points.length];
      f.signal("apparition", k, "pling", () => f.scene.eclat(f, x, y));
      const alpha = ph < 0.2 ? ph / 0.2 : ph > 0.8 ? (1 - ph) / 0.2 : 1;
      return { x, y, taille: 0.8 * (0.6 + 0.4 * Math.min(1, ph / 0.2)), alpha, sens: k % 2 ? 1 : -1, rot: 0.1 * Math.sin(t * 3) };
    }
    if (t < 15.5) {
      const e = etape(t, 13, 15.5), a = e * TAU * 1.5, r = entre(0.3, 0, doux(e));
      f.signal("apparition", 99, "pling", () => f.scene.eclat(f, 0.5 + 0.3, 0.45));
      return { x: 0.5 + r * Math.cos(a), y: 0.45 + 0.6 * r * Math.sin(a), taille: entre(0.8, 1.2, e), sens: Math.sin(a) > 0 ? -1 : 1 };
    }
    if (t < 17.8) return { x: 0.5, y: 0.45 + 0.03 * Math.sin(t * 2), taille: 1.2, sens: -1, rot: 0.08 * Math.sin(t * 2) };
    f.signal("disparition", 1, "tada", () => f.scene.eclat(f, 0.5, 0.45));
    const e = etape(t, 17.8, 18.8);
    return { x: 0.5, y: 0.45, taille: 1.2 + e, alpha: 1 - e, sens: -1, rot: e * 2 };
  },
};

const TAU = Math.PI * 2;
// 0 avant a, monte de a à b, 1 jusqu'à c, redescend de c à d.
function fenetre(t, a, b, c, d) {
  return t < a || t > d ? 0 : t < b ? (t - a) / (b - a) : t > c ? 1 - (t - c) / (d - c) : 1;
}

export class FilmLibre {
  // Le dessin regarde vers la gauche (on le règle avant avec « Tourner » et « Retourner »).
  constructor(canevas, sprite, prenom, sons, scene) {
    this.canevas = canevas;
    this.ctx = canevas.getContext("2d");
    this.L = canevas.width = 1280;
    this.H = canevas.height = 720;
    this.sprite = sprite;
    this.prenom = prenom || "moi";
    this.sons = sons;
    this.scene = scene;
    this.r = Math.random;
    this.etat = {};
    this.signaux = {};
    this.fond = document.createElement("canvas");
    this.fond.width = this.L;
    this.fond.height = this.H;
    const g = this.fond.getContext("2d");
    // Tirage fixe pour le décor : il reste le même d'un film à l'autre.
    let graine = 7;
    scene.fond(g, this.L, this.H, () => { graine = (graine * 9301 + 49297) % 233280; return graine / 233280; });
    if (scene.init) scene.init(this);
  }

  // Taille affichée du dessin, en pixels, pour une taille relative donnée.
  taillePx(taille) {
    const s = this.sprite;
    const e = Math.min((this.H * 0.42 * taille) / s.height, (this.L * 0.5 * taille) / s.width);
    return [s.width * e, s.height * e];
  }

  hauteurRel(taille) { return this.taillePx(taille)[1] / this.H; }

  // Déclenche un bruitage une seule fois par valeur de n (un rebond, un passage…).
  signal(nom, n, effet, rappel) {
    if (this.signaux[nom] === n) return;
    this.signaux[nom] = n;
    if (effet) this.sons.effet(effet);
    if (rappel) rappel();
  }

  jouer(fin) {
    this.debut = performance.now();
    this.sons.regler(this.scene.musique);
    const boucle = (now) => {
      const t = (now - this.debut) / 1000;
      this.dessiner(t);
      if (t < DUREE_LIBRE) this.raf = requestAnimationFrame(boucle);
      else if (fin) fin();
    };
    this.raf = requestAnimationFrame(boucle);
  }

  arreter() { cancelAnimationFrame(this.raf); }

  dessinerPersonnage(t, p) {
    const c = this.ctx, s = this.sprite;
    const [lw, lh] = this.taillePx(p.taille);
    if (lw < 2) return;
    c.save();
    c.globalAlpha = Math.max(0, Math.min(1, p.alpha ?? 1));
    c.translate(p.x * this.L, p.y * this.H);
    c.rotate(p.rot || 0);
    c.scale(-p.sens * (p.sx || 1), p.sy || 1); // le dessin regarde à gauche : retourné pour aller à droite
    c.shadowColor = "rgba(0,0,0,0.3)";
    c.shadowBlur = 22;
    c.shadowOffsetY = 12;
    if (p.onde) {
      // Vague de la tête (à gauche) vers la queue : le dessin nage.
      const bandes = 48;
      for (let i = 0; i < bandes; i++) {
        const u = i / bandes, v = Math.sin(u * Math.PI * 1.6 - t * 5);
        const dy = v * lh * 0.05 * (0.3 + u), etire = 1 + 0.06 * v;
        c.drawImage(s, u * s.width, 0, s.width / bandes + 1, s.height, -lw / 2 + u * lw, (-lh / 2) * etire + dy, lw / bandes + 1, lh * etire);
      }
    } else {
      c.drawImage(s, -lw / 2, -lh / 2, lw, lh);
    }
    c.restore();
  }

  parole(texte, x, yHaut) {
    const c = this.ctx;
    c.save();
    c.font = "bold 46px 'Comic Sans MS', 'Chalkboard SE', system-ui, sans-serif";
    const l = c.measureText(texte).width + 50;
    const bx = limiter(x * this.L - l / 2, 10, this.L - l - 10), by = limiter(yHaut * this.H - 100, 10, this.H - 90);
    c.fillStyle = "#fff";
    c.strokeStyle = "#222";
    c.lineWidth = 4;
    c.beginPath();
    c.roundRect(bx, by, l, 78, 39);
    c.fill();
    c.stroke();
    c.fillStyle = "#222";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(texte, bx + l / 2, by + 41);
    c.restore();
  }

  carton(lignes, opacite) {
    const c = this.ctx;
    c.save();
    c.globalAlpha = opacite;
    c.fillStyle = "rgba(10,20,60,0.8)";
    c.fillRect(0, 0, this.L, this.H);
    c.fillStyle = "#fff";
    c.textAlign = "center";
    c.textBaseline = "middle";
    lignes.forEach(([texte, taille], i) => {
      c.font = `bold ${taille}px 'Comic Sans MS', 'Chalkboard SE', system-ui, sans-serif`;
      c.fillText(texte, this.L / 2, this.H / 2 + (i - (lignes.length - 1) / 2) * 105);
    });
    c.restore();
  }

  dessiner(t) {
    const c = this.ctx, sc = this.scene;
    this.sons.avancer(t);
    c.drawImage(this.fond, 0, 0);
    this.pos = MOUVEMENTS[sc.mouvement](t, this);
    if (sc.derriere) sc.derriere(c, t, this);
    if (t > 2.5) this.dessinerPersonnage(t, this.pos);
    if (sc.devant) sc.devant(c, t, this);
    if (t > 15.6 && t < 17.8) {
      this.parole(sc.phrase.replace("{p}", this.prenom), this.pos.x, this.pos.y - this.hauteurRel(this.pos.taille) / 2);
    }
    if (t < 3.5) this.carton([["Le dessin animé de", 58], [this.prenom, 100], [`${sc.emoji} ${sc.nom}`, 52]], t < 2.5 ? 1 : 1 - (t - 2.5));
    if (t > 19.6) this.carton([["Fin", 140], [`Un film de ${this.prenom}`, 56]], Math.min(1, (t - 19.6) * 1.5));
  }
}
