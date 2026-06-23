import type { FastifyInstance } from 'fastify'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { buildApp } from '../src/app.js'
import { env } from '../src/config/env.js'
import { closeDatabase } from '../src/db/connection.js'

describe('CORS', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
    await closeDatabase()
  })

  it('deve aceitar preflight do frontend para criar link', async () => {
    const response = await request(app.server)
      .options('/links')
      .set('Origin', env.CORS_ORIGIN)
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'Content-Type')

    expect(response.status).toBe(204)
    expect(response.headers['access-control-allow-origin']).toBe(env.CORS_ORIGIN)
    expect(response.headers['access-control-allow-methods']).toContain('POST')
  })

  it('deve expor header CORS em GET do health check', async () => {
    const response = await request(app.server)
      .get('/health')
      .set('Origin', env.CORS_ORIGIN)

    expect(response.status).toBe(200)
    expect(response.headers['access-control-allow-origin']).toBe(env.CORS_ORIGIN)
    expect(response.body).toEqual({ status: 'ok' })
  })
})
