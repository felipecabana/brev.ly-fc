import { AxiosError } from 'axios'
import { describe, expect, it } from 'vitest'

import { getApiErrorMessage } from '../src/lib/api-error'

function axiosError(status?: number, data?: { error: string }) {
  return new AxiosError(
    'falhou',
    status ? 'ERR_BAD_RESPONSE' : 'ERR_NETWORK',
    undefined,
    undefined,
    status
      ? {
          status,
          data: data ?? {},
          statusText: '',
          headers: {},
          config: {} as never,
        }
      : undefined,
  )
}

describe('getApiErrorMessage', () => {
  it('usa a mensagem do backend quando disponível', () => {
    const message = getApiErrorMessage(
      axiosError(409, { error: 'URL encurtada já está em uso.' }),
    )

    expect(message).toBe('URL encurtada já está em uso.')
  })

  it('mapeia 404 sem corpo do backend', () => {
    expect(getApiErrorMessage(axiosError(404))).toBe('Link não encontrado.')
  })

  it('mapeia falha de rede', () => {
    expect(getApiErrorMessage(axiosError())).toBe(
      'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
    )
  })

  it('retorna mensagem genérica para erro desconhecido', () => {
    expect(getApiErrorMessage(new Error('ops'))).toBe(
      'Ocorreu um erro inesperado. Tente novamente.',
    )
  })
})
