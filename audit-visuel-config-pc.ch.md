# Audit Visuel — config-pc.ch
**Date :** 3 avril 2026
**Périmètre :** Page d'accueil, flow Config IA (étapes 1→3), page résultats, layout mobile
**Méthodologie :** Navigation réelle en navigateur (Chrome), capture DOM + screenshots, viewport desktop 1512px et mobile 375px

---

## 1. Page d'accueil

### Ce qui fonctionne bien ✅
- **Hero clair et focalisé.** Le titre "Ta config PC parfaite." est immédiatement compréhensible. La valeur est exprimée en une ligne.
- **Badge "Propulsé par Claude AI"** — bon signal de crédibilité, surtout pour la cible tech-savvy.
- **Deux parcours bien différenciés.** "Config IA" (recommandé, fond bleu/violet) vs "Config manuelle" (outline) : le contraste visuel guide naturellement vers la voie principale.
- **Label "Recommandé"** sur Config IA bien placé.
- **Lien "Explorer le catalogue"** en option secondaire pour les utilisateurs qui savent ce qu'ils cherchent — bon UX de dégagement.
- **Trust badges** ("Suisse | Meilleurs prix | 10 000+ configs") — ajoutent de la réassurance.
- **Animation typewriter** au chargement — effet engageant pour la headline.

### Problèmes identifiés ⚠️

#### P1 — Page d'accueil à écran unique, zéro contenu sous le fold
La homepage se limite à un seul écran. Il n'y a **aucune section supplémentaire** : pas de "Comment ça marche", pas de témoignages, pas de FAQ, pas de footer. Pour un utilisateur sceptique ou qui revient, il n'y a rien à lire. Cela nuit à la confiance et au SEO.

#### P2 — Sous-titre trop petit et texte faiblard
"Quelques questions. Une recommandation experte. Composants, prix, compatibilité." est pertinent mais le texte est petit et gris clair. La hiérarchie visuelle s'effondre entre le H1 géant et ce sous-titre timide. Il manque une accroche intermédiaire plus forte.

#### P3 — Aucun visuel produit / illustration
La page est entièrement typographique. Pour un site de config PC, l'absence d'image de matériel (GPU, setup, etc.) est un manque d'attractivité visuel. Une illustration ou une photo lifestyle renforcerait l'envie.

#### P4 — "10 000+ configs" non sourcé
Ce chiffre semble arbitraire pour un produit en early stage. Il peut créer de la méfiance si l'utilisateur le questionne.

#### P5 — Pas de footer
Aucun lien vers les mentions légales, politique de confidentialité, ou contact sur la homepage. Ces éléments apparaissent uniquement en bas de la page résultats.

---

## 2. Flow configurateur IA (étapes 1→2→3)

### Ce qui fonctionne bien ✅
- **Indicateur de progression "Étape X sur 3"** avec barre de progression — l'utilisateur sait où il en est.
- **Step 1 — Usage :** Options claires avec icônes et descriptions courtes. Le layout liste unique est propre et lisible.
- **Step 2 — Budget :** Combo slider + présets de budget en grille 2×2 très efficace. "Le plus populaire — 1200 CHF" est pré-sélectionné et mis en avant. Bonne ergonomie.
- **Bouton "Suivant" désactivé** tant qu'aucune sélection n'est faite — prévention d'erreur correcte.
- **Bouton "Retour"** disponible à chaque étape.

### Problèmes identifiés ⚠️

#### P6 — Step 3 "Détails" complètement invisible au premier chargement 🔴 CRITIQUE
L'étape 3 (résolution cible, usage compétitif, fréquence de jeu) est recouverte par l'overlay de génération **avant même que l'utilisateur ne puisse voir son contenu**. L'overlay de chargement se déclenche immédiatement à l'arrivée sur l'étape 3, rendant le formulaire de personnalisation totalement ignoré. C'est une perte fonctionnelle majeure — l'utilisateur ne peut pas affiner sa recommandation.

**Contenu de l'étape 3 (visible uniquement via DOM) :**
- Résolution cible : 1080p / 1440p / 4K
- Poids machine : Gaming standard / Gaming élite
- Priorité carte graphique
- Fréquence de jeu

#### P7 — Incohérence step counter
Quand l'utilisateur clique "Suivant" depuis le Step 2, le compteur passe à "Étape 3 sur 3" mais le contenu affiché est encore celui du Step 2 (Budget). La transition de contenu est retardée par l'animation Framer Motion, créant un écart visible entre le compteur et le contenu — confusion UX.

#### P8 — Slider budget avec borne ∞ ambiguë
Le slider de budget va de 300 à ∞. La borne infinie est représentée par le symbole "∞" sans explication. Un utilisateur non-initié peut ne pas comprendre que cela signifie "pas de limite". Un label "Sans limite" ou "5000+" serait plus explicite.

#### P9 — Disparition automatique de l'overlay de génération non assurée
L'overlay de génération reste visible après avoir atteint 100% (au lieu de se fermer automatiquement). L'utilisateur doit attendre sans feedback sur la durée d'attente restante. Sur mobile, l'overlay persiste jusqu'à interférer avec la navigation.

---

## 3. Page résultats

### Ce qui fonctionne bien ✅
- **En-tête de config nommée** ("Le Chasseur", "L'Éclaireur") — donne une identité au build, crée un attachement.
- **Message de compatibilité détaillé** : "Configuration parfaitement compatible : CPU AM4 + carte mère B450, DDR4 supportée, GPU compatible PCIe, alimentation suffisante (400W consommé sur 650W disponible), refroidisseur compatible AM4" — très rassurant et informatif.
- **Cartes composants bien structurées** : image produit, type, nom, description, prix en gros, liens multi-retailers (Digitec, Galaxus, Brack.ch, Interdiscount).
- **Badge "Essentiel"** sur chaque composant — cohérent.
- **"Comparer sur TopPreise"** — ajout de valeur, contextualisation prix suisse.
- **Bouton "+ Ajouter au panier" + "Changer le [composant]"** sur chaque carte — bonne possibilité de personnalisation post-génération.
- **PERFORMANCES ESTIMÉES** : scores par usage (Gaming 1080p: 50/100, 1440p: 41/100, etc.) — utile pour fixer les attentes.
- **DÉTAIL DES PRIX** avec tableau récapitulatif et total.
- **CTAs en bas** : "Tout ajouter au panier", "Sauvegarder", "Partager ma config", "Nouvelle config".

### Problèmes identifiés ⚠️

#### P10 — Bug confetti bloquant l'accès au contenu 🔴 CRITIQUE
Après génération, un canvas `position:fixed, z-index:100` représentant l'animation confetti **reste actif et couvre toute la page**. L'utilisateur est bloqué et ne peut pas interagir avec les résultats. Le bug disparaît après plusieurs secondes ou un scroll forcé, mais l'expérience initiale est cassée.

**Cause racine :** La callback de nettoyage du canvas n'est pas appelée après la fin de l'animation confetti.

#### P11 — État persisté au reload — retour sur anciens résultats
Si l'utilisateur ferme l'onglet et revient sur config-pc.ch, il voit directement **sa configuration précédente** au lieu de la page d'accueil. L'état React est persisté dans le navigateur (sessionStorage/localStorage). C'est déroutant pour un utilisateur qui voudrait "repartir de zéro".

#### P12 — Warning de compatibilité socket AM4/AM5
Dans certaines configurations générées, le message "Attention : Les composants de la DB utilisent un mélange de sockets AM4 et AM5" apparaît. C'est une **incompatibilité matérielle réelle** — une carte mère AM4 est physiquement incompatible avec un CPU AM5. Le configurateur génère des configs potentiellement non-assemblables, ce qui sape la proposition de valeur principale (compatibilité garantie).

#### P13 — Sections "Compléter ton setup" vides
La section "Compléter ton setup — Périphériques & accessoires" apparaît dans la liste mais **aucun produit n'est affiché** (moniteur, souris, clavier, casque). C'est une section placeholder qui crée une attente non satisfaite.

#### P14 — Sections COMPATIBILITÉ et ÉVOLUTIVITÉ non visibles sans scroll profond
Ces deux sections apportent de la valeur (est-ce que je peux upgrader facilement ?) mais sont enfouies très bas dans la page (après les 8 composants). La majorité des utilisateurs ne les verra pas.

#### P15 — Animations Framer Motion trop lentes au scroll
Tous les éléments utilisent `whileInView` avec une animation fade-in/slide. Lors d'un scroll rapide, les éléments entrent dans le viewport encore en `opacity:0` et restent invisibles pendant ~500ms. Sur une longue page (3853px), cela crée une expérience de scroll pénible où le contenu "pop" avec retard.

---

## 4. Layout mobile (375px)

### Ce qui fonctionne bien ✅
- **Homepage mobile** : Layout single-colonne propre, titre qui wrap correctement, cards Config IA/Config manuelle en pleine largeur.
- **Step 1 mobile** : Options en liste full-width avec bonne zone de tap.
- **Step 2 mobile** : Budget en grille 2×2 qui s'adapte bien, slider fonctionnel.
- **Résultats mobile** : Cards composants en pleine largeur, texte lisible, prix bien mis en avant.
- **Navbar** : Logo + FR flag reste accessible sur mobile.

### Problèmes identifiés ⚠️

#### P16 — "Polyvalent" coupé en bas du Step 1
La 5ème option ("Polyvalent — Un peu de tout") est partiellement coupée en bas de l'écran mobile. L'utilisateur ne voit pas qu'il faut scroller, et le bouton "Suivant" est hors écran. Risque de confusion / abandon.

#### P17 — Bouton "Suivant" hors écran sur certains steps
Sur des écrans de 375px, le bouton "Suivant" nécessite un scroll pour être visible dans les étapes du configurateur. Les boutons de navigation devraient être sticky en bas d'écran.

#### P18 — Total config aligné à droite sur mobile
Sur mobile, le prix total "1087 CHF" est aligné à droite en face du titre de la config aligné à gauche. Avec un contenu de compatibilité long sur 2 lignes entre les deux, le layout devient fragmenté. Une approche full-width en colonne unique serait plus lisible.

#### P19 — Overlay de chargement mal proportionné sur mobile
L'overlay de génération (floppy disk + barre de progression + pourcentage) est centré mais la mise en page est serrée sur 375px. Le contenu fantôme de l'étape 3 visible derrière l'overlay ajoute de la confusion visuelle.

---

## 5. Éléments cassés / mal alignés

| # | Élément | Description | Sévérité |
|---|---------|-------------|----------|
| P10 | Canvas confetti | `position:fixed; z-index:100` bloque l'accès aux résultats après génération | 🔴 Critique |
| P6 | Step 3 overlay | L'overlay de génération démarre immédiatement, ignorant le formulaire de détails | 🔴 Critique |
| P12 | Socket AM4/AM5 | Config générée avec composants incompatibles (AM4 + AM5) | 🔴 Critique |
| P11 | État persisté | Reload → affiche anciens résultats au lieu de la homepage | 🟠 Majeur |
| P7 | Step counter | Compteur "Étape 3" s'affiche avant que le contenu de l'étape 3 soit visible | 🟠 Majeur |
| P15 | Framer Motion | Elements invisibles pendant ~500ms après scroll rapide | 🟠 Majeur |
| P9 | Overlay 100% | Overlay de génération ne se ferme pas automatiquement à 100% | 🟠 Majeur |
| P13 | Setup périphériques | Section "Compléter ton setup" vide | 🟡 Mineur |
| P16 | Mobile scroll | "Polyvalent" + bouton Suivant coupés en bas | 🟡 Mineur |
| P17 | Boutons sticky | Navigation du configurateur non sticky en bas | 🟡 Mineur |
| P1 | Homepage court | Aucun contenu sous le fold | 🟡 Mineur |
| P8 | Slider ∞ | Borne infinie non expliquée | 🟡 Mineur |

---

## 6. Résumé et priorités

### Critiques (à corriger immédiatement)
1. **Canvas confetti** — ajouter `canvas.remove()` ou `canvas.style.display='none'` dans la callback de fin d'animation
2. **Step 3 invisible** — déclencher l'overlay de génération APRÈS la soumission du formulaire Détails, pas à l'entrée dans l'étape
3. **Incompatibilité socket** — ajouter une contrainte de filtre AM4/AM5 dans la logique de sélection des composants

### Majeurs (sprint suivant)
4. **État non réinitialisé au reload** — ajouter un bouton "Nouvelle config" depuis la homepage, ou ne pas persister l'état de résultats
5. **Animations trop lentes** — réduire `duration` Framer Motion de ~500ms à ~200ms, ou désactiver `whileInView` sur les listes
6. **Overlay à 100%** — auto-dismiss après 100% avec fadeOut de ~500ms

### Améliorations UX (backlog)
7. Homepage : ajouter une section "Comment ça marche" (3 étapes) et un footer
8. Mobile : rendre les boutons de navigation sticky en bas
9. Section "Compléter ton setup" : alimenter avec de vrais produits ou masquer jusqu'à disponibilité
10. Ajouter une image produit / illustration dans le hero

---

*Audit réalisé par Claude — config-pc.ch, avril 2026*
