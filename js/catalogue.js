// Catalogue de feuilles à colorier. Chaque feuille : un grand personnage en traits épais,
// tourné vers la gauche, à colorier puis à prendre en photo (mode « n'importe quel dessin »).
// Le dessin tient dans une boîte de 200 × 140 unités ; formes remplies de blanc, traits noirs.
// { d } = forme ; { d, trait: true } = simple trait ; { d, plein: true } = rempli de noir.

const rond = (cx, cy, r) => `M${cx - r} ${cy} A${r} ${r} 0 1 0 ${cx + r} ${cy} A${r} ${r} 0 1 0 ${cx - r} ${cy} Z`;
const oeil = (x, y, r = 6) => [{ d: rond(x, y, r) }, { d: rond(x - r * 0.25, y, r * 0.45), plein: true }];

export const FEUILLES = [
  {
    id: "poisson", titre: "Le poisson", sujet: "poisson", nom: "le poisson", corps: "profil",
    formes: [
      { d: "M146 70 L192 32 C182 55, 182 85, 192 108 Z" },
      { d: "M68 36 C78 6, 114 6, 126 44 Z" },
      { d: "M78 106 C86 132, 108 132, 114 102 Z" },
      { d: "M18 70 C38 22, 122 18, 152 70 C122 120, 38 116, 18 70 Z" },
      { d: "M56 44 Q44 70 56 96", trait: true },
      { d: "M80 34 Q64 70 80 106", trait: true },
      { d: "M104 32 Q88 70 104 108", trait: true },
      { d: "M128 44 Q114 70 128 98", trait: true },
      ...oeil(40, 60, 8),
      { d: "M22 80 Q30 86 38 80", trait: true },
    ],
  },
  {
    id: "raie", titre: "La raie", sujet: "raie", nom: "la raie", corps: "plat",
    formes: [
      { d: "M148 66 C172 64, 188 60, 198 52 C192 66, 176 74, 148 76 Z" },
      { d: "M12 70 C38 48, 60 18, 110 6 C112 38, 126 54, 152 62 C166 66, 166 74, 152 78 C126 86, 112 102, 110 134 C60 122, 38 92, 12 70 Z" },
      { d: "M34 70 L150 70", trait: true },
      ...oeil(40, 61, 4.5), ...oeil(40, 79, 4.5),
      ...[[76, 44, 6], [92, 28, 5], [98, 56, 7], [70, 92, 6], [98, 110, 5], [122, 70, 6], [62, 70, 4], [114, 40, 4], [116, 98, 4]].map(([x, y, r]) => ({ d: rond(x, y, r) })),
    ],
  },
  {
    id: "requin", titre: "Le requin", sujet: "requin", nom: "le requin", corps: "profil",
    formes: [
      { d: "M78 46 L96 8 L114 48 Z" },
      { d: "M62 86 L48 122 L86 92 Z" },
      { d: "M6 74 C24 50, 72 40, 140 52 C150 46, 166 28, 188 16 C180 44, 176 60, 168 70 C178 82, 186 102, 192 122 C170 106, 152 92, 140 88 C80 104, 22 98, 6 74 Z" },
      { d: "M18 86 C60 96, 110 94, 150 86", trait: true },
      { d: "M54 60 Q50 72 54 84 M62 58 Q58 72 62 86 M70 56 Q66 72 70 88", trait: true },
      { d: "M12 80 Q28 90 44 82", trait: true },
      { d: "M18 82 L21 87 L24 83 L27 88 L30 84 L33 88 L36 84", trait: true },
      ...oeil(32, 64, 5),
    ],
  },
  {
    id: "dauphin", titre: "Le dauphin", sujet: "dauphin", nom: "le dauphin", corps: "profil",
    formes: [
      { d: "M94 40 C100 18, 112 10, 128 8 C120 24, 120 36, 128 46 Z" },
      { d: "M80 94 C78 112, 86 124, 100 130 C100 114, 102 104, 108 96 Z" },
      { d: "M6 62 C22 54, 34 52, 46 54 C82 30, 142 34, 166 70 C172 80, 182 86, 194 80 C186 94, 186 106, 198 116 C180 112, 168 106, 160 94 C130 112, 70 108, 44 72 C34 68, 20 68, 6 62 Z" },
      { d: "M46 72 C80 94, 130 98, 160 92", trait: true },
      { d: "M10 65 Q26 72 42 66", trait: true },
      ...oeil(52, 58, 5),
    ],
  },
  {
    id: "baleine", titre: "La baleine", sujet: "baleine", nom: "la baleine", corps: "profil",
    formes: [
      { d: "M54 32 C50 18, 42 12, 34 4 M54 32 C55 18, 58 10, 62 2 M54 32 C60 18, 70 12, 78 6", trait: true },
      { d: "M72 102 C66 122, 76 134, 94 138 C92 122, 94 112, 100 106 Z" },
      { d: "M8 82 C8 40, 60 26, 110 36 C140 42, 160 60, 168 72 C176 60, 186 50, 198 44 C192 62, 192 80, 198 98 C186 94, 176 86, 168 80 C150 110, 80 122, 40 114 C18 110, 8 100, 8 82 Z" },
      { d: "M18 100 C60 114, 110 112, 152 92", trait: true },
      { d: "M34 106 L30 96 M54 110 L52 100 M74 112 L74 102 M94 111 L96 101 M114 108 L118 98 M134 101 L138 92", trait: true },
      { d: "M12 88 Q30 96 50 92", trait: true },
      ...oeil(40, 72, 6),
    ],
  },
  {
    id: "pieuvre", titre: "La pieuvre", sujet: "pieuvre", nom: "la pieuvre", corps: "profil",
    formes: [
      ...[46, 64, 82, 100, 118, 136].map((x) => ({ d: `M${x} 66 C${x - 12} 92, ${x + 14} 108, ${x - 6} 132 C${x + 4} 138, ${x + 16} 130, ${x + 12} 118 C${x + 6} 104, ${x + 22} 90, ${x + 16} 66 Z` })),
      { d: "M44 74 C30 6, 170 6, 156 74 Z" },
      ...oeil(84, 48, 9), ...oeil(116, 48, 9),
      { d: "M88 64 Q100 74 112 64", trait: true },
      { d: rond(64, 58, 5) }, { d: rond(136, 58, 5) }, { d: rond(100, 30, 4) },
    ],
  },
  {
    id: "tortue", titre: "La tortue", sujet: "tortue", nom: "la tortue", corps: "plat",
    formes: [
      { d: "M78 40 C64 16, 44 8, 30 12 C38 28, 56 42, 72 50 Z" },
      { d: "M78 100 C64 124, 44 132, 30 128 C38 112, 56 98, 72 90 Z" },
      { d: "M138 44 C150 30, 164 26, 172 30 C166 42, 154 50, 142 54 Z" },
      { d: "M138 96 C150 110, 164 114, 172 110 C166 98, 154 90, 142 86 Z" },
      { d: "M156 66 L178 70 L156 74 Z" },
      { d: "M44 70 C44 52, 18 50, 12 62 C8 72, 12 86, 26 86 C40 86, 44 80, 44 70 Z" },
      { d: "M44 70 C44 34, 160 30, 162 70 C160 110, 44 106, 44 70 Z" },
      { d: "M86 70 L96 54 L116 54 L126 70 L116 86 L96 86 Z", trait: true },
      { d: "M96 54 L88 38 M116 54 L124 38 M126 70 L150 70 M116 86 L124 102 M96 86 L88 102 M86 70 L58 70", trait: true },
      ...oeil(22, 64, 4),
      { d: "M12 76 Q18 80 24 77", trait: true },
    ],
  },
  {
    id: "dinosaure", titre: "Le dinosaure", sujet: "dinosaure", nom: "le dinosaure", corps: "profil",
    formes: [
      ...[[84, 56], [100, 50], [116, 50], [132, 54], [148, 62]].map(([x, y]) => ({ d: `M${x - 7} ${y + 4} L${x} ${y - 12} L${x + 7} ${y + 4} Z` })),
      { d: "M92 100 L90 132 L108 132 L110 100 Z" },
      { d: "M132 100 L132 132 L150 132 L150 98 Z" },
      { d: "M150 76 C170 82, 186 96, 198 116 C180 112, 164 104, 148 100 Z" },
      { d: "M62 92 C58 62, 120 44, 152 70 C166 84, 160 104, 140 106 L90 108 C72 108, 64 102, 62 92 Z" },
      { d: "M72 76 C58 54, 48 36, 36 26 C28 18, 10 18, 6 30 C4 40, 18 44, 30 40 C40 52, 50 74, 64 94 Z" },
      ...oeil(20, 28, 4),
      { d: "M8 36 Q16 40 24 37", trait: true },
      { d: rond(110, 76, 6) }, { d: rond(130, 84, 5) }, { d: rond(96, 90, 4) },
    ],
  },
  {
    id: "dragon", titre: "Le dragon", sujet: "dragon", nom: "le dragon", corps: "profil",
    formes: [
      { d: "M98 58 C90 18, 122 2, 150 6 C140 16, 152 26, 140 34 C154 38, 148 50, 134 54 C142 62, 128 70, 112 66 Z" },
      { d: "M104 34 L128 18 M108 46 L140 36", trait: true },
      { d: "M92 100 L90 132 L108 132 L110 100 Z" },
      { d: "M132 100 L132 132 L150 132 L150 98 Z" },
      { d: "M150 78 C172 84, 184 98, 190 112 L200 106 L196 124 L178 122 L186 116 C172 112, 160 106, 148 102 Z" },
      { d: "M62 92 C58 62, 120 50, 152 72 C166 86, 160 104, 140 106 L90 108 C72 108, 64 102, 62 92 Z" },
      { d: "M70 78 C62 62, 54 50, 44 44 C36 30, 12 30, 6 42 C2 54, 16 60, 30 56 C40 64, 48 78, 62 94 Z" },
      { d: "M34 34 L30 16 L42 30 Z" }, { d: "M24 36 L14 20 L30 32 Z" },
      ...oeil(26, 44, 4),
      { d: "M8 52 Q16 56 24 53", trait: true },
      { d: "M76 98 C100 104, 120 104, 140 100", trait: true },
    ],
  },
  {
    id: "chat", titre: "Le chat", sujet: "chat", nom: "le chat", corps: "profil",
    formes: [
      { d: "M148 82 C170 72, 180 50, 172 28 C186 38, 192 62, 180 82 C172 94, 160 98, 148 96 Z" },
      { d: "M62 104 L60 132 L76 132 L78 104 Z" }, { d: "M128 104 L128 132 L144 132 L144 104 Z" },
      { d: "M50 80 C50 58, 140 56, 152 78 C156 96, 148 108, 136 110 L70 110 C56 108, 50 96, 50 80 Z" },
      { d: "M20 46 L16 16 L40 36 Z" }, { d: "M48 36 L62 14 L64 44 Z" },
      { d: rond(40, 62, 26) },
      ...oeil(30, 58, 5), ...oeil(50, 58, 5),
      { d: "M37 68 L43 68 L40 72 Z", plein: true },
      { d: "M40 72 Q34 78 30 74 M40 72 Q46 78 50 74", trait: true },
      { d: "M24 70 L4 66 M24 74 L4 78 M56 70 L74 66 M56 74 L74 78", trait: true },
      { d: "M90 64 Q86 84 90 104 M112 62 Q108 84 112 106", trait: true },
    ],
  },
  {
    id: "chien", titre: "Le chien", sujet: "chien", nom: "le chien", corps: "profil",
    formes: [
      { d: "M150 76 C164 66, 174 52, 176 38 C184 50, 180 70, 166 84 Z" },
      { d: "M62 104 L60 132 L78 132 L80 104 Z" }, { d: "M128 104 L128 132 L146 132 L146 104 Z" },
      { d: "M52 80 C52 58, 142 54, 154 78 C158 96, 150 108, 138 110 L72 110 C58 108, 52 96, 52 80 Z" },
      { d: rond(44, 56, 26) },
      { d: "M8 62 C6 50, 20 46, 30 52 L34 74 C24 80, 10 76, 8 62 Z" },
      { d: "M48 34 C64 26, 76 40, 72 64 C68 74, 58 72, 56 62 C54 50, 48 44, 48 34 Z" },
      ...oeil(34, 48, 5),
      { d: rond(10, 58, 5), plein: true },
      { d: "M12 70 Q20 76 30 70", trait: true },
      { d: "M42 82 L82 86", trait: true },
    ],
  },
  {
    id: "lapin", titre: "Le lapin", sujet: "lapin", nom: "le lapin", corps: "profil",
    formes: [
      { d: rond(156, 82, 12) },
      { d: "M70 110 C60 112, 58 124, 74 126 L96 126 C100 118, 92 110, 82 108 Z" },
      { d: "M128 108 C118 110, 114 124, 132 126 L156 126 C160 116, 150 106, 138 106 Z" },
      { d: "M58 84 C56 56, 140 54, 154 84 C158 104, 144 116, 120 116 L84 116 C66 114, 58 102, 58 84 Z" },
      { d: "M34 44 C26 22, 26 2, 36 0 C46 2, 48 22, 46 44 Z" },
      { d: "M48 46 C46 24, 54 6, 64 8 C72 12, 66 30, 58 48 Z" },
      { d: rond(42, 64, 24) },
      { d: "M36 40 C32 24, 34 12, 38 10", trait: true },
      ...oeil(32, 60, 5),
      { d: rond(20, 70, 4), plein: true },
      { d: "M20 74 Q26 82 32 76", trait: true },
    ],
  },
  {
    id: "oiseau", titre: "L'oiseau", sujet: "oiseau", nom: "l'oiseau", corps: "profil",
    formes: [
      { d: "M140 70 L190 46 L186 66 L196 78 L184 86 L188 104 L140 84 Z" },
      { d: "M82 108 L78 132 M78 132 L68 136 M78 132 L84 138 M106 108 L104 132 M104 132 L94 136 M104 132 L110 138", trait: true },
      { d: "M48 76 C48 46, 110 36, 146 64 C156 74, 150 96, 130 104 C100 116, 52 110, 48 76 Z" },
      { d: rond(44, 54, 24) },
      { d: "M22 48 L2 56 L22 62 Z" },
      { d: "M80 66 C96 52, 128 54, 140 72 C124 82, 98 86, 80 66 Z" },
      { d: "M96 72 L124 72 M92 78 L116 80", trait: true },
      ...oeil(36, 48, 6),
    ],
  },
  {
    id: "papillon", titre: "Le papillon", sujet: "papillon", nom: "le papillon", corps: "plat",
    formes: [
      { d: "M100 64 C80 20, 40 0, 20 18 C4 34, 30 62, 98 70 Z" },
      { d: "M100 64 C120 20, 160 0, 180 18 C196 34, 170 62, 102 70 Z" },
      { d: "M98 74 C60 76, 30 96, 40 122 C52 138, 84 120, 98 80 Z" },
      { d: "M102 74 C140 76, 170 96, 160 122 C148 138, 116 120, 102 80 Z" },
      { d: "M100 52 C108 52, 108 110, 100 116 C92 110, 92 52, 100 52 Z" },
      { d: rond(100, 46, 8) },
      { d: "M96 40 C90 24, 82 16, 74 14 M104 40 C110 24, 118 16, 126 14", trait: true },
      { d: rond(52, 32, 10) }, { d: rond(148, 32, 10) }, { d: rond(64, 104, 8) }, { d: rond(136, 104, 8) },
      { d: rond(74, 52, 5) }, { d: rond(126, 52, 5) },
    ],
  },
  {
    id: "fusee", titre: "La fusée", sujet: "fusee", nom: "la fusée", corps: "profil",
    formes: [
      { d: "M160 52 C178 50, 192 58, 198 70 C192 82, 178 90, 160 88 Z" },
      { d: "M164 58 C176 60, 184 64, 188 70 C184 76, 176 80, 164 82", trait: true },
      { d: "M126 46 L156 14 L166 20 L152 52 Z" }, { d: "M126 94 L156 126 L166 120 L152 88 Z" },
      { d: "M6 70 C30 40, 70 34, 160 42 L160 98 C70 106, 30 100, 6 70 Z" },
      { d: rond(72, 70, 16) }, { d: rond(72, 70, 10) },
      { d: "M40 48 C46 60, 46 80, 40 92 M118 42 L118 98", trait: true },
      { d: rond(140, 58, 4) }, { d: rond(140, 82, 4) },
    ],
  },
  {
    id: "voiture", titre: "La voiture", sujet: "voiture", nom: "la voiture", corps: "profil",
    formes: [
      { d: "M6 96 C6 76, 16 70, 40 68 L62 40 C70 30, 80 28, 92 28 L134 28 C146 28, 154 34, 162 46 L176 68 C190 70, 196 80, 196 96 L196 108 L6 108 Z" },
      { d: "M70 64 L84 40 L108 40 L108 64 Z" }, { d: "M118 64 L118 40 L142 40 L154 64 Z" },
      { d: rond(50, 108, 18) }, { d: rond(50, 108, 8) }, { d: rond(152, 108, 18) }, { d: rond(152, 108, 8) },
      { d: "M14 80 L28 80 L28 88 L14 88 Z" },
      { d: "M112 72 L112 104 M118 76 L128 76", trait: true },
    ],
  },
  {
    id: "robot", titre: "Le robot", sujet: "robot", nom: "le robot", corps: "profil",
    formes: [
      { d: "M100 10 L100 22", trait: true }, { d: rond(100, 8, 5) },
      { d: "M48 48 L28 92 L40 96 L58 60 Z" }, { d: "M152 48 L172 92 L160 96 L142 60 Z" },
      { d: "M78 112 L78 136 L94 136 L94 112 Z" }, { d: "M106 112 L106 136 L122 136 L122 112 Z" },
      { d: "M50 44 L150 44 L150 114 L50 114 Z" },
      { d: "M66 20 L134 20 L134 46 L66 46 Z" },
      { d: rond(84, 32, 7) }, { d: rond(116, 32, 7) },
      { d: "M86 40 L114 40", trait: true },
      { d: "M66 60 L134 60 L134 96 L66 96 Z" },
      { d: rond(84, 78, 8) }, { d: rond(116, 78, 8) }, { d: "M98 72 L102 72 L102 84 L98 84 Z" },
    ],
  },
  {
    id: "monstre", titre: "Le monstre", sujet: "monstre", nom: "le monstre", corps: "profil",
    formes: [
      { d: "M62 30 L52 4 L78 24 Z" }, { d: "M138 30 L148 4 L122 24 Z" },
      { d: "M56 116 L52 136 L74 136 L76 118 Z" }, { d: "M124 118 L126 136 L148 136 L144 116 Z" },
      { d: "M44 70 L16 48 L22 40 L50 58 Z" }, { d: "M156 70 L184 48 L178 40 L150 58 Z" },
      { d: "M100 18 C150 18, 168 60, 162 92 C156 122, 120 124, 100 124 C80 124, 44 122, 38 92 C32 60, 50 18, 100 18 Z" },
      ...oeil(76, 54, 10), ...oeil(100, 46, 8), ...oeil(124, 54, 10),
      { d: "M68 84 Q100 112 132 84 Z" },
      { d: "M80 88 L86 98 L92 92 L100 102 L108 92 L114 98 L120 88", trait: true },
      { d: rond(70, 108, 5) }, { d: rond(132, 104, 6) },
    ],
  },
];

function echapper(t) {
  return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function dessinSVG(formes) {
  return formes.map((f) => {
    if (f.plein) return `<path d="${f.d}" fill="#000"/>`;
    if (f.trait) return `<path d="${f.d}" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
    return `<path d="${f.d}" fill="#fff" stroke="#000" stroke-width="2.6" stroke-linejoin="round"/>`;
  }).join("");
}

// Feuille A4 (unités = mm) : titre en haut, le personnage en grand, une petite ligne en bas.
export function feuilleSVG(f) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 297" width="210mm" height="297mm">` +
    `<rect width="210" height="297" fill="#fff"/>` +
    `<text x="105" y="36" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="16">${echapper(f.titre)}</text>` +
    `<text x="105" y="48" text-anchor="middle" font-family="Arial, sans-serif" font-size="5">Colorie-moi, puis prends-moi en photo dans « Mon dessin animé » !</text>` +
    `<g transform="translate(8 82) scale(0.97)">${dessinSVG(f.formes)}</g>` +
    `<text x="105" y="282" text-anchor="middle" font-family="Arial, sans-serif" font-size="3.5" fill="#888">Mon dessin animé · ${echapper(f.titre)}</text>` +
    `</svg>`;
}

// Petite image du personnage seul (pour le catalogue à l'écran).
export function vignetteSVG(f) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 208 148">${dessinSVG(f.formes)}</svg>`;
}

export function urlImage(svg) {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
