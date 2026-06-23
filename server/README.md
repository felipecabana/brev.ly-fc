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
| `npm run test` | Testes de integração das rotas (Vitest + PostgreSQL) |
| `npm run db:generate` | Gera migrations a partir do schema Drizzle |
| `npm run db:migrate` | Aplica migrations pendentes no PostgreSQL |

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

| Variável | Descrição |
|---|---|
| `PORT` | Porta do servidor (padrão: 3333) |
| `HOST` | Host de bind |
| `DATABASE_URL` | Connection string PostgreSQL |
| `CORS_ORIGIN` | Origin permitida pelo CORS (mesmo valor do `VITE_FRONTEND_URL` do frontend) |
| `CLOUDFLARE_*` | Credenciais para upload de CSV (exportação) |

## API

Rotas registradas **sem prefixo global** (`/api`). Cada recurso usa prefixo próprio no `app.register` (`/health`, `/links`), alinhado ao `VITE_BACKEND_URL` do frontend.

Respostas JSON usam o parser/serializer padrão do Fastify (`Content-Type: application/json` automático). Request logging via logger integrado (`debug` em desenvolvimento, `info` em produção).

## Implementado

- Projeto TypeScript com Fastify e validação de ambiente (Zod)
- CORS configurado para o frontend (origin, methods e headers permitidos)
- Error handler global com respostas `{ error }`, sem expor stack trace
- Schema Drizzle: tabelas `links` e `exports`, com migration inicial
- Conexão PostgreSQL e verificação no startup
- Rota de health check (`GET /health`)
- Rotas de links (`/links`): criar (`POST /`), listar com paginação (`GET /`), buscar por slug (`GET /:shortUrl`), incrementar acessos (`PATCH /:id/access`) e excluir por id (`DELETE /:id`), com validação Zod e erros em pt-BR
- Testes de integração das rotas de links em `test/links.spec.ts`
- Testes de CORS em `test/app.spec.ts`
- ESLint flat config com regras strict type-checked
