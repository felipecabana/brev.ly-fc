import { z } from 'zod'

const optionalNonEmptyString = z.preprocess(
  (value) => (value === '' || value === undefined ? undefined : value),
  z.string().min(1).optional(),
)

const optionalUrl = z.preprocess(
  (value) => (value === '' || value === undefined ? undefined : value),
  z.url().optional(),
)

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3333),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.url(),
  CORS_ORIGIN: z.url(),
  CLOUDFLARE_ACCOUNT_ID: optionalNonEmptyString,
  CLOUDFLARE_ACCESS_KEY_ID: optionalNonEmptyString,
  CLOUDFLARE_SECRET_ACCESS_KEY: optionalNonEmptyString,
  CLOUDFLARE_BUCKET: optionalNonEmptyString,
  CLOUDFLARE_PUBLIC_URL: optionalUrl,
})

export type Env = z.infer<typeof envSchema>

function formatZodError(error: z.ZodError): string {
  return error.issues
    .map((issue) => `  - ${issue.path.join('.') || 'root'}: ${issue.message}`)
    .join('\n')
}

export function loadEnv(): Env {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    console.error('Invalid environment variables:\n%s', formatZodError(result.error))
    process.exit(1)
  }

  return result.data
}

export const env = loadEnv()
