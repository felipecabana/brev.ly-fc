import cors from '@fastify/cors'
import Fastify, { type FastifyError } from 'fastify'

import { env } from './config/env.js'
import { healthRoutes } from './routes/health.js'

export async function buildApp() {
  const app = Fastify({
    logger: true,
  })

  await app.register(cors, {
    origin: env.CORS_ORIGIN,
  })

  app.setErrorHandler((error: FastifyError, _request, reply) => {
    app.log.error(error)

    const statusCode = error.statusCode ?? 500
    const message = statusCode >= 500 ? 'Internal Server Error' : error.message

    void reply.status(statusCode).send({ message })
  })

  await app.register(healthRoutes)

  return app
}
