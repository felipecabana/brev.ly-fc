import { api } from '../lib/axios'
import type { CreateLinkBody, LinkResponse } from './types'

export async function createLink({ originalUrl, shortUrl }: CreateLinkBody) {
  const response = await api.post<LinkResponse>('/links', {
    originalUrl,
    shortUrl,
  })

  return response.data
}
