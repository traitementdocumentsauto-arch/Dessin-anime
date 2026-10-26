// Les films au choix pour « n'importe quel dessin » : chacun a son décor, sa façon de
// bouger (voir MOUVEMENTS dans libre.js), sa musique et ses bruitages.

const TAU = Math.PI * 2;

function degrade(g, H, couleurs) {
  const d = g.createLinearGradient(0, 0, 0, H);
  couleurs.forEach((c, i) => d.addColorStop(i / (couleurs.length - 1), c));
  return d;
}

function colline(g, L, H, y, amp, periode, couleur, contour) {
  g.fillStyle = couleur;
  g.beginPath();
  g.moveTo(0, H);
  for (let x = 0; x <= L; x += 20) g.lineTo(x, y * H + Math.sin(x / periode) * amp + Math.sin(x / (periode * 0.37)) * amp * 0.3);
  g.lineTo(L, H);
  g.closePath();
  g.fill();
  if (contour) { g.strokeStyle = contour; g.lineWidth = 4; g.stroke(); }
}

function nuage(c, x, y, s, couleur = "#fff") {
  c.fillStyle = couleur;
  c.beginPath();
  for (const [dx, dy, r] of [[0, 0, 40], [45, -18, 48], [95, 0, 38], [45, 12, 40], [-35, 10, 28], [130, 12, 26]]) {
    c.moveTo(x + (dx + r) * s, y + dy * s);
    c.arc(x + dx * s, y + dy * s, r * s, 0, TAU);
  }
  c.fill();
}

function etoiles(g, L, H, n, r, hauteur = 1) {
  g.fillStyle = "#fff";
  for (let i = 0; i < n; i++) {
    g.globalAlpha = 0.3 + r() * 0.7;
    g.beginPath();
    g.arc(r() * L, r() * H * hauteur, r() * 1.8 + 0.4, 0, TAU);
    g.fill();
  }
  g.globalAlpha = 1;
}

function soleil(g, x, y, rayon) {
  const halo = g.createRadialGradient(x, y, rayon * 0.5, x, y, rayon * 2.6);
  halo.addColorStop(0, "rgba(255,240,150,0.7)");
  halo.addColorStop(1, "rgba(255,240,150,0)");
  g.fillStyle = halo;
  g.beginPath(); g.arc(x, y, rayon * 2.6, 0, TAU); g.fill();
  g.fillStyle = "#ffd93b";
  g.strokeStyle = "#f2a900";
  g.lineWidth = 5;
  g.beginPath(); g.arc(x, y, rayon, 0, TAU); g.fill(); g.stroke();
}

function lune(g, x, y, rayon) {
  const halo = g.createRadialGradient(x, y, rayon, x, y, rayon * 3);
  halo.addColorStop(0, "rgba(255,255,230,0.35)");
  halo.addColorStop(1, "rgba(255,255,230,0)");
  g.fillStyle = halo;
  g.beginPath(); g.arc(x, y, rayon * 3, 0, TAU); g.fill();
  g.fillStyle = "#fff8d6";
  g.beginPath(); g.arc(x, y, rayon, 0, TAU); g.fill();
  g.fillStyle = "rgba(200,190,150,0.5)";
  for (const [dx, dy, r] of [[-0.3, -0.2, 0.18], [0.25, 0.1, 0.22], [-0.1, 0.4, 0.12]]) {
    g.beginPath(); g.arc(x + dx * rayon, y + dy * rayon, r * rayon, 0, TAU); g.fill();
  }
}

function sapin(g, x, y, h, neige) {
  g.fillStyle = "#6b4a2b";
  g.fillRect(x - h * 0.05, y - h * 0.15, h * 0.1, h * 0.15);
  for (let k = 0; k < 3; k++) {
    const yb = y - h * 0.12 - k * h * 0.25, l = h * (0.42 - k * 0.1);
    g.fillStyle = "#1f6b45";
    g.beginPath(); g.moveTo(x - l, yb); g.lineTo(x + l, yb); g.lineTo(x, yb - h * 0.4); g.closePath(); g.fill();
    if (neige) {
      g.fillStyle = "#fff";
      g.beginPath(); g.moveTo(x - l * 0.35, yb - h * 0.26); g.lineTo(x + l * 0.35, yb - h * 0.26); g.lineTo(x, yb - h * 0.4); g.closePath(); g.fill();
    }
  }
}

function palmier(g, x, y, h, sens) {
  g.strokeStyle = "#8a5a2b";
  g.lineWidth = h * 0.07;
  g.lineCap = "round";
  g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + sens * h * 0.25, y - h * 0.5, x + sens * h * 0.15, y - h); g.stroke();
  const cx = x + sens * h * 0.15, cy = y - h;
  g.fillStyle = "#2e9b4f";
  for (let k = 0; k < 6; k++) {
    g.save();
    g.translate(cx, cy);
    g.rotate(-Math.PI / 2 + (k - 2.5) * 0.55);
    g.beginPath(); g.ellipse(h * 0.25, 0, h * 0.28, h * 0.07, 0, 0, TAU); g.fill();
    g.restore();
  }
}

// Petite bulle de particules commune.
function particules(c, liste, dessin) {
  for (const p of liste) {
    p.x += p.vx; p.y += p.vy; p.vy += p.g || 0; p.age++;
    dessin(c, p);
  }
  return liste.filter((p) => p.age < p.vie && p.y < 2000 && p.y > -300);
}

export const SCENES = [
  {
    id: "mer", nom: "Au fond de la mer", emoji: "🌊", mouvement: "nage", phrase: "Coucou {p} !",
    musique: { bpm: 80, base: 392, gamme: "penta", accords: [0, 3, 1, 2], melodie: "marimba", densite: 0.5, basse: "basse", graine: 5 },
    fond(g, L, H) {
      g.fillStyle = degrade(g, H, ["#7fd3f7", "#3a9fd8", "#1d5f9c"]);
      g.fillRect(0, 0, L, H);
      colline(g, L, H, 0.88, 14, 130, "#efd08a", "#c9a65c");
      for (const [x, rx, ry, couleur] of [[0.12, 70, 40, "#8b8b9a"], [0.83, 95, 55, "#7a7a8a"], [0.9, 50, 30, "#9a9aa8"]]) {
        g.fillStyle = couleur;
        g.beginPath(); g.ellipse(x * L, H * 0.92, rx, ry, 0, Math.PI, 0); g.fill(); g.stroke();
      }
    },
    init(f) {
      f.etat.algues = Array.from({ length: 9 }, (_, i) => ({ x: 0.04 + i * 0.115 + f.r() * 0.04, h: 0.18 + f.r() * 0.22, couleur: i % 2 ? "#2f9e5c" : "#3fb66c", phase: f.r() * 6 }));
      f.etat.bulles = [];
    },
    derriere(c, t, f) {
      const { L, H } = f;
      c.save();
      c.globalCompositeOperation = "lighter";
      for (let i = 0; i < 4; i++) {
        const x = L * (0.1 + i * 0.27) + Math.sin(t * 0.5 + i) * 50;
        c.fillStyle = f.etat.rayon || (f.etat.rayon = degrade(c, H, ["rgba(255,255,220,0.2)", "rgba(255,255,220,0)"]));
        c.beginPath(); c.moveTo(x - 35, 0); c.lineTo(x + 35, 0); c.lineTo(x + 160, H); c.lineTo(x - 30, H); c.fill();
      }
      c.restore();
      for (const a of f.etat.algues) {
        const base = a.x * L, haut = H * (0.9 - a.h), bas = H * 0.93;
        c.fillStyle = a.couleur;
        c.strokeStyle = "#1d6b3c";
        c.lineWidth = 3;
        c.beginPath();
        c.moveTo(base - 12, bas);
        for (let k = 0; k <= 10; k++) { const v = k / 10; c.lineTo(base - 12 * (1 - v) + Math.sin(t * 1.5 + a.phase + v * 3) * 25 * v, bas - (bas - haut) * v); }
        for (let k = 10; k >= 0; k--) { const v = k / 10; c.lineTo(base + 12 * (1 - v) + Math.sin(t * 1.5 + a.phase + v * 3) * 25 * v, bas - (bas - haut) * v); }
        c.closePath(); c.fill(); c.stroke();
      }
    },
    devant(c, t, f) {
      const e = f.etat, p = f.pos;
      if (f.r() < 0.12) e.bulles.push({ x: f.r() * f.L, y: f.H + 10, vx: 0, vy: -3, r: 6 + f.r() * 12, age: 0, vie: 400 });
      if (p && p.x > 0 && p.x < 1 && t > 3 && f.r() < 0.1) {
        e.bulles.push({ x: (p.x - p.sens * 0.06) * f.L, y: p.y * f.H, vx: 0, vy: -3, r: 5 + f.r() * 8, age: 0, vie: 400 });
        if (f.r() < 0.4) f.sons.effet("bulle");
      }
      c.strokeStyle = "rgba(255,255,255,0.85)";
      c.fillStyle = "rgba(255,255,255,0.15)";
      c.lineWidth = 3;
      e.bulles = particules(c, e.bulles, (c, b) => {
        c.beginPath(); c.arc(b.x + Math.sin(b.age / 10 + b.r) * 6, b.y, b.r, 0, TAU); c.fill(); c.stroke();
      });
    },
  },

  {
    id: "espace", nom: "Dans l'espace", emoji: "🚀", mouvement: "flotte", phrase: "Bonjour les étoiles !",
    musique: { bpm: 70, base: 220, gamme: "mineur", accords: [0, 5, 3, 4], melodie: "nappe", densite: 0.35, basse: "basse", graine: 11, volume: 1.1 },
    fond(g, L, H, r) {
      g.fillStyle = degrade(g, H, ["#04061a", "#120f3d", "#2a1458"]);
      g.fillRect(0, 0, L, H);
      for (const [x, y, rad, coul] of [[0.25, 0.35, 260, "rgba(140,80,255,0.18)"], [0.75, 0.6, 300, "rgba(40,140,255,0.15)"]]) {
        const n = g.createRadialGradient(x * L, y * H, 0, x * L, y * H, rad);
        n.addColorStop(0, coul); n.addColorStop(1, "rgba(0,0,0,0)");
        g.fillStyle = n; g.fillRect(0, 0, L, H);
      }
      etoiles(g, L, H, 260, r);
      // Planète à anneau.
      const px = L * 0.86, py = H * 0.86;
      const pl = g.createRadialGradient(px - 40, py - 40, 20, px, py, 130);
      pl.addColorStop(0, "#ffcf7a"); pl.addColorStop(1, "#d9662b");
      g.strokeStyle = "rgba(255,220,170,0.8)";
      g.lineWidth = 14;
      g.beginPath(); g.ellipse(px, py, 210, 50, -0.25, Math.PI, TAU); g.stroke();
      g.fillStyle = pl;
      g.beginPath(); g.arc(px, py, 130, 0, TAU); g.fill();
      g.beginPath(); g.ellipse(px, py, 210, 50, -0.25, 0, Math.PI); g.stroke();
      lune(g, L * 0.12, H * 0.2, 42);
    },
    init(f) {
      f.etat.scintille = Array.from({ length: 40 }, () => ({ x: f.r() * f.L, y: f.r() * f.H, p: f.r() * 6 }));
      f.etat.filante = null;
      f.etat.prochaineFilante = 4;
    },
    derriere(c, t, f) {
      const e = f.etat;
      c.strokeStyle = "#fff";
      for (const s of e.scintille) {
        const a = Math.max(0, Math.sin(t * 2 + s.p));
        c.globalAlpha = a;
        c.lineWidth = 2;
        c.beginPath(); c.moveTo(s.x - 7 * a, s.y); c.lineTo(s.x + 7 * a, s.y); c.moveTo(s.x, s.y - 7 * a); c.lineTo(s.x, s.y + 7 * a); c.stroke();
      }
      c.globalAlpha = 1;
      if (t > e.prochaineFilante) {
        e.prochaineFilante = t + 2.5 + f.r() * 2.5;
        e.filante = { x: f.L * (0.3 + f.r() * 0.7), y: -20, debut: t };
        f.sons.effet("etoile");
      }
      if (e.filante) {
        const k = (t - e.filante.debut) * 900, x = e.filante.x - k, y = e.filante.y + k * 0.5;
        const d = c.createLinearGradient(x, y, x + 160, y - 80);
        d.addColorStop(0, "rgba(255,255,255,1)"); d.addColorStop(1, "rgba(255,255,255,0)");
        c.strokeStyle = d; c.lineWidth = 4;
        c.beginPath(); c.moveTo(x, y); c.lineTo(x + 160, y - 80); c.stroke();
        if (x < -200) e.filante = null;
      }
    },
  },

  {
    id: "ciel", nom: "Dans le ciel", emoji: "☁️", mouvement: "vol", phrase: "Je vole, {p} !",
    musique: { bpm: 96, base: 523.25, gamme: "majeur", accords: [0, 4, 5, 3], melodie: "flute", densite: 0.55, basse: "basse", graine: 7 },
    fond(g, L, H) {
      g.fillStyle = degrade(g, H, ["#6cc4ff", "#bfe6ff", "#f3fbff"]);
      g.fillRect(0, 0, L, H);
      soleil(g, L * 0.86, H * 0.18, 58);
      ["#ff5e5e", "#ffa53b", "#ffe14d", "#5ed36b", "#4fa8ff", "#9b6bff"].forEach((coul, i) => {
        g.strokeStyle = coul; g.globalAlpha = 0.45; g.lineWidth = 18;
        g.beginPath(); g.arc(L * 0.35, H * 1.15, H * 0.75 - i * 18, Math.PI, TAU); g.stroke();
      });
      g.globalAlpha = 1;
      colline(g, L, H, 0.86, 20, 180, "#8fd27a");
      colline(g, L, H, 0.93, 14, 110, "#5fbf5a");
    },
    init(f) {
      f.etat.nuages = Array.from({ length: 7 }, (_, i) => ({ x: f.r() * f.L * 1.3, y: f.H * (0.08 + f.r() * 0.6), s: 0.6 + f.r() * 0.9, v: 0.4 + (i % 3) * 0.5 }));
      f.etat.oiseaux = null;
      f.etat.prochainOiseau = 5;
      f.etat.prochainVent = 2;
    },
    derriere(c, t, f) {
      const e = f.etat;
      for (const n of e.nuages) {
        n.x -= n.v;
        if (n.x < -250) { n.x = f.L + 100; n.y = f.H * (0.08 + f.r() * 0.6); }
        c.globalAlpha = 0.9;
        nuage(c, n.x, n.y, n.s);
      }
      c.globalAlpha = 1;
      if (t > e.prochainOiseau) {
        e.prochainOiseau = t + 4 + f.r() * 3;
        e.oiseaux = { debut: t, y: f.H * (0.15 + f.r() * 0.25) };
        f.sons.effet("oiseau");
      }
      if (e.oiseaux) {
        const x = f.L + 50 - (t - e.oiseaux.debut) * 220;
        c.strokeStyle = "#333"; c.lineWidth = 3;
        for (let k = 0; k < 3; k++) {
          const ox = x + k * 50, oy = e.oiseaux.y + k * 18, a = Math.sin(t * 10 + k) * 8;
          c.beginPath(); c.moveTo(ox - 14, oy - a); c.quadraticCurveTo(ox - 6, oy - 8, ox, oy); c.quadraticCurveTo(ox + 6, oy - 8, ox + 14, oy - a); c.stroke();
        }
        if (x < -200) e.oiseaux = null;
      }
      if (t > e.prochainVent) { e.prochainVent = t + 6; f.sons.effet("vent"); }
    },
  },

  {
    id: "jungle", nom: "Dans la jungle", emoji: "🌴", mouvement: "saut", phrase: "Hop ! Hop ! Hop !",
    musique: { bpm: 116, base: 293.66, gamme: "penta", accords: [0, 2, 3, 1], melodie: "pizz", densite: 0.75, basse: "basse", batterie: { t: "x...x.x.", h: "..x...x." }, graine: 21 },
    fond(g, L, H, r) {
      g.fillStyle = degrade(g, H, ["#8be4ff", "#d9f8ff"]);
      g.fillRect(0, 0, L, H);
      soleil(g, L * 0.15, H * 0.17, 50);
      colline(g, L, H, 0.62, 30, 160, "#7cc576");
      colline(g, L, H, 0.7, 22, 120, "#55ad55");
      palmier(g, L * 0.08, H * 0.84, H * 0.55, 1);
      palmier(g, L * 0.93, H * 0.84, H * 0.6, -1);
      palmier(g, L * 0.7, H * 0.74, H * 0.35, 1);
      g.fillStyle = "#3f9b45";
      g.fillRect(0, H * 0.82, L, H * 0.18);
      g.strokeStyle = "#2d7a33"; g.lineWidth = 3;
      g.beginPath(); g.moveTo(0, H * 0.82); g.lineTo(L, H * 0.82); g.stroke();
      for (let i = 0; i < 26; i++) {
        const x = r() * L, y = H * (0.86 + r() * 0.12);
        g.fillStyle = ["#ff6b8b", "#ffd23f", "#ff9f40", "#c77dff"][i % 4];
        for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(x + Math.cos(k * 1.26) * 7, y + Math.sin(k * 1.26) * 7, 5, 0, TAU); g.fill(); }
        g.fillStyle = "#fff3a0"; g.beginPath(); g.arc(x, y, 4, 0, TAU); g.fill();
      }
    },
    init(f) {
      f.etat.papillons = Array.from({ length: 4 }, (_, i) => ({ x: f.r(), y: 0.3 + f.r() * 0.35, p: f.r() * 6, coul: ["#ff6bd6", "#ffd23f", "#4fc3ff", "#ff8a3d"][i] }));
      f.etat.prochainOiseau = 2;
    },
    derriere(c, t, f) {
      for (const b of f.etat.papillons) {
        const x = ((b.x + t * 0.03) % 1.1) * f.L, y = (b.y + 0.05 * Math.sin(t * 2 + b.p)) * f.H, a = Math.abs(Math.sin(t * 12 + b.p));
        c.fillStyle = b.coul;
        c.beginPath(); c.ellipse(x - 9 * a, y, 10 * a + 1, 12, 0, 0, TAU); c.ellipse(x + 9 * a, y, 10 * a + 1, 12, 0, 0, TAU); c.fill();
        c.fillStyle = "#333"; c.fillRect(x - 1.5, y - 10, 3, 20);
      }
      if (t > f.etat.prochainOiseau) { f.etat.prochainOiseau = t + 2.5 + f.r() * 2.5; f.sons.effet("oiseau"); }
    },
  },

  {
    id: "neige", nom: "Sur la neige", emoji: "❄️", mouvement: "glisse", phrase: "Youpi, ça glisse !",
    musique: { bpm: 104, base: 587.33, gamme: "majeur", accords: [0, 3, 4, 0], melodie: "cloche", densite: 0.6, basse: "basse", batterie: { g: "x.x.x.x." }, graine: 13 },
    fond(g, L, H, r) {
      g.fillStyle = degrade(g, H, ["#1b2a5a", "#5b4f9a", "#f1b6c9"]);
      g.fillRect(0, 0, L, H);
      etoiles(g, L, H, 80, r, 0.4);
      lune(g, L * 0.82, H * 0.16, 46);
      g.fillStyle = "#c9d6f2";
      g.beginPath(); g.moveTo(0, H * 0.5);
      [[0.12, 0.28], [0.25, 0.45], [0.4, 0.22], [0.55, 0.42], [0.7, 0.3], [0.85, 0.44], [1, 0.32]].forEach(([x, y]) => g.lineTo(x * L, y * H));
      g.lineTo(L, H); g.lineTo(0, H); g.closePath(); g.fill();
      // La piste : y = 0,40 + 0,38 x (même pente que le mouvement « glisse »).
      for (let i = 0; i < 7; i++) { const x = 0.05 + i * 0.15; sapin(g, x * L + 30, (0.40 + 0.38 * x) * H - 5, H * (0.18 + r() * 0.1), true); }
      g.fillStyle = "#f7fbff";
      g.strokeStyle = "#b9cbe8"; g.lineWidth = 4;
      g.beginPath(); g.moveTo(0, H * 0.4); g.lineTo(L, H * 0.78); g.lineTo(L, H); g.lineTo(0, H); g.closePath(); g.fill(); g.stroke();
    },
    init(f) {
      f.etat.flocons = Array.from({ length: 130 }, () => ({ x: f.r() * f.L, y: f.r() * f.H, r: 1.5 + f.r() * 4, v: 0.6 + f.r() * 1.6, p: f.r() * 6 }));
    },
    devant(c, t, f) {
      c.fillStyle = "#fff";
      for (const s of f.etat.flocons) {
        s.y += s.v;
        if (s.y > f.H + 10) { s.y = -10; s.x = f.r() * f.L; }
        c.beginPath(); c.arc(s.x + Math.sin(t + s.p) * 12, s.y, s.r, 0, TAU); c.fill();
      }
    },
  },

  {
    id: "fete", nom: "La grande fête", emoji: "🎉", mouvement: "danse", phrase: "On danse, {p} !",
    musique: { bpm: 124, base: 261.63, gamme: "mineur", accords: [0, 5, 2, 6], melodie: "carre", densite: 0.7, basse: "basse-synthe", batterie: { k: "x.x.x.x.", s: "..x...x.", h: ".x.x.x.x" }, graine: 17 },
    fond(g, L, H) {
      g.fillStyle = degrade(g, H, ["#12052b", "#2e0f57", "#4a1670"]);
      g.fillRect(0, 0, L, H);
      g.strokeStyle = "#999"; g.lineWidth = 2;
      g.beginPath(); g.moveTo(L / 2, 0); g.lineTo(L / 2, 40); g.stroke();
    },
    init(f) {
      f.etat.confettis = Array.from({ length: 90 }, () => ({ x: f.r() * f.L, y: f.r() * f.H, v: 1 + f.r() * 2, a: f.r() * 6, coul: ["#ff4d6d", "#ffd23f", "#3ddc97", "#4cc9f0", "#c77dff"][Math.floor(f.r() * 5)] }));
    },
    derriere(c, t, f) {
      const { L, H } = f, b = t * f.scene.musique.bpm / 60;
      // Projecteurs.
      c.save();
      c.globalCompositeOperation = "lighter";
      ["rgba(255,60,120,0.22)", "rgba(60,200,255,0.22)", "rgba(255,220,60,0.2)", "rgba(120,255,120,0.18)"].forEach((coul, i) => {
        const a = Math.PI / 2 + Math.sin(t * 0.9 + i * 1.7) * 0.7, ox = L * (0.15 + i * 0.23);
        c.fillStyle = coul;
        c.beginPath(); c.moveTo(ox, 0);
        c.lineTo(ox + Math.cos(a - 0.15) * H * 1.3, Math.sin(a - 0.15) * H * 1.3);
        c.lineTo(ox + Math.cos(a + 0.15) * H * 1.3, Math.sin(a + 0.15) * H * 1.3);
        c.fill();
      });
      c.restore();
      // Piste de danse qui clignote en rythme.
      const cases = 12, haut = H * 0.2, pas = Math.floor(b);
      for (let i = 0; i < cases; i++) for (let j = 0; j < 3; j++) {
        c.fillStyle = ["#ff4d6d", "#ffd23f", "#3ddc97", "#4cc9f0", "#c77dff"][(i + j * 2 + pas) % 5];
        c.globalAlpha = (i + j + pas) % 2 ? 0.85 : 0.35;
        c.fillRect(i * L / cases, H - haut + j * haut / 3, L / cases - 3, haut / 3 - 3);
      }
      c.globalAlpha = 1;
      // Boule à facettes.
      c.fillStyle = "#cfd6e6";
      c.beginPath(); c.arc(L / 2, 80, 42, 0, TAU); c.fill();
      for (let k = 0; k < 14; k++) {
        c.fillStyle = (k + pas) % 3 ? "#ffffff" : "#8fa3c8";
        const a = k * 0.45 + t;
        c.fillRect(L / 2 + Math.cos(a) * 26 - 5, 80 + Math.sin(a * 1.3) * 26 - 5, 10, 10);
      }
    },
    devant(c, t, f) {
      for (const p of f.etat.confettis) {
        p.y += p.v; p.a += 0.08;
        if (p.y > f.H + 10) { p.y = -10; p.x = f.r() * f.L; }
        c.save(); c.translate(p.x + Math.sin(p.a) * 10, p.y); c.rotate(p.a);
        c.fillStyle = p.coul; c.fillRect(-6, -3, 12, 6);
        c.restore();
      }
    },
  },

  {
    id: "chateau", nom: "Le château magique", emoji: "🏰", mouvement: "magie", phrase: "Abracadabra !",
    musique: { bpm: 76, base: 440, gamme: "mineur", accords: [0, 3, 5, 4], melodie: "orgue", densite: 0.5, basse: "basse", graine: 29 },
    fond(g, L, H, r) {
      g.fillStyle = degrade(g, H, ["#1d0b45", "#4b2a8a", "#8a7fd6"]);
      g.fillRect(0, 0, L, H);
      etoiles(g, L, H, 120, r, 0.6);
      lune(g, L * 0.15, H * 0.18, 52);
      colline(g, L, H, 0.8, 18, 160, "#2c2160");
      // Château.
      const bx = L * 0.62, by = H * 0.82;
      g.fillStyle = "#3d2f7a";
      g.fillRect(bx, by - 200, 300, 200);
      for (const [dx, h] of [[-30, 290], [125, 340], [280, 290]]) {
        g.fillStyle = "#4a3a8f";
        g.fillRect(bx + dx, by - h, 60, h);
        g.fillStyle = "#e05a8a";
        g.beginPath(); g.moveTo(bx + dx - 10, by - h); g.lineTo(bx + dx + 70, by - h); g.lineTo(bx + dx + 30, by - h - 90); g.closePath(); g.fill();
        g.strokeStyle = "#ccc"; g.lineWidth = 3;
        g.beginPath(); g.moveTo(bx + dx + 30, by - h - 90); g.lineTo(bx + dx + 30, by - h - 130); g.stroke();
        g.fillStyle = "#ffd23f";
        g.beginPath(); g.moveTo(bx + dx + 30, by - h - 130); g.lineTo(bx + dx + 62, by - h - 118); g.lineTo(bx + dx + 30, by - h - 106); g.fill();
        g.fillStyle = "#ffe68a";
        g.fillRect(bx + dx + 22, by - h + 50, 16, 26);
      }
      g.fillStyle = "#1d1440";
      g.beginPath(); g.arc(bx + 155, by - 40, 40, Math.PI, 0); g.lineTo(bx + 195, by); g.lineTo(bx + 115, by); g.fill();
      g.fillStyle = "#231a52";
      g.fillRect(0, H * 0.86, L, H * 0.14);
    },
    init(f) {
      f.etat.lucioles = Array.from({ length: 25 }, () => ({ x: f.r(), y: 0.3 + f.r() * 0.6, p: f.r() * 6 }));
      const h = document.createElement("canvas");
      h.width = h.height = 28;
      const g = h.getContext("2d"), d = g.createRadialGradient(14, 14, 0, 14, 14, 14);
      d.addColorStop(0, "rgba(255,250,170,1)"); d.addColorStop(1, "rgba(255,250,170,0)");
      g.fillStyle = d; g.fillRect(0, 0, 28, 28);
      f.etat.halo = h;
      f.etat.eclats = [];
    },
    derriere(c, t, f) {
      for (const l of f.etat.lucioles) {
        const x = (l.x + 0.03 * Math.sin(t * 0.7 + l.p)) * f.L, y = (l.y + 0.03 * Math.cos(t * 0.9 + l.p)) * f.H;
        c.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + l.p));
        c.drawImage(f.etat.halo, x - 14, y - 14);
      }
      c.globalAlpha = 1;
    },
    devant(c, t, f) {
      const p = f.pos;
      if (p && (p.alpha ?? 1) > 0.3 && t > 3 && f.r() < 0.5) {
        const [l, h] = f.taillePx(p.taille);
        f.etat.eclats.push({ x: p.x * f.L + (f.r() - 0.5) * l, y: p.y * f.H + (f.r() - 0.5) * h, vx: (f.r() - 0.5) * 2, vy: -1 - f.r() * 2, age: 0, vie: 40, coul: f.r() < 0.5 ? "#fff6a0" : "#ff9ff3" });
      }
      f.etat.eclats = particules(c, f.etat.eclats, (c, e) => {
        const r = 6 * (1 - e.age / e.vie) + 1;
        c.fillStyle = e.coul;
        c.beginPath();
        for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, rr = k % 2 ? r * 0.35 : r; c.lineTo(e.x + Math.cos(a) * rr, e.y + Math.sin(a) * rr); }
        c.fill();
      });
    },
    // Gerbe d'étincelles quand le dessin apparaît.
    eclat(f, x, y) {
      for (let k = 0; k < 30; k++) {
        const a = f.r() * TAU, v = 2 + f.r() * 6;
        f.etat.eclats.push({ x: x * f.L, y: y * f.H, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 0.08, age: 0, vie: 45, coul: ["#fff6a0", "#ff9ff3", "#9be7ff"][k % 3] });
      }
    },
  },

  {
    id: "volcan", nom: "Le volcan", emoji: "🌋", mouvement: "saut", phrase: "Ça chauffe !",
    musique: { bpm: 132, base: 293.66, gamme: "blues", accords: [0, 0, 3, 4], melodie: "basse-synthe", densite: 0.65, basse: "basse", batterie: { k: "x...x...", t: "..x..xx.", h: "x.x.x.x." }, graine: 31 },
    fond(g, L, H) {
      g.fillStyle = degrade(g, H, ["#5a1b2e", "#e0503a", "#ffb14a"]);
      g.fillRect(0, 0, L, H);
      // Volcan.
      g.fillStyle = "#4a2c22";
      g.beginPath(); g.moveTo(L * 0.18, H * 0.84); g.lineTo(L * 0.43, H * 0.24); g.lineTo(L * 0.57, H * 0.24); g.lineTo(L * 0.82, H * 0.84); g.closePath(); g.fill();
      g.strokeStyle = "#ff6a1a"; g.lineWidth = 12; g.lineCap = "round";
      for (const [x0, x1] of [[0.46, 0.38], [0.5, 0.52], [0.54, 0.64]]) {
        g.beginPath(); g.moveTo(L * x0, H * 0.25); g.quadraticCurveTo(L * (x0 + x1) / 2 + 20, H * 0.45, L * x1, H * 0.62); g.stroke();
      }
      g.fillStyle = "#ff8c1a";
      g.beginPath(); g.ellipse(L * 0.5, H * 0.24, L * 0.07, 14, 0, 0, TAU); g.fill();
      g.fillStyle = "#6b4a2b";
      g.fillRect(0, H * 0.82, L, H * 0.18);
      g.strokeStyle = "#4a3320"; g.lineWidth = 4;
      g.beginPath(); g.moveTo(0, H * 0.82); g.lineTo(L, H * 0.82); g.stroke();
      // Fougères.
      g.strokeStyle = "#3f8f3a"; g.lineWidth = 6;
      for (const x of [0.05, 0.12, 0.88, 0.95]) for (let k = -2; k <= 2; k++) {
        g.beginPath(); g.moveTo(L * x, H * 0.84); g.quadraticCurveTo(L * x + k * 20, H * 0.7, L * x + k * 45, H * 0.72); g.stroke();
      }
    },
    init(f) {
      f.etat.fumees = [];
      f.etat.laves = [];
      f.etat.prochaineEruption = 3.5;
    },
    derriere(c, t, f) {
      const e = f.etat, cx = f.L * 0.5, cy = f.H * 0.23;
      if (f.r() < 0.15) e.fumees.push({ x: cx + (f.r() - 0.5) * 60, y: cy, vx: 0.3 + f.r() * 0.5, vy: -1 - f.r(), age: 0, vie: 160, r: 20 });
      e.fumees = particules(c, e.fumees, (c, p) => {
        c.fillStyle = `rgba(80,70,70,${0.5 * (1 - p.age / p.vie)})`;
        c.beginPath(); c.arc(p.x, p.y, p.r + p.age * 0.4, 0, TAU); c.fill();
      });
      if (t > e.prochaineEruption) {
        e.prochaineEruption = t + 3 + f.r() * 2;
        f.sons.effet("grondement");
        for (let k = 0; k < 9; k++) e.laves.push({ x: cx, y: cy, vx: (f.r() - 0.5) * 14, vy: -10 - f.r() * 8, g: 0.35, age: 0, vie: 200, r: 8 + f.r() * 10 });
      }
      const lueur = c.createRadialGradient(cx, cy, 0, cx, cy, 160);
      lueur.addColorStop(0, `rgba(255,200,60,${0.35 + 0.15 * Math.sin(t * 6)})`);
      lueur.addColorStop(1, "rgba(255,120,0,0)");
      c.fillStyle = lueur; c.beginPath(); c.arc(cx, cy, 160, 0, TAU); c.fill();
      e.laves = particules(c, e.laves, (c, p) => {
        c.fillStyle = "#ff7b00"; c.strokeStyle = "#ffd23f"; c.lineWidth = 3;
        c.beginPath(); c.arc(p.x, p.y, p.r, 0, TAU); c.fill(); c.stroke();
      }).filter((p) => p.y < f.H * 0.84);
    },
  },
];
