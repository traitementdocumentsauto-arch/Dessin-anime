import { nomDuType } from "./types.js";

// Catalogue de feuilles à colorier. Chaque feuille : un grand personnage en traits épais,
// tourné vers la gauche, à colorier puis à prendre en photo (mode « n'importe quel dessin »).
// Le dessin tient dans une boîte de 200 × 140 unités ; formes remplies de blanc, traits noirs.
// { d } = forme ; { d, trait: true } = simple trait ; { d, plein: true } = rempli de noir.

const rond = (cx, cy, r) => `M${cx - r} ${cy} A${r} ${r} 0 1 0 ${cx + r} ${cy} A${r} ${r} 0 1 0 ${cx - r} ${cy} Z`;
// Feuille d'arbre de (bx, by) jusqu'à la pointe (tx, ty), largeur l.
const feuilleArbre = (bx, by, tx, ty, l) => {
  const mx = (bx + tx) / 2, my = (by + ty) / 2, n = Math.hypot(tx - bx, ty - by), px = (-(ty - by) / n) * l, py = ((tx - bx) / n) * l;
  return `M${bx} ${by} Q${mx + px} ${my + py} ${tx} ${ty} Q${mx - px} ${my - py} ${bx} ${by} Z`;
};
// Fleur : 5 pétales autour d'un cœur.
const fleur = (cx, cy, r) => [
  ...[0, 1, 2, 3, 4].map((k) => { const a = -Math.PI / 2 + (k * 2 * Math.PI) / 5; return { d: rond(cx + Math.cos(a) * r * 0.62, cy + Math.sin(a) * r * 0.62, r * 0.5) }; }),
  { d: rond(cx, cy, r * 0.42) },
];
const oeil = (x, y, r = 6) => [{ d: rond(x, y, r) }, { d: rond(x - r * 0.25, y, r * 0.45), plein: true }];

const BASES = [
  {
    id: "poisson", groupe: "mer", titre: "Le poisson", sujet: "poisson", nom: "le poisson", corps: "profil",
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
    id: "raie", groupe: "mer", titre: "La raie", sujet: "raie", nom: "la raie", corps: "plat",
    formes: [
      { d: "M148 66 C172 64, 188 60, 198 52 C192 66, 176 74, 148 76 Z" },
      { d: "M12 70 C38 48, 60 18, 110 6 C112 38, 126 54, 152 62 C166 66, 166 74, 152 78 C126 86, 112 102, 110 134 C60 122, 38 92, 12 70 Z" },
      { d: "M34 70 L150 70", trait: true },
      ...oeil(40, 61, 4.5), ...oeil(40, 79, 4.5),
      ...[[76, 44, 6], [92, 28, 5], [98, 56, 7], [70, 92, 6], [98, 110, 5], [122, 70, 6], [62, 70, 4], [114, 40, 4], [116, 98, 4]].map(([x, y, r]) => ({ d: rond(x, y, r) })),
    ],
  },
  {
    id: "requin", groupe: "mer", titre: "Le requin", sujet: "requin", nom: "le requin", corps: "profil",
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
    id: "dauphin", groupe: "mer", titre: "Le dauphin", sujet: "dauphin", nom: "le dauphin", corps: "profil",
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
    id: "baleine", groupe: "mer", titre: "La baleine", sujet: "baleine", nom: "la baleine", corps: "profil",
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
    id: "pieuvre", groupe: "mer", titre: "La pieuvre", sujet: "pieuvre", nom: "la pieuvre", corps: "profil",
    formes: [
      ...[46, 64, 82, 100, 118, 136].map((x) => ({ d: `M${x} 66 C${x - 12} 92, ${x + 14} 108, ${x - 6} 132 C${x + 4} 138, ${x + 16} 130, ${x + 12} 118 C${x + 6} 104, ${x + 22} 90, ${x + 16} 66 Z` })),
      { d: "M44 74 C30 6, 170 6, 156 74 Z" },
      ...oeil(84, 48, 9), ...oeil(116, 48, 9),
      { d: "M88 64 Q100 74 112 64", trait: true },
      { d: rond(64, 58, 5) }, { d: rond(136, 58, 5) }, { d: rond(100, 30, 4) },
    ],
  },
  {
    id: "tortue", groupe: "mer", titre: "La tortue", sujet: "tortue", nom: "la tortue", corps: "plat",
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
    id: "dinosaure", groupe: "animaux", titre: "Le dinosaure", sujet: "dinosaure", nom: "le dinosaure", corps: "profil",
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
    id: "dragon", groupe: "animaux", titre: "Le dragon", sujet: "dragon", nom: "le dragon", corps: "profil",
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
    id: "chat", groupe: "animaux", titre: "Le chat", sujet: "chat", nom: "le chat", corps: "profil",
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
    id: "chien", groupe: "animaux", titre: "Le chien", sujet: "chien", nom: "le chien", corps: "profil",
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
    id: "lapin", groupe: "animaux", titre: "Le lapin", sujet: "lapin", nom: "le lapin", corps: "profil",
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
    id: "oiseau", groupe: "animaux", titre: "L'oiseau", sujet: "oiseau", nom: "l'oiseau", corps: "profil",
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
    id: "papillon", groupe: "animaux", titre: "Le papillon", sujet: "papillon", nom: "le papillon", corps: "plat",
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
    id: "fusee", groupe: "autres", titre: "La fusée", sujet: "fusee", nom: "la fusée", corps: "profil",
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
    id: "voiture", groupe: "autres", titre: "La voiture", sujet: "voiture", nom: "la voiture", corps: "profil",
    formes: [
      { d: "M6 96 C6 76, 16 70, 40 68 L62 40 C70 30, 80 28, 92 28 L134 28 C146 28, 154 34, 162 46 L176 68 C190 70, 196 80, 196 96 L196 108 L6 108 Z" },
      { d: "M70 64 L84 40 L108 40 L108 64 Z" }, { d: "M118 64 L118 40 L142 40 L154 64 Z" },
      { d: rond(50, 108, 18) }, { d: rond(50, 108, 8) }, { d: rond(152, 108, 18) }, { d: rond(152, 108, 8) },
      { d: "M14 80 L28 80 L28 88 L14 88 Z" },
      { d: "M112 72 L112 104 M118 76 L128 76", trait: true },
    ],
  },
  {
    id: "robot", groupe: "autres", titre: "Le robot", sujet: "robot", nom: "le robot", corps: "profil",
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
    id: "monstre", groupe: "autres", titre: "Le monstre", sujet: "monstre", nom: "le monstre", corps: "profil",
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

  // ---------- Monstres de poche (inventés) ----------
  {
    id: "pyroto", groupe: "monstres", titre: "Pyroto", type: "feu", sujet: "pokemon", nom: "Pyroto", phrase: "Attaque Flamme Rigolote ! Fshhh !",
    formes: [
      { d: "M140 80 C160 70, 170 50, 160 30 C175 38, 180 30, 178 18 C192 34, 198 56, 188 76 C196 74, 200 70, 198 64 C200 86, 182 104, 150 100 Z" },
      { d: "M158 88 C172 80, 180 66, 176 50", trait: true },
      { d: "M70 100 L66 130 L82 130 L84 104 Z" }, { d: "M118 100 L118 130 L134 130 L132 100 Z" },
      { d: "M60 84 C58 62, 130 56, 146 80 C152 100, 138 110, 120 110 L80 110 C66 108, 60 98, 60 84 Z" },
      { d: "M64 86 L72 96 L78 86 L86 96 L92 86", trait: true },
      { d: "M26 32 L20 2 L46 22 Z" }, { d: "M52 24 L64 0 L72 30 Z" },
      { d: "M28 24 L26 10 M58 18 L63 8", trait: true },
      { d: "M6 60 C6 36, 30 22, 52 26 C76 30, 82 56, 70 72 C60 84, 28 84, 6 60 Z" },
      ...oeil(32, 46, 7),
      { d: rond(8, 59, 4), plein: true },
      { d: "M12 68 Q22 74 32 68", trait: true },
      { d: "M52 56 L60 50 L58 62 Z" },
    ],
  },
  {
    id: "aquabulle", groupe: "monstres", titre: "Aquabulle", type: "eau", sujet: "pokemon", nom: "Aquabulle", phrase: "Attaque Jet de Bulles ! Blub blub !",
    formes: [
      { d: "M140 70 C165 56, 186 60, 198 72 C186 84, 165 88, 140 82 Z" },
      { d: "M150 76 C166 72, 180 72, 192 72", trait: true },
      { d: "M72 84 C66 108, 76 118, 86 110 L88 86 Z" }, { d: "M118 84 C114 108, 124 118, 134 110 L134 84 Z" },
      { d: "M52 40 C60 18, 76 16, 82 24 C72 30, 66 36, 62 46 Z" },
      { d: "M60 50 C76 38, 92 40, 96 48 C86 50, 76 56, 66 60 Z" },
      { d: "M58 84 C72 100, 88 100, 92 94 C82 90, 72 84, 66 78 Z" },
      { d: "M50 74 C50 54, 140 54, 150 74 C150 94, 50 98, 50 74 Z" },
      { d: rond(40, 66, 30) },
      ...oeil(28, 58, 7),
      { d: "M14 76 Q28 86 42 78", trait: true },
      { d: rond(100, 66, 5) }, { d: rond(118, 78, 4) }, { d: rond(84, 82, 4) },
    ],
  },
  {
    id: "feuillon", groupe: "monstres", titre: "Feuillon", type: "plante", sujet: "pokemon", nom: "Feuillon", phrase: "Attaque Tempête de Feuilles ! Fiou !",
    formes: [
      ...[-165, -140, -115, -90, -65, -40, -15].map((a) => {
        const r = (a * Math.PI) / 180, c = Math.cos(r), si = Math.sin(r);
        return { d: feuilleArbre(104 + 34 * c, 92 + 28 * si, 104 + 84 * c, 92 + 70 * si, 12) };
      }),
      { d: "M62 112 L60 130 L78 130 L80 114 Z" }, { d: "M126 114 L126 130 L144 130 L144 112 Z" },
      { d: "M40 92 C40 52, 166 44, 168 92 C168 114, 152 120, 132 120 L70 120 C50 120, 40 110, 40 92 Z" },
      { d: "M42 88 C30 84, 16 88, 8 98 C14 108, 32 110, 46 104 Z" },
      { d: rond(9, 97, 5), plein: true },
      ...oeil(40, 82, 6),
      { d: "M20 106 Q28 110 36 106", trait: true },
      { d: "M90 96 Q104 104 118 96", trait: true },
    ],
  },
  {
    id: "volteo", groupe: "monstres", titre: "Voltéo", type: "electrique", sujet: "pokemon", nom: "Voltéo", phrase: "Attaque Éclair Zigzag ! Bzzzt !",
    formes: [
      { d: "M144 70 L178 54 L168 72 L198 66 L166 94 L172 80 L144 88 Z" },
      { d: "M80 120 L76 136 M76 136 L66 139 M76 136 L84 139 M112 120 L112 136 M112 136 L102 139 M112 136 L120 139", trait: true },
      { d: "M88 36 L78 8 L96 22 L104 0 L114 32 Z" },
      { d: rond(100, 80, 48) },
      { d: "M108 80 C128 64, 150 72, 148 92 C134 102, 116 98, 108 80 Z" },
      { d: "M118 84 L126 78 L130 88 L140 82", trait: true },
      { d: "M56 72 L34 80 L56 88 Z" },
      ...oeil(72, 64, 8),
      { d: rond(80, 94, 7) },
      { d: "M70 112 L80 104 L90 114 L100 104 L110 114 L120 104", trait: true },
    ],
  },
  {
    id: "givrou", groupe: "monstres", titre: "Givrou", type: "glace", sujet: "pokemon", nom: "Givrou", phrase: "Attaque Souffle Glacé ! Brrr !",
    formes: [
      { d: "M80 44 L84 14 L100 42 Z" }, { d: "M100 40 L112 4 L124 42 Z" }, { d: "M124 46 L144 16 L148 54 Z" },
      { d: "M112 12 L112 36 M86 22 L90 38 M140 26 L142 44", trait: true },
      { d: "M68 104 L66 130 L84 130 L86 106 Z" }, { d: "M124 106 L124 130 L142 130 L142 104 Z" },
      { d: "M50 86 C46 54, 142 40, 162 80 C170 104, 152 116, 132 116 L76 116 C58 114, 50 102, 50 86 Z" },
      { d: rond(24, 40, 9) }, { d: rond(56, 36, 9) },
      { d: rond(42, 64, 28) },
      { d: "M12 74 C12 62, 34 62, 34 74 C34 86, 12 86, 12 74 Z" },
      { d: rond(15, 71, 4), plein: true },
      ...oeil(40, 56, 6),
      { d: "M108 74 L108 100 M95 87 L121 87 M99 78 L117 96 M117 78 L99 96", trait: true },
    ],
  },
  {
    id: "fantomou", groupe: "monstres", titre: "Fantomou", type: "fantome", sujet: "pokemon", nom: "Fantomou", phrase: "Attaque Bouh Mystère ! Hou hou !",
    formes: [
      { d: "M30 70 C30 20, 130 10, 150 50 C160 70, 176 88, 196 94 C180 104, 164 104, 150 98 C140 120, 130 110, 122 124 C112 110, 104 126, 94 116 C84 128, 74 114, 64 124 C56 112, 40 116, 36 104 C32 96, 30 84, 30 70 Z" },
      { d: "M56 86 C42 92, 30 102, 24 112 C40 110, 54 102, 62 94 Z" },
      ...oeil(58, 50, 10), ...oeil(88, 48, 10),
      { d: "M62 72 Q74 92 86 72 Z", plein: true },
      { d: "M112 62 C122 52, 134 60, 128 70 C122 78, 110 72, 116 64", trait: true },
    ],
  },
  {
    id: "drakeo", groupe: "monstres", titre: "Drakéo", type: "dragon", sujet: "pokemon", nom: "Drakéo", phrase: "Attaque Rugissement du Dragon ! Grrraou !",
    formes: [
      { d: "M100 58 C100 30, 120 16, 138 18 C128 30, 140 36, 128 44 C138 50, 128 60, 112 62 Z" },
      { d: "M140 92 C160 92, 176 84, 188 70 L198 76 L190 92 L182 86 C170 102, 156 108, 140 108 Z" },
      { d: "M74 104 L72 130 L90 130 L92 106 Z" }, { d: "M120 104 L120 130 L138 130 L138 104 Z" },
      { d: "M56 90 C52 60, 132 52, 148 86 C154 106, 140 114, 122 114 L80 114 C64 112, 58 102, 56 90 Z" },
      { d: "M70 98 C90 104, 110 104, 130 98 M68 88 C90 94, 112 94, 134 88", trait: true },
      { d: "M44 20 L54 0 L62 24 Z" }, { d: "M28 20 L28 4 L40 20 Z" },
      { d: "M8 52 C8 26, 40 14, 64 22 C86 30, 88 60, 72 74 C56 86, 20 84, 8 70 Z" },
      ...oeil(40, 44, 8),
      { d: rond(14, 52, 2.5), plein: true },
      { d: "M14 64 Q28 72 40 66", trait: true },
      { d: "M24 67 L27 72 L30 68", trait: true },
    ],
  },
  {
    id: "rocaille", groupe: "monstres", titre: "Rocaille", type: "roche", sujet: "pokemon", nom: "Rocaille", phrase: "Attaque Avalanche de Cailloux ! Boum !",
    formes: [
      { d: "M38 80 L10 70 L4 90 L30 98 Z" }, { d: "M166 80 L192 74 L196 96 L168 100 Z" },
      { d: "M60 118 L56 134 L84 134 L84 120 Z" }, { d: "M118 120 L118 134 L146 134 L142 118 Z" },
      { d: "M86 24 L96 8 L110 26 Z" },
      { d: "M40 120 L30 80 L50 40 L90 22 L140 30 L168 64 L170 104 L150 124 Z" },
      { d: "M120 40 L128 58 L122 70 M150 70 L142 86 L150 98 M100 104 L110 114", trait: true },
      ...oeil(66, 62, 7), ...oeil(94, 60, 7),
      { d: "M56 50 L74 54 M104 48 L86 53", trait: true },
      { d: "M66 84 Q80 92 94 84", trait: true },
    ],
  },
  {
    id: "plumio", groupe: "monstres", titre: "Plumio", type: "vol", sujet: "pokemon", nom: "Plumio", phrase: "Attaque Tornade de Plumes ! Fwouuu !",
    formes: [
      { d: "M150 76 L196 62 L188 78 L198 90 L150 90 Z" },
      { d: "M84 108 L80 126 M80 126 L72 130 M80 126 L86 132 M110 108 L110 126 M110 126 L102 130 M110 126 L116 132", trait: true },
      { d: "M44 80 C44 54, 120 50, 156 80 C150 104, 60 112, 44 80 Z" },
      { d: "M80 62 C80 22, 120 2, 160 8 C146 20, 150 32, 140 40 C150 46, 142 58, 120 64 Z" },
      { d: "M96 56 C104 38, 120 26, 140 20 M104 60 C116 48, 128 42, 140 40", trait: true },
      { d: "M28 46 L20 24 L40 40 Z" }, { d: "M48 40 L54 20 L60 42 Z" },
      { d: rond(40, 66, 24) },
      { d: rond(32, 62, 11) },
      ...oeil(32, 62, 7),
      { d: "M18 68 L4 74 L18 78 Z" },
    ],
  },
  {
    id: "psylou", groupe: "monstres", titre: "Psylou", type: "psy", sujet: "pokemon", nom: "Psylou", phrase: "Attaque Ondes Magiques ! Wouiii !",
    formes: [
      { d: "M140 80 C168 78, 184 62, 182 46 C180 34, 166 30, 160 38 C170 40, 172 50, 168 58 C160 70, 150 74, 140 74 Z" },
      { d: rond(160, 34, 8) },
      { d: rond(80, 112, 9) }, { d: rond(120, 112, 9) },
      { d: "M60 84 C58 64, 130 58, 146 80 C152 98, 138 108, 118 108 L82 108 C66 106, 60 96, 60 84 Z" },
      { d: "M22 38 L12 6 L42 28 Z" }, { d: "M54 28 L66 0 L74 34 Z" },
      { d: rond(44, 60, 30) },
      { d: "M44 30 L51 40 L44 50 L37 40 Z" },
      ...oeil(32, 62, 9), ...oeil(58, 60, 9),
      { d: "M38 76 Q44 82 50 76", trait: true },
      { d: "M18 70 L2 66 M18 76 L2 80", trait: true },
    ],
  },
  {
    id: "lapaillette", groupe: "monstres", titre: "Lapaillette", type: "fee", sujet: "pokemon", nom: "Lapaillette", phrase: "Attaque Poussière d'Étoiles ! Pling !",
    formes: [
      { d: "M90 62 C70 22, 110 0, 132 20 C142 32, 122 52, 96 66 Z" },
      { d: "M98 72 C112 52, 142 52, 148 68 C152 82, 126 86, 100 78 Z" },
      { d: rond(112, 30, 6) }, { d: rond(130, 70, 5) },
      { d: "M150 82 L156 70 L160 82 L172 84 L162 90 L166 102 L156 94 L146 100 L150 90 L140 84 Z" },
      { d: "M70 110 C60 112, 58 124, 74 126 L96 126 C100 118, 92 110, 82 108 Z" },
      { d: "M124 108 C114 110, 110 124, 128 126 L150 126 C154 116, 144 106, 134 106 Z" },
      { d: "M58 86 C56 60, 140 58, 152 86 C156 106, 142 116, 120 116 L84 116 C66 114, 58 102, 58 86 Z" },
      { d: "M30 40 C22 18, 24 2, 34 2 C44 4, 46 20, 44 42 Z" },
      { d: "M46 42 C46 22, 56 6, 66 10 C74 14, 66 30, 58 46 Z" },
      { d: rond(42, 64, 24) },
      ...oeil(32, 60, 6),
      { d: rond(20, 70, 4), plein: true },
      { d: "M20 76 Q26 82 32 77", trait: true },
    ],
  },
  {
    id: "sablox", groupe: "monstres", titre: "Sablox", type: "sol", sujet: "pokemon", nom: "Sablox", phrase: "Attaque Tremblement Tout Doux ! Brrroum !",
    formes: [
      { d: "M150 92 L196 104 L150 108 Z" },
      { d: "M64 94 L62 120 L78 120 L80 96 Z" }, { d: "M130 96 L130 120 L146 120 L146 94 Z" },
      { d: "M48 98 C48 48, 152 42, 160 98 Z" },
      { d: "M72 98 C72 66, 80 54, 90 50 M96 98 C96 62, 100 50, 106 48 M120 98 C122 64, 124 52, 128 50 M142 98 C144 72, 142 60, 148 58", trait: true },
      { d: "M44 72 L48 56 L58 74 Z" },
      { d: "M56 84 C42 70, 20 70, 6 84 C12 96, 30 100, 56 98 Z" },
      ...oeil(32, 82, 5),
      { d: rond(7, 85, 4), plein: true },
    ],
  },
];


// ---------- Évolutions des monstres de poche ----------
// Chaque évolution garde le corps du monstre et gagne des éléments de son type :
// derriere = dessiné avant le corps, devant = après. Tout touche le corps (sinon la photo
// découpée le perdrait).
const EVOLUTIONS = {
  pyroto: [
    { id: "pyrenard", titre: "Pyrenard", phrase: "Attaque Crocs de Feu ! Grrr, fshhh !",
      derriere: [
        { d: "M146 94 C172 96, 196 80, 194 54 C204 72, 204 98, 186 112 C174 120, 158 116, 146 106 Z" },
        { d: "M56 76 C58 56, 72 50, 74 38 C82 50, 84 58, 92 58 C94 48, 102 44, 106 36 C112 52, 106 62, 110 72 Z" },
      ],
      devant: [{ d: "M102 62 C100 48, 106 42, 112 30 C116 44, 124 48, 126 60 Z" }, { d: "M22 36 L42 40", trait: true }] },
    { id: "pyroloup", titre: "Pyroloup", phrase: "Attaque Tornade de Flammes ! Fwooosh !",
      derriere: [
        { d: "M150 70 C150 40, 166 20, 160 -6 C178 12, 186 40, 172 70 Z" },
        { d: "M146 94 C172 96, 196 80, 194 54 C204 72, 204 98, 186 112 C174 120, 158 116, 146 106 Z" },
        { d: "M56 76 C58 56, 72 50, 74 38 C82 50, 84 58, 92 58 C94 48, 102 44, 106 36 C112 52, 106 62, 110 72 Z" },
        { d: "M30 28 C28 10, 38 4, 42 -10 C48 6, 56 8, 58 24 Z" },
      ],
      devant: [
        { d: "M102 62 C100 48, 106 42, 112 30 C116 44, 124 48, 126 60 Z" },
        { d: "M62 132 C58 122, 64 118, 66 108 C70 118, 78 118, 84 128 Z" },
        { d: "M114 132 C110 122, 116 118, 118 108 C122 118, 130 118, 136 128 Z" },
        { d: "M84 76 L92 84 L98 76 L106 84 M116 74 L122 82 L128 74", trait: true },
        { d: "M22 36 L42 40", trait: true },
      ] },
  ],
  aquabulle: [
    { id: "aquaflot", titre: "Aquaflot", phrase: "Attaque Vague Géante ! Splash !",
      derriere: [
        { d: "M70 60 C80 36, 112 30, 140 58 Z" },
        { d: "M146 74 C168 46, 190 40, 200 44 C192 60, 192 86, 200 104 C190 106, 168 98, 146 80 Z" },
      ],
      devant: [{ d: "M30 42 C28 34, 36 26, 40 20 C44 28, 50 36, 46 42 C42 48, 34 48, 30 42 Z" }] },
    { id: "aquatitan", titre: "Aquatitan", phrase: "Attaque Hydro-Tempête ! Splaaash !",
      derriere: [
        { d: "M60 62 C68 20, 118 6, 152 36 C140 40, 136 48, 134 60 Z" },
        { d: "M146 74 C168 46, 190 40, 200 44 C192 60, 192 86, 200 104 C190 106, 168 98, 146 80 Z" },
        { d: "M58 88 C46 108, 54 126, 70 130 C72 116, 78 104, 86 92 Z" },
      ],
      devant: [
        { d: "M18 48 L4 22 L28 40 Z" }, { d: "M48 40 L60 14 L62 46 Z" },
        { d: "M30 42 C28 34, 36 26, 40 20 C44 28, 50 36, 46 42 C42 48, 34 48, 30 42 Z" },
        { d: "M88 60 C100 72, 120 72, 132 60", trait: true },
      ] },
  ],
  feuillon: [
    { id: "buissonnet", titre: "Buissonnet", phrase: "Attaque Pluie de Pétales ! Fiou fiou !",
      derriere: [], devant: [...fleur(104, 46, 16)] },
    { id: "forestor", titre: "Forestor", phrase: "Attaque Forêt Géante ! Crrrac !",
      derriere: [-150, -120, -90, -60, -30].map((a) => {
        const r = (a * Math.PI) / 180, c = Math.cos(r), si = Math.sin(r);
        return { d: feuilleArbre(104 + 30 * c, 92 + 26 * si, 104 + 100 * c, 92 + 92 * si, 16) };
      }),
      devant: [...fleur(104, 46, 16), ...fleur(76, 56, 11), ...fleur(132, 54, 11), { d: "M38 84 L30 62 L22 54 M30 62 L38 50", trait: true }] },
  ],
  volteo: [
    { id: "electroc", titre: "Électroc", phrase: "Attaque Tonnerre Zigzag ! Bzzzt !",
      derriere: [
        { d: "M112 52 L132 12 L142 32 L162 2 L158 42 L178 32 L150 72 Z" },
        { d: "M82 40 L68 6 L90 20 L98 -10 L112 22 L126 0 L120 40 Z" },
      ],
      devant: [{ d: "M90 88 L98 82 L96 92 L106 86", trait: true }] },
    { id: "fulguraigle", titre: "Fulguraigle", phrase: "Attaque Éclair Royal ! Krakooom !",
      derriere: [
        { d: "M112 52 L132 12 L142 32 L162 2 L158 42 L178 32 L150 72 Z" },
        { d: "M82 40 L68 6 L90 20 L98 -10 L112 22 L126 0 L120 40 Z" },
        { d: "M120 108 L150 130 L148 116 L176 128 L160 100 L176 104 L140 88 Z" },
        { d: "M142 76 L186 52 L174 72 L200 70 L170 96 L178 84 L142 92 Z" },
      ],
      devant: [{ d: "M56 70 L30 70 C24 76, 28 86, 36 86 L56 90 Z" }, { d: "M60 54 L84 58", trait: true }, { d: "M90 88 L98 82 L96 92 L106 86", trait: true }] },
  ],
  givrou: [
    { id: "givrours", titre: "Givrours", phrase: "Attaque Blizzard ! Brrrrr !",
      derriere: [{ d: "M146 54 L170 26 L166 66 Z" }],
      devant: [{ d: "M28 42 L30 20 L40 38 Z" }, { d: "M42 38 L48 14 L56 38 Z" }] },
    { id: "glaciator", titre: "Glaciator", phrase: "Attaque Ère Glaciaire ! Crrrac !",
      derriere: [
        { d: "M68 58 L88 24 L112 18 L142 30 L164 58 L162 80 Z" },
        { d: "M150 52 L182 8 L176 64 Z" }, { d: "M96 22 L104 -12 L118 20 Z" },
      ],
      devant: [{ d: "M28 42 L30 20 L40 38 Z" }, { d: "M42 38 L48 14 L56 38 Z" }, { d: "M16 82 L18 98 L24 84 Z" }] },
  ],
  fantomou: [
    { id: "fantomasque", titre: "Fantomasque", phrase: "Attaque Ombre Farceuse ! Hihihi !",
      derriere: [{ d: "M146 48 C168 28, 190 28, 198 38 C186 44, 176 50, 166 62 Z" }],
      devant: [{ d: "M56 36 C64 12, 96 2, 110 28 Z" }, { d: "M62 30 C78 22, 94 20, 106 24", trait: true }] },
    { id: "spectroi", titre: "Spectroi", phrase: "Attaque Cauchemar Royal ! Hou hou hou !",
      derriere: [
        { d: "M22 84 C8 40, 40 2, 100 4 C150 6, 172 40, 178 72 C160 60, 140 70, 120 60 Z" },
        { d: "M146 48 C168 28, 190 28, 198 38 C186 44, 176 50, 166 62 Z" },
      ],
      devant: [{ d: "M54 26 L56 -4 L68 12 L80 -10 L92 12 L104 -4 L108 22 Z" }, { d: rond(80, 12, 3) }] },
  ],
  drakeo: [
    { id: "drakeon", titre: "Drakéon", phrase: "Attaque Souffle de Dragon ! Rooooar !",
      derriere: [
        { d: "M96 60 C90 12, 130 -8, 168 0 C154 14, 166 26, 150 34 C164 40, 154 54, 130 60 Z" },
        { d: "M104 58 L112 40 L120 56 Z" }, { d: "M124 60 L134 44 L140 62 Z" }, { d: "M140 70 L154 58 L154 78 Z" },
      ],
      devant: [{ d: "M42 22 L52 -6 L62 24 Z" }] },
    { id: "dragorion", titre: "Dragorion", phrase: "Attaque Météore Draconique ! Braoum !",
      derriere: [
        { d: "M84 62 C64 20, 80 -8, 104 -12 C100 4, 110 14, 100 22 C112 28, 104 40, 96 48 Z" },
        { d: "M96 60 C90 12, 130 -8, 168 0 C154 14, 166 26, 150 34 C164 40, 154 54, 130 60 Z" },
        { d: "M104 58 L112 40 L120 56 Z" }, { d: "M124 60 L134 44 L140 62 Z" }, { d: "M140 70 L154 58 L154 78 Z" },
        { d: "M180 66 L200 56 L196 86 Z" },
      ],
      devant: [{ d: "M40 24 C34 2, 46 -12, 62 -14 C54 -2, 54 10, 58 26 Z" }] },
  ],
  rocaille: [
    { id: "rocaillou", titre: "Rocaillou", phrase: "Attaque Poing de Pierre ! Boum !",
      derriere: [{ d: "M58 46 L62 20 L76 40 Z" }, { d: "M116 30 L130 4 L138 34 Z" }],
      devant: [{ d: rond(12, 84, 14) }, { d: rond(188, 86, 14) }] },
    { id: "montagnor", titre: "Montagnor", phrase: "Attaque Séisme Géant ! Badaboum !",
      derriere: [
        { d: "M56 44 L100 -10 L146 32 Z" },
        { d: "M86 8 L100 -10 L114 8 L106 4 L100 10 L94 4 Z" },
        { d: "M58 46 L62 20 L76 40 Z" }, { d: "M116 30 L130 4 L138 34 Z" },
      ],
      devant: [{ d: rond(12, 84, 16) }, { d: rond(188, 86, 16) }, { d: "M54 48 L76 54 M106 46 L84 52", trait: true }] },
  ],
  plumio: [
    { id: "plumaigle", titre: "Plumaigle", phrase: "Attaque Rafale Plumée ! Fwiiiou !",
      derriere: [{ d: "M92 84 C112 112, 150 122, 178 114 C162 106, 160 98, 150 92 Z" }],
      devant: [{ d: "M30 46 L22 20 L36 34 L40 12 L48 40 Z" }] },
    { id: "cyclonaile", titre: "Cyclonaile", phrase: "Attaque Cyclone Céleste ! Fwouuum !",
      derriere: [
        { d: "M76 64 C70 10, 120 -12, 176 -6 C160 8, 168 22, 154 30 C168 36, 160 50, 140 56 C150 60, 140 70, 120 68 Z" },
        { d: "M92 84 C112 112, 150 122, 178 114 C162 106, 160 98, 150 92 Z" },
        { d: "M146 78 L200 50 L192 70 L200 82 L192 96 L200 112 L146 96 Z" },
      ],
      devant: [{ d: "M30 46 L22 20 L36 34 L40 12 L48 40 Z" }] },
  ],
  psylou: [
    { id: "psymiou", titre: "Psymiou", phrase: "Attaque Psy-Rayon ! Wouiii !",
      derriere: [{ d: "M140 92 C168 98, 188 110, 196 126 C184 122, 172 118, 160 116 C152 110, 146 104, 140 100 Z" }],
      devant: [{ d: "M44 26 L53 38 L44 50 L35 38 Z" }] },
    { id: "psymagus", titre: "Psymagus", phrase: "Attaque Tempête Mentale ! Wouiiiii !",
      derriere: [
        { d: "M64 72 C46 100, 52 126, 62 136 L148 136 C138 120, 148 100, 140 76 Z" },
        { d: "M140 92 C168 98, 188 110, 196 126 C184 122, 172 118, 160 116 C152 110, 146 104, 140 100 Z" },
      ],
      devant: [
        { d: "M26 40 L50 -14 L74 36 Z" }, { d: "M16 40 C30 32, 62 30, 82 38 C62 46, 30 48, 16 40 Z" }, { d: rond(50, 10, 4) },
      ] },
  ],
  lapaillette: [
    { id: "lapetoile", titre: "Lapétoile", phrase: "Attaque Arc-en-ciel Magique ! Pling pling !",
      derriere: [{ d: "M96 80 C110 100, 150 110, 166 92 C170 80, 150 70, 120 74 Z" }],
      devant: [...fleur(48, 40, 9)] },
    { id: "lunalapin", titre: "Lunalapin", phrase: "Attaque Lumière de Lune ! Pliiiing !",
      derriere: [
        { d: "M86 62 C60 10, 112 -14, 146 8 C160 22, 136 48, 96 66 Z" },
        { d: "M96 80 C110 100, 150 110, 166 92 C170 80, 150 70, 120 74 Z" },
      ],
      devant: [...fleur(48, 40, 9), { d: "M36 46 C28 50, 30 60, 40 62 C34 58, 34 50, 40 48 Z" }] },
  ],
  sablox: [
    { id: "sablopic", titre: "Sablopic", phrase: "Attaque Tempête de Sable ! Fsshhh !",
      derriere: [{ d: "M66 58 L70 40 L80 54 Z" }, { d: "M92 48 L98 30 L106 46 Z" }, { d: "M120 48 L128 30 L134 48 Z" }, { d: "M144 60 L154 44 L156 64 Z" }],
      devant: [{ d: "M60 116 L54 128 L62 124 L64 130 L72 122 L74 116 Z" }] },
    { id: "foreusor", titre: "Foreusor", phrase: "Attaque Foreuse Géante ! Vrrrrr !",
      derriere: [
        { d: "M64 60 L68 34 L82 54 Z" }, { d: "M90 50 L98 22 L108 48 Z" }, { d: "M118 50 L128 22 L136 50 Z" }, { d: "M142 62 L158 38 L158 66 Z" },
        { d: rond(194, 106, 10) },
      ],
      devant: [
        { d: "M60 116 L54 128 L62 124 L64 130 L72 122 L74 116 Z" },
        { d: "M24 76 L36 42 L48 76 Z" }, { d: "M28 68 L44 62 M31 60 L41 56 M33 52 L39 50", trait: true },
      ] },
  ],
};

// Le catalogue : chaque monstre de poche suivi de ses deux évolutions.
export const FEUILLES = BASES.flatMap((f) => {
  if (f.groupe !== "monstres") return [f];
  return [
    { ...f, famille: f.id, stade: 1 },
    ...(EVOLUTIONS[f.id] || []).map((e, i) => ({
      id: e.id, groupe: "monstres", titre: e.titre, type: f.type, sujet: "pokemon", nom: e.titre, phrase: e.phrase,
      famille: f.id, stade: i + 2, formes: [...e.derriere, ...f.formes, ...e.devant],
    })),
  ];
});

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
export const GROUPES = [
  ["monstres", "Monstres de poche"], ["mer", "Dans la mer"], ["animaux", "Animaux"], ["autres", "Et aussi"],
];

export function feuilleSVG(f) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 297" width="210mm" height="297mm">` +
    `<rect width="210" height="297" fill="#fff"/>` +
    `<text x="105" y="36" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="16">${echapper(f.titre)}</text>` +
    (f.type ? `<text x="105" y="58" text-anchor="middle" font-family="Arial, sans-serif" font-size="6" font-weight="bold">Type ${echapper(nomDuType(f.type))}${f.stade ? ` · Évolution ${f.stade} sur 3` : ""}</text>` : "") +
    `<text x="105" y="48" text-anchor="middle" font-family="Arial, sans-serif" font-size="5">Colorie-moi, puis prends-moi en photo dans « Mon dessin animé » !</text>` +
    `<g transform="translate(8 82) scale(0.97)">${dessinSVG(f.formes)}</g>` +
    `<text x="105" y="282" text-anchor="middle" font-family="Arial, sans-serif" font-size="3.5" fill="#888">Mon dessin animé · ${echapper(f.titre)}</text>` +
    `</svg>`;
}

// Petite image du personnage seul (pour le catalogue à l'écran).
export function vignetteSVG(f) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -18 212 160">${dessinSVG(f.formes)}</svg>`;
}

export function urlImage(svg) {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
