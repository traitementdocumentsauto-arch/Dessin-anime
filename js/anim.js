// Le dessin animé : le décor colorié ondule, les personnages découpés nagent.

import { PAGE } from "./pages.js";

export const DUREE = 26;

const limiter = (v, a, b) => Math.max(a, Math.min(b, v));
const etape = (t, a, b) => limiter((t - a) / (b - a), 0, 1);
const doux = (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);
const entre = (a, b, x) => a + (b - a) * x;

// Découpe un personnage : sa silhouette sert de pochoir sur la page photographiée.
function decouper(page, perso) {
  const s = page.width / PAGE.largeur;
  const [x0, y0, x1, y1] = perso.boite;
  const c = document.createElement("canvas");
  c.width = Math.round((x1 - x0) * s);
  c.height = Math.round((y1 - y0) * s);
  const ctx = c.getContext("2d");
  ctx.setTransform(s, 0, 0, s, -x0 * s, -y0 * s);
  ctx.lineWidth = 1.6;
  ctx.lineJoin = "round";
  for (const f of perso.silhouette) {
    const p = new Path2D(f.d);
    ctx.fill(p);
    ctx.stroke(p);
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = "source-in";
  ctx.drawImage(page, -x0 * s, -y0 * s);
  return c;
}

function decor(page, d) {
  const s = page.width / PAGE.largeur;
  const marge = 1;
  const c = document.createElement("canvas");
  c.width = Math.round((d.l - 2 * marge) * s);
  c.height = Math.round((d.h - 2 * marge) * s);
  c.getContext("2d").drawImage(page, -(d.x + marge) * s, -(d.y + marge) * s);
  return c;
}

// Sons fabriqués sur place (aucun fichier à télécharger).
// À créer pendant un appui sur l'écran (sinon les téléphones refusent le son).
export class Sons {
  constructor() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    this.ctx = Ctx ? new Ctx() : null;
    this.actif = true;
    this.prochaineNote = 0;
  }
  reveiller() { if (this.ctx && this.ctx.state === "suspended") this.ctx.resume(); }
  note(freq, duree, type = "sine", volume = 0.08, glisse = 0) {
    if (!this.ctx || !this.actif) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (glisse) o.frequency.exponentialRampToValueAtTime(freq * glisse, t + duree);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(volume, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duree);
    o.connect(g).connect(this.ctx.destination);
    o.start(t);
    o.stop(t + duree + 0.05);
  }
  bulle() { this.note(300 + Math.random() * 300, 0.12, "sine", 0.06, 2.5); }
  musique(t) {
    // Petite mélodie douce, notes de la gamme pentatonique.
    if (t < this.prochaineNote) return;
    this.prochaineNote = t + 0.5;
    const gamme = [523, 587, 659, 784, 880, 1047];
    if (Math.random() < 0.7) this.note(gamme[(Math.random() * gamme.length) | 0], 0.45, "triangle", 0.035);
  }
}

export class Film {
  constructor(canevas, pageModele, pagePhoto, prenom, sons) {
    this.canevas = canevas;
    this.ctx = canevas.getContext("2d");
    this.prenom = prenom || "moi";
    this.fond = decor(pagePhoto, pageModele.decor);
    this.sprites = Object.fromEntries(pageModele.personnages.map((p) => [p.id, decouper(pagePhoto, p)]));
    this.L = canevas.width = 1280;
    this.H = canevas.height = Math.round(1280 * this.fond.height / this.fond.width);
    this.bulles = [];
    this.sons = sons;
    this.sens = { poisson: 1 };
  }

  jouer(fin) {
    this.debut = performance.now();
    this.fin = fin;
    this.prochaineBulle = 0;
    this.sons.prochaineNote = 0;
    const boucle = (now) => {
      const t = (now - this.debut) / 1000;
      this.dessiner(t);
      if (t < DUREE) this.raf = requestAnimationFrame(boucle);
      else if (this.fin) this.fin();
    };
    this.raf = requestAnimationFrame(boucle);
  }

  arreter() {
    cancelAnimationFrame(this.raf);
  }

  posPoisson(t) {
    const vague = (a, b) => 0.03 * Math.sin(t * 2.2) * Math.sin(Math.PI * etape(t, a, b));
    if (t < 3) return [-0.3, 0.45];
    if (t < 9) return [entre(-0.25, 0.32, doux(etape(t, 3, 9))), 0.45 + vague(3, 9)];
    if (t < 13) return [0.32 + 0.02 * Math.sin(Math.PI * etape(t, 9, 13)), 0.45 + vague(9, 13)];
    if (t < 17) {
      const a = Math.PI / 2 + 2 * Math.PI * doux(etape(t, 13, 17));
      return [0.32 + 0.12 * Math.cos(a), 0.33 + 0.12 * Math.sin(a)];
    }
    const x = etape(t, 17, 22);
    return [entre(0.32, 1.35, doux(x)), 0.45 - 0.18 * Math.sin(Math.PI * x / 2) + vague(17, 22)];
  }

  posPieuvre(t) {
    let y;
    if (t < 8) y = 1.4;
    else if (t < 13) y = entre(1.4, 0.58, doux(etape(t, 8, 13)));
    else if (t < 19) y = 0.58 + 0.025 * Math.sin((t - 13) * 3);
    else y = entre(0.58, 1.4, doux(etape(t, 19, 23)));
    return [0.72, y];
  }

  dessinerSprite(img, x, y, largeur, { rotation = 0, sx = 1, sy = 1 } = {}) {
    const c = this.ctx;
    const hauteur = largeur * img.height / img.width;
    c.save();
    c.translate(x * this.L, y * this.H);
    c.rotate(rotation);
    c.scale(sx, sy);
    c.shadowColor = "rgba(0,40,80,0.35)";
    c.shadowBlur = 18;
    c.shadowOffsetY = 8;
    c.drawImage(img, -largeur / 2, -hauteur / 2, largeur, hauteur);
    c.restore();
    return hauteur;
  }

  parole(texte, x, y) {
    const c = this.ctx;
    c.save();
    c.font = "bold 44px 'Comic Sans MS', 'Chalkboard SE', system-ui, sans-serif";
    const l = c.measureText(texte).width + 48;
    const bx = limiter(x * this.L - l / 2, 10, this.L - l - 10), by = y * this.H - 120;
    c.fillStyle = "#fff";
    c.strokeStyle = "#222";
    c.lineWidth = 4;
    c.beginPath();
    c.roundRect(bx, by, l, 76, 38);
    c.moveTo(x * this.L - 14, by + 74);
    c.lineTo(x * this.L, by + 106);
    c.lineTo(x * this.L + 14, by + 74);
    c.fill();
    c.stroke();
    c.fillStyle = "#222";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(texte, bx + l / 2, by + 40);
    c.restore();
  }

  carton(lignes, opacite) {
    const c = this.ctx;
    c.save();
    c.globalAlpha = opacite;
    c.fillStyle = "rgba(10,40,90,0.75)";
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

    // Décor qui ondule comme sous l'eau.
    const f = this.fond;
    const bandes = 60;
    for (let i = 0; i < bandes; i++) {
      const sy = (i * f.height) / bandes, sh = Math.min(f.height / bandes + 1, f.height - sy);
      const dx = Math.sin(i * 0.35 + t * 2) * 6;
      c.drawImage(f, 0, sy, f.width, sh, -12 + dx, (i * H) / bandes, L + 24, (sh * H) / f.height + 0.5);
    }

    // Rayons de lumière.
    c.save();
    c.globalCompositeOperation = "lighter";
    for (let i = 0; i < 3; i++) {
      const x = L * (0.2 + i * 0.3) + Math.sin(t * 0.6 + i) * 40;
      const g = c.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "rgba(255,255,220,0.18)");
      g.addColorStop(1, "rgba(255,255,220,0)");
      c.fillStyle = g;
      c.beginPath();
      c.moveTo(x - 30, 0);
      c.lineTo(x + 30, 0);
      c.lineTo(x + 140, H);
      c.lineTo(x - 20, H);
      c.fill();
    }
    c.restore();

    // Personnages.
    const [px, py] = this.posPieuvre(t);
    const respire = Math.sin(t * 4);
    const hPieuvre = this.dessinerSprite(this.sprites.pieuvre, px, py, L * 0.27, { sx: 1 - 0.05 * respire, sy: 1 + 0.06 * respire });

    const [fx, fy] = this.posPoisson(t);
    const [fx2] = this.posPoisson(t + 0.05);
    if (Math.abs(fx2 - fx) > 0.0005) this.sens.poisson = fx2 > fx ? 1 : -1;
    this.dessinerSprite(this.sprites.poisson, fx, fy, L * 0.27, {
      rotation: Math.sin(t * 3) * 0.08,
      sx: this.sens.poisson * (1 + 0.04 * Math.sin(t * 9)),
    });

    // Bulles.
    if (t > this.prochaineBulle) {
      this.prochaineBulle = t + 0.25 + Math.random() * 0.4;
      this.bulles.push({ x: Math.random(), y: 1.05, r: 6 + Math.random() * 10, n: t });
      if (fx > 0 && fx < 1 && t > 3 && t < 22) {
        this.bulles.push({ x: fx + 0.12 * this.sens.poisson, y: fy - 0.02, r: 5 + Math.random() * 6, n: t });
        if (Math.random() < 0.5) this.sons.bulle();
      }
    }
    c.save();
    c.strokeStyle = "rgba(255,255,255,0.8)";
    c.fillStyle = "rgba(255,255,255,0.15)";
    c.lineWidth = 3;
    this.bulles = this.bulles.filter((b) => b.y > -0.1);
    for (const b of this.bulles) {
      b.y -= 0.004;
      const x = b.x * L + Math.sin((t - b.n) * 4 + b.r) * 6;
      c.beginPath();
      c.arc(x, b.y * H, b.r, 0, Math.PI * 2);
      c.fill();
      c.stroke();
    }
    c.restore();

    // Cœurs pendant la danse.
    if (t > 13.5 && t < 17.5) {
      c.save();
      c.font = "60px system-ui, sans-serif";
      c.textAlign = "center";
      for (let i = 0; i < 5; i++) {
        const age = (t - 13.5 - i * 0.6);
        if (age < 0 || age > 2) continue;
        c.globalAlpha = 1 - age / 2;
        c.fillText("❤️", L * (0.5 + 0.05 * Math.sin(i * 2)), H * (0.6 - age * 0.18));
      }
      c.restore();
    }

    // Paroles.
    if (t > 10 && t < 12.5) this.parole("Bonjour !", fx, fy - 0.1);
    if (t > 12.5 && t < 15) this.parole(`Salut ${this.prenom} !`, px, py - hPieuvre / H / 2 + 0.05);
    if (t > 19 && t < 21) this.parole("Au revoir !", px, Math.min(py, 0.75) - hPieuvre / H / 2 + 0.05);

    // Cartons du début et de la fin.
    if (t < 3.5) this.carton([["Le dessin animé de", 64], [this.prenom, 110]], t < 2.5 ? 1 : 1 - (t - 2.5));
    if (t > 22.5) this.carton([["Fin", 140], [`Un film de ${this.prenom}`, 56]], Math.min(1, t - 22.5));
  }
}
