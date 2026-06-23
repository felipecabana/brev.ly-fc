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
| `npm test` | Testes unitários (Vitest) |

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
- Design system com tokens Tailwind, fontes Open Sans/Quicksand e componentes UI (`Button`, `Input`, `IconButton`, `Card`, `Spinner`, `Logo`); `Button` com estado de loading
- Ícones via `@phosphor-icons/react`
- Página inicial (`pages/home-page.tsx`): formulário de criação de link, listagem responsiva com spinner de carregamento, estado vazio, loading no envio e exclusão com confirmação
- Página de redirecionamento (`pages/redirect-page.tsx`): busca o link pelo slug, incrementa acessos e redireciona para a URL original, com spinner durante o fetch; slug inválido ou inexistente exibe a página 404
- Página 404 (`pages/not-found-page.tsx`): mensagem de link não encontrado, arte 404 e navegação de volta à home
- Roteamento completo em `routes.tsx`: `/` (home), `/:shortUrl` (redirecionamento) e `*` (404 para rotas inexistentes)
- Error boundary global (`components/error-boundary.tsx`) com fallback amigável e retorno à home
- Acessibilidade e micro-interações: foco visível por teclado (`focus-visible`) e transições suaves nos controles interativos
- Validação de links centralizada em `lib/link-validation.ts` (slug e URL alinhados ao backend), com validação em tempo real no formulário da home
- Tratamento de erros de API em `lib/api-error.ts` e feedback inline na criação, exclusão e listagem de links; retry inteligente no React Query e distinção entre 404 e falhas de rede no redirecionamento
- Testes unitários em `test/` para schemas de validação, mapeamento de erros e política de retry
