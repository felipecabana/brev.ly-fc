import { z } from 'zod'

export const SHORT_URL_PATTERN = /^[a-zA-Z0-9_-]{3,32}$/

export const shortUrlSchema = z
  .string()
  .regex(
    SHORT_URL_PATTERN,
    'Use entre 3 e 32 caracteres (letras, números, _ ou -).',
  )

export const originalUrlSchema = z.url('Informe uma URL válida.')

export const createLinkFormSchema = z.object({
  originalUrl: originalUrlSchema,
  shortUrl: shortUrlSchema,
})

export type CreateLinkForm = z.infer<typeof createLinkFormSchema>

export function isValidShortUrl(value: string) {
  return SHORT_URL_PATTERN.test(value)
}
