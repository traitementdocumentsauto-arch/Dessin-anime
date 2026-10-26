# Mon dessin animé

En ligne : https://traitementdocumentsauto-arch.github.io/Dessin-anime/

Application web pour enfant (téléphone ou tablette, Android ou iPhone) :

1. **Imprimer** un coloriage (`imprimer.html`, A4, à 100 %).
2. **Colorier** la page sur papier.
3. **Prendre la page en photo** dans l'application : elle retrouve les 4 carrés noirs des coins, redresse la page et corrige la lumière.
4. **Regarder le dessin animé** : le décor colorié ondule sous l'eau, le poisson et la pieuvre découpés dans le dessin nagent, parlent et dansent.
5. **Garder** ses dessins animés : ils restent sur l'appareil (rien n'est envoyé sur Internet).

**N'importe quel dessin** (« Photo de mon dessin ») : sans page spéciale, l'application découpe le dessin sur la photo (tout ce qui n'est pas le papier, en tenant compte d'une lumière jaune ou d'une ombre), on le tourne pour qu'il regarde vers la gauche, puis il nage dans une mer dessinée par l'application.

Bouton « Essayer sans imprimer » : film avec une page déjà coloriée.

Les photos passent par un champ de fichier ouvert par une étiquette (`<label for>`), jamais par un clic de script ni l'attribut `capture` : dans certains lecteurs (page publiée sur claude.ai) ils sont bloqués, alors que le choix du téléphone (« Prendre une photo » ou « Photothèque ») reste proposé.

## Fichiers

- `js/pages.js` : les coloriages, décrits en millimètres (sert à imprimer, à reconnaître la photo et à découper les personnages).
- `js/photo.js` : recherche des carrés noirs, redressement de la photo, correction de la lumière.
- `js/anim.js` : le dessin animé et les sons (fabriqués sur place).
- `js/libre.js` : « n'importe quel dessin » (découpe sur la photo, film dans une mer dessinée).
- `js/galerie.js` : dessins gardés sur l'appareil (IndexedDB).
- `js/app.js` : les écrans.

## Lancer

Les scripts sont des modules : il faut passer par un petit serveur, pas ouvrir le fichier directement.

```
python -m http.server 8000
```

Puis ouvrir http://localhost:8000. Le site est publié par GitHub Pages depuis la branche `main` (dossier racine) : chaque envoi sur `main` le met à jour en une ou deux minutes. Aucune photo n'est envoyée sur Internet : tout reste dans le téléphone.

## Ajouter un coloriage

Dans `js/pages.js`, copier `MER` : un décor (cadre du haut) et des personnages (un cadre chacun), avec pour chaque personnage sa **silhouette** (contour extérieur, sert de pochoir) et ses **détails** (yeux, traits). Garder les 4 carrés noirs et la bande vide en bas de page.
