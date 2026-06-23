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

## Docker

Build e execução em container (multi-stage, Node 20.18, usuário non-root). As migrations são aplicadas automaticamente no startup.

```bash
docker build -t brevly-server .
docker run -p 3333:3333 \
  -e DATABASE_URL=postgresql://user:password@host:5432/brevly \
  -e CORS_ORIGIN=http://localhost:5173 \
  brevly-server
```

Passe as variáveis de ambiente via `-e` ou `--env-file` (o `.env` local não entra na imagem). Se o PostgreSQL estiver no host, use `host.docker.internal` no `DATABASE_URL` (Windows/macOS).

Resultados da validação local: [DEPLOYMENT_CHECKLIST.md](../DEPLOYMENT_CHECKLIST.md).

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

| Variável | Descrição |
|---|---|
| `PORT` | Porta do servidor (padrão: 3333) |
| `HOST` | Host de bind |
| `DATABASE_URL` | Connection string PostgreSQL |
| `CORS_ORIGIN` | Origin permitida pelo CORS — deve ser igual ao `VITE_FRONTEND_URL` do frontend |
| `CLOUDFLARE_ACCOUNT_ID` | ID da conta Cloudflare (exportação CSV) |
| `CLOUDFLARE_ACCESS_KEY_ID` | Access key do R2 |
| `CLOUDFLARE_SECRET_ACCESS_KEY` | Secret key do R2 |
| `CLOUDFLARE_BUCKET` | Nome do bucket R2 |
| `CLOUDFLARE_PUBLIC_URL` | URL pública base dos arquivos exportados |

## Produção

- `CORS_ORIGIN` deve corresponder **exatamente** ao `VITE_FRONTEND_URL` do frontend (protocolo, host e porta).
- `CLOUDFLARE_*` são necessárias para a exportação CSV; sem elas, `POST /links/export` retorna erro 500.
- No Docker, passe as variáveis via `-e` ou `--env-file` — o `.env` local não entra na imagem.

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
- Rotas de links (`/links`): criar (`POST /`), listar com paginação (`GET /`), buscar por slug (`GET /:shortUrl`), incrementar acessos (`PATCH /:id/access`), excluir por id (`DELETE /:id`) e exportar CSV (`POST /export`), com validação Zod e erros em pt-BR
- Exportação CSV: gera relatório com todos os links (`originalUrl`, `shortUrl`, `accessCount`, `createdAt`), envia para Cloudflare R2 e retorna `{ fileName, publicUrl }`
- Serviço de exportação em `src/services/export.ts` (geração de CSV + upload S3-compatível)
- Testes de integração das rotas de links em `test/links.spec.ts`
- Testes de integração da exportação CSV em `test/export.spec.ts`
- Testes de CORS em `test/app.spec.ts`
- ESLint flat config com regras strict type-checked
- Container Docker com build multi-stage, entrypoint de migrations e execução como usuário non-root
