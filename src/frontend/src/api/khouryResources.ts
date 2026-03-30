import apiClient from './client'
import type { KhouryResourceCategory } from '@/types/khouryResource'

export const getKhouryResources = (
  signal?: AbortSignal,
  params?: { category?: KhouryResourceCategory; is_featured?: boolean },
) =>
  apiClient
    .get('/api/khoury-resources', { signal, params })
    .then((r) => r.data)

export const getKhouryResourceById = (id: number, signal?: AbortSignal) =>
  apiClient.get(`/api/khoury-resources/${id}`, { signal }).then((r) => r.data)
