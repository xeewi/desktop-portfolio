# Accessibilité

Le site vise la norme **WCAG 2.2, niveau AA**, sur tous les OS, tous les thèmes, en desktop comme sur mobile.
Cette note explique pourquoi, ce que ça implique, ce qui a été changé (octobre 2026) et comment ça reste vrai
dans le temps.

## Pourquoi

- **Des gens réels utilisent le site autrement qu'à la souris** : au clavier seul, avec un lecteur d'écran
  (VoiceOver, NVDA), en commande vocale, avec un zoom fort ou une vue basse. Environ une personne sur six vit
  avec un handicap, sans compter les situations temporaires (bras cassé, plein soleil sur l'écran).
- **C'est un portfolio** : il est lu par des recruteurs et des clients, et il montre comment on travaille.
  Un site qui ressemble à un bureau Windows mais qui ne s'utilise qu'à la souris dit le contraire de ce qu'on
  veut montrer.
- **C'est la norme de référence** : WCAG est le standard du W3C, repris par le RGAA en France et par
  l'European Accessibility Act (en vigueur depuis juin 2025). AA est le niveau exigé partout.
- **Le concept du site rend l'exercice difficile**, donc intéressant : fenêtres qui se chevauchent, menus,
  barre des tâches, et 55 thèmes qui copient des couleurs d'OS pensées à une époque où le contraste
  n'était pas un sujet.

## Ce que WCAG 2.2 AA demande, en bref

Quatre principes : le contenu doit être **perceptible**, **utilisable**, **compréhensible** et **robuste**.
Concrètement, pour ce site :

| Sujet | Exigence | Critère |
|---|---|---|
| Contraste du texte | 4,5:1 (3:1 pour le gros texte et les éléments d'interface) | 1.4.3, 1.4.11 |
| Clavier | tout se fait au clavier, sans piège | 2.1.1, 2.1.2 |
| Focus | toujours visible, jamais caché sous autre chose | 2.4.7, 2.4.11 |
| Structure | titres hiérarchisés, zones (navigation, contenu principal, pied) | 1.3.1, 2.4.1 |
| Noms | chaque contrôle a un nom, qui commence par son texte visible | 4.1.2, 2.5.3 |
| Cibles | 24×24 px minimum, ou espacées de 24 px | 2.5.8 |
| Langue | langue de la page et des passages dans une autre langue | 3.1.1, 3.1.2 |
| Mouvement | pas d'animation imposée (`prefers-reduced-motion`) | 2.3.3, 2.2.2 |

## Ce qui a été changé

### Point de départ

Un audit automatique (axe-core, l'outil de référence) sur les 55 thèmes × 7 fenêtres donnait :
**1 417 problèmes de contraste**, 546 cibles trop petites, des titres dans le désordre, des zones
défilantes inaccessibles au clavier. Aucun thème n'était conforme. Le site avait déjà de bonnes bases :
`lang` sur la page, `aria-label` sur les boutons de fenêtre, mouvement réduit respecté.

### Contraste : lisible par construction

Le cœur du problème : les palettes reprennent les vraies couleurs des OS, et beaucoup échouent.
Le bleu macOS `#007aff` sous du texte blanc donne 4:1, l'orange Ubuntu `#e95420` 3,6:1.

Plutôt que de corriger 55 thèmes à la main (et de recommencer à chaque nouveau thème), une fonction
`readable()` (`src/design-system/tokens/contrast.ts`) passe sur chaque thème au moment où il est appliqué :

- elle assombrit (thème clair) ou éclaircit (thème sombre) `--ink`, `--muted`, `--heading` et `--accent`
  juste assez pour atteindre 4,5:1, sur le papier et sur les fonds teintés (élément sélectionné, carte de thème) ;
- elle garde la teinte, donc le thème reste reconnaissable ;
- elle ajoute `--on-accent` (blanc ou noir, la couleur du texte posé sur l'accent) et `--desk-ink`
  (libellés des icônes du bureau sur un fond d'écran uni trop clair pour du blanc).

Conséquence visible : certaines couleurs sont un peu plus profondes que l'original (l'orange Yaru tire vers
le rouille, le bleu macOS est plus foncé). C'est un choix assumé : lisible avant fidèle.

Les couleurs hors palette (barres de titre, barres des tâches) ont été corrigées à la main dans les thèmes
concernés : XP Olive, Crystal, Pink et Silver, Solarized, et le post-it.

### Contour des boutons et sélection (octobre 2026)

axe ne vérifie que le contraste du **texte**. Le contour d'un contrôle et l'indication d'un état (critère
1.4.11, 3:1) lui échappent, et il a fallu un œil humain pour voir que les boutons secondaires étaient
**invisibles en mode sombre macOS** (fond du bouton = fond de la fenêtre, pas de bordure). Une mesure sur
tous les thèmes a montré que le problème était plus large :

| | Avant | Après |
|---|---|---|
| Bouton secondaire, macOS / Ubuntu / Windows 10 | 1,0 à 1,4:1 | ≥ 3:1 |
| Bouton secondaire, Vista | 2,8:1 | ≥ 3:1 |
| Entreprise sélectionnée (Expérience), Ubuntu / XP / Vista | 1,1 à 3,4:1 | ≥ 3:1 |

Corrections :
- `readable()` calcule une couleur de contour `--edge` par thème : un gris teinté entre le fond et le texte,
  foncé ou éclairci juste assez pour 3:1 sur `--paper`. Les boutons secondaires l'utilisent comme bordure
  (sauf Windows 95 et XP, dont le relief et la bordure d'origine passaient déjà).
- La sélection dans l'explorateur a une bordure d'accent (Vista), une bordure foncée (XP, dont le panneau
  est déjà bleu) ou un fond d'accent plein (Ubuntu, comme macOS).
- Thème Aqua : son fond de fenêtre est rayé ; `--paper` vaut maintenant la rayure la plus foncée, celle
  contre laquelle le texte et les contours sont les moins lisibles.

### Structure

- Un `h1` invisible à l'écran (« Guillaume Gautier · … ») dans une zone `<main>` (composant `Workspace`),
  les titres de fenêtres en `h2`, les sections des applis en `h3`, les éléments en `h4`.
- Le menu Démarrer est une zone de navigation nommée.
- Les emojis et symboles décoratifs (📍, ✉️, ✓, ◀ ▶) sont masqués aux lecteurs d'écran.

### Clavier

- Ouvrir une fenêtre y amène le focus ; fermer ou réduire une fenêtre l'envoie à la suivante.
- Le contenu des fenêtres (et le panneau d'Experience) est focusable, donc défilable au clavier.
- Passer au Tab dans une fenêtre cachée derrière une autre la ramène devant (le focus n'est jamais masqué).
- Menu Démarrer : le focus entre dedans à l'ouverture, `Échap` le ferme et rend le focus au bouton.
- L'écran de démarrage se passe avec n'importe quelle touche.
- Les icônes du bureau gardent l'anneau de focus du navigateur (il était supprimé).

### Noms et langues

- Le bouton de langue s'annonce « EN, Passer en français » : il commence par ce qu'il affiche, pour la
  commande vocale (« clique sur EN »), et le libellé en français est marqué `lang="fr"`.
- Le « G » du bouton Démarrer est dessiné en CSS, hors du nom du bouton.

### Taille des cibles

Les boutons de fenêtre des thèmes classiques sont petits (12 à 21 px). Plutôt que de les agrandir,
ils sont espacés pour que leurs centres soient à 24 px, ce que la norme accepte : feux macOS à 12 px d'écart
(8 px dans le vrai macOS), boutons Windows 95 à 8 px, XP à 3 px, feux du thème Vista « Aqua » à 11 px.

### Bugs trouvés en route

- La poignée de redimensionnement invisible recouvrait le coin du bouton Fermer : un clic à cet endroit
  redimensionnait au lieu de fermer.
- Après avoir fermé ou réduit la fenêtre du dessus, plus aucune fenêtre n'était active.

### Retiré

- Le composant `Tabs` : inutilisé, et son rôle `tablist` sans navigation aux flèches ni panneaux était faux.
  À refaire proprement (motif ARIA complet) le jour où on en a besoin.

## Comment ça reste vrai

Trois filets, lancés avant chaque livraison :

1. **`npm run lint`** : règles `jsx-a11y` d'oxlint. Attrape à l'écriture un `div` cliquable, une image sans
   `alt`, un attribut ARIA invalide…
2. **`npm test`** : `tokens/contrast.test.ts` vérifie que chaque thème, après `readable()`, passe 4,5:1.
   Un nouveau thème est testé sans rien ajouter.
3. **`npm run test:e2e`** :
   - `e2e/a11y.spec.ts` lance axe sur chaque thème de chaque OS (lus depuis la fenêtre Personnaliser,
     donc les nouveaux sont inclus) et chaque fenêtre ; teste aussi le parcours clavier (focus, Échap,
     anneau de focus visible sur tout ce que Tab atteint) ;
   - `e2e/mobile.spec.ts` fait de même en mise en page tactile ;
   - `e2e/a11y.spec.ts` **mesure aussi les pixels à l'écran**, sur chaque thème : le bord des boutons doit
     ressortir à 3:1 sur au moins 2 côtés (le relief de Windows 95 n'en montre que 2), et la sélection
     dans Expérience sur au moins 1 (la barre de Windows 10). C'est ce qu'axe ne sait pas faire.

Les exceptions sont annotées dans le code (`oxlint-disable-next-line … --` avec la raison) ou dans
`e2e/helpers.ts`.

## Exceptions et limites connues

- **La signature du fond d'écran** (nom, titre en grand) est exclue du test de contraste : elle fait partie
  de l'image, répète la fenêtre « À propos » et est masquée aux lecteurs d'écran. WCAG prévoit cette
  exception pour le texte décoratif.
- **Déplacer une fenêtre au clavier** n'est pas possible. La norme ne l'exige pas : le bouton Agrandir donne
  accès à tout le contenu.
- **Liens qui ouvrent un nouvel onglet** (LinkedIn, GitHub, CV) : pas d'avertissement. Recommandé, pas
  obligatoire en AA.
- **Le titre de l'onglet** reste en anglais quand on passe en français.
- **Un outil automatique trouve environ la moitié des problèmes.** Le reste demande un passage humain :
  parcourir le site avec VoiceOver (`Cmd+F5` sur Mac) ou NVDA, au clavier seul, et zoomé à 200 %.
  À refaire après chaque gros changement d'interface.

## Pour aller plus loin

- [WCAG 2.2 en résumé (W3C)](https://www.w3.org/WAI/WCAG22/quickref/)
- [RGAA 4.1](https://accessibilite.numerique.gouv.fr/)
- [Motifs ARIA (W3C APG)](https://www.w3.org/WAI/ARIA/apg/patterns/) : comment faire un menu, des onglets,
  une boîte de dialogue accessibles
