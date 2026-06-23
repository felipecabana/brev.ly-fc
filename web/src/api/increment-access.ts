import { api } from '../lib/axios'
import type { IncrementAccessParams, LinkResponse } from './types'

export async function incrementAccess({ id }: IncrementAccessParams) {
  const response = await api.patch<LinkResponse>(`/links/${id}/access`)

  return response.data
}
