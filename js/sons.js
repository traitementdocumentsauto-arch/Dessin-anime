// Musiques et bruitages fabriqués sur place (aucun fichier à télécharger).
// Chaque film a sa musique : tempo, gamme, accords, instruments et batterie.

const GAMMES = {
  majeur: [0, 2, 4, 5, 7, 9, 11],
  mineur: [0, 2, 3, 5, 7, 8, 10],
  penta: [0, 2, 4, 7, 9],
  blues: [0, 3, 5, 6, 7, 10],
};

// Musique douce par défaut (page « Au fond de la mer »).
export const MUSIQUE_CALME = { bpm: 84, base: 523.25, gamme: "penta", accords: [0, 3, 1, 2], melodie: "triangle", densite: 0.55, basse: null, graine: 3 };

// Petit tirage pseudo-aléatoire reproductible : la même musique revient à chaque film.
function tirage(graine) {
  let s = graine * 9301 + 49297;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

function motif(config) {
  const r = tirage(config.graine || 1);
  const notes = [];
  let pos = 2;
  for (let i = 0; i < 16; i++) {
    if (r() > (config.densite ?? 0.6) && i % 4 !== 0) { notes.push(null); continue; }
    pos = Math.max(0, Math.min(7, pos + Math.round((r() - 0.5) * 4)));
    notes.push(pos);
  }
  return notes;
}

export class Sons {
  constructor() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    this.ctx = Ctx ? new Ctx() : null;
    this.actif = true;
    this.config = null;
    this.pas = -1;
    if (!this.ctx) return;
    const comp = this.ctx.createDynamicsCompressor();
    this.sortie = this.ctx.createGain();
    this.sortie.gain.value = 0.9;
    this.sortie.connect(comp).connect(this.ctx.destination);
    const n = this.ctx.sampleRate;
    this.bruitBlanc = this.ctx.createBuffer(1, n, n);
    const d = this.bruitBlanc.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  }

  reveiller() { if (this.ctx && this.ctx.state === "suspended") this.ctx.resume(); }

  // Choisit la musique du film et la remet au début.
  regler(config) {
    this.config = config;
    this.pas = -1;
    this.notes = config ? motif(config) : [];
  }

  // Appelé à chaque image : joue les temps de musique écoulés.
  avancer(t) {
    if (!this.ctx || !this.config) return;
    const duree = 60 / this.config.bpm / 2;
    const pas = Math.floor(t / duree);
    if (pas - this.pas > 2) this.pas = pas - 1;
    while (this.pas < pas) {
      this.pas++;
      if (this.actif) this.jouerPas(this.pas);
    }
  }

  // Ancien nom, gardé pour la page « Au fond de la mer ».
  musique(t) {
    if (!this.config) this.regler(MUSIQUE_CALME);
    this.avancer(t);
  }

  frequence(degre, octave = 0) {
    const g = GAMMES[this.config.gamme] || GAMMES.majeur;
    const o = Math.floor(degre / g.length);
    const i = ((degre % g.length) + g.length) % g.length;
    return this.config.base * 2 ** ((g[i] + 12 * (o + octave)) / 12);
  }

  jouerPas(i) {
    const c = this.config;
    const mesure = Math.floor(i / 8), temps = i % 8;
    const accord = c.accords[mesure % c.accords.length];
    const vol = c.volume ?? 1;
    if (c.basse && (temps === 0 || (temps === 4 && c.bpm < 120) || (c.bpm >= 120 && temps % 2 === 0))) {
      this.instrument(c.basse, this.frequence(accord, -2), 0.35 * vol);
    }
    if (c.batterie) {
      for (const [son, rythme] of Object.entries(c.batterie)) {
        if (rythme[i % rythme.length] === "x") this.instrument(son, 0, vol);
      }
    }
    const n = this.notes[i % 16];
    if (n !== null && n !== undefined) this.instrument(c.melodie, this.frequence(accord + n), 0.5 * vol);
  }

  // ---------- Briques ----------

  enveloppe(t, attaque, duree, volume) {
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), t + attaque);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attaque + duree);
    return g;
  }

  oscillateur(type, freq, { volume = 0.1, attaque = 0.01, duree = 0.3, vers = 0, filtre = 0, decalage = 0, vibrato = 0 } = {}) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + 0.01 + decalage;
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (vers) o.frequency.exponentialRampToValueAtTime(vers, t + attaque + duree);
    if (vibrato) {
      const lfo = this.ctx.createOscillator(), prof = this.ctx.createGain();
      lfo.frequency.value = 5.5;
      prof.gain.value = freq * vibrato;
      lfo.connect(prof).connect(o.frequency);
      lfo.start(t);
      lfo.stop(t + attaque + duree + 0.1);
    }
    let chaine = o;
    if (filtre) {
      const f = this.ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = filtre;
      chaine = chaine.connect(f);
    }
    chaine.connect(this.enveloppe(t, attaque, duree, volume)).connect(this.sortie);
    o.start(t);
    o.stop(t + attaque + duree + 0.1);
  }

  bruit({ volume = 0.1, attaque = 0.005, duree = 0.2, type = "bandpass", freq = 1000, vers = 0, q = 1, decalage = 0 } = {}) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + 0.01 + decalage;
    const s = this.ctx.createBufferSource();
    s.buffer = this.bruitBlanc;
    s.loop = true;
    const f = this.ctx.createBiquadFilter();
    f.type = type;
    f.Q.value = q;
    f.frequency.setValueAtTime(freq, t);
    if (vers) f.frequency.exponentialRampToValueAtTime(vers, t + attaque + duree);
    s.connect(f).connect(this.enveloppe(t, attaque, duree, volume)).connect(this.sortie);
    s.start(t, Math.random() * 0.5);
    s.stop(t + attaque + duree + 0.1);
  }

  // ---------- Instruments ----------

  instrument(nom, f, v = 0.5) {
    if (!this.ctx) return;
    switch (nom) {
      case "marimba":
        this.oscillateur("sine", f, { volume: 0.16 * v, attaque: 0.004, duree: 0.35 });
        this.oscillateur("sine", f * 4, { volume: 0.03 * v, attaque: 0.002, duree: 0.08 });
        break;
      case "cloche":
        this.oscillateur("sine", f, { volume: 0.12 * v, attaque: 0.003, duree: 1.1 });
        this.oscillateur("sine", f * 2.76, { volume: 0.04 * v, attaque: 0.002, duree: 0.45 });
        this.oscillateur("sine", f * 5.4, { volume: 0.015 * v, attaque: 0.002, duree: 0.2 });
        break;
      case "flute":
        this.oscillateur("sine", f, { volume: 0.12 * v, attaque: 0.06, duree: 0.45, vibrato: 0.012 });
        this.oscillateur("triangle", f * 2, { volume: 0.015 * v, attaque: 0.06, duree: 0.3 });
        break;
      case "nappe":
        this.oscillateur("sawtooth", f, { volume: 0.035 * v, attaque: 0.35, duree: 1.6, filtre: 900 });
        this.oscillateur("sawtooth", f * 1.007, { volume: 0.035 * v, attaque: 0.35, duree: 1.6, filtre: 900 });
        this.oscillateur("sine", f * 2, { volume: 0.03 * v, attaque: 0.2, duree: 1.2 });
        break;
      case "carre":
        this.oscillateur("square", f, { volume: 0.05 * v, attaque: 0.005, duree: 0.16, filtre: 2400 });
        break;
      case "pizz":
        this.oscillateur("triangle", f, { volume: 0.16 * v, attaque: 0.003, duree: 0.14 });
        break;
      case "triangle":
        this.oscillateur("triangle", f, { volume: 0.07 * v, attaque: 0.02, duree: 0.45 });
        break;
      case "basse":
        this.oscillateur("triangle", f, { volume: 0.3 * v, attaque: 0.01, duree: 0.35 });
        break;
      case "basse-synthe":
        this.oscillateur("sawtooth", f, { volume: 0.14 * v, attaque: 0.01, duree: 0.22, filtre: 500 });
        break;
      case "orgue":
        this.oscillateur("square", f, { volume: 0.03 * v, attaque: 0.03, duree: 0.5, filtre: 1500 });
        this.oscillateur("sine", f / 2, { volume: 0.06 * v, attaque: 0.03, duree: 0.5 });
        break;
      case "k": // grosse caisse
        this.oscillateur("sine", 150, { volume: 0.55 * v, attaque: 0.003, duree: 0.22, vers: 42 });
        break;
      case "s": // caisse claire
        this.bruit({ volume: 0.22 * v, duree: 0.13, freq: 1800, q: 0.8 });
        this.oscillateur("triangle", 210, { volume: 0.08 * v, attaque: 0.002, duree: 0.07 });
        break;
      case "h": // charleston
        this.bruit({ volume: 0.07 * v, duree: 0.035, type: "highpass", freq: 7500 });
        break;
      case "t": // tambour grave
        this.oscillateur("sine", 110, { volume: 0.4 * v, attaque: 0.003, duree: 0.3, vers: 60 });
        this.bruit({ volume: 0.05 * v, duree: 0.08, freq: 400 });
        break;
      case "g": // grelots
        for (let k = 0; k < 3; k++) this.bruit({ volume: 0.05 * v, duree: 0.06, type: "highpass", freq: 6500, decalage: k * 0.05 });
        break;
    }
  }

  // ---------- Bruitages ----------

  effet(nom) {
    if (!this.ctx || !this.actif) return;
    switch (nom) {
      case "bulle": this.oscillateur("sine", 300 + Math.random() * 300, { volume: 0.06, attaque: 0.02, duree: 0.12, vers: 900 }); break;
      case "boing":
        this.oscillateur("sine", 160, { volume: 0.18, attaque: 0.005, duree: 0.28, vers: 520 });
        this.oscillateur("triangle", 320, { volume: 0.05, attaque: 0.005, duree: 0.2, vers: 900 });
        break;
      case "zap": this.oscillateur("square", 1600, { volume: 0.04, attaque: 0.005, duree: 0.3, vers: 160, filtre: 3000 }); break;
      case "vent": this.bruit({ volume: 0.07, attaque: 0.5, duree: 1.4, type: "lowpass", freq: 300, vers: 1400 }); break;
      case "whoosh": this.bruit({ volume: 0.12, attaque: 0.08, duree: 0.45, freq: 400, vers: 3000, q: 1.5 }); break;
      case "grelots": this.instrument("g", 0, 1.4); this.instrument("cloche", 2093, 0.5); break;
      case "pling": this.instrument("cloche", 1568, 0.9); this.instrument("cloche", 2349, 0.5); break;
      case "grondement":
        this.bruit({ volume: 0.5, attaque: 0.05, duree: 1.4, type: "lowpass", freq: 140, vers: 60 });
        this.oscillateur("sine", 55, { volume: 0.3, attaque: 0.05, duree: 1, vers: 35 });
        break;
      case "oiseau":
        for (let k = 0; k < 3; k++) this.oscillateur("sine", 2400 + Math.random() * 600, { volume: 0.04, attaque: 0.01, duree: 0.07, vers: 3600, decalage: k * 0.12 });
        break;
      case "tada": [523, 659, 784, 1047].forEach((f, k) => this.oscillateur("triangle", f, { volume: 0.12, attaque: 0.01, duree: k === 3 ? 0.8 : 0.15, decalage: k * 0.09 })); break;
      case "etoile": this.oscillateur("sine", 3000, { volume: 0.03, attaque: 0.01, duree: 0.6, vers: 1200 }); break;
      case "rire": [0, 1, 2, 3].forEach((k) => this.oscillateur("triangle", 700 - k * 60, { volume: 0.06, attaque: 0.01, duree: 0.09, vers: 500 - k * 60, decalage: k * 0.13 })); break;
    }
  }

  bulle() { this.effet("bulle"); }
}
