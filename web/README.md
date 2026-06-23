# Brev.ly — Frontend

SPA React do encurtador de URLs (Vite + TypeScript + TailwindCSS).

## Pré-requisitos

- Node.js >= 20.18.0

## Setup

```bash
cp .env.example .env
npm install
```

## Scripts

| Script | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento Vite |
| `npm run build` | Compila TypeScript e gera build em `dist/` |
| `npm run preview` | Preview do build de produção |
| `npm run lint` | ESLint (zero warnings) |
| `npm run typecheck` | Verificação de tipos sem emitir arquivos |

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

| Variável | Descrição |
|---|---|
| `VITE_FRONTEND_URL` | URL pública do frontend |
| `VITE_BACKEND_URL` | URL base da API |

## Implementado

- Projeto Vite + React + TypeScript com strict mode
- TailwindCSS (mobile-first), React Query, React Hook Form, Zod, React Router e Axios
- Estrutura base: `api/`, `components/`, `lib/`, `pages/`
- Validação de ambiente com Zod (`src/env.ts`)
- Shell da aplicação com `QueryClientProvider` e rota placeholder
- ESLint flat config alinhado ao backend
- Camada de API: cliente Axios (`lib/axios.ts`), tipos compartilhados e funções HTTP para links (`api/`)
- React Query configurado com defaults centralizados em `lib/query-client.ts`
