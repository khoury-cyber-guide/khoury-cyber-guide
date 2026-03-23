import apiClient from './client'
import type { TopicCreate, TopicUpdate } from '@/types/topic'
import type { CourseCreate, CourseUpdate } from '@/types/course'

type ProfessorCreate = {
  full_name: string
  bio?: string
  area_of_focus?: string
  photo?: string
  url?: string
  misc?: Record<string, unknown>
  course_ids?: number[]
  topic_ids?: number[]
}

type ProfessorUpdate = Partial<ProfessorCreate>

type ClubCreate = {
  name: string
  location: string
  level: string[]
  mission?: string
  email?: string
  tags?: string[]
  url?: string
  misc?: Record<string, unknown>
  topic_ids?: number[]
}

type ClubUpdate = Partial<ClubCreate>

const auth = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } })

export const verifyAdminToken = (token: string) =>
  apiClient.post('/api/admin/verify', null, auth(token))

// Topics
export const adminCreateTopic = (token: string, data: TopicCreate) =>
  apiClient.post('/api/topics', data, auth(token))

export const adminUpdateTopic = (token: string, slug: string, data: TopicUpdate) =>
  apiClient.patch(`/api/topics/${slug}`, data, auth(token))

export const adminDeleteTopic = (token: string, slug: string) =>
  apiClient.delete(`/api/topics/${slug}`, auth(token))

// Courses
export const adminCreateCourse = (token: string, data: CourseCreate) =>
  apiClient.post('/api/courses', data, auth(token))

export const adminUpdateCourse = (token: string, id: number, data: CourseUpdate) =>
  apiClient.patch(`/api/courses/${id}`, data, auth(token))

export const adminDeleteCourse = (token: string, id: number) =>
  apiClient.delete(`/api/courses/${id}`, auth(token))

// Professors
export const adminCreateProfessor = (token: string, data: ProfessorCreate) =>
  apiClient.post('/api/professors', data, auth(token))

export const adminUpdateProfessor = (token: string, id: number, data: ProfessorUpdate) =>
  apiClient.patch(`/api/professors/${id}`, data, auth(token))

export const adminDeleteProfessor = (token: string, id: number) =>
  apiClient.delete(`/api/professors/${id}`, auth(token))

// Clubs
export const adminCreateClub = (token: string, data: ClubCreate) =>
  apiClient.post('/api/clubs', data, auth(token))

export const adminUpdateClub = (token: string, id: number, data: ClubUpdate) =>
  apiClient.patch(`/api/clubs/${id}`, data, auth(token))

export const adminDeleteClub = (token: string, id: number) =>
  apiClient.delete(`/api/clubs/${id}`, auth(token))
