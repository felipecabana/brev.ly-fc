import type { FastifyPluginCallback } from 'fastify'
import { count, desc, eq, sql } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '../db/connection.js'
import { links } from '../db/schema.js'

export const linksRoutes: FastifyPluginCallback = (app, _opts, done) => {
  app.get('/', async (request, reply) => {
    const listLinksQuerySchema = z.object({
      pageIndex: z.coerce.number().int().min(0).default(0),
      limit: z.coerce.number().int().min(1).max(100).default(10),
    })

    try {
      const { pageIndex, limit } = listLinksQuerySchema.parse(request.query)
      const offset = pageIndex * limit

      const [rows, countRows] = await Promise.all([
        db
          .select()
          .from(links)
          .orderBy(desc(links.createdAt))
          .offset(offset)
          .limit(limit),
        db.select({ totalCount: count() }).from(links),
      ])

      const totalCount = countRows[0]?.totalCount ?? 0

      return { links: rows, meta: { pageIndex, limit, totalCount } }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Parâmetros de consulta inválidos.' })
      }

      throw error
    }
  })

  app.get('/:shortUrl', async (request, reply) => {
    const getLinkBySlugParamsSchema = z.object({
      shortUrl: z.string().regex(/^[a-zA-Z0-9_-]{3,32}$/),
    })

    try {
      const { shortUrl } = getLinkBySlugParamsSchema.parse(request.params)

      const [link] = await db
        .select()
        .from(links)
        .where(eq(links.shortUrl, shortUrl))
        .limit(1)

      if (!link) {
        return await reply.status(404).send({ error: 'Link não encontrado.' })
      }

      return { link }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Parâmetros de rota inválidos.' })
      }

      throw error
    }
  })

  app.patch('/:id/access', async (request, reply) => {
    const incrementAccessParamsSchema = z.object({
      id: z.uuid(),
    })

    try {
      const { id } = incrementAccessParamsSchema.parse(request.params)

      const [link] = await db
        .update(links)
        .set({
          accessCount: sql`${links.accessCount} + 1`,
        })
        .where(eq(links.id, id))
        .returning()

      if (!link) {
        return await reply.status(404).send({ error: 'Link não encontrado.' })
      }

      return { link }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Parâmetros de rota inválidos.' })
      }

      throw error
    }
  })

  app.delete('/:id', async (request, reply) => {
    const deleteLinkParamsSchema = z.object({
      id: z.uuid(),
    })

    try {
      const { id } = deleteLinkParamsSchema.parse(request.params)

      const [deletedLink] = await db
        .delete(links)
        .where(eq(links.id, id))
        .returning()

      if (!deletedLink) {
        return await reply.status(404).send({ error: 'Link não encontrado.' })
      }

      return await reply.status(200).send()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Parâmetros de rota inválidos.' })
      }

      throw error
    }
  })

  app.post('/', async (request, reply) => {
    const createLinkBodySchema = z.object({
      originalUrl: z.url(),
      shortUrl: z.string().regex(/^[a-zA-Z0-9_-]{3,32}$/),
    })

    try {
      const { originalUrl, shortUrl } = createLinkBodySchema.parse(request.body)

      const [link] = await db
        .insert(links)
        .values({ originalUrl, shortUrl })
        .returning()

      return await reply.status(201).send({ link })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Corpo da requisição inválido.' })
      }

      if ((error as { code?: string }).code === '23505') {
        return reply.status(409).send({ error: 'URL encurtada já está em uso.' })
      }

      throw error
    }
  })

  done()
}
