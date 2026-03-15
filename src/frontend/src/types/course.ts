export type CourseCategoryTag =
  | 'Support'
  | 'CS Requirement'
  | 'CY Elective'
  | 'CY Requirement'

export interface CourseSummary {
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

export interface CourseDetail extends CourseSummary {
  extended_description: string
  url: string
  coreq: boolean
  attributes: string[]
  terms: string
  tutoring: string
  topics: { id: number; title: string; slug: string; category: string }[]
  prereqs: CourseSummary[]
  past_professors: ProfessorSummary[]
  misc: Record<string, unknown>
  created_at: string
}

export const COURSE_CATEGORY_META: Record<CourseCategoryTag, { label: string; description: string }> = {
  'CY Requirement': {
    label: 'Required Cybersecurity Courses',
    description: 'Core cybersecurity courses required for the CY degree.',
  },
  'CS Requirement': {
    label: 'Required Computer Science Courses',
    description: 'Computer science foundations required for the CY degree.',
  },
  Support: {
    label: 'Required Supporting Courses',
    description: 'Mathematics, science, and other supporting requirements.',
  },
  'CY Elective': {
    label: 'Cybersecurity Elective Courses',
    description: 'Choose from approved cybersecurity electives to complete your degree.',
  },
}
