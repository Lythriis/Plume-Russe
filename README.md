# Plume Russe – Site de cours de russe

Site statique simple pour aider une amie à apprendre le russe, avec :

- une page d'accueil et un petit tableau de bord,
- une section **Leçons** (structure prête, à remplir),
- une section **Exercices** interactifs,
- une section **Suivi** avec résumé de progression et notes professeur,
- une section **À propos**.

Tout fonctionne **sans serveur** : uniquement HTML, CSS et JavaScript. Les données de progression sont stockées dans le navigateur (localStorage).

---

## 1. Fichiers importants

- `index.html` : structure de toutes les sections du site.
- `styles.css` : apparence du site (couleurs, mise en page).
- `script.js` : logique de base (suivi de progression, correction des exercices, sauvegarde des notes).

Tu peux modifier les textes directement dans `index.html` (titres de leçons, consignes, etc.).

---

## 2. Tester le site en local

Tu peux simplement ouvrir `index.html` en double-cliquant dessus :

1. Ouvre le dossier `Plume Russe` sur ton ordinateur.
2. Double-clique sur `index.html`.
3. Le site s'ouvre dans ton navigateur (Chrome, Edge, etc.).

---

## 3. Mettre le site en ligne avec GitHub Pages

### Étape A – Créer un dépôt GitHub

1. Crée un compte sur `https://github.com` si ce n'est pas déjà fait.
2. Clique sur **New repository**.
3. Nom du dépôt (par exemple) : `plume-russe`.
4. Laisse les options par défaut, clique sur **Create repository**.

### Étape B – Envoyer les fichiers sur GitHub (méthode simple via interface web)

1. Sur la page de ton dépôt, clique sur **Add file** > **Upload files**.
2. Glisse-dépose les fichiers suivants dans la page :
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`
3. En bas de la page, clique sur **Commit changes**.

### Étape C – Activer GitHub Pages

1. Sur ton dépôt GitHub, clique sur l'onglet **Settings**.
2. Dans le menu de gauche, clique sur **Pages**.
3. Section **Build and deployment** :
   - **Source** : choisis `Deploy from a branch`.
   - **Branch** : sélectionne `main` (ou `master`) et le dossier `/ (root)`.
   - Clique sur **Save**.
4. Après quelques minutes, GitHub te donnera une URL du type :
   - `https://ton-pseudo.github.io/plume-russe/`

Tu pourras envoyer ce lien à ton amie.

---

## 4. Comment ajouter ou modifier des leçons / exercices

### Ajouter une leçon

1. Ouvre `index.html` dans un éditeur de texte (par exemple VS Code ou même le Bloc-notes).
2. Repère la section `<!-- Leçons -->`.
3. Copie-colle un bloc `<article class="pr-card pr-lesson-card" ...>` et adapte :
   - le titre (par ex. "Leçon 4 – Verbes de base"),
   - la description.

### Modifier les exercices

1. Repère la section `<!-- Exercices -->` dans `index.html`.
2. Pour le QCM :
   - tu peux changer les mots russes,
   - mets la bonne réponse dans l'attribut `data-correct`.
3. Pour l'exercice de saisie texte :
   - change la réponse attendue dans `data-answer="спасибо"`.

Si tu veux, tu pourras me demander plus tard de générer d'autres types d'exercices (audio, phrases à compléter, etc.).

---

## 5. Suivi et notes professeur

- Les compteurs de **leçons complétées** et **exercices réussis** se mettent à jour automatiquement lorsque :
  - tu cliques sur "Commencer la prochaine leçon",
  - un exercice est réussi.
- La **dernière activité** est la dernière date/heure d'action.
- Tes **notes professeur** sont enregistrées automatiquement pendant que tu écris.

Tout cela reste **local** sur l'ordinateur de ton amie (aucune donnée envoyée en ligne).

---

Si tu veux aller plus loin (nouveaux exercices, plusieurs niveaux, espace élève/prof distinct, etc.), indique-moi ce que tu imagines et je t’aiderai à faire évoluer le site. 

