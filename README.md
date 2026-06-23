# Brev.ly

Encurtador de URLs — monorepo com backend API e frontend SPA.

## Estrutura

```
brev.ly-fc/
├── server/   # API REST (Fastify + Drizzle + PostgreSQL)
└── web/      # Frontend (React + Vite)
```

## Documentação

| Pacote | Descrição |
|---|---|
| [server/README.md](./server/README.md) | Setup, scripts e estado atual do backend |
| [web/README.md](./web/README.md) | Setup, scripts e estado atual do frontend |

## Pré-requisitos

- Node.js >= 20.18.0
- PostgreSQL (backend)

## Início rápido

```bash
# Backend
cd server
cp .env.example .env
npm install
npm run db:migrate
npm run dev

# Frontend (outro terminal)
cd web
cp .env.example .env
npm install
npm run dev
```
