import { api } from '../lib/axios'
import type { DeleteLinkParams } from './types'

export async function deleteLink({ id }: DeleteLinkParams) {
  await api.delete(`/links/${id}`)
}
