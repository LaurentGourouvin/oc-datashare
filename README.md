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
- Make
  - **macOS** : inclus avec Xcode Command Line Tools → `xcode-select --install`
  - **Linux** : `sudo apt install make`
  - **Windows** : installer [Git Bash](https://gitforwindows.org/) ou [WSL2](https://learn.microsoft.com/fr-fr/windows/wsl/install), Make est inclus

## Installation

```bash
# 1. Cloner le repo
git clone https://github.com/LaurentGourouvin/oc-datashare.git
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

## Tests de performance (k6)

### Installation de k6

```bash
# macOS
brew install k6

# Linux
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update && sudo apt-get install k6
```

### Lancer le test

```bash
# 1. S'assurer que le backend tourne
make dev

# 2. Récupérer un token JWT via /auth/login et le renseigner dans k6/upload-test.js

# 3. Lancer le test depuis le dossier k6/
cd k6
k6 run upload-test.js
```

Les résultats et leur analyse sont disponibles dans [`PERF.md`](PERF.md).

## Workflow Git

```
main
 └── develop
      ├── feature/us01-upload
      ├── feature/us03-register
      └── ...
```

- **`main`** — branche de production, stable. On ne pousse jamais directement dessus.
- **`develop`** — branche d'intégration, reçoit toutes les features terminées.
- **`feature/*`** — une branche par User Story ou tâche, créée depuis `develop`.

**Cycle de travail :**

```bash
# 1. Créer sa branche depuis develop
git checkout develop
git checkout -b feature/us03-register

# 2. Coder, commiter
git commit -m "feat(auth): ajout endpoint register"

# 3. Merger sur develop une fois terminé
git checkout develop
git merge feature/us03-register

# 4. Quand develop est stable → merge sur main (livraison)
git checkout main
git merge develop
```

## Structure du projet

```
datashare/
├── backend/          # API NestJS
├── frontend/         # App React
├── k6/               # Scripts de tests de performance
├── docker-compose.yml
├── Makefile
└── README.md
```

## Documentation

- [`TESTING.md`](./TESTING.md) : Plan de tests et couverture
- [`SECURITY.md`](./SECURITY.md) : Sécurité et vulnérabilités
- [`PERF.md`](./PERF.md) : Tests de performance
- [`MAINTENANCE.md`](./MAINTENANCE.md) : Procédures de maintenance
- –[`API_CONTRACT.md`](./API_CONTRAT.md) : Contrat API