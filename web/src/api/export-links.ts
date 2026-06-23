import { api } from '../lib/axios'
import type { ExportLinksResponse } from './types'

export async function exportLinks() {
  const response = await api.post<ExportLinksResponse>('/links/export')

  return response.data
}
