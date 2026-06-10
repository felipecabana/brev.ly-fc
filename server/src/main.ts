import { buildApp } from './app.js'
import { env } from './config/env.js'
import { closeDatabase, verifyDatabaseConnection } from './db/connection.js'

async function start() {
  await verifyDatabaseConnection()

  const app = await buildApp()

  try {
    await app.listen({ port: env.PORT, host: env.HOST })
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }

  const shutdown = async (signal: string) => {
    app.log.info(`Received ${signal}, shutting down gracefully`)
    await app.close()
    await closeDatabase()
    process.exit(0)
  }

  process.on('SIGINT', () => {
    void shutdown('SIGINT')
  })

  process.on('SIGTERM', () => {
    void shutdown('SIGTERM')
  })
}

start().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
