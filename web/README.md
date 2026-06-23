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
- Shell da aplicação com `QueryClientProvider` e roteamento React Router
- ESLint flat config alinhado ao backend
- Camada de API: cliente Axios (`lib/axios.ts`), tipos compartilhados e funções HTTP para links (`api/`)
- React Query configurado com defaults centralizados em `lib/query-client.ts`
- Design system com tokens Tailwind, fontes Open Sans/Quicksand e componentes UI (`Button`, `Input`, `IconButton`, `Logo`)
- Ícones via `@phosphor-icons/react`
- Página inicial (`pages/home-page.tsx`): formulário de criação de link, listagem com estados de loading e vazio, e exclusão com confirmação
- Página de redirecionamento (`pages/redirect-page.tsx`): busca o link pelo slug, incrementa acessos e redireciona para a URL original, com estado de carregamento e fallback para link inválido ou inexistente
- Rota `/` apontando para a home
