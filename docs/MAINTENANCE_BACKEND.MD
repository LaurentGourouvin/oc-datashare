# MAINTENANCE.md | DataShare

## Prérequis

- Node.js v20+
- Docker
- npm

---

## Mise à jour des dépendances

### Vérifier les dépendances obsolètes

```bash
cd backend && npm outdated
cd frontend && npm outdated
```

### Mettre à jour les dépendances

```bash
# Mises à jour mineures et patches (non breaking)
npm update

# Mise à jour majeure (vérifier les breaking changes avant)
npm install <package>@latest
```

> ⚠️ Après chaque mise à jour majeure, relancer les tests et vérifier que l'application démarre correctement.

### Vérifier la sécurité après mise à jour

```bash
npm audit
```

---

## Base de données

### Modifier le schéma

1. Modifier `backend/prisma/schema.prisma`
2. Créer la migration :

```bash
cd backend && npx prisma migrate dev --name <nom_de_la_migration>
```

3. Vérifier la migration dans `backend/prisma/migrations/`
4. Relancer les tests pour s'assurer qu'il n'y a pas de régression

### Appliquer les migrations après un git pull

```bash
cd backend && npx prisma migrate deploy
```

### Réinitialiser la base de données (dev uniquement)

```bash
cd backend && npx prisma migrate reset
```

> ⚠️ Cette commande supprime toutes les données. Ne jamais exécuter en production.

---

## Tests

### Relancer les tests après une modification

```bash
cd backend && npm run test
```

### Vérifier la couverture de code

```bash
cd backend && npm run test:cov
```

> Le seuil minimum est de 70%. En dessous, ajouter des tests avant de merger.

---

## Docker

### Démarrer les services

```bash
make docker-up
```

### Arrêter les services

```bash
make docker-down
```

### Redémarrer PostgreSQL

```bash
docker restart datashare-db
```

### Vérifier les logs PostgreSQL

```bash
docker logs datashare-db
```

---

## Suivi

| Action | Fréquence |
|---|---|
| `npm audit` | À chaque ajout de dépendance |
| `npm outdated` | Une fois par mois |
| Mise à jour des dépendances mineures | Une fois par mois |
| Mise à jour des dépendances majeures | Selon les besoins et le planning |