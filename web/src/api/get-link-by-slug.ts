import { api } from '../lib/axios'
import type { GetLinkBySlugParams, LinkResponse } from './types'

export async function getLinkBySlug({ shortUrl }: GetLinkBySlugParams) {
  const response = await api.get<LinkResponse>(`/links/${shortUrl}`)

  return response.data
}
