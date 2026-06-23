# Checklist de deployment — Brev.ly

Validação manual executada em **22/06/2026**.

## Testes automatizados

| Item | Comando | Resultado |
|------|---------|-----------|
| Integração backend | `cd server && npm test` | ✅ 17 testes (links, export, CORS) |
| Unitários frontend | `cd web && npm test` | ✅ 13 testes |
| E2E frontend | `cd web && npm run test:e2e` | ✅ 7 testes |
| Build de produção | `cd web && npm run build` | ✅ chunks separados por rota |

## Docker (server)

| Item | Resultado | Observação |
|------|-----------|------------|
| `docker build -t brevly-server ./server` | ✅ | Imagem gerada com sucesso |
| Tamanho da imagem | ⚠️ ~507 MB | Acima da meta de ~200 MB; aceitável para ambiente local |
| Usuário non-root | ✅ | `nodejs` |
| `docker run` + migrations | ✅ | Requer `host.docker.internal` no `DATABASE_URL` quando o PostgreSQL está no host (Windows/macOS) |
| Smoke test `GET /health` | ✅ | `{"status":"ok"}` na porta `3335` |
| CORS preflight (`OPTIONS /links`) | ✅ | `204` + `access-control-allow-origin` com origin de produção |
| CORS em `GET /health` | ✅ | `200` + header CORS com origin de produção |

### Comando usado na validação

```bash
docker run -d --name brevly-deploy-check -p 3335:3333 \
  -e DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/brevly \
  -e CORS_ORIGIN=https://app.exemplo.com \
  -e PORT=3333 \
  -e HOST=0.0.0.0 \
  brevly-server
```

Em produção, use `--env-file` ou variáveis do provedor. `CORS_ORIGIN` deve ser igual ao `VITE_FRONTEND_URL`.

## Fluxos manuais complementares

| Item | Resultado | Observação |
|------|-----------|------------|
| Fluxo completo (criar → listar → redirect → contador → export → excluir) | ✅ | Coberto por E2E (`links.e2e-spec.ts`) |
| Cenários de erro (404, validação, API) | ✅ | Coberto por E2E (`links-errors.e2e-spec.ts`) |
| Exportação CSV com CDN real | ⏭️ | Requer `CLOUDFLARE_*` configuradas; coberto por testes de integração com mock S3 |
| Preview do build (`npm run preview`) | ⏭️ | Build validado; preview manual opcional antes do deploy |

## Produção — lembrete

- `CORS_ORIGIN` (server) = `VITE_FRONTEND_URL` (web)
- `VITE_BACKEND_URL` aponta para a API pública (sem `/links`)
- `CLOUDFLARE_*` obrigatórias para exportação CSV em produção
