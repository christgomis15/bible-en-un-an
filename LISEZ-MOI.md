# Bible en un an

Application web installable (PWA) : toute la Bible en 312 jours de lecture, du lundi au samedi, avec le dimanche pour souffler et faire le point.

## Mettre en ligne
Le dossier est un site statique : il suffit de le publier tel quel (aucune compilation).
- **Vercel / Netlify** : glissez le dossier, ou liez un dépôt Git.
- **GitHub Pages** : placez le contenu du dossier à la racine d'un dépôt, puis activez Pages.

Vous pouvez aussi double-cliquer sur `index.html` pour l'utiliser directement sur l'ordinateur (progression enregistrée dans ce navigateur ; pas de mode hors ligne ni d'installation dans ce cas).

Une fois en ligne (HTTPS), l'application s'installe sur l'écran d'accueil du téléphone et fonctionne hors connexion.

## Contenu
- `data/lsg.js` : texte Louis Segond 1910 (domaine public), 66 livres, 1 189 chapitres, 31 102 versets.
- `data/plan.js` : plan de 312 jours, chapitres entiers, charge de lecture équilibrée (≈ 8 à 16 min/jour).
- La Bible du Semeur (© Biblica) n'est pas incluse : l'application ouvre le passage du jour sur BibleGateway / YouVersion.

## Où modifier quoi
- Questions de méditation : début de `app.js` (`OBSERVER`, `THEMES`, `APPLIQUER`, `PRIER`).
- Couleurs et polices : variables en tête de `style.css`.
- Après une mise à jour, changer `CACHE = 'bible-an-v1'` dans `sw.js` pour forcer le rafraîchissement hors ligne.

## Données
La progression est stockée sur l'appareil (localStorage). Réglages → Exporter / Importer pour la sauvegarder ou la transférer.
