// Ce que dit le dessin : il se présente, parle de ses couleurs, de ce qu'il est
// (raie, dinosaure, fusée…) et du film où il se trouve.

// {e} = « e » au féminin, {beau} = beau / belle, {prenom}, {nom}, {Nom}.
export const SUJETS = [
  { id: "poisson", emoji: "🐟", nom: "le poisson", f: false, phrases: ["Regarde mes jolies nageoires !", "Je fais des bulles : blub, blub, blub !", "Je nage très, très vite !"] },
  { id: "raie", emoji: "🌊", nom: "la raie", f: true, phrases: ["Regarde mes grandes ailes de raie !", "Je glisse comme un tapis volant !", "Mes taches, c'est pour me cacher dans le sable !"] },
  { id: "requin", emoji: "🦈", nom: "le requin", f: false, phrases: ["Je suis un requin, mais je suis gentil !", "Regarde mes dents : je les brosse tous les jours !", "Je suis le roi de la mer !"] },
  { id: "dauphin", emoji: "🐬", nom: "le dauphin", f: false, phrases: ["Je fais des sauts et des pirouettes !", "Hi hi hi ! C'est comme ça que je parle !", "J'adore jouer avec les vagues !"] },
  { id: "baleine", emoji: "🐳", nom: "la baleine", f: true, phrases: ["Je suis la plus grande de la mer !", "Pschhh ! Regarde mon jet d'eau !", "Je chante des chansons très, très graves !"] },
  { id: "pieuvre", emoji: "🐙", nom: "la pieuvre", f: true, phrases: ["J'ai huit bras pour te faire un câlin !", "Je peux changer de couleur !", "Psst ! Je crache de l'encre pour me cacher !"] },
  { id: "tortue", emoji: "🐢", nom: "la tortue", f: true, phrases: ["Je suis lente, mais j'arrive toujours au bout !", "Ma maison, c'est ma carapace !", "J'ai plus de cent ans… ou presque !"] },
  { id: "chat", emoji: "🐱", nom: "le chat", f: false, phrases: ["Miaou ! Tu me fais une caresse ?", "Je retombe toujours sur mes pattes !", "Ronron, ronron… je suis content{e} !"] },
  { id: "chien", emoji: "🐶", nom: "le chien", f: false, phrases: ["Ouaf ouaf ! On joue à la balle ?", "Je remue la queue parce que je suis content{e} !", "Je suis ton meilleur ami !"] },
  { id: "lapin", emoji: "🐰", nom: "le lapin", f: false, phrases: ["J'adore les carottes !", "Regarde mes grandes oreilles !", "Je saute comme un champion !"] },
  { id: "dinosaure", emoji: "🦖", nom: "le dinosaure", f: false, phrases: ["Grrraou ! Je suis un dinosaure !", "Je suis plus vieux que tes grands-parents !", "Mes pas font boum, boum, boum !"] },
  { id: "dragon", emoji: "🐉", nom: "le dragon", f: false, phrases: ["Je crache du feu… pour griller des guimauves !", "Regarde mes ailes de dragon !", "Je garde un trésor tout brillant !"] },
  { id: "oiseau", emoji: "🐦", nom: "l'oiseau", f: false, phrases: ["Cui cui ! Je chante pour toi !", "Mes plumes sont toutes douces !", "Je fais mon nid tout là-haut !"] },
  { id: "papillon", emoji: "🦋", nom: "le papillon", f: false, phrases: ["Je vais butiner les fleurs !", "Avant, j'étais une petite chenille !", "Mes ailes sont comme des vitraux !"] },
  { id: "licorne", emoji: "🦄", nom: "la licorne", f: true, phrases: ["Ma corne est magique !", "Je mange des arcs-en-ciel au petit déjeuner !", "Je fais des paillettes partout !"] },
  { id: "pokemon", emoji: "⚡", nom: "le Pokémon", f: false, phrases: ["Je suis prêt pour le combat !", "Attaque éclair ! Zzzzap !", "Bientôt, je vais évoluer !"] },
  { id: "voiture", emoji: "🚗", nom: "la voiture", f: true, phrases: ["Vroum vroum ! Attention, j'arrive !", "Bip bip ! Faites place !", "Je suis la plus rapide !"] },
  { id: "fusee", emoji: "🚀", nom: "la fusée", f: true, phrases: ["Trois, deux, un… décollage !", "Je vais jusqu'à la Lune !", "Mon moteur fait un bruit de tonnerre !"] },
  { id: "robot", emoji: "🤖", nom: "le robot", f: false, phrases: ["Bip bip. Je suis un robot. Bip.", "Mes circuits sont tout contents !", "Je range ta chambre en une seconde !"] },
  { id: "monstre", emoji: "👾", nom: "le monstre", f: false, phrases: ["Bouh ! … Je t'ai fait peur ?", "Je suis un gentil monstre !", "J'adore les câlins de monstre !"] },
  { id: "personnage", emoji: "🙂", nom: "le bonhomme", f: false, phrases: ["Coucou, c'est moi !", "Tu as vu comme je suis bien dessiné{e} ?", "On est copains, toi et moi ?"] },
  { id: "autre", emoji: "✨", nom: "ton dessin", f: false, phrases: ["Tu as vu comme je suis {beau} ?", "Merci de m'avoir dessiné{e} !", "Je suis unique au monde !"] },
];

const PHRASES_FILM = {
  mer: "Au fond de la mer, c'est la belle vie !",
  espace: "{Nom} dans l'espace ! C'est une grande première !",
  ciel: "Regarde, {prenom}, je vole au-dessus des nuages !",
  jungle: "Dans la jungle, je saute plus haut que les singes !",
  neige: "Brrr, il fait froid… mais qu'est-ce que ça glisse !",
  fete: "Tout le monde danse avec {nom} !",
  chateau: "Abracadabra ! {Nom} est magique !",
  volcan: "Le volcan crache du feu… même pas peur !",
};

// ---------- Couleurs du dessin ----------

const COULEURS = [
  { nom: "rouge", f: "rouge", h: [345, 15] },
  { nom: "orange", f: "orange", h: [15, 40] },
  { nom: "jaune", f: "jaune", h: [40, 70] },
  { nom: "vert", f: "verte", h: [70, 165] },
  { nom: "bleu", f: "bleue", h: [165, 255] },
  { nom: "violet", f: "violette", h: [255, 290] },
  { nom: "rose", f: "rose", h: [290, 345] },
];

// Couleur principale (et une seconde si elle est bien présente) des pixels du dessin.
export function couleursDuDessin(sprite) {
  const r = Math.min(1, 160 / Math.max(sprite.width, sprite.height));
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(sprite.width * r));
  c.height = Math.max(1, Math.round(sprite.height * r));
  const g = c.getContext("2d", { willReadFrequently: true });
  g.drawImage(sprite, 0, 0, c.width, c.height);
  const d = g.getImageData(0, 0, c.width, c.height).data;
  const compte = new Array(COULEURS.length).fill(0);
  let opaques = 0, colores = 0, sombres = 0;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] < 128) continue;
    opaques++;
    const R = d[i] / 255, G = d[i + 1] / 255, B = d[i + 2] / 255;
    const max = Math.max(R, G, B), min = Math.min(R, G, B), s = max ? (max - min) / max : 0;
    if (max < 0.25) { sombres++; continue; }
    if (s < 0.25) continue;
    colores++;
    let h;
    if (max === R) h = 60 * (((G - B) / (max - min)) % 6);
    else if (max === G) h = 60 * ((B - R) / (max - min) + 2);
    else h = 60 * ((R - G) / (max - min) + 4);
    if (h < 0) h += 360;
    const k = COULEURS.findIndex(({ h: [a, b] }) => (a < b ? h >= a && h < b : h >= a || h < b));
    compte[k]++;
  }
  if (!opaques) return [];
  if (colores < opaques * 0.15) return [sombres > opaques * 0.4 ? { nom: "noir", f: "noire" } : { nom: "gris", f: "grise" }];
  const tri = compte.map((n, k) => [n, k]).sort((a, b) => b[0] - a[0]);
  const res = [COULEURS[tri[0][1]]];
  // Seconde couleur : même quelques petites taches comptent (« un peu de vert »).
  if (tri[1][0] > colores * 0.005) res.push({ ...COULEURS[tri[1][1]], peu: tri[1][0] < colores * 0.07 });
  return res;
}

// ---------- Texte ----------

// « la raie tachetée » -> féminin ; un nom sans article garde le genre du sujet.
export function genreDuNom(nom, sujet) {
  const n = nom.trim().toLowerCase();
  if (/^(la|une|ma) /.test(n)) return true;
  if (/^(le|un|mon) /.test(n)) return false;
  return sujet.f;
}

function remplir(texte, v) {
  return texte
    .replaceAll("{e}", v.f ? "e" : "")
    .replaceAll("{beau}", v.f ? "belle" : "beau")
    .replaceAll("{prenom}", v.prenom)
    .replaceAll("{Nom}", v.nom.charAt(0).toUpperCase() + v.nom.slice(1))
    .replaceAll("{nom}", v.nom);
}

function hasard(liste) { return liste[Math.floor(Math.random() * liste.length)]; }

// Les répliques du film, avec l'instant où elles commencent et leur durée à l'écran.
export function repliques({ sujet, nom, phrasePerso, couleurs, scene, prenom }) {
  sujet = sujet || SUJETS[SUJETS.length - 1];
  nom = (nom || "").trim() || sujet.nom;
  const v = { f: genreDuNom(nom, sujet), prenom, nom };
  const lignes = [{ t: 4.6, duree: 2.4, texte: remplir("Bonjour {prenom} ! Je suis {nom} !", v) }];
  if (couleurs && couleurs.length) {
    const [a, b] = couleurs;
    let t = `Regarde, je suis tout{e} ${v.f ? a.f : a.nom}`;
    if (b) t += b.peu ? ` avec un peu de ${b.nom}` : ` avec du ${b.nom}`;
    lignes.push({ t: 7.3, duree: 2.2, texte: remplir(t + " !", v) });
  }
  lignes.push({ t: 10.2, duree: 2.6, texte: phrasePerso && phrasePerso.trim() ? phrasePerso.trim() : remplir(hasard(sujet.phrases), v) });
  lignes.push({ t: 15.6, duree: 2.2, texte: remplir(PHRASES_FILM[scene.id] || scene.phrase, v) });
  lignes.push({ t: 18, duree: 1.5, texte: remplir("Au revoir {prenom} !", v) });
  return lignes;
}
