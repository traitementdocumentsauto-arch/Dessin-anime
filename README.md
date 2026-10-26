# Mon dessin animé

En ligne : https://traitementdocumentsauto-arch.github.io/Dessin-anime/

Application web pour enfant (téléphone ou tablette, Android ou iPhone) :

1. **Imprimer** un coloriage (`imprimer.html`, A4, à 100 %).
2. **Colorier** la page sur papier.
3. **Prendre la page en photo** dans l'application : elle retrouve les 4 carrés noirs des coins, redresse la page et corrige la lumière.
4. **Regarder le dessin animé** : le décor colorié ondule sous l'eau, le poisson et la pieuvre découpés dans le dessin nagent, parlent et dansent.
5. **Garder** ses dessins animés : ils restent sur l'appareil (rien n'est envoyé sur Internet).

**N'importe quel dessin** (« Photo de mon dessin ») : sans page spéciale, l'application découpe le dessin sur la photo (tout ce qui n'est pas le papier, en tenant compte d'une lumière jaune ou d'une ombre), on le tourne pour qu'il regarde vers la gauche, puis on **choisit son film** (ou « Surprise ! ») :

| Film | Le dessin… | Musique et bruitages |
|---|---|---|
| 🌊 Au fond de la mer | nage en ondulant | marimba, bulles |
| 🚀 Dans l'espace | flotte en tournant, part vers les étoiles | nappes lentes, étoiles filantes, laser |
| ☁️ Dans le ciel | vole en battant des ailes | flûte, oiseaux, vent |
| 🌴 Dans la jungle | saute | pizzicati et tambours, « boing », oiseaux |
| ❄️ Sur la neige | glisse sur la piste, saute un tremplin | clochettes et grelots, « whoosh » |
| 🎉 La grande fête | danse en rythme | batterie, basse, confettis |
| 🏰 Le château magique | apparaît et disparaît en étincelles | orgue, « pling », « tada » |
| 🌋 Le volcan | saute pendant les éruptions | blues rapide, grondements |

Le dessin est **déformé** pendant le film (maillage de triangles) : il ondule en nageant, bat des ailes en volant, tremblote en flottant, se tasse en retombant, se penche en glissant, se dandine en dansant, et sautille quand il parle.

**Ses paroles** : avant le film, on dit ce qu'est le dessin (poisson, raie, dinosaure, fusée…), on peut lui donner un nom (« la raie tachetée ») et une phrase à dire. Il se présente, parle de ses couleurs (repérées sur le dessin : « Je suis toute bleue avec un peu de vert ! »), dit une phrase propre à ce qu'il est, une phrase du film, puis au revoir. Les répliques s'affichent dans des bulles et sont dites **à voix haute** par la voix du téléphone (synthèse vocale de l'appareil, rien n'est envoyé sur Internet) ; le bouton Son coupe aussi la voix.

Bouton « Essayer sans imprimer » : film avec une page déjà coloriée.

Les boutons photo ouvrent directement l'appareil photo (`capture`) ; « Choisir une photo déjà prise » ouvre la photothèque. Les champs de fichier s'ouvrent par une étiquette (`<label for>`), jamais par un clic de script.

## Fichiers

- `js/pages.js` : les coloriages, décrits en millimètres (sert à imprimer, à reconnaître la photo et à découper les personnages).
- `js/photo.js` : recherche des carrés noirs, redressement de la photo, correction de la lumière.
- `js/anim.js` : le dessin animé et les sons (fabriqués sur place).
- `js/libre.js` : « n'importe quel dessin » (découpe sur la photo, façons de bouger, film).
- `js/scenes.js` : les 8 films (décor, animations, musique, phrase).
- `js/paroles.js` : sujets du dessin, couleurs repérées, répliques du film.
- `js/voix.js` : voix du téléphone.
- `js/sons.js` : musiques et bruitages fabriqués sur place (instruments, batterie, effets).
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
