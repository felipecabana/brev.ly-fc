import { QueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

export function shouldRetryQuery(failureCount: number, error: unknown) {
  if (failureCount >= 3) return false

  if (isAxiosError(error) && error.response) {
    const status = error.response.status
    if (status >= 400 && status < 500) return false
  }

  return true
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetryQuery,
      staleTime: 5_000,
      gcTime: 300_000,
    },
  },
})
