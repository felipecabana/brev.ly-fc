import { api } from '../lib/axios'
import type { GetLinksQuery, GetLinksResponse } from './types'

export async function getLinks({ pageIndex, limit }: GetLinksQuery) {
  const response = await api.get<GetLinksResponse>('/links', {
    params: { pageIndex, limit },
  })

  return response.data
}
