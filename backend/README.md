# DataShare — Backend

API REST construite avec NestJS (TypeScript) + Prisma + PostgreSQL.

## Prérequis

- Node.js v20+
- Docker (pour PostgreSQL)
- [Prisma CLI](https://www.prisma.io/docs)

## Installation

```bash
npm install
```

## Configuration

Copier le fichier d'exemple et renseigner les variables :

```bash
cp .env.example .env
```

| Variable | Description | Valeur par défaut |
|---|---|---|
| `DATABASE_URL` | URL de connexion PostgreSQL | `postgresql://datashare:datashare@localhost:5432/datashare` |
| `JWT_SECRET` | Clé secrète pour signer les tokens JWT | `change_me_in_production` |
| `JWT_EXPIRES_IN` | Durée de validité du token JWT | `7d` |
| `UPLOAD_DIR` | Dossier de stockage des fichiers | `./uploads` |
| `MAX_FILE_SIZE` | Taille maximale d'un fichier (en octets) | `1073741824` (1 Go) |

## Lancer le serveur

```bash
# Développement (watch mode)
npm run start:dev

# Production
npm run start:prod
```

## Base de données

### Lancer PostgreSQL via Docker

```bash
# Depuis la racine du monorepo
make docker-up
```

### Migrations Prisma

```bash
# Créer et appliquer une nouvelle migration
npx prisma migrate dev --name <nom_de_la_migration>

# Appliquer les migrations existantes (ex: après un git pull)
npx prisma migrate deploy

# Réinitialiser la BDD (supprime toutes les données !)
npx prisma migrate reset
```

### Prisma Studio (interface visuelle)

```bash
npx prisma studio
```

### Générer le client Prisma

```bash
# À relancer après chaque modification du schema.prisma
npx prisma generate
```

## Tests

```bash
# Tests unitaires
npm run test

# Tests avec couverture
npm run test:cov

# Tests en watch mode
npm run test:watch
```

## Structure

```
backend/
├── src/
│   ├── auth/          # Module authentification (US03, US04)
│   ├── files/         # Module fichiers (US01, US02, US05, US06)
│   ├── users/         # Module utilisateurs
│   └── main.ts
├── prisma/
│   ├── schema.prisma  # Modèle de données
│   └── migrations/    # Historique des migrations
├── uploads/           # Stockage local des fichiers (gitignored)
├── prisma.config.ts   # Configuration Prisma 7
└── .env.example       # Variables d'environnement
```