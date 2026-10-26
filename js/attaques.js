// Effets d'attaque des monstres de poche : quand le monstre crie son attaque, des flammes,
// éclairs, bulles, feuilles… jaillissent devant lui, avec un bruitage et parfois l'écran
// qui tremble. Un effet dure DUREE secondes.

const TAU = Math.PI * 2;
export const DUREE = 2.8;

const SONS = {
  feu: ["feu"], eau: ["eau"], plante: ["whoosh", "pling"], electrique: ["tonnerre"], glace: ["cristal"],
  fantome: ["fantome"], dragon: ["feu", "grondement"], roche: ["grondement"], vol: ["vent", "whoosh"],
  psy: ["psy"], fee: ["tada", "pling"], sol: ["grondement"],
};
const SECOUSSE = { electrique: 6, dragon: 8, roche: 12, sol: 14 };

export class Attaque {
  constructor(type, debut, f) {
    this.type = type;
    this.debut = debut;
    this.f = f;
    this.parts = [];
    this.eclairs = [];
    (SONS[type] || []).forEach((n, k) => setTimeout(() => f.sons.effet(n), k * 250));
  }

  fini(t) { return t - this.debut > DUREE; }

  // Décalage de toute l'image (écran qui tremble).
  secousse(t) {
    const a = SECOUSSE[this.type];
    const e = (t - this.debut) / DUREE;
    if (!a || e < 0 || e > 1) return [0, 0];
    const k = a * (1 - e);
    return [(Math.random() - 0.5) * 2 * k, (Math.random() - 0.5) * 2 * k];
  }

  // Le monstre grossit un peu en lançant son attaque.
  gonfle(t) {
    const e = (t - this.debut) / DUREE;
    return e < 0 || e > 1 ? 1 : 1 + 0.15 * Math.sin(Math.PI * Math.min(1, e * 2.5));
  }

  dessiner(c, t) {
    const f = this.f, p = f.posEcran || f.pos;
    if (!p || p.cache) return;
    const age = t - this.debut, e = age / DUREE;
    if (e < 0 || e > 1) return;
    const L = f.L, H = f.H, r = Math.random;
    const [lw, lh] = f.taillePx(p.taille);
    const sens = p.sens || -1;
    // Le monstre regarde vers sa gauche (sens -1) : l'attaque part de devant lui.
    const ox = p.x * L + sens * lw * 0.42, oy = p.y * H - lh * 0.08;
    const lance = age < DUREE - 0.8;
    const ajouter = (q) => this.parts.push({ age: 0, ...q });
    c.save();
    switch (this.type) {
      case "feu":
      case "dragon": {
        const couleurs = this.type === "feu" ? ["#ffd23f", "#ff9f1c", "#ff4d1c"] : ["#c77dff", "#ff4d6d", "#ffb703"];
        if (lance) for (let k = 0; k < 6; k++) ajouter({ x: ox, y: oy, vx: sens * (8 + r() * 8), vy: (r() - 0.5) * 5, r: 10 + r() * 14, vie: 40, coul: couleurs[k % 3] });
        this.parts = this.parts.filter((q) => q.age < q.vie);
        for (const q of this.parts) {
          q.x += q.vx; q.y += q.vy - 0.6; q.age++;
          const v = 1 - q.age / q.vie;
          c.globalAlpha = 0.75 * v;
          c.fillStyle = q.coul;
          c.beginPath(); c.arc(q.x, q.y, q.r * (1 + q.age / 25), 0, TAU); c.fill();
        }
        break;
      }
      case "eau": {
        if (lance) for (let k = 0; k < 5; k++) ajouter({ x: ox, y: oy, vx: sens * (10 + r() * 7), vy: (r() - 0.6) * 6, g: 0.25, r: 6 + r() * 8, vie: 45, bulle: r() < 0.3 });
        this.parts = this.parts.filter((q) => q.age < q.vie);
        for (const q of this.parts) {
          q.x += q.vx; q.vy += q.bulle ? -0.15 : q.g; q.y += q.vy; q.age++;
          c.globalAlpha = 1 - q.age / q.vie;
          if (q.bulle) {
            c.strokeStyle = "#fff"; c.lineWidth = 3; c.fillStyle = "rgba(160,220,255,0.4)";
            c.beginPath(); c.arc(q.x, q.y, q.r * 1.4, 0, TAU); c.fill(); c.stroke();
          } else {
            c.fillStyle = "#4fc3ff"; c.strokeStyle = "#1d6fb8"; c.lineWidth = 2;
            c.beginPath(); c.ellipse(q.x, q.y, q.r * 1.6, q.r, Math.atan2(q.vy, q.vx), 0, TAU); c.fill(); c.stroke();
          }
        }
        break;
      }
      case "plante": {
        if (lance && r() < 0.8) ajouter({ x: ox, y: oy, a: r() * TAU, v: 6 + r() * 4, rot: r() * TAU, vie: 70, coul: r() < 0.7 ? "#3fb66c" : "#ff9ff3" });
        this.parts = this.parts.filter((q) => q.age < q.vie);
        for (const q of this.parts) {
          q.age++;
          const d = q.age * q.v, a = q.a + q.age * 0.08;
          const x = q.x + sens * Math.abs(Math.cos(a)) * d, y = q.y + Math.sin(a) * d * 0.6;
          c.globalAlpha = 1 - q.age / q.vie;
          c.save(); c.translate(x, y); c.rotate(q.rot + q.age * 0.2);
          c.fillStyle = q.coul; c.strokeStyle = "#1d6b3c"; c.lineWidth = 2;
          c.beginPath(); c.ellipse(0, 0, 16, 7, 0, 0, TAU); c.fill(); c.stroke();
          c.restore();
        }
        break;
      }
      case "electrique": {
        // Éclair blanc au début, puis zigzags jaunes.
        if (age < 0.15) { c.fillStyle = "rgba(255,255,220,0.6)"; c.fillRect(0, 0, L, H); }
        if (lance && r() < 0.5) {
          const pts = [[ox, oy]];
          let x = ox, y = oy;
          const fin = sens * (250 + r() * 400), ang = (r() - 0.5) * 1.2;
          for (let k = 1; k <= 7; k++) { x = ox + (fin * k) / 7; y = oy + Math.tan(ang) * Math.abs(fin) * k / 7 + (r() - 0.5) * 50; pts.push([x, y]); }
          this.eclairs.push({ pts, age: 0 });
          if (r() < 0.3) this.f.sons.effet("zap");
        }
        this.eclairs = this.eclairs.filter((q) => q.age++ < 8);
        for (const q of this.eclairs) {
          c.globalAlpha = 1 - q.age / 8;
          for (const [lw2, coul] of [[14, "rgba(255,240,120,0.5)"], [6, "#ffe14d"], [2, "#fff"]]) {
            c.strokeStyle = coul; c.lineWidth = lw2; c.lineJoin = "miter";
            c.beginPath(); q.pts.forEach(([x, y], k) => (k ? c.lineTo(x, y) : c.moveTo(x, y))); c.stroke();
          }
        }
        break;
      }
      case "glace": {
        c.fillStyle = `rgba(160,220,255,${0.25 * Math.sin(Math.PI * e)})`;
        c.fillRect(0, 0, L, H);
        if (lance) for (let k = 0; k < 3; k++) ajouter({ x: ox, y: oy, vx: sens * (9 + r() * 7), vy: (r() - 0.5) * 7, rot: r() * TAU, r: 10 + r() * 14, vie: 50 });
        this.parts = this.parts.filter((q) => q.age < q.vie);
        for (const q of this.parts) {
          q.x += q.vx; q.y += q.vy; q.age++; q.rot += 0.1;
          c.globalAlpha = 1 - q.age / q.vie;
          c.save(); c.translate(q.x, q.y); c.rotate(q.rot);
          c.fillStyle = "#e6f7ff"; c.strokeStyle = "#5bb8ff"; c.lineWidth = 2.5;
          c.beginPath(); c.moveTo(0, -q.r); c.lineTo(q.r * 0.4, 0); c.lineTo(0, q.r); c.lineTo(-q.r * 0.4, 0); c.closePath(); c.fill(); c.stroke();
          c.restore();
        }
        break;
      }
      case "fantome": {
        c.fillStyle = `rgba(90,40,140,${0.3 * Math.sin(Math.PI * e)})`;
        c.fillRect(0, 0, L, H);
        if (lance && r() < 0.25) ajouter({ x: ox, y: oy, vx: sens * (3 + r() * 3), vy: -1 - r() * 2, r: 22 + r() * 14, vie: 80 });
        this.parts = this.parts.filter((q) => q.age < q.vie);
        for (const q of this.parts) {
          q.x += q.vx + Math.sin(q.age / 6) * 2; q.y += q.vy; q.age++;
          c.globalAlpha = 0.85 * (1 - q.age / q.vie);
          c.fillStyle = "#f2e9ff"; c.strokeStyle = "#5a2a8c"; c.lineWidth = 3;
          c.beginPath();
          c.arc(q.x, q.y, q.r, Math.PI, 0);
          for (let k = 0; k <= 4; k++) c.lineTo(q.x + q.r - (k * q.r) / 2, q.y + q.r * (k % 2 ? 0.7 : 1.1));
          c.closePath(); c.fill(); c.stroke();
          c.fillStyle = "#5a2a8c";
          c.beginPath(); c.arc(q.x - q.r * 0.35, q.y - q.r * 0.1, q.r * 0.15, 0, TAU); c.arc(q.x + q.r * 0.35, q.y - q.r * 0.1, q.r * 0.15, 0, TAU); c.fill();
        }
        break;
      }
      case "roche":
      case "sol": {
        const roche = this.type === "roche";
        if (lance && r() < (roche ? 0.5 : 0.7)) {
          ajouter(roche
            ? { x: r() * L, y: -40, vx: 0, vy: 2, g: 0.6, r: 14 + r() * 20, vie: 90, rot: r() * TAU }
            : { x: ox + sens * r() * 300, y: H * 0.9, vx: (r() - 0.5) * 4, vy: -2 - r() * 3, g: 0, r: 30 + r() * 30, vie: 50, poussiere: true });
        }
        this.parts = this.parts.filter((q) => q.age < q.vie && q.y < H + 60);
        for (const q of this.parts) {
          q.x += q.vx; q.vy += q.g; q.y += q.vy; q.age++;
          if (q.poussiere) {
            c.globalAlpha = 0.5 * (1 - q.age / q.vie);
            c.fillStyle = "#c9a26b";
            c.beginPath(); c.arc(q.x, q.y, q.r * (1 + q.age / 30), 0, TAU); c.fill();
          } else {
            c.globalAlpha = 1;
            c.save(); c.translate(q.x, q.y); c.rotate(q.rot + q.age * 0.05);
            c.fillStyle = "#8d7a66"; c.strokeStyle = "#3e3329"; c.lineWidth = 3;
            c.beginPath();
            for (let k = 0; k < 6; k++) { const a = (k * TAU) / 6, rr = q.r * (0.75 + 0.25 * ((k * 37) % 5) / 4); c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
            c.closePath(); c.fill(); c.stroke();
            c.restore();
          }
        }
        break;
      }
      case "vol": {
        if (lance && r() < 0.6) ajouter({ x: ox, y: oy, a: r() * TAU, vie: 60, rot: r() * TAU, plume: r() < 0.5 });
        this.parts = this.parts.filter((q) => q.age < q.vie);
        c.lineWidth = 5;
        for (const q of this.parts) {
          q.age++;
          const d = q.age * 9, a = q.a + q.age * 0.15;
          const x = q.x + sens * d, y = q.y + Math.sin(a) * 60;
          c.globalAlpha = 1 - q.age / q.vie;
          if (q.plume) {
            c.save(); c.translate(x, y); c.rotate(q.rot + q.age * 0.1);
            c.fillStyle = "#fff"; c.strokeStyle = "#7a8fa6"; c.lineWidth = 2;
            c.beginPath(); c.ellipse(0, 0, 18, 6, 0, 0, TAU); c.fill(); c.stroke();
            c.beginPath(); c.moveTo(-18, 0); c.lineTo(18, 0); c.stroke();
            c.restore();
          } else {
            c.strokeStyle = "rgba(255,255,255,0.9)"; c.lineWidth = 5;
            c.beginPath(); c.arc(x, y, 26, a, a + 4); c.stroke();
          }
        }
        break;
      }
      case "psy": {
        if (lance && age * 10 % 3 < 0.35) ajouter({ x: ox, y: oy, vie: 50 });
        this.parts = this.parts.filter((q) => q.age < q.vie);
        for (const q of this.parts) {
          q.age++;
          const rr = 20 + q.age * 12;
          c.globalAlpha = 1 - q.age / q.vie;
          c.strokeStyle = q.age % 10 < 5 ? "#ff6bd6" : "#b26bff"; c.lineWidth = 8;
          c.beginPath(); c.ellipse(q.x + sens * q.age * 6, q.y, rr * 0.6, rr, 0, 0, TAU); c.stroke();
        }
        break;
      }
      case "fee": {
        if (lance) for (let k = 0; k < 2; k++) ajouter({ x: ox, y: oy, vx: sens * (3 + r() * 9), vy: (r() - 0.5) * 9, rot: r() * TAU, r: 8 + r() * 12, vie: 60, coul: ["#ff9ff3", "#ffd23f", "#9be7ff", "#fff"][Math.floor(r() * 4)] });
        this.parts = this.parts.filter((q) => q.age < q.vie);
        for (const q of this.parts) {
          q.x += q.vx; q.y += q.vy; q.vx *= 0.97; q.vy *= 0.97; q.age++;
          c.globalAlpha = 1 - q.age / q.vie;
          c.save(); c.translate(q.x, q.y); c.rotate(q.rot + q.age * 0.1);
          c.fillStyle = q.coul;
          c.beginPath();
          for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 5, rr = k % 2 ? q.r * 0.4 : q.r; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
          c.closePath(); c.fill();
          c.restore();
        }
        break;
      }
    }
    c.restore();
  }
}
