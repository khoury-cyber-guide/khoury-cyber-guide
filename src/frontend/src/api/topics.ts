import type { TopicCategory, TopicDetail, TopicSummary } from '@/types/topic'
import apiClient from './client'

export async function getTopics(
  signal: AbortSignal,
  category?: TopicCategory,
): Promise<TopicSummary[]> {
  const params = category ? { category } : {}
  const { data } = await apiClient.get<TopicSummary[]>('/api/topics', { params, signal })
  return data
}

export async function getTopicBySlug(
  signal: AbortSignal,
  slug: string,
): Promise<TopicDetail> {
  const { data } = await apiClient.get<TopicDetail>(`/api/topics/${encodeURIComponent(slug)}`, { signal })
  return data
}
