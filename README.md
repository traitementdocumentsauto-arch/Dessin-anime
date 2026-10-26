# Mon dessin animé

En ligne : https://traitementdocumentsauto-arch.github.io/Dessin-anime/

Application web pour enfant (téléphone ou tablette, Android ou iPhone) :

1. **Imprimer** un coloriage (`imprimer.html`, A4, à 100 %).
2. **Colorier** la page sur papier.
3. **Prendre la page en photo** dans l'application : elle retrouve les 4 carrés noirs des coins, redresse la page et corrige la lumière.
4. **Regarder le dessin animé** : le décor colorié ondule sous l'eau, le poisson et la pieuvre découpés dans le dessin nagent, parlent et dansent.
5. **Garder** ses dessins animés : ils restent sur l'appareil (rien n'est envoyé sur Internet).

**Feuilles à colorier** (bouton « 🖨️ Feuilles à colorier ») : un catalogue de 30 feuilles, rangées par familles. **Monstres de poche** inventés (dans l'esprit des Pokémon, sans reprendre les vrais, protégés) : Pyroto (feu), Aquabulle (eau), Feuillon (plante), Voltéo (électrique), Givrou (glace), Fantomou (fantôme), Drakéo (dragon), Rocaille (roche), Plumio (vol), Psylou (psy), Lapaillette (fée), Sablox (sol) ; chacun crie son attaque dans le film. Puis 18 autres feuilles (`js/catalogue.js`, page d'impression `feuille.html`, une feuille ou « tout imprimer ») : poisson, raie, requin, dauphin, baleine, pieuvre, tortue, dinosaure, dragon, chat, chien, lapin, oiseau, papillon, fusée, voiture, robot, monstre, plus la page « Au fond de la mer ». Chaque feuille montre un grand personnage en traits épais, tourné vers la gauche. Le bouton 📷 sous une feuille ouvre l'appareil photo et l'application sait déjà ce que c'est (sujet et nom remplis).

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

**Plusieurs dessins de l'enfant** peuvent jouer ensemble : sur l'écran « Quel film ? », on choisit jusqu'à deux autres dessins gardés dans « Mes dessins animés ». Ils suivent le premier (même mouvement, un peu en retard, un peu plus petits, à côté de lui), en 3D eux aussi, et se présentent (« Et moi, je suis Bubulle ! ») avec une voix un peu différente.

Des **compagnons** s'animent autour du dessin, dessinés dans le même style (`js/compagnons.js`) : poissons, méduse, crabe et tortue dans la mer ; ovnis, fusée et étoiles dans l'espace ; oiseaux, ballons et papillon dans le ciel ; singe, perroquets, papillon et tortue dans la jungle ; bonhomme de neige et pingouins sur la neige ; oursons, notes de musique et ballon à la fête ; fées, étoile et papillon au château ; dinosaures et ptérodactyle au volcan.

Le dessin est animé **en 3D** (three.js, copié dans `js/vendor/`, licence MIT) : le dessin découpé devient une feuille souple et éclairée. Un dessin vu de dessus (raie, tortue, papillon) est vu un peu en plongée, et ses deux côtés ondulent ensemble comme des ailes. Un dessin vu de profil se courbe de gauche à droite, la queue plus que la tête. Dans les films de la mer, du ciel et de l'espace, le dessin **vient vers l'écran** et passe tout contre (gros plan) ; à la fin de la fête, il saute vers l'écran. Sans WebGL, le dessin reste **déformé** en 2D (maillage de triangles) : il ondule en nageant, bat des ailes en volant, tremblote en flottant, se tasse en retombant, se penche en glissant, se dandine en dansant, et sautille quand il parle.

**Ses paroles** : avant le film, on dit ce qu'est le dessin (poisson, raie, dinosaure, fusée…), on peut lui donner un nom (« la raie tachetée ») et une phrase à dire. Il se présente, parle de ses couleurs (repérées sur le dessin : « Je suis toute bleue avec un peu de vert ! »), dit une phrase propre à ce qu'il est, une phrase du film, puis au revoir. Les répliques s'affichent dans des bulles et sont dites **à voix haute** par la voix du téléphone (synthèse vocale de l'appareil, rien n'est envoyé sur Internet) ; le bouton Son coupe aussi la voix.

Bouton « Essayer sans imprimer » : film avec une page déjà coloriée.

Les boutons photo ouvrent directement l'appareil photo (`capture`) ; « Choisir une photo déjà prise » ouvre la photothèque. Les champs de fichier s'ouvrent par une étiquette (`<label for>`), jamais par un clic de script.

## Fichiers

- `js/pages.js` : les coloriages, décrits en millimètres (sert à imprimer, à reconnaître la photo et à découper les personnages).
- `js/photo.js` : recherche des carrés noirs, redressement de la photo, correction de la lumière.
- `js/anim.js` : le dessin animé et les sons (fabriqués sur place).
- `js/libre.js` : « n'importe quel dessin » (découpe sur la photo, façons de bouger, film).
- `js/scenes.js` : les 8 films (décor, animations, musique, phrase).
- `js/catalogue.js` : les feuilles à colorier.
- `js/compagnons.js` : les compagnons (dessins et trajets).
- `js/acteur3d.js` : le dessin en 3D (three.js).
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

## Fluidité

Le film est pensé en 1280 × 720, mais dessiné à 75 % de cette taille sur téléphone ; si l'appareil passe sous 38 images par seconde, la taille baisse encore (jusqu'à 50 %). Les effets lourds (dégradés, halos) sont préparés une seule fois.
