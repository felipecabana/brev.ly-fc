import { AxiosError } from 'axios'
import { describe, expect, it } from 'vitest'

import { shouldRetryQuery } from '../src/lib/query-client'

function axiosError(status: number) {
  return new AxiosError(
    'falhou',
    'ERR_BAD_RESPONSE',
    undefined,
    undefined,
    {
      status,
      data: {},
      statusText: '',
      headers: {},
      config: {} as never,
    },
  )
}

describe('shouldRetryQuery', () => {
  it('não retenta após 404', () => {
    expect(shouldRetryQuery(0, axiosError(404))).toBe(false)
  })

  it('retenta erro de rede', () => {
    const networkError = new AxiosError('offline', 'ERR_NETWORK')

    expect(shouldRetryQuery(0, networkError)).toBe(true)
    expect(shouldRetryQuery(3, networkError)).toBe(false)
  })
})
