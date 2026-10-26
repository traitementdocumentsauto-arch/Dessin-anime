// Coloriages : chaque page est décrite en millimètres (feuille A4 portrait).
// La même description sert à imprimer la page, à la reconnaître sur la photo
// et à découper les personnages pour le dessin animé.

export const PAGE = { largeur: 210, hauteur: 297 };

// Centres des 4 carrés noirs, dans l'ordre : haut gauche, haut droite, bas droite, bas gauche.
export const TAILLE_REPERE = 12;
export const REPERES = [[16, 16], [194, 16], [194, 281], [16, 281]];

// Bandes de papier qui restent toujours blanches : servent à corriger la lumière
// et à savoir si la page est à l'endroit (le titre est en haut, rien en bas).
// BANDE_VIDE est le reflet de BANDE_TITRE : une page à l'envers met le titre dedans.
export const BANDE_TITRE = { x: 40, y: 19, l: 130, h: 9 };
export const BANDE_VIDE = { x: 40, y: 269, l: 130, h: 9 };

function cercle(cx, cy, r) {
  return `M${cx - r} ${cy} A${r} ${r} 0 1 0 ${cx + r} ${cy} A${r} ${r} 0 1 0 ${cx - r} ${cy} Z`;
}

function etoile(cx, cy, r1, r2, branches = 5) {
  const pts = [];
  for (let i = 0; i < branches * 2; i++) {
    const r = i % 2 ? r2 : r1;
    const a = -Math.PI / 2 + (i * Math.PI) / branches;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join(" L")} Z`;
}

function algue(x, base, h) {
  return `M${x} ${base} C${x - 6} ${base - h * 0.35}, ${x + 6} ${base - h * 0.6}, ${x - 1} ${base - h} ` +
    `C${x + 5} ${base - h * 0.6}, ${x + 10} ${base - h * 0.35}, ${x + 6} ${base} Z`;
}

function tentacule(x) {
  return `M${x} 214 C${x - 4} 230, ${x + 6} 240, ${x - 2} 258 Q${x + 2} 262 ${x + 4} 257 ` +
    `C${x + 11} 240, ${x + 2} 230, ${x + 8} 214 Z`;
}

function vagues(x0, x1, y, amp, pas) {
  // Ligne de vagues de droite à gauche (pour fermer le ciel par le bas).
  let d = `Q${x1 - pas / 2} ${y - amp} ${x1 - pas} ${y}`;
  for (let x = x1 - 2 * pas; x >= x0; x -= pas) d += ` T${x} ${y}`;
  return d;
}

// forme : { d, demo } — d = tracé SVG, demo = couleur du mode « essayer sans imprimer »,
// plein = tracé rempli de noir (pupilles), trait = simple trait sans surface.
export const MER = {
  id: "mer",
  titre: "Au fond de la mer",
  consigne: "Colorie, puis prends la page en photo !",
  decor: { x: 20, y: 40, l: 170, h: 115 },
  formes: [
    { d: "M20 40 H190 V155 H20 Z", demo: "#4fb3ea" },
    { d: `M20 40 H190 V50 ${vagues(20, 190, 50, 4, 10)} Z`, demo: "#c4ecff" },
    { d: "M20 140 Q45 130 70 138 T120 136 T165 134 T190 138 V155 H20 Z", demo: "#f3d58c" },
    { d: "M30 146 C30 136, 50 134, 52 146 Z", demo: "#8e8e9c" },
    { d: "M148 142 C150 130, 174 130, 176 141 Z", demo: "#7d7d8c" },
    { d: algue(62, 137, 45), demo: "#2f9e5c" },
    { d: algue(74, 138, 30), demo: "#45b86f" },
    { d: algue(132, 136, 50), demo: "#2f9e5c" },
    { d: algue(181, 137, 38), demo: "#45b86f" },
    { d: etoile(110, 146, 7, 3), demo: "#ff8a3d" },
    { d: "M84 151 Q90 139 96 151 Z", demo: "#ffb6c8" },
    { d: "M90 151 L90 143 M87 151 L88 144 M93 151 L92 144", trait: true },
    { d: cercle(40, 80, 2.2), demo: "#e6f7ff" },
    { d: cercle(44, 71, 1.5), demo: "#e6f7ff" },
    { d: cercle(152, 92, 2.6), demo: "#e6f7ff" },
    { d: cercle(156, 82, 1.6), demo: "#e6f7ff" },
  ],
  personnages: [
    {
      id: "poisson",
      nom: "Le poisson",
      cadre: { x: 20, y: 165, l: 82, h: 103 },
      boite: [23, 191, 95, 249],
      silhouette: [
        { d: "M44 222 L26 207 C29 216, 29 228, 26 237 Z", demo: "#ff6a00" },
        { d: "M56 209 Q61 194 76 208 Z", demo: "#ff6a00" },
        { d: "M60 236 Q64 247 72 237 Z", demo: "#ff6a00" },
        { d: "M42 222 C42 210, 56 205, 68 206 C80 207, 90 214, 92 222 C90 230, 80 237, 68 238 C56 239, 42 234, 42 222 Z", demo: "#ffb300" },
      ],
      details: [
        { d: "M57 211 Q53 222 57 234", trait: true },
        { d: "M67 208 Q63 222 67 237", trait: true },
        { d: cercle(82, 218, 3.2), demo: "#ffffff" },
        { d: cercle(82.6, 218, 1.4), plein: true },
        { d: "M85 227 Q88 229 90 226", trait: true },
      ],
    },
    {
      id: "pieuvre",
      nom: "La pieuvre",
      cadre: { x: 108, y: 165, l: 82, h: 103 },
      boite: [121, 186, 177, 265],
      silhouette: [
        ...[129, 141, 153, 165].map((x) => ({ d: tentacule(x), demo: "#b04ce0" })),
        { d: "M126 217 C123 186, 175 186, 172 217 Z", demo: "#cd73ff" },
      ],
      details: [
        { d: cercle(141, 206, 3.6), demo: "#ffffff" },
        { d: cercle(157, 206, 3.6), demo: "#ffffff" },
        { d: cercle(141.6, 206.5, 1.6), plein: true },
        { d: cercle(157.6, 206.5, 1.6), plein: true },
        { d: "M143 213 Q149 218 155 213", trait: true },
        { d: cercle(136, 196, 1.8), demo: "#9a3cc4" },
        { d: cercle(149, 193, 1.4), demo: "#9a3cc4" },
        { d: cercle(162, 197, 2), demo: "#9a3cc4" },
      ],
    },
  ],
};

export const PAGES = [MER];

function echapper(t) {
  return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function forme(f, demo, epaisseur) {
  if (f.plein) return `<path d="${f.d}" fill="#000"/>`;
  if (f.trait) return `<path d="${f.d}" fill="none" stroke="#000" stroke-width="${epaisseur * 0.7}" stroke-linecap="round"/>`;
  const fond = demo && f.demo ? f.demo : "#fff";
  return `<path d="${f.d}" fill="${fond}" stroke="#000" stroke-width="${epaisseur}" stroke-linejoin="round"/>`;
}

// Page complète en SVG (unités = mm). demo = true : page déjà coloriée.
export function pageSVG(page, { demo = false } = {}) {
  const { largeur, hauteur } = PAGE;
  const t = TAILLE_REPERE;
  const morceaux = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${largeur} ${hauteur}" width="${largeur}mm" height="${hauteur}mm">`,
    `<rect width="${largeur}" height="${hauteur}" fill="#fff"/>`,
    ...REPERES.map(([x, y]) => `<rect x="${x - t / 2}" y="${y - t / 2}" width="${t}" height="${t}" fill="#000"/>`),
    `<text x="105" y="27" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="9">${echapper(page.titre)}</text>`,
    `<text x="105" y="34" text-anchor="middle" font-family="Arial, sans-serif" font-size="4">${echapper(page.consigne)}</text>`,
    ...page.formes.map((f) => forme(f, demo, 0.9)),
    `<rect x="${page.decor.x}" y="${page.decor.y}" width="${page.decor.l}" height="${page.decor.h}" fill="none" stroke="#000" stroke-width="1"/>`,
  ];
  for (const p of page.personnages) {
    const c = p.cadre;
    morceaux.push(
      `<rect x="${c.x}" y="${c.y}" width="${c.l}" height="${c.h}" rx="4" fill="none" stroke="#000" stroke-width="0.6" stroke-dasharray="2 1.5"/>`,
      `<text x="${c.x + c.l / 2}" y="${c.y + 7}" text-anchor="middle" font-family="Arial, sans-serif" font-size="4.5">${echapper(p.nom)}</text>`,
      ...p.silhouette.map((f) => forme(f, demo, 0.9)),
      ...p.details.map((f) => forme(f, demo, 0.7)),
    );
  }
  morceaux.push("</svg>");
  return morceaux.join("");
}

// Dessine la page SVG dans un canevas (pxParMm pixels par millimètre).
export function pageEnCanevas(page, { demo = false, pxParMm = 4 } = {}) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = PAGE.largeur * pxParMm;
      c.height = PAGE.hauteur * pxParMm;
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      resolve(c);
    };
    img.onerror = reject;
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(pageSVG(page, { demo }));
  });
}
