# Brev.ly — Backend

API REST do encurtador de URLs (Fastify + Drizzle + PostgreSQL).

## Pré-requisitos

- Node.js >= 20.18.0
- PostgreSQL

## Setup

```bash
cp .env.example .env
npm install
npm run db:migrate
```

## Scripts

| Script | Descrição |
|---|---|
| `npm run dev` | Servidor em modo desenvolvimento |
| `npm run build` | Compila TypeScript para `dist/` |
| `npm run start` | Executa build de produção |
| `npm run lint` | ESLint (zero warnings) |
| `npm run typecheck` | Verificação de tipos sem emitir arquivos |
| `npm run db:generate` | Gera migrations a partir do schema Drizzle |
| `npm run db:migrate` | Aplica migrations pendentes no PostgreSQL |

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

| Variável | Descrição |
|---|---|
| `PORT` | Porta do servidor (padrão: 3333) |
| `HOST` | Host de bind |
| `DATABASE_URL` | Connection string PostgreSQL |
| `CORS_ORIGIN` | Origin permitida pelo CORS |
| `CLOUDFLARE_*` | Credenciais para upload de CSV (exportação) |

## Implementado

- Projeto TypeScript com Fastify, CORS e validação de ambiente (Zod)
- Schema Drizzle: tabelas `links` e `exports`, com migration inicial
- Conexão PostgreSQL e verificação no startup
- Rota de health check (`GET /health`)
- ESLint flat config com regras strict type-checked
