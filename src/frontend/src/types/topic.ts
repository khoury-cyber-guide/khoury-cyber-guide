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

export interface CourseSummaryInTopic {
  id: number
  course_program: string
  course_code: number
  title: string
  description: string
  category_tag: string[]
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

export interface OffCampus {
  certifications: Record<string, string>
  learning_tools: Record<string, string>
  socials: Record<string, string>
}

export interface TopicMisc {
  why_care?: string
  secondary_section?: string
  still_confused?: string
  active_research?: Record<string, string>
  tools?: Record<string, string>
  other_resources?: Record<string, string>
}

export interface TopicDetail extends TopicSummary {
  off_campus: OffCampus
  courses: CourseSummaryInTopic[]
  clubs: ClubSummary[]
  professors: ProfessorSummary[]
  misc: TopicMisc
  created_at: string
}
