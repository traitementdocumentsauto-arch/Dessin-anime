// Types des monstres de poche : nom affiché, petit symbole, et bruitage de leur attaque.
export const TYPES = [
  { id: "feu", nom: "Feu", emoji: "🔥", attaque: "Flamme Géante" },
  { id: "eau", nom: "Eau", emoji: "💧", attaque: "Jet d'Eau" },
  { id: "plante", nom: "Plante", emoji: "🌿", attaque: "Tempête de Feuilles" },
  { id: "electrique", nom: "Électrique", emoji: "⚡", attaque: "Éclair Zigzag" },
  { id: "glace", nom: "Glace", emoji: "❄️", attaque: "Souffle Glacé" },
  { id: "fantome", nom: "Fantôme", emoji: "👻", attaque: "Ombre Mystère" },
  { id: "dragon", nom: "Dragon", emoji: "🐲", attaque: "Souffle du Dragon" },
  { id: "roche", nom: "Roche", emoji: "🪨", attaque: "Pluie de Cailloux" },
  { id: "vol", nom: "Vol", emoji: "🪶", attaque: "Tornade" },
  { id: "psy", nom: "Psy", emoji: "🔮", attaque: "Ondes Magiques" },
  { id: "fee", nom: "Fée", emoji: "✨", attaque: "Poussière d'Étoiles" },
  { id: "sol", nom: "Sol", emoji: "⛰️", attaque: "Tremblement de Terre" },
];

export const nomDuType = (id) => (TYPES.find((t) => t.id === id) || {}).nom || "";

export const typeParId = (id) => TYPES.find((t) => t.id === id) || null;
