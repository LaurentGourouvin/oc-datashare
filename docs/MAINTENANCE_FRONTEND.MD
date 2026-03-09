# MAINTENANCE.md | DataShare Frontend

## Prérequis

- Node.js v20+
- npm

---

## Mise à jour des dépendances

### Vérifier les dépendances obsolètes

```bash
cd frontend && npm outdated
```

### Mettre à jour les dépendances

```bash
# Mises à jour mineures et patches (non breaking)
npm update

# Mise à jour majeure (vérifier les breaking changes avant)
npm install <package>@latest
```

> ⚠️ Après chaque mise à jour majeure, relancer les tests Cypress et vérifier que l'application démarre correctement.

### Vérifier la sécurité après mise à jour

```bash
cd frontend && npm audit
```

---

## Tests

### Lancer les tests E2E

```bash
# Interface graphique
cd frontend && npm run cy:open

# Mode headless (CI)
cd frontend && npm run cy:run
```

### Vérifier la couverture de code

Le rapport est généré automatiquement dans `coverage/` après `npm run cy:run`.

```bash
cat coverage/coverage-summary.json
```

> Le seuil minimum est de 70%. En dessous, ajouter des tests avant de merger.

---

## Variables d'environnement

Le frontend utilise un fichier `.env` à la racine de `frontend/` :

```bash
VITE_API_URL=http://localhost:3000
```

> ⚠️ Ne jamais committer le fichier `.env`. Il est listé dans `.gitignore`.

En production, remplacer `VITE_API_URL` par l'URL de l'API déployée.

---

## Build de production

```bash
cd frontend && npm run build
```

Les fichiers compilés sont générés dans `frontend/dist/`. Ce dossier peut être servi par n'importe quel serveur statique (Nginx, Apache, AWS S3, etc.).

### Prévisualiser le build

```bash
cd frontend && npm run preview
```

---

## Procédure de correction d'un bug en production

1. Créer une branche `hotfix/<description>` depuis `main`
2. Corriger le bug
3. Relancer les tests : `npm run cy:run`
4. Vérifier que la couverture reste au-dessus de 70%
5. Merger sur `main` et `develop`
6. Rebuilder et redéployer : `npm run build`

---

## Suivi

| Action | Fréquence |
|---|---|
| `npm audit` | À chaque ajout de dépendance |
| `npm outdated` | Une fois par mois |
| Mise à jour des dépendances mineures | Une fois par mois |
| Mise à jour des dépendances majeures | Selon les besoins et le planning |
| Relancer les tests Cypress | À chaque merge sur `develop` |