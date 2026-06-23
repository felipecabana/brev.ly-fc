import { isAxiosError } from 'axios'

const statusMessages: Record<number, string> = {
  400: 'Dados inválidos. Verifique as informações e tente novamente.',
  404: 'Link não encontrado.',
  409: 'URL encurtada já está em uso.',
  500: 'Erro interno do servidor. Tente novamente mais tarde.',
}

const networkErrorMessage =
  'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'

const genericErrorMessage = 'Ocorreu um erro inesperado. Tente novamente.'

function getBackendErrorMessage(data: unknown) {
  if (
    typeof data === 'object' &&
    data !== null &&
    'error' in data &&
    typeof data.error === 'string'
  ) {
    return data.error
  }
}

export function getApiErrorMessage(error: unknown) {
  if (!isAxiosError(error)) {
    return genericErrorMessage
  }

  if (!error.response) {
    return networkErrorMessage
  }

  const backendMessage = getBackendErrorMessage(error.response.data)

  if (backendMessage) {
    return backendMessage
  }

  return statusMessages[error.response.status] ?? genericErrorMessage
}
