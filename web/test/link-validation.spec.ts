import { describe, expect, it } from 'vitest'

import {
  createLinkFormSchema,
  isValidShortUrl,
  originalUrlSchema,
  shortUrlSchema,
} from '../src/lib/link-validation'

describe('link-validation', () => {
  it('aceita slug válido', () => {
    expect(shortUrlSchema.safeParse('meu-link_1').success).toBe(true)
  })

  it('rejeita slug com caracteres inválidos', () => {
    expect(shortUrlSchema.safeParse('link com espaço').success).toBe(false)
  })

  it('rejeita slug curto demais', () => {
    expect(shortUrlSchema.safeParse('ab').success).toBe(false)
  })

  it('aceita URL válida', () => {
    expect(originalUrlSchema.safeParse('https://example.com').success).toBe(true)
  })

  it('rejeita URL inválida', () => {
    expect(originalUrlSchema.safeParse('nao-e-url').success).toBe(false)
  })

  it('valida o formulário completo', () => {
    const result = createLinkFormSchema.safeParse({
      originalUrl: 'https://example.com',
      shortUrl: 'meu-link',
    })

    expect(result.success).toBe(true)
  })

  it('isValidShortUrl segue o mesmo padrão do schema', () => {
    expect(isValidShortUrl('abc')).toBe(true)
    expect(isValidShortUrl('ab')).toBe(false)
  })
})
