import type { FastifyInstance } from 'fastify'
import { isNotNull } from 'drizzle-orm'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { buildApp } from '../src/app.js'
import { env } from '../src/config/env.js'
import { closeDatabase, db } from '../src/db/connection.js'
import { links } from '../src/db/schema.js'
import { createLink } from './helpers.js'

const { s3SendMock, cdnConfigured } = vi.hoisted(() => ({
  s3SendMock: vi.fn(),
  cdnConfigured: { current: true },
}))

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: class {
    send(command: { input: { Body?: string; Key?: string; Bucket?: string } }) {
      return s3SendMock(command.input)
    }
  },
  PutObjectCommand: class {
    constructor(public input: { Body?: string; Key?: string; Bucket?: string }) {}
  },
}))

vi.mock('../src/config/env.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/config/env.js')>()
  const withCdn = {
    ...actual.env,
    CLOUDFLARE_ACCOUNT_ID: actual.env.CLOUDFLARE_ACCOUNT_ID ?? 'test-account-id',
    CLOUDFLARE_ACCESS_KEY_ID: actual.env.CLOUDFLARE_ACCESS_KEY_ID ?? 'test-access-key',
    CLOUDFLARE_SECRET_ACCESS_KEY:
      actual.env.CLOUDFLARE_SECRET_ACCESS_KEY ?? 'test-secret-key',
    CLOUDFLARE_BUCKET: actual.env.CLOUDFLARE_BUCKET ?? 'test-bucket',
    CLOUDFLARE_PUBLIC_URL:
      actual.env.CLOUDFLARE_PUBLIC_URL ?? 'https://cdn.example.com/exports',
  }

  return {
    ...actual,
    get env() {
      if (!cdnConfigured.current) {
        return {
          ...withCdn,
          CLOUDFLARE_ACCOUNT_ID: undefined,
          CLOUDFLARE_ACCESS_KEY_ID: undefined,
          CLOUDFLARE_SECRET_ACCESS_KEY: undefined,
          CLOUDFLARE_BUCKET: undefined,
          CLOUDFLARE_PUBLIC_URL: undefined,
        }
      }

      return withCdn
    },
  }
})

describe('POST /links/export', () => {
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
    cdnConfigured.current = true
    s3SendMock.mockReset()
    s3SendMock.mockResolvedValue({})

    await db.delete(links).where(isNotNull(links.id))
  })

  it('deve exportar links em CSV e publicar na CDN', async () => {
    const first = await createLink(app, 'csv-one')
    await createLink(app, 'csv-two')
    await request(app.server).patch(`/links/${first.id}/access`)

    const response = await request(app.server).post('/links/export')

    expect(response.status).toBe(201)
    expect(response.body.fileName).toMatch(/^[0-9a-f-]{36}-\d+\.csv$/)

    const publicBase = env.CLOUDFLARE_PUBLIC_URL ?? 'https://cdn.example.com/exports'
    expect(response.body.publicUrl).toBe(
      `${publicBase.replace(/\/$/, '')}/${response.body.fileName}`,
    )

    expect(s3SendMock).toHaveBeenCalledOnce()

    const upload = s3SendMock.mock.calls[0]?.[0] as
      | { Body?: string; Key?: string; Bucket?: string }
      | undefined
    expect(upload).toEqual(
      expect.objectContaining({
        Bucket: env.CLOUDFLARE_BUCKET,
        Key: response.body.fileName,
        ContentType: 'text/csv; charset=utf-8',
      }),
    )

    const csv = upload?.Body ?? ''
    expect(csv.split('\n')[0]).toBe('originalUrl,shortUrl,accessCount,createdAt')
    expect(csv).toContain('https://example.com/csv-one,csv-one,1,')
    expect(csv).toContain('https://example.com/csv-two,csv-two,0,')
  })

  it('deve retornar 500 quando a CDN não está configurada', async () => {
    cdnConfigured.current = false

    const response = await request(app.server).post('/links/export')

    expect(response.status).toBe(500)
    expect(response.body).toEqual({ error: 'CDN não configurada.' })
    expect(s3SendMock).not.toHaveBeenCalled()
  })

  it('deve retornar 500 quando o upload na CDN falha', async () => {
    s3SendMock.mockRejectedValueOnce(new Error('S3 unavailable'))

    const response = await request(app.server).post('/links/export')

    expect(response.status).toBe(500)
    expect(response.body).toEqual({ error: 'Falha ao publicar CSV na CDN.' })
  })
})
