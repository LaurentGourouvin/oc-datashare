# MAINTENANCE.md | DataShare

## Prérequis

- Node.js v20+
- Docker
- npm

---

## Backend

### Mise à jour des dépendances

#### Vérifier les dépendances obsolètes

```bash
cd backend && npm outdated
```

#### Mettre à jour les dépendances

```bash
# Mises à jour mineures et patches (non breaking)
npm update

# Mise à jour majeure (vérifier les breaking changes avant)
npm install <package>@latest
```

> ⚠️ Après chaque mise à jour majeure, relancer les tests et vérifier que l'application démarre correctement.

#### Vérifier la sécurité après mise à jour

```bash
cd backend && npm audit
```

---

### Base de données

#### Modifier le schéma

1. Modifier `backend/prisma/schema.prisma`
2. Créer la migration :

```bash
cd backend && npx prisma migrate dev --name <nom_de_la_migration>
```

3. Vérifier la migration dans `backend/prisma/migrations/`
4. Relancer les tests pour s'assurer qu'il n'y a pas de régression

#### Appliquer les migrations après un git pull

```bash
cd backend && npx prisma migrate deploy
```

#### Réinitialiser la base de données (dev uniquement)

```bash
cd backend && npx prisma migrate reset
```

> ⚠️ Cette commande supprime toutes les données. Ne jamais exécuter en production.

---

### Tests

#### Relancer les tests après une modification

```bash
cd backend && npm run test
```

#### Vérifier la couverture de code

```bash
cd backend && npm run test:cov
```

> Le seuil minimum est de 70%. En dessous, ajouter des tests avant de merger.

---

### Docker

#### Démarrer les services

```bash
make docker-up
```

#### Arrêter les services

```bash
make docker-down
```

#### Redémarrer PostgreSQL

```bash
docker restart datashare-db
```

#### Vérifier les logs PostgreSQL

```bash
docker logs datashare-db
```

---

## Frontend

### Mise à jour des dépendances

#### Vérifier les dépendances obsolètes

```bash
cd frontend && npm outdated
```

#### Mettre à jour les dépendances

```bash
# Mises à jour mineures et patches (non breaking)
npm update

# Mise à jour majeure (vérifier les breaking changes avant)
npm install <package>@latest
```

> ⚠️ Après chaque mise à jour majeure, relancer les tests Cypress et vérifier que l'application démarre correctement.

#### Vérifier la sécurité après mise à jour

```bash
cd frontend && npm audit
```

---

### Tests

#### Lancer les tests E2E

```bash
# Interface graphique
cd frontend && npm run cy:open

# Mode headless (CI)
cd frontend && npm run cy:run
```

#### Vérifier la couverture de code

Le rapport est généré automatiquement dans `coverage/` après `npm run cy:run`.

```bash
cat frontend/coverage/coverage-summary.json
```

> Le seuil minimum est de 70%. En dessous, ajouter des tests avant de merger.

---

### Variables d'environnement

Le frontend utilise un fichier `.env` à la racine de `frontend/` :

```bash
VITE_API_URL=http://localhost:3000
```

> ⚠️ Ne jamais committer le fichier `.env`. Il est listé dans `.gitignore`.

En production, remplacer `VITE_API_URL` par l'URL de l'API déployée.

---

### Build de production

```bash
cd frontend && npm run build
```

Les fichiers compilés sont générés dans `frontend/dist/`. Ce dossier peut être servi par n'importe quel serveur statique (Nginx, Apache, AWS S3, etc.).

#### Prévisualiser le build

```bash
cd frontend && npm run preview
```

---

## Procédure de correction d'un bug en production

1. Créer une branche `hotfix/<description>` depuis `main`
2. Corriger le bug
3. Relancer les tests backend : `cd backend && npm run test`
4. Relancer les tests frontend : `cd frontend && npm run cy:run`
5. Vérifier que la couverture reste au-dessus de 70% sur les deux couches
6. Merger sur `main` et `develop`
7. Rebuilder et redéployer

---

## Suivi

| Action | Fréquence |
|---|---|
| `npm audit` (backend + frontend) | À chaque ajout de dépendance |
| `npm outdated` (backend + frontend) | Une fois par mois |
| Mise à jour des dépendances mineures | Une fois par mois |
| Mise à jour des dépendances majeures | Selon les besoins et le planning |
| Relancer les tests backend | À chaque merge sur `develop` |
| Relancer les tests Cypress | À chaque merge sur `develop` |