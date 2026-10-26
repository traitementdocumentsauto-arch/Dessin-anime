// Photo du coloriage : retrouver les 4 carrés noirs, redresser la page,
// corriger la lumière.

import { PAGE, REPERES, BANDE_TITRE, BANDE_VIDE } from "./pages.js";

const TAILLE_MAX = 2000;

// Fichier (photo) -> canevas, réduit à 2000 px de côté au plus.
export async function chargerPhoto(fichier) {
  const url = URL.createObjectURL(fichier);
  try {
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("Photo illisible"));
      i.src = url;
    });
    const r = Math.min(1, TAILLE_MAX / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement("canvas");
    c.width = Math.round(img.naturalWidth * r);
    c.height = Math.round(img.naturalHeight * r);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    return c;
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Cherche les 4 carrés noirs. Renvoie leurs centres [HG, HD, BD, BG] ou null.
export function trouverReperes(source) {
  const r = Math.min(1, 640 / Math.max(source.width, source.height));
  const w = Math.round(source.width * r);
  const h = Math.round(source.height * r);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(source, 0, 0, w, h);
  const px = ctx.getImageData(0, 0, w, h).data;

  const gris = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) gris[i] = 0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2];

  // Moyenne locale (image intégrale) : un pixel est « noir » s'il est bien plus sombre que son voisinage.
  const integ = new Float64Array((w + 1) * (h + 1));
  for (let y = 0; y < h; y++) {
    let ligne = 0;
    for (let x = 0; x < w; x++) {
      ligne += gris[y * w + x];
      integ[(y + 1) * (w + 1) + x + 1] = integ[y * (w + 1) + x + 1] + ligne;
    }
  }
  const demi = Math.max(8, Math.round(Math.max(w, h) / 12));
  const noir = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    const y0 = Math.max(0, y - demi), y1 = Math.min(h, y + demi + 1);
    for (let x = 0; x < w; x++) {
      const x0 = Math.max(0, x - demi), x1 = Math.min(w, x + demi + 1);
      const somme = integ[y1 * (w + 1) + x1] - integ[y0 * (w + 1) + x1] - integ[y1 * (w + 1) + x0] + integ[y0 * (w + 1) + x0];
      const moyenne = somme / ((x1 - x0) * (y1 - y0));
      if (gris[y * w + x] < moyenne * 0.6 && gris[y * w + x] < 150) noir[y * w + x] = 1;
    }
  }

  // Zones noires d'un seul tenant.
  const etiquette = new Int32Array(w * h);
  const pile = new Int32Array(w * h);
  const candidats = [];
  let numero = 0;
  for (let depart = 0; depart < w * h; depart++) {
    if (!noir[depart] || etiquette[depart]) continue;
    numero++;
    let haut = 0, n = 0, sx = 0, sy = 0;
    let minx = w, maxx = 0, miny = h, maxy = 0;
    pile[haut++] = depart;
    etiquette[depart] = numero;
    while (haut) {
      const i = pile[--haut];
      const x = i % w, y = (i - x) / w;
      n++; sx += x; sy += y;
      if (x < minx) minx = x;
      if (x > maxx) maxx = x;
      if (y < miny) miny = y;
      if (y > maxy) maxy = y;
      if (x > 0 && noir[i - 1] && !etiquette[i - 1]) { etiquette[i - 1] = numero; pile[haut++] = i - 1; }
      if (x < w - 1 && noir[i + 1] && !etiquette[i + 1]) { etiquette[i + 1] = numero; pile[haut++] = i + 1; }
      if (y > 0 && noir[i - w] && !etiquette[i - w]) { etiquette[i - w] = numero; pile[haut++] = i - w; }
      if (y < h - 1 && noir[i + w] && !etiquette[i + w]) { etiquette[i + w] = numero; pile[haut++] = i + w; }
    }
    const bl = maxx - minx + 1, bh = maxy - miny + 1;
    const allure = bl / bh;
    // Un carré plein : à peu près carré, bien rempli, ni minuscule ni énorme.
    if (bl >= 5 && bh >= 5 && bl < w / 5 && bh < h / 5 && allure > 0.5 && allure < 2 && n / (bl * bh) > 0.6) {
      candidats.push({ x: sx / n, y: sy / n, n });
    }
  }
  if (candidats.length < 4) return null;

  // Parmi les carrés de taille semblable, garder les 4 plus aux coins (plus grande surface couverte).
  let meilleur = null, meilleureAire = 0;
  for (const ref of candidats) {
    const groupe = candidats.filter((k) => k.n > ref.n * 0.4 && k.n < ref.n * 2.5);
    if (groupe.length < 4) continue;
    const choix = [
      groupe.reduce((a, b) => (b.x + b.y < a.x + a.y ? b : a)),
      groupe.reduce((a, b) => (b.x - b.y > a.x - a.y ? b : a)),
      groupe.reduce((a, b) => (b.x + b.y > a.x + a.y ? b : a)),
      groupe.reduce((a, b) => (b.x - b.y < a.x - a.y ? b : a)),
    ];
    if (new Set(choix).size < 4) continue;
    const aire = aireQuadrilatere(choix);
    if (aire > meilleureAire) { meilleureAire = aire; meilleur = choix; }
  }
  if (!meilleur || meilleureAire < w * h * 0.05) return null;

  let coins = meilleur.map((k) => [k.x / r, k.y / r]);
  // La page est en hauteur : si le « haut » trouvé est le grand côté, la photo a été prise de côté.
  if (distance(coins[0], coins[1]) > distance(coins[0], coins[3])) coins = tourner(coins);
  return coins;
}

function aireQuadrilatere(p) {
  let s = 0;
  for (let i = 0; i < 4; i++) {
    const a = p[i], b = p[(i + 1) % 4];
    s += a.x * b.y - b.x * a.y;
  }
  return Math.abs(s) / 2;
}

function distance(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

// Fait tourner l'ordre des coins d'un quart de tour.
export function tourner(coins) {
  return [coins[3], coins[0], coins[1], coins[2]];
}

// Homographie qui envoie les 4 points « de » sur les 4 points « vers ».
export function homographie(de, vers) {
  const A = [], b = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = de[i], [u, v] = vers[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
  }
  const h = resoudre(A, b);
  return [h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7], 1];
}

export function appliquer(H, x, y) {
  const d = H[6] * x + H[7] * y + H[8];
  return [(H[0] * x + H[1] * y + H[2]) / d, (H[3] * x + H[4] * y + H[5]) / d];
}

function resoudre(A, b) {
  const n = b.length;
  const M = A.map((ligne, i) => [...ligne, b[i]]);
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let i = col + 1; i < n; i++) if (Math.abs(M[i][col]) > Math.abs(M[pivot][col])) pivot = i;
    [M[col], M[pivot]] = [M[pivot], M[col]];
    for (let i = 0; i < n; i++) {
      if (i === col) continue;
      const f = M[i][col] / M[col][col];
      for (let j = col; j <= n; j++) M[i][j] -= f * M[col][j];
    }
  }
  return M.map((ligne, i) => ligne[n] / ligne[i]);
}

// Projette l'image source dans un canevas de la taille « largeur × hauteur ».
// H envoie un pixel du résultat vers un pixel de la source.
export function deformer(source, H, largeur, hauteur) {
  const sw = source.width, sh = source.height;
  const src = source.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, sw, sh).data;
  const sortie = document.createElement("canvas");
  sortie.width = largeur;
  sortie.height = hauteur;
  const ctx = sortie.getContext("2d");
  const img = ctx.createImageData(largeur, hauteur);
  const d = img.data;
  for (let y = 0; y < hauteur; y++) {
    for (let x = 0; x < largeur; x++) {
      const q = H[6] * x + H[7] * y + H[8];
      const u = (H[0] * x + H[1] * y + H[2]) / q;
      const v = (H[3] * x + H[4] * y + H[5]) / q;
      const o = (y * largeur + x) * 4;
      if (u < 0 || v < 0 || u >= sw - 1 || v >= sh - 1) {
        d[o] = d[o + 1] = d[o + 2] = 255; d[o + 3] = 255;
        continue;
      }
      const x0 = u | 0, y0 = v | 0, fx = u - x0, fy = v - y0;
      const i00 = (y0 * sw + x0) * 4, i10 = i00 + 4, i01 = i00 + sw * 4, i11 = i01 + 4;
      for (let k = 0; k < 3; k++) {
        const haut = src[i00 + k] + (src[i10 + k] - src[i00 + k]) * fx;
        const bas = src[i01 + k] + (src[i11 + k] - src[i01 + k]) * fx;
        d[o + k] = haut + (bas - haut) * fy;
      }
      d[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return sortie;
}

function encre(canevas, bande, pxParMm) {
  const ctx = canevas.getContext("2d", { willReadFrequently: true });
  const d = ctx.getImageData(bande.x * pxParMm, bande.y * pxParMm, bande.l * pxParMm, bande.h * pxParMm).data;
  let somme = 0;
  for (let i = 0; i < d.length; i += 4) somme += 255 - (d[i] + d[i + 1] + d[i + 2]) / 3;
  return somme / (d.length / 4);
}

function projeter(photo, coins, pxParMm) {
  const cibles = REPERES.map(([x, y]) => [x * pxParMm, y * pxParMm]);
  return deformer(photo, homographie(cibles, coins), PAGE.largeur * pxParMm, PAGE.hauteur * pxParMm);
}

// Le titre doit être en haut : sinon la page était à l'envers, on retourne l'ordre des coins.
export function orienter(photo, coins) {
  const apercu = projeter(photo, coins, 2);
  return encre(apercu, BANDE_VIDE, 2) > encre(apercu, BANDE_TITRE, 2) ? tourner(tourner(coins)) : coins;
}

// Remet la page droite : coins = centres des carrés [HG, HD, BD, BG] sur la photo.
export function redresser(photo, coins, pxParMm = 4) {
  const page = projeter(photo, coins, pxParMm);
  corrigerLumiere(page, pxParMm);
  return page;
}

// Le papier doit redevenir blanc : on mesure sa couleur dans les marges du haut
// et du bas, puis on corrige toute la page (lumière jaune, ombre d'un côté…).
const MARGE_HAUT = { x: 30, y: 3, l: 150, h: 5 };

function couleurPapier(ctx, b, pxParMm) {
  const d = ctx.getImageData(b.x * pxParMm, b.y * pxParMm, b.l * pxParMm, b.h * pxParMm).data;
  const canaux = [[], [], []];
  for (let i = 0; i < d.length; i += 4) for (let k = 0; k < 3; k++) canaux[k].push(d[i + k]);
  return canaux.map((v) => v.sort((a, c) => a - c)[Math.floor(v.length * 0.6)] || 255);
}

export function corrigerLumiere(page, pxParMm = 4) {
  const ctx = page.getContext("2d", { willReadFrequently: true });
  const gainHaut = couleurPapier(ctx, MARGE_HAUT, pxParMm).map((v) => 250 / Math.max(60, v));
  const gainBas = couleurPapier(ctx, BANDE_VIDE, pxParMm).map((v) => 250 / Math.max(60, v));
  const yHaut = (MARGE_HAUT.y + MARGE_HAUT.h / 2) * pxParMm;
  const yBas = (BANDE_VIDE.y + BANDE_VIDE.h / 2) * pxParMm;
  const img = ctx.getImageData(0, 0, page.width, page.height);
  const d = img.data;
  for (let y = 0; y < page.height; y++) {
    const f = Math.max(0, Math.min(1, (y - yHaut) / (yBas - yHaut)));
    const gain = [0, 1, 2].map((k) => gainHaut[k] + (gainBas[k] - gainHaut[k]) * f);
    for (let i = y * page.width * 4, fin = i + page.width * 4; i < fin; i += 4) {
      let r = d[i] * gain[0], g = d[i + 1] * gain[1], bl = d[i + 2] * gain[2];
      // Un peu plus de couleur : les feutres paraissent ternes en photo.
      const m = (r + g + bl) / 3;
      r = m + (r - m) * 1.25; g = m + (g - m) * 1.25; bl = m + (bl - m) * 1.25;
      d[i] = r; d[i + 1] = g; d[i + 2] = bl;
    }
  }
  ctx.putImageData(img, 0, 0);
}
