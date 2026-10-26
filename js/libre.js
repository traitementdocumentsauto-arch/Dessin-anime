// « N'importe quel dessin » : on découpe le dessin sur la photo (tout ce qui n'est pas
// du papier), puis il nage dans une mer dessinée par l'application.

const limiter = (v, a, b) => Math.max(a, Math.min(b, v));
const etape = (t, a, b) => limiter((t - a) / (b - a), 0, 1);
const doux = (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);
const entre = (a, b, x) => a + (b - a) * x;

export const DUREE_LIBRE = 26.5;

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

export class FilmLibre {
  // Le personnage regarde vers la gauche (on le règle avant avec « Tourner » et « Retourner »).
  constructor(canevas, sprite, prenom, sons) {
    this.canevas = canevas;
    this.ctx = canevas.getContext("2d");
    this.L = canevas.width = 1280;
    this.H = canevas.height = 720;
    this.sprite = sprite;
    this.prenom = prenom || "moi";
    this.sons = sons;
    this.bulles = [];
    this.fond = this.dessinerFond();
    this.algues = Array.from({ length: 9 }, (_, i) => ({
      x: 0.04 + i * 0.115 + Math.random() * 0.04, h: 0.18 + Math.random() * 0.22,
      couleur: i % 2 ? "#2f9e5c" : "#3fb66c", phase: Math.random() * 6,
    }));
  }

  dessinerFond() {
    const c = document.createElement("canvas");
    c.width = this.L; c.height = this.H;
    const g = c.getContext("2d");
    const eau = g.createLinearGradient(0, 0, 0, this.H);
    eau.addColorStop(0, "#7fd3f7");
    eau.addColorStop(0.55, "#3a9fd8");
    eau.addColorStop(1, "#1d5f9c");
    g.fillStyle = eau;
    g.fillRect(0, 0, this.L, this.H);
    // Sable.
    g.fillStyle = "#efd08a";
    g.strokeStyle = "#c9a65c";
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(0, this.H);
    for (let x = 0; x <= this.L; x += 40) g.lineTo(x, this.H * 0.86 + Math.sin(x / 130) * 18 + Math.sin(x / 47) * 5);
    g.lineTo(this.L, this.H);
    g.closePath();
    g.fill();
    g.stroke();
    // Rochers et coquillages.
    for (const [x, rx, ry, couleur] of [[0.12, 70, 40, "#8b8b9a"], [0.83, 95, 55, "#7a7a8a"], [0.9, 50, 30, "#9a9aa8"]]) {
      g.fillStyle = couleur;
      g.beginPath();
      g.ellipse(x * this.L, this.H * 0.9, rx, ry, 0, Math.PI, 0);
      g.fill();
      g.stroke();
    }
    g.font = "44px system-ui, sans-serif";
    g.fillText("🐚", this.L * 0.35, this.H * 0.95);
    g.fillText("⭐", this.L * 0.6, this.H * 0.97);
    return c;
  }

  jouer(fin) {
    this.debut = performance.now();
    this.prochaineBulle = 0;
    this.sons.prochaineNote = 0;
    const boucle = (now) => {
      const t = (now - this.debut) / 1000;
      this.dessiner(t);
      if (t < DUREE_LIBRE) this.raf = requestAnimationFrame(boucle);
      else if (fin) fin();
    };
    this.raf = requestAnimationFrame(boucle);
  }

  arreter() { cancelAnimationFrame(this.raf); }

  // Position (x, y en fraction de l'écran), taille et sens (-1 = vers la gauche).
  trajet(t) {
    const ondule = (a) => 0.04 * Math.sin(t * 1.6 + a);
    if (t < 10) return { x: entre(1.35, -0.35, etape(t, 3, 10)), y: 0.48 + ondule(0), taille: 1, sens: -1 };
    if (t < 16) return { x: entre(-0.25, 1.25, etape(t, 10, 16)), y: 0.3 + ondule(1), taille: 0.55, sens: 1 };
    if (t < 19) return { x: entre(1.5, 0.5, doux(etape(t, 16, 19))), y: 0.55 + ondule(2), taille: 1.35, sens: -1 };
    if (t < 21) return { x: 0.5 + 0.02 * Math.sin((t - 19) * 3), y: 0.55 + ondule(2), taille: 1.35, sens: -1 };
    return { x: entre(0.5, -0.6, doux(etape(t, 21, 23.5))), y: 0.55 + ondule(2), taille: 1.35, sens: -1 };
  }

  dessinerPersonnage(t, { x, y, taille, sens }) {
    const c = this.ctx, s = this.sprite;
    const hauteur = this.H * 0.5 * taille;
    const echelle = Math.min(hauteur / s.height, (this.L * 0.6 * taille) / s.width);
    const lw = s.width * echelle, lh = s.height * echelle;
    c.save();
    c.translate(x * this.L, y * this.H);
    c.scale(-sens, 1); // le dessin regarde à gauche : on le retourne pour aller à droite
    c.rotate(Math.sin(t * 1.3) * 0.05);
    c.shadowColor = "rgba(0,30,70,0.35)";
    c.shadowBlur = 24;
    c.shadowOffsetY = 14;
    // Vague qui part de la tête (à gauche) vers la queue : le dessin nage.
    const bandes = 48;
    for (let i = 0; i < bandes; i++) {
      const u = i / bandes;
      const dy = Math.sin(u * Math.PI * 1.6 - t * 5) * lh * 0.05 * (0.3 + u);
      const etire = 1 + 0.06 * Math.sin(u * Math.PI * 1.6 - t * 5);
      c.drawImage(s, u * s.width, 0, s.width / bandes + 1, s.height,
        -lw / 2 + u * lw, -lh / 2 * etire + dy, lw / bandes + 1, lh * etire);
    }
    c.restore();
  }

  parole(texte, x, y) {
    const c = this.ctx;
    c.save();
    c.font = "bold 46px 'Comic Sans MS', 'Chalkboard SE', system-ui, sans-serif";
    const l = c.measureText(texte).width + 50;
    const bx = limiter(x * this.L - l / 2, 10, this.L - l - 10), by = limiter(y * this.H, 10, this.H) - 40;
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
    c.fillStyle = "rgba(10,40,90,0.78)";
    c.fillRect(0, 0, this.L, this.H);
    c.fillStyle = "#fff";
    c.textAlign = "center";
    c.textBaseline = "middle";
    lignes.forEach(([texte, taille], i) => {
      c.font = `bold ${taille}px 'Comic Sans MS', 'Chalkboard SE', system-ui, sans-serif`;
      c.fillText(texte, this.L / 2, this.H / 2 + (i - (lignes.length - 1) / 2) * 110);
    });
    c.restore();
  }

  dessiner(t) {
    const c = this.ctx, L = this.L, H = this.H;
    this.sons.musique(t);
    c.drawImage(this.fond, 0, 0);

    // Rayons de lumière.
    c.save();
    c.globalCompositeOperation = "lighter";
    for (let i = 0; i < 4; i++) {
      const x = L * (0.1 + i * 0.27) + Math.sin(t * 0.5 + i) * 50;
      const g = c.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "rgba(255,255,220,0.2)");
      g.addColorStop(1, "rgba(255,255,220,0)");
      c.fillStyle = g;
      c.beginPath();
      c.moveTo(x - 35, 0); c.lineTo(x + 35, 0); c.lineTo(x + 160, H); c.lineTo(x - 30, H);
      c.fill();
    }
    c.restore();

    // Algues qui ondulent.
    for (const a of this.algues) {
      const base = a.x * L, haut = H * (0.9 - a.h);
      c.save();
      c.fillStyle = a.couleur;
      c.strokeStyle = "#1d6b3c";
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(base - 12, H * 0.92);
      for (let k = 0; k <= 10; k++) {
        const v = k / 10;
        c.lineTo(base - 12 * (1 - v) + Math.sin(t * 1.5 + a.phase + v * 3) * 25 * v, H * 0.92 - (H * 0.92 - haut) * v);
      }
      for (let k = 10; k >= 0; k--) {
        const v = k / 10;
        c.lineTo(base + 12 * (1 - v) + Math.sin(t * 1.5 + a.phase + v * 3) * 25 * v, H * 0.92 - (H * 0.92 - haut) * v);
      }
      c.closePath();
      c.fill();
      c.stroke();
      c.restore();
    }

    const pos = this.trajet(t);
    if (t > 2.5) this.dessinerPersonnage(t, pos);

    // Bulles.
    if (t > this.prochaineBulle) {
      this.prochaineBulle = t + 0.2 + Math.random() * 0.35;
      this.bulles.push({ x: Math.random(), y: 1.02, r: 6 + Math.random() * 12, n: t });
      if (pos.x > 0 && pos.x < 1 && Math.random() < 0.6) {
        this.bulles.push({ x: pos.x - pos.sens * 0.05, y: pos.y, r: 5 + Math.random() * 8, n: t });
        if (Math.random() < 0.5) this.sons.bulle();
      }
    }
    c.save();
    c.strokeStyle = "rgba(255,255,255,0.85)";
    c.fillStyle = "rgba(255,255,255,0.15)";
    c.lineWidth = 3;
    this.bulles = this.bulles.filter((b) => b.y > -0.1);
    for (const b of this.bulles) {
      b.y -= 0.004;
      c.beginPath();
      c.arc(b.x * L + Math.sin((t - b.n) * 4 + b.r) * 6, b.y * H, b.r, 0, Math.PI * 2);
      c.fill();
      c.stroke();
    }
    c.restore();

    if (t > 19 && t < 21.5) this.parole(`Coucou ${this.prenom} !`, pos.x, 0.08);
    if (t < 3.5) this.carton([["Le dessin animé de", 64], [this.prenom, 110]], t < 2.5 ? 1 : 1 - (t - 2.5));
    if (t > 23.5) this.carton([["Fin", 140], [`Un film de ${this.prenom}`, 56]], Math.min(1, t - 23.5));
  }
}
