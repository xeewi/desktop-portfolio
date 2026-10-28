# Choix techniques

Ce document explique **chaque choix technique du site**, **pourquoi** il a été fait, **comment** il est mis en
œuvre (avec les fichiers concernés) et **sur quelles références** il s'appuie. Il est complémentaire de :

- `docs/ACCESSIBILITE.md` : le détail de la démarche WCAG 2.2 AA (pourquoi, ce qui a changé, limites) ;
- `src/design-system/README.md` : le mode d'emploi du design system (ajouter un thème, un OS, une icône) ;

État décrit : octobre 2026 (React 19.3, Vite 8.3, TypeScript 7.0, Vitest 5.0, Playwright 1.64, oxlint 1.90).

## Sommaire

1. [Le produit en une phrase](#1-le-produit-en-une-phrase)
2. [Principe directeur : le moins de code et de dépendances possible](#2-principe-directeur--le-moins-de-code-et-de-dépendances-possible)
3. [Socle : React + TypeScript + Vite, en application statique](#3-socle--react--typescript--vite-en-application-statique)
4. [TypeScript 7 et une configuration stricte « effaçable »](#4-typescript-7-et-une-configuration-stricte--effaçable-)
5. [Architecture de l'application](#5-architecture-de-lapplication)
6. [État : des hooks React, pas de bibliothèque](#6-état--des-hooks-react-pas-de-bibliothèque)
7. [Le gestionnaire de fenêtres](#7-le-gestionnaire-de-fenêtres)
8. [Design system en trois couches : palette, tokens, composants](#8-design-system-en-trois-couches--palette-tokens-composants)
9. [CSS natif, variables CSS et spécificité maîtrisée](#9-css-natif-variables-css-et-spécificité-maîtrisée)
10. [Application du thème au runtime](#10-application-du-thème-au-runtime)
11. [Contraste « lisible par construction »](#11-contraste--lisible-par-construction-)
12. [Icônes : thèmes libres freedesktop, générés par script](#12-icônes--thèmes-libres-freedesktop-générés-par-script)
13. [Responsive : deux mises en page, pas une infinité](#13-responsive--deux-mises-en-page-pas-une-infinité)
14. [Bilingue sans bibliothèque d'i18n](#14-bilingue-sans-bibliothèque-di18n)
15. [Persistance : localStorage « au mieux »](#15-persistance--localstorage--au-mieux-)
16. [Mouvement et écran de démarrage](#16-mouvement-et-écran-de-démarrage)
17. [Accessibilité comme contrainte d'architecture](#17-accessibilité-comme-contrainte-darchitecture)
18. [Qualité : oxlint](#18-qualité--oxlint)
19. [Tests : Vitest pour la logique, Playwright pour le reste](#19-tests--vitest-pour-la-logique-playwright-pour-le-reste)
20. [Performance et poids](#20-performance-et-poids)
21. [Ce qui a été volontairement laissé de côté](#21-ce-qui-a-été-volontairement-laissé-de-côté)
22. [Limites connues et pistes](#22-limites-connues-et-pistes)
23. [Bibliographie](#23-bibliographie)

---

## 1. Le produit en une phrase

Un portfolio qui se présente comme **un faux bureau d'ordinateur** : fenêtres déplaçables, menu Démarrer, barre
des tâches, icônes. Le visiteur choisit parmi **6 systèmes** (Windows 95, XP, Vista, 10, Ubuntu, macOS) et
**55 thèmes**, en anglais ou en français, sur ordinateur comme sur téléphone.

Ce concept dicte presque tous les choix qui suivent : beaucoup de variations visuelles (→ design system à
tokens), une interaction riche à la souris (→ gestionnaire de fenêtres maison), un risque fort pour
l'accessibilité (→ tests automatiques à grande échelle), et aucun besoin de serveur (→ site statique).

## 2. Principe directeur : le moins de code et de dépendances possible

**Choix.** Le projet n'a que **deux dépendances d'exécution** : `react` et `react-dom`. Tout le reste
(gestion d'état, fenêtres, thèmes, i18n, contraste, stockage) est écrit à la main, en quelques dizaines de
lignes chacun. Les dépendances de développement se limitent aux outils de build, de types, de lint et de test.

**Pourquoi.**

- Chaque dépendance est du code qu'on ne maîtrise pas, à mettre à jour, à auditer, et qui pèse dans le
  bundle. Pour un site personnel maintenu par une seule personne, c'est le coût qui compte le plus sur la durée.
- Les besoins réels sont petits : deux langues, 8 fenêtres, un état local. Une bibliothèque générique
  apporterait surtout des fonctionnalités inutilisées.
- La plateforme web couvre aujourd'hui l'essentiel : variables CSS, `color-mix()`, `dvh`, `matchMedia`,
  Pointer Events, `localStorage`.

**Comment.** Règle appliquée à chaque besoin : d'abord vérifier si ça doit exister, puis si le code du projet
le fait déjà, puis la plateforme, puis une dépendance déjà installée, et seulement ensuite écrire le minimum.

**Références.**
- Martin Fowler, *Yagni* : <https://martinfowler.com/bliki/Yagni.html>
- MDN, *Using CSS custom properties* : <https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties>

## 3. Socle : React + TypeScript + Vite, en application statique

**Choix.** Une **SPA statique** : `index.html` + un bundle JS + un bundle CSS + des images. Pas de serveur,
pas de rendu côté serveur, pas de framework méta (Next.js, Remix, Astro…). Le projet est parti du template
officiel `create-vite` React + TypeScript (d'où le `README.md` d'origine).

**Pourquoi React.**
- L'interface est un **état qui change en continu** (fenêtres ouvertes, position, ordre d'empilement, thème,
  langue, menu ouvert) : c'est exactement le cas d'usage d'une bibliothèque d'UI déclarative.
- Écosystème, outillage de test et de lint matures (règles `rules-of-hooks`, `jsx-a11y`).
- C'est la stack principale de l'auteur : le portfolio montre ce qu'il fait au quotidien.

**Pourquoi pas de SSR / framework méta.** Le site n'a qu'une seule « page », pas de données distantes, pas
de route. Le SEO se limite à un titre et une description dans `index.html`. Un serveur ajouterait de
l'hébergement, du déploiement et de la complexité sans rien apporter au visiteur.

**Pourquoi Vite.**
- Serveur de dev instantané fondé sur les modules ES natifs, HMR rapide.
- Build de production optimisé (Vite 8 utilise Rolldown, bundler écrit en Rust).
- Fonctions utilisées par le projet : import d'assets (les icônes deviennent des URL hachées), `?raw` pour
  lire un fichier comme texte, `import.meta.glob` (test des icônes), `vite preview` pour servir le build aux
  tests e2e.
- Vitest réutilise la même configuration (`vite.config.ts`) : un seul pipeline de transformation pour l'app
  et les tests.

**Comment.**
- `index.html` : `lang="en"` et `data-chrome="vista"` posés d'emblée (page valide avant même que React
  démarre), `viewport-fit=cover` pour les écrans à encoche, `theme-color`, titre et description.
- `src/main.tsx` : `createRoot` + `<StrictMode>` (double exécution des effets en dev pour révéler les effets
  mal nettoyés).
- `vite.config.ts` : le plugin React et la config Vitest, rien d'autre.

**Références.**
- Vite, *Why Vite* : <https://vite.dev/guide/why>
- Vite, *Static asset handling* / *Glob import* : <https://vite.dev/guide/assets>, <https://vite.dev/guide/features#glob-import>
- Rolldown : <https://rolldown.rs/>
- React, *StrictMode* : <https://react.dev/reference/react/StrictMode>

## 4. TypeScript 7 et une configuration stricte « effaçable »

**Choix.** TypeScript **7** (le compilateur réécrit en Go par Microsoft), vérification seule (`noEmit`) :
c'est Vite qui transforme le code, `tsc -b` ne sert qu'à vérifier les types au build.

**Pourquoi.**
- TypeScript 7 vérifie les types environ 10 fois plus vite que la version JavaScript : le `npm run build`
  reste rapide.
- Les types attrapent à la compilation des erreurs qu'aucun test ne verrait : une traduction manquante, un
  nom d'icône inconnu, un identifiant d'application mal orthographié.

**Comment (options notables de `tsconfig.app.json`).**

| Option | Effet | Pourquoi |
|---|---|---|
| `moduleResolution: "bundler"`, `allowImportingTsExtensions` | résolution comme Vite | les imports écrits sont ceux que Vite comprend |
| `verbatimModuleSyntax` | `import type` obligatoire pour les types | le transpileur peut effacer les imports de type sans analyser le programme |
| `erasableSyntaxOnly` | interdit `enum`, `namespace`, propriétés de paramètre | le TS du projet se réduit à « JS + annotations effaçables », compatible avec le *type stripping* de Node et de tous les transpileurs rapides |
| `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` | lint dans le compilateur | pas de code mort |
| `skipLibCheck` | ne vérifie pas les `.d.ts` des dépendances | vitesse |

Deux projets séparés (`tsconfig.app.json` pour le navigateur, `tsconfig.node.json` pour les fichiers de config
et les tests e2e) car ils n'ont pas les mêmes globals (`DOM` d'un côté, `node` de l'autre).

**Techniques de typage utilisées.**
- **Types dérivés des données** plutôt qu'écrits deux fois : `AppId` est calculé depuis le tableau `APPS`
  (`as const satisfies …`, `src/apps/registry.ts`) ; `Palette` est `typeof basePalette` ; `Content` est
  le type du fichier anglais, et le fichier français doit le respecter (`fr: Content`), donc une clé oubliée
  en français est une erreur de compilation.
- `satisfies` vérifie la forme d'un objet sans perdre ses types littéraux.
- `NoInfer<Id>` dans `useWindowManager` empêche TypeScript d'élargir le type des identifiants à partir du
  paramètre `initiallyOpen`.
- Types de chaînes gabarits pour les tokens : `` Record<`--${string}`, string> ``.

**Références.**
- Microsoft, *A 10x Faster TypeScript* (annonce du portage natif) : <https://devblogs.microsoft.com/typescript/typescript-native-port/>
- TSConfig `erasableSyntaxOnly` : <https://www.typescriptlang.org/tsconfig/#erasableSyntaxOnly>
- TSConfig `verbatimModuleSyntax` : <https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax>
- Node.js, *TypeScript (type stripping)* : <https://nodejs.org/api/typescript.html>
- TypeScript 4.9, opérateur `satisfies` : <https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator>
- TypeScript 5.4, `NoInfer` : <https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-4.html#the-noinfer-utility-type>

## 5. Architecture de l'application

**Choix.** Quatre zones, chacune avec un rôle unique :

```
src/
  main.tsx              démarrage
  App.tsx               « composition root » : relie l'état aux composants, aucun style
  hooks/                l'état de l'application (fenêtres, thème, langue, heure, media query)
  apps/                 le contenu de chaque fenêtre (À propos, Expérience, Compétences…)
  content/              tous les textes, en anglais et en français, + les liens
  design-system/        tout ce qui est visuel : thèmes, tokens, composants, icônes
```

**Pourquoi.**
- **Le design system ne sait rien du contenu** : ses composants reçoivent des props et rendent du JSX. Pas
  d'état global, pas de `localStorage`, pas d'horloge à l'intérieur (`src/design-system/README.md`). On peut
  donc le tester, le faire évoluer ou le réutiliser seul.
- **`App.tsx` est le seul endroit qui assemble** : on lit l'application de haut en bas dans un fichier.
  C'est le motif *composition root*.
- **Le contenu est séparé du code** : changer une phrase ne touche aucun composant.
- **Colocation** : chaque composant a son dossier avec son `.tsx`, son `.css` et ses tests éventuels.
- **D'autres sites dans une fenêtre** (`WebApp`) : une `iframe` avec un titre, et un lien « Ouvrir dans un
  nouvel onglet » au cas où le site refuserait d'être intégré. Les tests remplacent ces sites par une page
  factice : on teste la fenêtre, pas le serveur de quelqu'un d'autre.

**Comment.**
- Registre des applications (`src/apps/registry.ts`) : un tableau déclare id, icône et largeur. Bureau, menu
  Démarrer et barre des tâches sont tous générés à partir de lui ; ajouter une application = une ligne + un
  composant.
- **Composants composés** pour les gros éléments (`StartMenu.Root / .Apps / .App / .Links…`,
  `Explorer.Root / .Sidebar / .Content…`) : l'appelant choisit ce qu'il met et dans quel ordre, sans liste
  de props à rallonge.
- Point d'entrée unique `design-system/index.ts` : l'application n'importe jamais un fichier interne.

**La fenêtre « Sous le capot ».** Une version courte de ce document vit dans le site, sous forme de mini-application
(`src/apps/hood/`) : un écran d'accueil (trois `NavCard`) mène à trois écrans, et un bouton **Retour** ramène toujours
à l'accueil, d'où qu'on vienne. Dans l'explorateur, on se déplace entre dossiers avec le chemin cliquable et la
colonne de gauche : Retour ne remonte pas l'arborescence, il sort de l'écran. Après chaque déplacement, le focus va
au titre du nouvel écran, pour que clavier et lecteur d'écran repartent du haut de ce qui a changé.
- **Choix techniques** : une note par choix (comment, pourquoi) et un bouton « Montre-moi » qui met en évidence la
  partie de l'écran concernée (celui de la note sur les tests ouvre l'écran Tests).
- **Architecture** : un explorateur du dépôt. On ouvre les dossiers et on lit le code de chaque fichier texte
  (`sources.ts` : `import.meta.glob` en `?raw`, un petit morceau par fichier, téléchargé seulement à l'ouverture ;
  images, PDF et `package-lock.json` exclus). Les dossiers et fichiers clés portent une note (quoi, pourquoi), et
  `architecture.test.ts` vérifie que chaque chemin cité s'ouvre bien. La logique (lister un dossier, le fil
  d'Ariane) est une fonction pure testée (`files.ts`).
- **Tests** : les résultats du dernier passage complet (`tests.json`, écrit par `e2e/reporter.ts`).
- Une seule fenêtre plutôt que trois : le bureau reste lisible pour les visiteurs non techniques, et le menu
  Démarrer ne recouvre pas les icônes. Des onglets ont été essayés puis abandonnés au profit de l'écran d'accueil.
- Les textes sont dans `content/` (clé `hood`), dans les deux langues ; ce que chaque note montre est dans
  `apps/hoodTargets.ts` (un sélecteur CSS, et ce qu'il faut ouvrir avant : une fenêtre ou le menu Démarrer).
- La surbrillance est un composant du design system, `Spotlight` : un anneau qui suit l'élément (mesuré à
  chaque image, pour suivre une fenêtre qui s'ouvre ou bouge), le reste de l'écran assombri, une légende
  annoncée aux lecteurs d'écran (`<output>`, rôle `status`). Il ne capte aucun clic.
- Clavier : `Échap` ferme et rend le focus au bouton qui l'a ouvert (motif des boîtes de dialogue de l'APG) ;
  un clic n'importe où ferme aussi. Le placement de la légende (dessous, sinon dessus, sinon dedans) est une
  fonction pure testée (`Spotlight/layout.ts`).
- Choisi plutôt qu'un mode « survol » sur tout le site : rien ne dépend du survol (inexistant au clavier et
  sur téléphone, WCAG 1.4.13), et la visite des non-techniciens n'est pas encombrée.

**Références.**
- Mark Seemann, *Composition Root* : <https://blog.ploeh.dk/2011/07/28/CompositionRoot/>
- Kent C. Dodds, *Colocation* : <https://kentcdodds.com/blog/colocation>
- Kent C. Dodds, *Compound Components with React Hooks* : <https://kentcdodds.com/blog/compound-components-with-react-hooks>

## 6. État : des hooks React, pas de bibliothèque

**Choix.** Pas de Redux, Zustand, Jotai ni Context : cinq hooks dans `src/hooks/`, appelés depuis `App.tsx`,
qui passe les valeurs en props.

| Hook | Rôle | Primitive React |
|---|---|---|
| `useWindowManager` | ouvert / réduit / agrandi, position, taille, ordre des fenêtres | `useState` |
| `useThemeSelection` | OS + thème courants, appliqués avant l'affichage | `useState` + `useLayoutEffect` |
| `useLang` | langue, mémorisée, posée sur `<html lang>` | `useState` + `useEffect` |
| `useMediaQuery` | mise en page tactile ou bureau, en direct | `useSyncExternalStore` |
| `useNow` | l'heure, chaque seconde (horloge, barre des tâches) | `useState` + `setInterval` |

**Pourquoi.**
- L'état est **petit et ne descend que d'un ou deux niveaux** : des props suffisent, et elles rendent le flux
  de données lisible.
- Les primitives React couvrent chaque cas. En particulier `useSyncExternalStore` est la façon officielle de
  s'abonner à une source extérieure (ici `matchMedia`) sans état incohérent pendant le rendu concurrent.
- `useLayoutEffect` pour le thème : il s'exécute **avant que le navigateur peigne**, donc on ne voit jamais
  le thème par défaut clignoter avant le thème mémorisé.

**Références.**
- React, *useSyncExternalStore* : <https://react.dev/reference/react/useSyncExternalStore>
- React, *useLayoutEffect* : <https://react.dev/reference/react/useLayoutEffect>
- React, *You Might Not Need an Effect* : <https://react.dev/learn/you-might-not-need-an-effect>
- React, *Choosing the State Structure* : <https://react.dev/learn/choosing-the-state-structure>

## 7. Le gestionnaire de fenêtres

**Choix.** Un gestionnaire de fenêtres **écrit à la main** (≈ 60 lignes, `src/hooks/useWindowManager.ts`)
et un composant `Window` qui utilise les **Pointer Events** natifs. Pas de bibliothèque de drag & drop.

**Pourquoi.**
- Les bibliothèques de glisser-déposer visent les listes triables ou le transfert de données entre zones ;
  ici on ne fait que déplacer un rectangle.
- Pointer Events unifie souris, stylet et doigt dans une seule API ; `setPointerCapture` garantit qu'on
  continue de recevoir les mouvements même si le pointeur sort de la barre de titre.

**Comment.**
- **Logique pure à part** (`components/Window/geometry.ts`) : `resizeRect()` (8 poignées, taille minimale
  300×180, jamais au-dessus de l'écran) et `dragTo()` (garde toujours 120 px de barre de titre à l'écran
  pour pouvoir la rattraper). Ces fonctions n'ont ni DOM ni React, elles sont testées unitairement
  (`geometry.test.ts`). C'est le motif « cœur fonctionnel, coquille impérative ».
- **Ordre d'empilement** : chaque fenêtre a un `z` ; mettre au premier plan = `max(z) + 1`. La fenêtre
  active n'est pas stockée, elle est **calculée** (`topWindow()` : la plus haute parmi celles ouvertes et
  non réduites). Un état dérivé ne peut pas se désynchroniser ; un bug où plus aucune fenêtre n'était active
  après fermeture a été corrigé ainsi, avec un test de non-régression.
- **Hauteur libre par défaut** : `h` est indéfini tant que l'utilisateur n'a pas redimensionné, la fenêtre
  épouse son contenu.
- **Fenêtre nouvellement ouverte ramenée dans l'écran** si la fenêtre du navigateur est petite.
- **La hauteur maximale tient compte de la position** : `max-height` = place disponible moins le `top` de la
  fenêtre (`--win-y`). Une fenêtre haute ouverte bas devient plus courte et défile à l'intérieur, au lieu de
  dépasser sous la barre des tâches.
- **Le bureau ne défile jamais** : `overflow: clip` et non `hidden`. Une boîte en `hidden` peut encore être
  défilée par `focus()` ; donner le focus au menu Démarrer de XP pendant qu'il montait de sous l'écran faisait
  sauter tout le bureau (test de non-régression dans `motion.spec.ts`).
- La largeur utilisée pendant le glisser est la largeur **rendue** (`getBoundingClientRect`), pas la prop, car
  un `max-width` CSS peut la réduire.

**Références.**
- MDN, *Pointer events* : <https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events>
- MDN, *Element.setPointerCapture()* : <https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture>
- Gary Bernhardt, *Functional Core, Imperative Shell* : <https://www.destroyallsoftware.com/screencasts/catalog/functional-core-imperative-shell>

## 8. Design system en trois couches : palette, tokens, composants

C'est le choix structurant du projet : comment afficher **6 OS × 55 thèmes** avec **un seul jeu de
composants** ?

**Choix.** Trois couches, chacune ne parlant qu'à celle du dessous :

```
themes/*.ts      palette   --accent, --paper, --wall, --title-a…    couleurs et polices (1 fichier par OS)
chromes/*.css    tokens    --win-radius, --ctrl-bg, --task-h…      l'allure d'une famille d'OS
components/X/    composants : ne lisent que des tokens, ne savent pas sur quel OS ils sont
```

- Un **thème** (palette) ne liste que ce qu'il change par rapport à la palette de base de son OS :
  `t(base, 'zune', 'Zune', {en, fr}, { '--accent': '#f08020' })`. Ajouter un thème = une ligne.
- Un **chrome** (biseaux Windows 95, Luna XP, verre Vista, plat Windows 10, GNOME, macOS) ne contient
  **que des valeurs de tokens**, aucun sélecteur sur un composant.
- Les **composants** lisent `var(--…)` et n'ont jamais de `[data-chrome='xp'] .ds-window { … }`.

**Pourquoi.**
- Sans cette séparation, chaque composant devrait connaître chaque OS : 6 × 30 composants de cas
  particuliers. Avec, ajouter un OS = un fichier de palette + un fichier de tokens.
- C'est l'approche des *design tokens* (formalisée par le W3C Design Tokens Community Group) : des décisions
  de design nommées, découplées de leur utilisation.
- Les tokens sont déclarés sur `[data-chrome]` **et non sur `:root`** : la page et chaque miniature de la
  fenêtre « Personnaliser » portent leur propre `data-chrome`. Une miniature peut ainsi afficher un autre OS
  que la page **avec les mêmes composants** (`ThemePreview`).
- `tokens/base.css` liste **tous** les tokens avec leur valeur par défaut (le look Vista) et un commentaire :
  c'est la documentation de référence de ce qu'on peut régler.

**Comment.**
- Les états visuels passent par des **attributs de données ou ARIA** (`data-active`, `aria-pressed`,
  `aria-current`) plutôt que des classes modificatrices : un seul vocabulaire sert au style, à
  l'accessibilité et aux tests.
- Les rares thèmes qui touchent un composant passent par `tokens` (toutes tailles) ou `desktopTokens`
  (bureau seulement, par exemple les feux tricolores Aqua du thème Vista).
- Préfixe `ds-` et nommage de type BEM (`ds-window__titlebar`) pour éviter les collisions sans outil.

**Références.**
- W3C Design Tokens Community Group : <https://www.designtokens.org/> — format : <https://tr.designtokens.org/format/>
- BEM : <https://getbem.com/>
- MDN, *Using data attributes* : <https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Solve_HTML_problems/Use_data_attributes>

## 9. CSS natif, variables CSS et spécificité maîtrisée

**Choix.** **CSS pur**, un fichier par composant importé par le composant. Ni Tailwind, ni CSS-in-JS, ni CSS
Modules, ni préprocesseur.

**Pourquoi.**
- Le thème change **au runtime** pour 55 combinaisons : c'est précisément ce que font les variables CSS
  (elles cascadent et se recalculent sans JavaScript). Un CSS-in-JS régénérerait des styles ; Tailwind
  ne gère pas bien des valeurs qui dépendent d'un thème choisi par le visiteur sans tout repasser par
  des variables de toute façon.
- Zéro coût d'exécution, zéro dépendance, lisible par n'importe qui.
- Le CSS moderne couvre ce qui manquait autrefois : imbrication des variables, `color-mix()` pour les
  teintes, `:where()` pour la spécificité, `dvh` et `env(safe-area-inset-*)` pour le mobile.

**Comment.**
- **Ordre d'import explicite** (`chromes/index.css`) : défauts, puis groupes partagés (`_flat.css` pour tous
  sauf Vista, `_shell.css` pour Ubuntu et macOS), puis chaque OS. Même spécificité partout, donc c'est
  l'ordre qui décide, de façon prévisible.
- **`:where()`** pour écrire des règles partagées sans augmenter la spécificité :
  `[data-chrome]:not(:where([data-chrome='vista']))` garde la spécificité de `[data-chrome]`, donc un fichier
  d'OS chargé après gagne toujours, sans `!important`.
- **`initial`** comme valeur de token signifie « pas de surcharge, le composant garde sa valeur » (fallback
  de `var()`).
- **`color-mix()`** pour dériver les fonds teintés (élément sélectionné, carte de thème) de l'accent du
  thème, sans stocker de couleur supplémentaire.

**Références.**
- MDN, *:where()* (spécificité nulle) : <https://developer.mozilla.org/en-US/docs/Web/CSS/:where>
- MDN, *color-mix()* : <https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix>
- MDN, *Cascade, specificity, and inheritance* : <https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Handling_conflicts>
- MDN, *env()* : <https://developer.mozilla.org/en-US/docs/Web/CSS/env>

## 10. Application du thème au runtime

**Choix.** `applyTheme()` (`src/design-system/runtime/theme.ts`) écrit la palette **en styles inline sur
`<html>`** et pose `data-chrome`. Les surcharges réservées au bureau vont dans **une petite feuille `<style>`**
générée.

**Pourquoi.**
- Un style inline sur `<html>` est la façon la plus directe de définir des variables CSS pour toute la page,
  et il suffit de l'effacer (`removeAttribute('style')`) pour repartir de zéro au changement de thème.
- Les styles inline ne peuvent pas contenir de media query : d'où la feuille générée
  `@media (desktop) { html[data-chrome] { … } }`. Le sélecteur `html[data-chrome]` est un cran plus
  spécifique que `[data-chrome]` des fichiers de chrome : il gagne **sans `!important`**.
- Appliqué dans un `useLayoutEffect`, donc avant l'affichage : pas de flash du thème par défaut.
- **OS de la première visite : l'inverse de celui du visiteur** (`defaultOsId()`, lu dans le user agent,
  seule source disponible). Windows sur ordinateur → macOS ; macOS, Linux, mobiles et inconnus → Windows XP.
  Un choix mémorisé passe toujours avant.

**Références.**
- MDN, *CSSStyleDeclaration.setProperty()* : <https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/setProperty>
- React, *useLayoutEffect* : <https://react.dev/reference/react/useLayoutEffect>

## 11. Contraste « lisible par construction »

**Problème.** Les thèmes reprennent les vraies couleurs des OS, et beaucoup échouent au contraste WCAG : le
bleu macOS `#007aff` sur blanc donne 4,0:1, l'orange Ubuntu 3,6:1, pour 4,5:1 exigés. Le premier audit
comptait 1 417 problèmes de contraste.

**Choix.** Plutôt que corriger 55 thèmes à la main (et recommencer à chaque nouveau thème), une fonction
**`readable()`** (`src/design-system/tokens/contrast.ts`, ≈ 90 lignes) passe sur chaque palette au moment où
elle est appliquée.

**Comment.**
- Implémente **la formule WCAG** : luminance relative (conversion sRGB → linéaire, coefficients 0,2126 /
  0,7152 / 0,0722), puis ratio `(L1 + 0,05) / (L2 + 0,05)`.
- Pousse `--ink`, `--muted`, `--heading` et `--accent` vers le noir (fond clair) ou le blanc (fond sombre),
  par pas de 2 %, **juste assez** pour atteindre le seuil sur le papier **et** sur les fonds teintés où ce
  texte apparaît. La teinte est conservée : le thème reste reconnaissable.
- Seuil fixé à **4,6** et non 4,5 : marge pour les arrondis de `color-mix()` dans le navigateur.
- Ajoute trois variables dérivées : `--on-accent` (texte blanc ou noir posé sur l'accent), `--desk-ink`
  (libellés des icônes du bureau sur un fond uni trop clair pour du blanc) et `--edge` (contour des
  contrôles, 3:1 sur le fond, WCAG 1.4.11).
- Compromis assumé et documenté : certaines couleurs sont un peu plus profondes que l'original. **Lisible
  avant fidèle.**

**Pourquoi c'est robuste.** `contrast.test.ts` boucle sur **tous les thèmes de tous les OS** : un thème
ajouté demain est testé sans écrire de test. Les couleurs hors palette (barres de titre, barres des tâches)
sont vérifiées par axe dans les tests e2e. axe ne voyant pas le contour des contrôles, un test e2e mesure
les pixels à l'écran (bord du bouton contre ce qui l'entoure) sur chaque thème.

**Références.**
- W3C, WCAG 2.2, définition de la luminance relative : <https://www.w3.org/TR/WCAG22/#dfn-relative-luminance>
- W3C, WCAG 2.2, ratio de contraste : <https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio>
- W3C, *Understanding SC 1.4.3 Contrast (Minimum)* : <https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html>
- W3C, *Understanding SC 1.4.11 Non-text Contrast* : <https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html>

## 12. Icônes : thèmes libres freedesktop, générés par script

**Choix.** Chaque OS a ses propres icônes, tirées de **thèmes d'icônes open source** (Chicago95,
B00merang XP / 7 / 10, Yaru, WhiteSur), téléchargées par `scripts/fetch-icons.mjs` et **versionnées** dans
`src/design-system/icons/`.

**Pourquoi.**
- Dessiner 6 × 8 icônes fidèles prendrait des jours ; des communautés l'ont déjà fait, sous licence libre.
- Tous ces thèmes suivent la **spécification freedesktop de nommage des icônes** (`folder`, `internet-mail`,
  `preferences-system`…). Une seule table de correspondance « nom du site → noms freedesktop » sert donc à
  tous les OS.
- Script exécuté à la main, résultat versionné : le build ne dépend pas du réseau ni de GitHub.

**Comment.**
- Le script lit l'arbre du dépôt via l'API GitHub *Git Trees*, choisit pour chaque nom le meilleur fichier
  (le plus grand, SVG avant PNG à taille égale, sans variantes `symbolic`/`dark`/`@2x`), suit les liens
  symboliques git, puis écrit les fichiers, `icons.css` et `CREDITS.md` (licences).
- `icons.css` définit **un token par icône et par OS** (`--icon-folder: url(…)`). `<Icon name="folder" />`
  affiche `background-image: var(--icon-folder)` : **seules les images de l'OS courant sont téléchargées**,
  car le navigateur ne charge une `url()` que lorsqu'elle est réellement utilisée.
- Icônes à `1em` : on les dimensionne avec `font-size`.
- Toujours décoratives (`aria-hidden`) : le nom est porté par le texte du bouton.
- `Icon.test.ts` vérifie que chaque OS a toutes ses icônes et que chaque fichier référencé existe.

**Références.**
- freedesktop.org, *Icon Naming Specification* : <https://specifications.freedesktop.org/icon-naming-spec/latest/>
- GitHub REST API, *Git trees* : <https://docs.github.com/en/rest/git/trees>
- Crédits et licences : `src/design-system/icons/CREDITS.md`

## 13. Responsive : deux mises en page, pas une infinité

**Choix.** Deux modes seulement :

- **tactile** : `(max-width: 760px), (max-height: 500px)` — fenêtres plein écran, non déplaçables ni
  redimensionnables, grandes cibles, on démarre sur la grille d'icônes comme un écran d'accueil ;
- **bureau** : `(min-width: 761px) and (min-height: 501px)` — vraies fenêtres.

**Pourquoi.**
- Un bureau à fenêtres flottantes n'a pas de sens sur 390 px de large ; le modèle mental du téléphone
  (une appli à la fois, plein écran) est le bon.
- La **hauteur** compte aussi : un téléphone en paysage a de la largeur mais 400 px de haut.
- Deux modes = deux cas à tester, pas une infinité.

**Comment.**
- Les requêtes sont en constantes dans `runtime/media.ts` (`TOUCH`, `DESKTOP`) pour le JS
  (`useMediaQuery`), et réécrites dans le CSS (le CSS ne peut pas importer de constante). Un commentaire de
  chaque côté rappelle de les garder synchronisées.
- `100dvh` (hauteur dynamique, qui tient compte des barres du navigateur mobile) et
  `env(safe-area-inset-*)` (encoches) avec `viewport-fit=cover`.
- Cibles de 44 px en tactile (WCAG 2.5.5 niveau AAA et recommandations Apple), 24 px minimum ailleurs.
- Projet Playwright dédié « mobile » (Pixel 7) qui rejoue axe sur chaque OS et chaque appli.

**Références.**
- MDN, *Viewport units (dvh)* : <https://developer.mozilla.org/en-US/docs/Web/CSS/length#viewport-percentage_lengths>
- MDN, *env()* et *safe-area-inset* : <https://developer.mozilla.org/en-US/docs/Web/CSS/env>
- W3C, *Understanding SC 2.5.8 Target Size (Minimum)* : <https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html>
- Apple, *Human Interface Guidelines — Accessibility* (44 pt) : <https://developer.apple.com/design/human-interface-guidelines/accessibility>

## 14. Bilingue sans bibliothèque d'i18n

**Choix.** Deux objets TypeScript, `src/content/en.ts` et `fr.ts`. Le français est typé `Content` (le type
de l'anglais). Pas de react-i18next, de FormatJS ni de fichiers JSON.

**Pourquoi.**
- Deux langues, ~100 chaînes, pas de traducteurs externes : une bibliothèque d'i18n (chargement, clés en
  chaînes, interpolation) n'apporterait rien.
- **Le compilateur garantit la complétude** : une clé manquante en français est une erreur de type, pas une
  chaîne vide en production. Avec des clés en chaîne (`t('ui.close')`), une faute de frappe passe.
- Les pluriels ou formats simples sont de simples fonctions (`status: (n) => …`).
- Dates et heures via l'API **`Intl`** native, avec la locale du contenu (`ui.locale`).

**Comment.**
- `useLang` : anglais par défaut, choix mémorisé, posé sur `<html lang>` (lecteurs d'écran, césure,
  correcteurs).
- Le bouton de langue affiche « EN » et s'annonce « EN, Passer en français », avec `lang="fr"` sur la partie
  française (WCAG 3.1.2 et 2.5.3).
- Les noms accessibles (`aria-label`) sont eux aussi dans `content/`, donc traduits.

**Références.**
- MDN, *Intl* : <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl>
- W3C, *Understanding SC 3.1.2 Language of Parts* : <https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html>
- W3C, *Understanding SC 2.5.3 Label in Name* : <https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html>

## 15. Persistance : localStorage « au mieux »

**Choix.** OS, thème par OS et langue sont mémorisés dans `localStorage` via deux fonctions `read()` /
`write()` (`runtime/storage.ts`) qui **ne lèvent jamais d'exception**.

**Pourquoi.**
- Préférences d'affichage d'un seul visiteur, non sensibles : pas besoin de serveur ni de cookie.
- `localStorage` peut lever une exception (navigation privée de certains navigateurs, stockage désactivé,
  quota). Le site doit fonctionner quand même : le choix n'est simplement pas retenu.
- Un thème mémorisé **par OS** (`theme:<os>`) : revenir sur un OS restaure son thème.
- Aucun cookie, aucun traceur : pas de bandeau de consentement nécessaire pour ce stockage, qui relève des
  préférences demandées par l'utilisateur.

**Références.**
- MDN, *Window.localStorage — Exceptions* : <https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage#exceptions>
- CNIL, *Cookies et autres traceurs* (les traceurs strictement nécessaires à un service demandé sont exemptés de consentement) : <https://www.cnil.fr/fr/cookies-et-autres-traceurs>

## 16. Mouvement et écran de démarrage

**Choix.** Un écran de démarrage (≈ 2,2 s) à l'arrivée et à chaque changement d'OS, et quelques animations
(apparition des fenêtres, menu). **Tout s'arrête sous `prefers-reduced-motion: reduce`**, de façon globale.

**Pourquoi.**
- L'écran de démarrage fait partie de la mise en scène (« l'ordinateur redémarre »), mais il ne doit jamais
  bloquer : un clic **ou n'importe quelle touche** le passe, et il est masqué aux lecteurs d'écran
  (`aria-hidden`), la page en dessous étant déjà utilisable.
- Les animations peuvent provoquer des nausées ou des vertiges chez les personnes atteintes de troubles
  vestibulaires. Une seule règle globale (`animation-duration: 0s; transition-duration: 0s`) couvre tous
  les composants présents et futurs, sans qu'on ait à y penser.
- Les tests e2e tournent en mouvement réduit par défaut (rapides et déterministes) ; `boot.spec.ts` le
  réactive pour tester l'écran de démarrage.

**Références.**
- MDN, *prefers-reduced-motion* : <https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion>
- W3C, *Understanding SC 2.3.3 Animation from Interactions* : <https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html>
- W3C, *Understanding SC 2.2.2 Pause, Stop, Hide* : <https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html>

## 17. Accessibilité comme contrainte d'architecture

Le détail complet est dans `docs/ACCESSIBILITE.md`. Ici, les choix **techniques** qui en découlent.

**Choix.** Cible **WCAG 2.2 niveau AA**, vérifiée automatiquement à trois niveaux (lint, test unitaire du
contraste, axe-core en e2e sur chaque thème × chaque appli).

**Pourquoi.**
- C'est la norme de référence, reprise par le RGAA en France et exigée par l'**European Accessibility Act**
  (directive (UE) 2019/882, applicable depuis le 28 juin 2025).
- Environ une personne sur six vit avec un handicap important (OMS).
- Un portfolio montre comment on travaille : un faux bureau utilisable seulement à la souris dirait l'inverse.

**Choix techniques qui en découlent.**
- **Éléments natifs d'abord** (`<button>`, `<a href>`, `<nav>`, `<main>`, `<section aria-label>`, vrais
  titres) : ils apportent clavier, focus et rôle gratuitement. C'est la « première règle d'ARIA ».
- **Structure de titres** : un `h1` masqué visuellement dans `<main>` (`Workspace`), titres de fenêtres en
  `h2`, sections en `h3`, éléments en `h4` (composant `Heading` qui impose le niveau).
- **Gestion du focus** :
  - ouvrir une fenêtre y amène le focus, mais **seulement après une interaction** du visiteur
    (`navigator.userActivation.hasBeenActive`) : au chargement de la page, on ne vole pas le focus ;
  - fermer ou réduire une fenêtre donne le focus à la suivante (calculée par `topWindow()`) ;
  - passer au Tab dans une fenêtre cachée la ramène devant (WCAG 2.4.11, focus jamais masqué) ;
  - menu Démarrer : le focus y entre, `Échap` le ferme et rend le focus au bouton.
- **Zones défilantes focusables** (`tabIndex={0}`) pour défiler au clavier (WCAG 2.1.1).
- **Cibles** : les petits boutons de fenêtre des thèmes rétro (12 à 21 px) sont **espacés** pour que leurs
  centres soient à 24 px, ce que la norme accepte, au lieu de les grossir et de trahir l'OS.
- Classe `.ds-sr-only` avec `clip-path: inset(50%)` (technique actuelle, `clip` étant déprécié).

**Références.**
- W3C, *WCAG 2.2* : <https://www.w3.org/TR/WCAG22/> — résumé : <https://www.w3.org/WAI/WCAG22/quickref/>
- W3C, *Using ARIA — First rule of ARIA use* : <https://www.w3.org/TR/using-aria/#rule1>
- W3C, *ARIA Authoring Practices Guide* : <https://www.w3.org/WAI/ARIA/apg/>
- W3C, *Understanding SC 2.4.11 Focus Not Obscured (Minimum)* : <https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html>
- MDN, *UserActivation* : <https://developer.mozilla.org/en-US/docs/Web/API/UserActivation>
- Directive (UE) 2019/882 (European Accessibility Act) : <https://eur-lex.europa.eu/eli/dir/2019/882/oj>
- RGAA 4.1 : <https://accessibilite.numerique.gouv.fr/>
- OMS, *Disability* : <https://www.who.int/news-room/fact-sheets/detail/disability-and-health>

## 18. Qualité : oxlint

**Choix.** **oxlint** (écrit en Rust, projet Oxc) au lieu d'ESLint, avec les plugins `react`, `typescript`,
`oxc` et **`jsx-a11y`** (28 règles d'accessibilité activées en erreur, `.oxlintrc.json`).

**Pourquoi.**
- 50 à 100 fois plus rapide qu'ESLint, sans configuration de parseur ni de plugins à installer : une seule
  dépendance.
- Les règles qui comptent ici existent : `rules-of-hooks` (React) et `jsx-a11y` (un `div` cliquable, une
  image sans `alt`, un attribut ARIA invalide sont refusés à l'écriture).
- Pas de Prettier non plus : volontairement, pas d'outil de plus pour un projet à un seul auteur.

**Comment.** Les exceptions sont **locales et justifiées** :
`// oxlint-disable-next-line jsx-a11y/… -- raison`. Exemple : la fenêtre (`<section>`) réagit au pointeur
uniquement pour passer au premier plan, ce n'est pas un contrôle.

**Références.**
- Oxc, *Oxlint* : <https://oxc.rs/docs/guide/usage/linter.html>
- Liste des règles : <https://oxc.rs/docs/guide/usage/linter/rules.html>
- eslint-plugin-jsx-a11y (règles d'origine) : <https://github.com/jsx-eslint/eslint-plugin-jsx-a11y>

## 19. Tests : Vitest pour la logique, Playwright pour le reste

**Choix.** Deux niveaux seulement :

1. **Un test end-to-end Playwright par fonctionnalité** (`e2e/*.spec.ts`), qui pilote le site comme un
   visiteur, sur le **build de production**.
2. **Des tests unitaires Vitest** (`src/**/*.test.ts`, à côté du code) **uniquement pour la logique pure** :
   maths des fenêtres, contraste, cohérence des thèmes, icônes, `topWindow()`.

Pas de tests de composants (Testing Library) : le balisage et le câblage sont couverts par l'e2e.

**Pourquoi.**
- Ce site est avant tout de l'interaction (glisser, focus, clavier, responsive) : seul un vrai navigateur
  le teste fidèlement. jsdom ne fait ni layout, ni Pointer Events réalistes, ni `matchMedia`.
- Les calculs (géométrie, contraste) se testent mieux isolés : rapide, exhaustif, sans navigateur. D'où la
  règle « extraire la logique en fonction pure d'abord ».
- C'est l'idée du *testing trophy* : beaucoup de tests proches de l'usage réel, des tests unitaires là où il
  y a de la logique, et l'analyse statique (types + lint) comme socle.
- **Chaque bug corrigé ajoute le test qui l'aurait attrapé**, marqué `// regression:`.

**Comment (Vitest).**
- Configuré dans `vite.config.ts` : mêmes transformations que l'app.
- `css.include` laisse passer `icons.css` en texte (Vitest vide le CSS par défaut) pour que `Icon.test.ts`
  puisse l'analyser ; `import.meta.glob` liste les fichiers d'icônes réellement présents.
- Tests **paramétrés par les données** : une boucle sur `OSES` et leurs thèmes ; un nouveau thème est testé
  sans nouvelle ligne de test.

**Comment (Playwright).**
- `webServer` lance `npm run build && vite preview` : on teste **ce qui sera déployé**.
- Deux projets : `desktop` (Chrome 1280×800) et `mobile` (Pixel 7) pour la mise en page tactile.
- `reducedMotion: 'reduce'` par défaut : pas d'écran de démarrage ni d'animation, tests rapides et stables.
- **Sélecteurs par rôle et nom accessible** (`getByRole('button', { name: 'Close' })`) via `e2e/helpers.ts` :
  si le test trouve le bouton, un lecteur d'écran aussi. Les tests vérifient l'accessibilité au passage.
- `visit(page, { os, lang })` pré-remplit `localStorage` avec un `addInitScript`, comme un visiteur qui
  revient.
- **axe-core** (`@axe-core/playwright`) sur **chaque thème de chaque OS × chaque appli**, avec les tags
  WCAG 2.0 / 2.1 / 2.2 A et AA. La liste des thèmes est lue dans la fenêtre « Personnaliser » : un nouveau
  thème est couvert automatiquement.
- Parcours clavier testés explicitement (`page.keyboard`, `toBeFocused()`).
- En CI : `forbidOnly`, une relance en cas d'échec, rapporteur GitHub ; trace conservée en cas d'échec.

**Limite connue.** Un outil automatique ne trouve qu'une partie des problèmes d'accessibilité (Deque estime
environ 57 % en volume). Un passage manuel au lecteur d'écran reste nécessaire après chaque gros changement
(voir `docs/ACCESSIBILITE.md`).

**Références.**
- Vitest, *Why Vitest* : <https://vitest.dev/guide/why>
- Playwright, *Best practices* : <https://playwright.dev/docs/best-practices>
- Playwright, *Locators* (priorité aux rôles) : <https://playwright.dev/docs/locators>
- Playwright, *Accessibility testing* : <https://playwright.dev/docs/accessibility-testing>
- Playwright, *Web server* : <https://playwright.dev/docs/test-webserver>
- Playwright, *Emulation (reducedMotion)* : <https://playwright.dev/docs/emulation>
- Testing Library, *Guiding principles* : <https://testing-library.com/docs/guiding-principles>
- Kent C. Dodds, *The Testing Trophy* : <https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications>
- Deque, *Automated testing coverage* : <https://www.deque.com/automated-accessibility-testing-coverage/>

## 20. Performance et poids

**État mesuré** (build d'octobre 2026) : JS **290 Ko (≈ 91 Ko gzip)**, CSS **88 Ko (≈ 21 Ko gzip)**, plus
les icônes de l'OS affiché uniquement.

**Choix qui y contribuent.**
- Deux dépendances d'exécution (React, React DOM), qui représentent l'essentiel du JS.
- Icônes chargées à la demande par le CSS (seul l'OS courant), avec noms de fichiers hachés par Vite
  (mise en cache longue durée possible).
- Fond d'écran en **dégradés CSS** et non en images : aucun octet téléchargé, net à toute résolution.
- Police Ubuntu en `display=swap` avec `preconnect` : le texte s'affiche tout de suite dans une police de
  secours. Les autres OS utilisent des **polices système** (`system-ui`, `-apple-system`, `Segoe UI`).
- Pas de React Compiler : le gain serait négligeable sur un arbre aussi petit, au prix d'un build plus lent.

**Références.**
- web.dev, *Establish network connections early* (preconnect) : <https://web.dev/articles/preconnect-and-dns-prefetch>
- MDN, *font-display* : <https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display>
- React, *React Compiler* : <https://react.dev/learn/react-compiler>

## 21. Ce qui a été volontairement laissé de côté

| Écarté | Pourquoi | Quand le reconsidérer |
|---|---|---|
| Next.js / Astro / SSR | une seule vue, pas de données distantes | si le site gagne un blog ou des pages indexables |
| Routeur | pas d'URL par fenêtre | si on veut partager un lien vers une fenêtre |
| Redux / Zustand / Context | état petit, passé en props | si l'état doit traverser beaucoup de niveaux |
| Bibliothèque d'i18n | 2 langues, typage plus sûr | au-delà de 3 langues ou avec des traducteurs |
| Tailwind / CSS-in-JS | thèmes au runtime = variables CSS | — |
| Bibliothèque de drag & drop | on déplace des rectangles | — |
| Testing Library (tests de composants) | l'e2e couvre balisage et câblage | si des composants gagnent de la logique interne |
| Prettier, ESLint | oxlint suffit, un seul auteur | à l'arrivée d'autres contributeurs |
| Composant `Tabs` | inutilisé, et son ARIA était incomplet | à refaire avec le motif APG complet le jour où il sert |
| Lint « type-aware » (`oxlint-tsgolint`) | pas nécessaire à ce stade | si des erreurs de promesses / types passent le lint |

## 22. Limites connues et pistes

- **Google Fonts chargé depuis les serveurs de Google** : l'IP du visiteur leur est transmise. Un tribunal
  allemand (LG München I, 20 janvier 2022, 3 O 17493/20) l'a jugé contraire au RGPD sans consentement.
  Piste : héberger la police Ubuntu avec le site (quelques Ko, `@font-face` local).
- **Les media queries sont écrites deux fois** (CSS et `runtime/media.ts`) : le CSS ne peut pas importer de
  constante. Un commentaire rappelle de les garder alignées.
- **Pas de dépôt git ni de configuration de CI/hébergement** dans le projet à ce jour, alors que la
  configuration Playwright est déjà prête pour la CI (`process.env.CI`). Piste : un workflow GitHub Actions
  qui lance lint, tests unitaires et e2e, et un hébergement statique (n'importe quel CDN de fichiers).
- **`README.md`** est encore celui du template Vite : à remplacer par une présentation du projet renvoyant
  vers ce document.
- **Fidélité Ubuntu / macOS** : ils reprennent la logique de barre des autres OS (voir `docs/BACKLOG.md`).
- Limites d'accessibilité : voir la section dédiée de `docs/ACCESSIBILITE.md`.

## 23. Bibliographie

**Normes**
- W3C, *Web Content Accessibility Guidelines (WCAG) 2.2* — <https://www.w3.org/TR/WCAG22/>
- W3C, *ARIA Authoring Practices Guide* — <https://www.w3.org/WAI/ARIA/apg/>
- W3C Design Tokens Community Group — <https://www.designtokens.org/>
- freedesktop.org, *Icon Naming Specification* — <https://specifications.freedesktop.org/icon-naming-spec/latest/>
- Directive (UE) 2019/882 (European Accessibility Act) — <https://eur-lex.europa.eu/eli/dir/2019/882/oj>
- RGAA 4.1 — <https://accessibilite.numerique.gouv.fr/>

**Documentation officielle des outils**
- React — <https://react.dev/>
- Vite — <https://vite.dev/>
- TypeScript — <https://www.typescriptlang.org/docs/>
- Vitest — <https://vitest.dev/>
- Playwright — <https://playwright.dev/>
- axe-core — <https://github.com/dequelabs/axe-core>
- Oxc / oxlint — <https://oxc.rs/>
- MDN Web Docs — <https://developer.mozilla.org/>

**Articles de fond**
- Martin Fowler, *Yagni* — <https://martinfowler.com/bliki/Yagni.html>
- Mark Seemann, *Composition Root* — <https://blog.ploeh.dk/2011/07/28/CompositionRoot/>
- Gary Bernhardt, *Functional Core, Imperative Shell* — <https://www.destroyallsoftware.com/screencasts/catalog/functional-core-imperative-shell>
- Kent C. Dodds, *Colocation* — <https://kentcdodds.com/blog/colocation>
- Kent C. Dodds, *Compound Components with React Hooks* — <https://kentcdodds.com/blog/compound-components-with-react-hooks>
- Kent C. Dodds, *The Testing Trophy and Testing Classifications* — <https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications>
- React, *You Might Not Need an Effect* — <https://react.dev/learn/you-might-not-need-an-effect>
