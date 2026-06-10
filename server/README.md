# Brev.ly — Backend

API REST do encurtador de URLs (Fastify + Drizzle + PostgreSQL).

## Pré-requisitos

- Node.js >= 20.18.0
- PostgreSQL

## Setup

```bash
cp .env.example .env
npm install
```

## Scripts

| Script | Descrição |
|---|---|
| `npm run dev` | Servidor em modo desenvolvimento |
| `npm run build` | Compila TypeScript para `dist/` |
| `npm run start` | Executa build de produção |
| `npm run lint` | ESLint (zero warnings) |
| `npm run typecheck` | Verificação de tipos sem emitir arquivos |
