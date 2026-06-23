import type { FastifyInstance } from 'fastify'
import request from 'supertest'
import { expect } from 'vitest'

export async function createLink(app: FastifyInstance, shortUrl: string) {
  const response = await request(app.server)
    .post('/links')
    .send({
      originalUrl: `https://example.com/${shortUrl}`,
      shortUrl,
    })

  expect(response.status).toBe(201)

  return response.body.link
}
