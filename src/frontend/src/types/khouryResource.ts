export type KhouryResourceCategory =
  | 'general_university'
  | 'advising_degree_planning'
  | 'coop_career_planning'
  | 'clubs_on_campus_events'
  | 'scholarship_financial_aid'
  | 'undergraduate_research'
  | 'wellbeing_mental_health'

export type KhouryResourcePriority = 'TOP_3' | 'EXPAND' | 'IF_SPACE'

export interface KhouryResourceSummary {
  id: number
  name: string
  description: string
  url: string
  category: KhouryResourceCategory
  priority: KhouryResourcePriority
  is_featured: boolean
}

export interface KhouryResourceRead extends KhouryResourceSummary {
  misc: Record<string, unknown>
  created_at: string
}
