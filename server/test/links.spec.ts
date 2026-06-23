import type { FastifyInstance } from 'fastify'
import { isNotNull } from 'drizzle-orm'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { buildApp } from '../src/app.js'
import { closeDatabase, db } from '../src/db/connection.js'
import { links } from '../src/db/schema.js'
import { createLink } from './helpers.js'

describe('Links routes', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
    await closeDatabase()
  })

  beforeEach(async () => {
    await db.delete(links).where(isNotNull(links.id))
  })

  it('deve criar um link', async () => {
    const response = await request(app.server)
      .post('/links')
      .send({
        originalUrl: 'https://example.com',
        shortUrl: 'my-link',
      })

    expect(response.status).toBe(201)
    expect(response.body.link).toEqual(
      expect.objectContaining({
        originalUrl: 'https://example.com',
        shortUrl: 'my-link',
        accessCount: 0,
      }),
    )
  })

  it('deve rejeitar corpo inválido na criação', async () => {
    const response = await request(app.server)
      .post('/links')
      .send({
        originalUrl: 'not-a-url',
        shortUrl: 'ab',
      })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ error: 'Corpo da requisição inválido.' })
  })

  it('deve rejeitar slug duplicado', async () => {
    await createLink(app, 'duplicate')

    const response = await request(app.server)
      .post('/links')
      .send({
        originalUrl: 'https://other.example.com',
        shortUrl: 'duplicate',
      })

    expect(response.status).toBe(409)
    expect(response.body).toEqual({ error: 'URL encurtada já está em uso.' })
  })

  it('deve listar links com paginação', async () => {
    await createLink(app, 'page-1')
    await createLink(app, 'page-2')
    await createLink(app, 'page-3')

    const firstPage = await request(app.server)
      .get('/links')
      .query({ pageIndex: 0, limit: 2 })

    expect(firstPage.status).toBe(200)
    expect(firstPage.body.links).toHaveLength(2)
    expect(firstPage.body.meta).toEqual({
      pageIndex: 0,
      limit: 2,
      totalCount: 3,
    })

    const secondPage = await request(app.server)
      .get('/links')
      .query({ pageIndex: 1, limit: 2 })

    expect(secondPage.status).toBe(200)
    expect(secondPage.body.links).toHaveLength(1)
    expect(secondPage.body.meta.totalCount).toBe(3)
  })

  it('deve retornar página vazia quando o offset passa do total', async () => {
    await createLink(app, 'only-one')

    const response = await request(app.server)
      .get('/links')
      .query({ pageIndex: 5, limit: 10 })

    expect(response.status).toBe(200)
    expect(response.body.links).toEqual([])
    expect(response.body.meta.totalCount).toBe(1)
  })

  it('deve buscar link pelo slug', async () => {
    await createLink(app, 'find-me')

    const response = await request(app.server).get('/links/find-me')

    expect(response.status).toBe(200)
    expect(response.body.link.shortUrl).toBe('find-me')
  })

  it('deve retornar 404 para slug inexistente', async () => {
    const response = await request(app.server).get('/links/missing')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ error: 'Link não encontrado.' })
  })

  it('deve excluir um link existente', async () => {
    const link = await createLink(app, 'to-delete')

    const deleteResponse = await request(app.server).delete(`/links/${link.id}`)

    expect(deleteResponse.status).toBe(200)

    const getResponse = await request(app.server).get('/links/to-delete')

    expect(getResponse.status).toBe(404)
  })

  it('deve retornar 404 ao excluir link inexistente', async () => {
    const response = await request(app.server).delete(
      '/links/00000000-0000-4000-8000-000000000000',
    )

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ error: 'Link não encontrado.' })
  })

  it('deve rejeitar id inválido na exclusão', async () => {
    const response = await request(app.server).delete('/links/not-a-uuid')

    expect(response.status).toBe(400)
    expect(response.body).toEqual({ error: 'Parâmetros de rota inválidos.' })
  })

  it('deve incrementar o contador de acessos', async () => {
    const link = await createLink(app, 'track-access')

    const response = await request(app.server).patch(`/links/${link.id}/access`)

    expect(response.status).toBe(200)
    expect(response.body.link.accessCount).toBe(1)
  })

  it('deve incrementar o contador de acessos em paralelo', async () => {
    const link = await createLink(app, 'concurrent')

    const responses = await Promise.all(
      Array.from({ length: 10 }, () =>
        request(app.server).patch(`/links/${link.id}/access`),
      ),
    )

    for (const response of responses) {
      expect(response.status).toBe(200)
    }

    const getResponse = await request(app.server).get('/links/concurrent')

    expect(getResponse.body.link.accessCount).toBe(10)
  })
})
