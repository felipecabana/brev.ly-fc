# Brev.ly

Encurtador de URLs — monorepo com backend API e frontend SPA.

## Estado atual

- Integração frontend + backend validada com testes E2E (fluxo feliz e cenários de erro)
- Exportação CSV habilitada na home, com build de produção otimizado (lazy loading e chunks separados)
- Meta tags, favicon e documentação de variáveis de ambiente para deploy
- Checklist de deployment validado ([DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md))

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
| [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | Checklist de validação de deployment |

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

## Testes

```bash
# Backend (PostgreSQL necessário)
cd server && npm test

# Frontend — unitários e E2E
cd web && npm test
cd web && npm run test:e2e
```

## Produção

`CORS_ORIGIN` no backend deve ser **exatamente** a URL pública do frontend (`VITE_FRONTEND_URL`). Exemplo:

| Backend (`server/.env`) | Frontend (`web/.env`) |
|---|---|
| `CORS_ORIGIN=https://app.exemplo.com` | `VITE_FRONTEND_URL=https://app.exemplo.com` |

`VITE_BACKEND_URL` aponta para a API em produção (ex.: `https://api.exemplo.com`).
