import cors from '@fastify/cors'
import Fastify, { type FastifyError } from 'fastify'
import { z } from 'zod'

import { env } from './config/env.js'
import { healthRoutes } from './routes/health.js'
import { linksRoutes } from './routes/links.js'

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === 'production' ? 'info' : 'debug',
    },
  })

  await app.register(cors, {
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  })

  app.setErrorHandler((error: FastifyError, _request, reply) => {
    app.log.error(error)

    if (error instanceof z.ZodError) {
      return reply.status(400).send({ error: 'Requisição inválida.' })
    }

    const statusCode = error.statusCode ?? 500
    const message =
      statusCode >= 500 ? 'Erro interno do servidor.' : error.message

    return reply.status(statusCode).send({ error: message })
  })

  await app.register(healthRoutes)
  await app.register(linksRoutes, { prefix: '/links' })

  return app
}
