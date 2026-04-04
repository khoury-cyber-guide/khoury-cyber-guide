export type TopicCategory =
  | 'build_and_secure'
  | 'attack_and_defend'
  | 'strategy_and_governance'

export interface TopicSummary {
  id: number
  title: string
  slug: string
  category: TopicCategory
  order: number
  description: string
}

import type { CourseCategoryTag } from '@/types/course'

export interface CourseSummaryInTopic {
  id: number
  course_program: string
  course_code: number
  title: string
  description: string
  category_tag: CourseCategoryTag[]
}

export interface ProfessorSummary {
  id: number
  full_name: string
  area_of_focus: string
  photo: string
  url: string
}

export interface ClubSummary {
  id: number
  name: string
  mission: string
  url: string
  tags: string[]
}

export interface ResourceItem {
  name: string
  url: string
  description?: string
}

export interface OffCampus {
  certifications: ResourceItem[]
  learning_tools: ResourceItem[]
  blogs_newsletters: ResourceItem[]
  tools: ResourceItem[]
}

export interface TopicMisc {
  what_is?: string
  common_attacks?: string
  why_care?: string
  still_confused?: ResourceItem[]
  active_research?: ResourceItem[]
  other_resources?: ResourceItem[]
}

export interface TopicCreate {
  title: string
  category: TopicCategory
  slug: string
  order?: number
  description?: string
  off_campus?: Partial<OffCampus>
  misc?: Record<string, unknown>
  course_ids?: number[]
  club_ids?: number[]
  khoury_resource_ids?: number[]
  professor_ids?: number[]
}

export type TopicUpdate = Partial<TopicCreate>

export interface KhouryResourceInTopic {
  id: number
  name: string
  description: string
  url: string
  category: string
  priority: string
  is_featured: boolean
}

export interface TopicDetail extends TopicSummary {
  off_campus: OffCampus
  courses: CourseSummaryInTopic[]
  clubs: ClubSummary[]
  khoury_resources: KhouryResourceInTopic[]
  professors: ProfessorSummary[]
  misc: TopicMisc
  created_at: string
}
