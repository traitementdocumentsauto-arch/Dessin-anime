import { MER, PAGES, pageEnCanevas } from "./pages.js";
import { chargerPhoto, trouverReperes, orienter, redresser, tourner } from "./photo.js";
import { Film } from "./anim.js";
import { Sons } from "./sons.js";
import { SCENES } from "./scenes.js";
import { SUJETS, couleursDuDessin, repliques } from "./paroles.js";
import { Voix } from "./voix.js";
import * as galerie from "./galerie.js";
import { decouperDessin, tournerSprite, FilmLibre } from "./libre.js";

const $ = (id) => document.getElementById(id);
const etat = { photo: null, coins: null, page: null, modele: MER, film: null, sons: null, garde: false, sprite: null, scene: SCENES[0],
  infos: { sujet: null, nom: "", phrase: "" }, couleurs: null, voix: null };

function lirePrenom() {
  try { return localStorage.getItem("prenom") || ""; } catch { return ""; }
}
$("prenom").value = lirePrenom();
$("prenom").addEventListener("input", () => {
  try { localStorage.setItem("prenom", $("prenom").value.trim()); } catch { /* navigation privée */ }
});

function montrer(id) {
  if (id !== "film" && etat.film) { etat.film.arreter(); etat.film = null; }
  document.querySelectorAll(".ecran").forEach((e) => e.classList.toggle("actif", e.id === id));
}

function attente(oui) { $("attente").hidden = !oui; }

// Message affiché quelques secondes en bas de l'écran (les fenêtres alert() sont bloquées dans certains lecteurs).
let minuteurMessage;
function message(texte) {
  const m = $("message");
  m.textContent = texte;
  m.hidden = false;
  clearTimeout(minuteurMessage);
  minuteurMessage = setTimeout(() => { m.hidden = true; }, 4000);
}

// Le son ne peut démarrer qu'après un appui sur l'écran.
document.addEventListener("pointerdown", () => {
  if (!etat.sons) etat.sons = new Sons();
  etat.sons.reveiller();
}, { capture: true });

// ---------- Photo ----------

async function photoChoisie(fichier) {
  if (!fichier) return;
  attente(true);
  try {
    etat.photo = await chargerPhoto(fichier);
    etat.coins = trouverReperes(etat.photo);
    const trouve = !!etat.coins;
    if (trouve) etat.coins = orienter(etat.photo, etat.coins);
    else {
      const { width: w, height: h } = etat.photo;
      etat.coins = [[w * 0.15, h * 0.1], [w * 0.85, h * 0.1], [w * 0.85, h * 0.9], [w * 0.15, h * 0.9]];
    }
    $("consigne-reglage").textContent = trouve
      ? "J'ai trouvé ta page ! Les ronds sont bien sur les carrés noirs ?"
      : "Je n'ai pas trouvé les 4 carrés noirs. Pose chaque rond sur un carré.";
    montrer("reglage");
    dessinerReglage();
  } catch (e) {
    message("Je n'arrive pas à ouvrir cette photo. Essaie encore !");
  } finally {
    attente(false);
  }
}

$("photo").addEventListener("change", (e) => { photoChoisie(e.target.files[0]); e.target.value = ""; });

// ---------- N'importe quel dessin ----------

async function dessinChoisi(fichier) {
  if (!fichier) return;
  attente(true);
  try {
    const photo = await chargerPhoto(fichier);
    await new Promise((r) => setTimeout(r, 30));
    const sprite = decouperDessin(photo);
    if (!sprite) { message("Je ne vois pas de dessin sur cette photo. Essaie avec la feuille bien à plat !"); return; }
    // Une photo en hauteur d'un dessin en largeur : on le met d'emblée en largeur.
    etat.sprite = sprite.height > sprite.width * 1.15 ? tournerSprite(sprite) : sprite;
    reglerInfos({ sujet: null, nom: "", phrase: "" });
    montrer("apercu");
    dessinerApercu();
  } catch {
    message("Je n'arrive pas à ouvrir cette photo. Essaie encore !");
  } finally {
    attente(false);
  }
}

$("libre").addEventListener("change", (e) => { dessinChoisi(e.target.files[0]); e.target.value = ""; });
$("libre-galerie").addEventListener("change", (e) => { dessinChoisi(e.target.files[0]); e.target.value = ""; });

// ---------- Choix du film ----------

const listeFilms = $("liste-films");
for (const sc of SCENES) {
  const b = document.createElement("button");
  b.className = `film-choix film-${sc.id}`;
  b.dataset.action = "scene";
  b.dataset.scene = sc.id;
  const emoji = document.createElement("span");
  emoji.className = "film-emoji";
  emoji.textContent = sc.emoji;
  const nom = document.createElement("span");
  nom.textContent = sc.nom;
  b.append(emoji, nom);
  listeFilms.append(b);
}

// ---------- Ce que c'est (pour ses paroles) ----------

const listeSujets = $("sujets");
for (const sj of SUJETS) {
  const b = document.createElement("button");
  b.className = "sujet";
  b.dataset.action = "sujet";
  b.dataset.sujet = sj.id;
  b.setAttribute("aria-pressed", "false");
  const emoji = document.createElement("span");
  emoji.textContent = sj.emoji;
  const nom = document.createElement("span");
  nom.textContent = sj.nom.replace(/^(le |la |l')/, "").replace("ton dessin", "autre");
  b.append(emoji, nom);
  listeSujets.append(b);
}

function reglerInfos(infos) {
  etat.infos = { sujet: infos.sujet || null, nom: infos.nom || "", phrase: infos.phrase || "" };
  const sj = SUJETS.find((x) => x.id === etat.infos.sujet);
  listeSujets.querySelectorAll(".sujet").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.sujet === etat.infos.sujet)));
  $("nom-dessin").value = etat.infos.nom;
  $("nom-dessin").placeholder = sj ? sj.nom : "la raie tachetée, Bubulle…";
  $("phrase-dessin").value = etat.infos.phrase;
}

$("nom-dessin").addEventListener("input", () => { etat.infos.nom = $("nom-dessin").value; });
$("phrase-dessin").addEventListener("input", () => { etat.infos.phrase = $("phrase-dessin").value; });

function choisirFilm(sprite, dejaGarde) {
  if (sprite !== etat.page || !etat.couleurs) etat.couleurs = couleursDuDessin(sprite);
  etat.page = sprite;
  etat.garde = dejaGarde;
  etat.modele = null;
  montrer("choix-film");
}

function dessinerApercu() {
  const c = $("canevas-apercu"), s = etat.sprite;
  const boite = c.parentElement.getBoundingClientRect();
  const r = Math.min(boite.width / s.width, boite.height / s.height, 2);
  c.width = s.width;
  c.height = s.height;
  c.style.width = `${s.width * r}px`;
  c.style.height = `${s.height * r}px`;
  c.getContext("2d").drawImage(s, 0, 0);
}

// ---------- Réglage des coins ----------

const canReglage = $("canevas-reglage");
const COULEURS = ["#ff3b30", "#ffcc00", "#34c759", "#0a84ff"];
let poignee = -1;

function dessinerReglage() {
  const p = etat.photo;
  const boite = canReglage.parentElement.getBoundingClientRect();
  const r = Math.min(boite.width / p.width, boite.height / p.height);
  canReglage.style.width = `${p.width * r}px`;
  canReglage.style.height = `${p.height * r}px`;
  canReglage.width = p.width;
  canReglage.height = p.height;
  const c = canReglage.getContext("2d");
  c.drawImage(p, 0, 0);
  const rayon = Math.max(p.width, p.height) / 28;
  c.lineWidth = rayon / 5;
  c.strokeStyle = "rgba(10,132,255,0.9)";
  c.beginPath();
  etat.coins.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.closePath();
  c.stroke();
  etat.coins.forEach(([x, y], i) => {
    c.fillStyle = COULEURS[i] + "99";
    c.strokeStyle = "#fff";
    c.beginPath();
    c.arc(x, y, rayon, 0, Math.PI * 2);
    c.fill();
    c.stroke();
  });
  // Repère du haut de la page, un peu à l'intérieur du bord entre les deux premiers coins.
  const [a, b] = etat.coins;
  const cx = etat.coins.reduce((s, p) => s + p[0], 0) / 4, cy = etat.coins.reduce((s, p) => s + p[1], 0) / 4;
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
  c.save();
  c.translate(mx + (cx - mx) * 0.2, my + (cy - my) * 0.2);
  c.rotate(Math.atan2(b[1] - a[1], b[0] - a[0]));
  c.fillStyle = "#0a84ff";
  c.font = `bold ${rayon * 1.2}px system-ui, sans-serif`;
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillText("▲ haut ▲", 0, 0);
  c.restore();
}

function pointPhoto(e) {
  const b = canReglage.getBoundingClientRect();
  return [(e.clientX - b.left) * canReglage.width / b.width, (e.clientY - b.top) * canReglage.height / b.height];
}

canReglage.addEventListener("pointerdown", (e) => {
  const [x, y] = pointPhoto(e);
  let meilleur = -1, dist = Infinity;
  etat.coins.forEach(([cx, cy], i) => {
    const d = Math.hypot(cx - x, cy - y);
    if (d < dist) { dist = d; meilleur = i; }
  });
  if (dist < Math.max(canReglage.width, canReglage.height) / 8) {
    poignee = meilleur;
    canReglage.setPointerCapture(e.pointerId);
  }
});
canReglage.addEventListener("pointermove", (e) => {
  if (poignee < 0) return;
  etat.coins[poignee] = pointPhoto(e);
  dessinerReglage();
});
canReglage.addEventListener("pointerup", () => { poignee = -1; });
canReglage.addEventListener("pointercancel", () => { poignee = -1; });

// ---------- Film ----------

// page = page de coloriage redressée, ou personnage découpé quand etat.modele vaut null.
function lancerFilm(page, dejaGarde) {
  etat.page = page;
  etat.garde = dejaGarde;
  $("bouton-garder").hidden = dejaGarde;
  montrer("film");
  if (!etat.sons) etat.sons = new Sons();
  const prenom = lirePrenom() || "moi";
  etat.film = etat.modele
    ? new Film($("canevas-film"), etat.modele, page, prenom, etat.sons)
    : new FilmLibre($("canevas-film"), page, prenom, etat.sons, etat.scene, {
      voix: etat.voix || (etat.voix = new Voix()),
      repliques: repliques({
        sujet: SUJETS.find((x) => x.id === etat.infos.sujet), nom: etat.infos.nom, phrasePerso: etat.infos.phrase,
        couleurs: etat.couleurs, scene: etat.scene, prenom,
      }),
    });
  if (etat.voix) etat.voix.actif = etat.sons.actif;
  $("bouton-autre").hidden = !!etat.modele;
  etat.film.jouer();
}

function majBoutonSon() {
  $("bouton-son").textContent = etat.sons && !etat.sons.actif ? "🔇 Son" : "🔊 Son";
}

async function afficherGalerie() {
  montrer("galerie");
  const liste = $("liste-galerie");
  liste.replaceChildren();
  let dessins = [];
  try { dessins = await galerie.lister(); } catch { /* stockage indisponible */ }
  $("galerie-vide").hidden = dessins.length > 0;
  for (const d of dessins.reverse()) {
    const carte = document.createElement("div");
    carte.className = "carte";
    const img = document.createElement("img");
    const url = URL.createObjectURL(d.image);
    img.src = url;
    img.alt = "Dessin";
    img.addEventListener("click", async () => {
      const image = await galerie.enCanevas(d.image);
      if (d.pageId === "libre") { reglerInfos(d.infos || {}); etat.couleurs = null; return choisirFilm(image, true); }
      etat.modele = PAGES.find((p) => p.id === d.pageId) || MER;
      lancerFilm(image, true);
    });
    const date = document.createElement("span");
    date.textContent = new Date(d.date).toLocaleDateString("fr-FR");
    const suppr = document.createElement("button");
    suppr.className = "supprimer";
    suppr.textContent = "✕";
    suppr.setAttribute("aria-label", "Supprimer");
    suppr.addEventListener("click", async () => {
      // Premier appui : demande de confirmation sur le bouton lui-même.
      if (!suppr.classList.contains("confirmer")) {
        suppr.classList.add("confirmer");
        suppr.textContent = "Supprimer ?";
        setTimeout(() => { suppr.classList.remove("confirmer"); suppr.textContent = "✕"; }, 3000);
        return;
      }
      await galerie.supprimer(d.id);
      URL.revokeObjectURL(url);
      afficherGalerie();
    });
    carte.append(img, date, suppr);
    liste.append(carte);
  }
}

// ---------- Boutons ----------

const actions = {
  "tourner-libre": () => { etat.sprite = tournerSprite(etat.sprite); dessinerApercu(); },
  "miroir-libre": () => { etat.sprite = tournerSprite(etat.sprite, true); dessinerApercu(); },
  "partir-libre": () => choisirFilm(etat.sprite, false),
  sujet: (b) => {
    const meme = etat.infos.sujet === b.dataset.sujet;
    reglerInfos({ ...etat.infos, sujet: meme ? null : b.dataset.sujet });
  },
  scene: (b) => {
    etat.scene = SCENES.find((s) => s.id === b.dataset.scene) || SCENES[0];
    lancerFilm(etat.page, etat.garde);
  },
  surprise: () => {
    const autres = SCENES.filter((s) => s !== etat.scene);
    etat.scene = autres[Math.floor(Math.random() * autres.length)];
    lancerFilm(etat.page, etat.garde);
  },
  "autre-film": () => choisirFilm(etat.page, etat.garde),
  accueil: () => montrer("accueil"),
  galerie: afficherGalerie,
  tourner: () => { etat.coins = tourner(etat.coins); dessinerReglage(); },
  partir: () => {
    attente(true);
    // Laisse le message s'afficher avant le calcul.
    setTimeout(() => {
      try {
        etat.modele = MER;
        lancerFilm(redresser(etat.photo, etat.coins), false);
      } finally {
        attente(false);
      }
    }, 30);
  },
  demo: async () => {
    etat.modele = MER;
    lancerFilm(await pageEnCanevas(MER, { demo: true }), true);
  },
  rejouer: () => {
    if (etat.film) etat.film.arreter();
    lancerFilm(etat.page, etat.garde);
  },
  son: () => {
    if (!etat.sons) etat.sons = new Sons();
    etat.sons.actif = !etat.sons.actif;
    if (etat.voix) { etat.voix.actif = etat.sons.actif; if (!etat.voix.actif) etat.voix.taire(); }
    majBoutonSon();
  },
  garder: async () => {
    try {
      await galerie.garder({ pageId: etat.modele ? etat.modele.id : "libre", prenom: lirePrenom(), canevas: etat.page, infos: etat.modele ? null : etat.infos });
      etat.garde = true;
      $("bouton-garder").hidden = true;
      message("Gardé dans « Mes dessins animés » !");
    } catch {
      message("Je n'ai pas pu garder ce dessin sur cet appareil.");
    }
  },
};

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-action]");
  if (b && actions[b.dataset.action]) actions[b.dataset.action](b);
});

window.addEventListener("resize", () => { if ($("reglage").classList.contains("actif")) dessinerReglage(); });
