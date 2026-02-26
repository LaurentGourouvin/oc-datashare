# DataShare

Prototype de plateforme de transfert sécurisé de fichiers, inspiré de WeTransfer. Destiné aux freelances et petites entreprises.

## Stack technique

| Couche | Technologie |
|---|---|
| Back-end | NestJS (TypeScript) |
| Front-end | React (TypeScript) + Vite |
| Base de données | PostgreSQL |
| ORM | Prisma |
| Stockage | Système de fichiers local |
| Auth | JWT |
| Conteneurs | Docker + Docker Compose |

## Prérequis

- [Node.js](https://nodejs.org/) v20+
- [Docker](https://www.docker.com/) + Docker Compose
- [Make](https://www.gnu.org/software/make/)

## Installation

```bash
# 1. Cloner le repo
git clone https://github.com/<ton-username>/datashare.git
cd datashare

# 2. Installer les dépendances
make install

# 3. Configurer les variables d'environnement
cp backend/.env.example backend/.env
# Éditer backend/.env si nécessaire

# 4. Démarrer la base de données
make docker-up

# 5. Appliquer les migrations Prisma
make db-migrate
```

## Lancer l'application

```bash
make dev
```

- Frontend : http://localhost:5173
- Backend : http://localhost:3000
- API Docs : http://localhost:3000/api

## Commandes disponibles

```bash
make help
```

## Structure du projet

```
datashare/
├── backend/          # API NestJS
├── frontend/         # App React
├── docker-compose.yml
├── Makefile
└── README.md
```

## Documentation

- [`TESTING.md`](./TESTING.md) — Plan de tests et couverture
- [`SECURITY.md`](./SECURITY.md) — Sécurité et vulnérabilités
- [`PERF.md`](./PERF.md) — Tests de performance
- [`MAINTENANCE.md`](./MAINTENANCE.md) — Procédures de maintenance
