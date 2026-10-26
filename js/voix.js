// Voix du téléphone (synthèse vocale) : le dessin parle à voix haute.
// Rien n'est envoyé sur Internet par l'application ; la voix est celle de l'appareil.

export class Voix {
  constructor() {
    this.synthese = "speechSynthesis" in window ? window.speechSynthesis : null;
    this.actif = true;
    this.voixFr = null;
    if (!this.synthese) return;
    const choisir = () => {
      const toutes = this.synthese.getVoices().filter((v) => v.lang && v.lang.toLowerCase().startsWith("fr"));
      this.voixFr = toutes.find((v) => v.lang.toLowerCase() === "fr-fr") || toutes[0] || null;
    };
    choisir();
    this.synthese.addEventListener?.("voiceschanged", choisir);
  }

  // aigu = voix du personnage ; sinon voix du conteur. ami = voix un peu différente.
  dire(texte, { aigu = true, ami = false } = {}) {
    if (!this.synthese || !this.actif || !texte) return;
    const u = new SpeechSynthesisUtterance(texte.replace(/…/g, ", "));
    u.lang = "fr-FR";
    if (this.voixFr) u.voice = this.voixFr;
    u.pitch = ami ? 1.3 : aigu ? 1.7 : 1;
    u.rate = ami ? 1.15 : aigu ? 1.08 : 0.95;
    this.synthese.speak(u);
  }

  taire() { if (this.synthese) this.synthese.cancel(); }
}
