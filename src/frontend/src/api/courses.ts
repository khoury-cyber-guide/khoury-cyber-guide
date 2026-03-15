import type { CourseCategoryTag, CourseDetail, CourseSummary } from '@/types/course'
import apiClient from './client'

export async function getCourses(
  signal: AbortSignal,
  categoryTag?: CourseCategoryTag,
): Promise<CourseSummary[]> {
  const params = categoryTag ? { category_tag: categoryTag } : {}
  const { data } = await apiClient.get<CourseSummary[]>('/api/courses', { params, signal })
  return data
}

export async function getCourseById(
  signal: AbortSignal,
  id: number,
): Promise<CourseDetail> {
  const { data } = await apiClient.get<CourseDetail>(`/api/courses/${id}`, { signal })
  return data
}
