// Dessins gardés sur l'appareil (IndexedDB) : rien ne part sur Internet.

const BASE = "dessins-animes";
const TABLE = "dessins";

function ouvrir() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(BASE, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(TABLE, { keyPath: "id", autoIncrement: true });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function operation(mode, action) {
  const db = await ouvrir();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(TABLE, mode);
    const req = action(tx.objectStore(TABLE));
    tx.oncomplete = () => { db.close(); resolve(req.result); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

export async function garder({ pageId, prenom, canevas }) {
  // PNG pour un personnage découpé (fond transparent), JPEG pour une page entière.
  const format = pageId === "libre" ? "image/png" : "image/jpeg";
  const image = await new Promise((r) => canevas.toBlob(r, format, 0.88));
  return operation("readwrite", (t) => t.add({ pageId, prenom, image, date: Date.now() }));
}

export function lister() {
  return operation("readonly", (t) => t.getAll());
}

export function supprimer(id) {
  return operation("readwrite", (t) => t.delete(id));
}

export async function enCanevas(blob) {
  const bmp = await createImageBitmap(blob);
  const c = document.createElement("canvas");
  c.width = bmp.width;
  c.height = bmp.height;
  c.getContext("2d").drawImage(bmp, 0, 0);
  return c;
}
