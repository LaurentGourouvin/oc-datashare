.PHONY: help install dev dev-backend dev-frontend build test test-backend test-frontend docker-up docker-down docker-logs db-migrate db-reset db-studio

# ─── Help ─────────────────────────────────────────────────────────────────────

help:
	@echo ""
	@echo "╔══════════════════════════════════════════════════╗"
	@echo "║              DataShare — Commandes               ║"
	@echo "╠══════════════════════════════════════════════════╣"
	@echo "║  INSTALLATION                                    ║"
	@echo "║    make install        Installe toutes les dép.  ║"
	@echo "╠══════════════════════════════════════════════════╣"
	@echo "║  DÉVELOPPEMENT                                   ║"
	@echo "║    make dev            Lance backend + frontend  ║"
	@echo "║    make dev-backend    Lance uniquement NestJS   ║"
	@echo "║    make dev-frontend   Lance uniquement Vite     ║"
	@echo "╠══════════════════════════════════════════════════╣"
	@echo "║  BUILD                                           ║"
	@echo "║    make build          Build backend + frontend  ║"
	@echo "╠══════════════════════════════════════════════════╣"
	@echo "║  TESTS                                           ║"
	@echo "║    make test           Lance tous les tests      ║"
	@echo "║    make test-backend   Tests NestJS uniquement   ║"
	@echo "║    make test-frontend  Tests React uniquement    ║"
	@echo "╠══════════════════════════════════════════════════╣"
	@echo "║  DOCKER                                          ║"
	@echo "║    make docker-up      Démarre les conteneurs    ║"
	@echo "║    make docker-down    Arrête les conteneurs     ║"
	@echo "║    make docker-logs    Affiche les logs Docker   ║"
	@echo "╠══════════════════════════════════════════════════╣"
	@echo "║  BASE DE DONNÉES                                 ║"
	@echo "║    make db-migrate     Applique les migrations   ║"
	@echo "║    make db-reset       Remet la BDD à zéro       ║"
	@echo "║    make db-studio      Ouvre Prisma Studio       ║"
	@echo "╚══════════════════════════════════════════════════╝"
	@echo ""

# ─── Installation ────────────────────────────────────────────────────────────

install:
	npm install

# ─── Développement ───────────────────────────────────────────────────────────

dev:
	npm run dev

dev-backend:
	npm run dev:backend

dev-frontend:
	npm run dev:frontend

# ─── Build ───────────────────────────────────────────────────────────────────

build:
	npm run build

# ─── Tests ───────────────────────────────────────────────────────────────────

test:
	npm run test

test-backend:
	npm run test:backend

test-frontend:
	npm run test:frontend

# ─── Docker ──────────────────────────────────────────────────────────────────

docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f

# ─── Base de données (Prisma) ─────────────────────────────────────────────────

db-migrate:
	npm run prisma migrate dev --prefix backend

db-reset:
	npm run prisma migrate reset --prefix backend

db-studio:
	npm run prisma studio --prefix backend
