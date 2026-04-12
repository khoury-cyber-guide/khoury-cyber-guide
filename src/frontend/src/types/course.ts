export type CourseCategoryTag =
  | 'Support'
  | 'CS Requirement'
  | 'CY Elective'
  | 'CY Requirement'
  | 'Social Issues Requirement'
  | 'Presentation Requirement'
  | 'Misc. Elective'

export interface CourseSummary {
  id: number
  course_program: string
  course_code: number
  title: string
  description: string
  category_tag: CourseCategoryTag[]
  is_featured: boolean
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
  prereq_text: string
  attributes: string[]
  terms: string[]
  tutoring: string
  class_type: string
  avg_section_count: { summer?: number; fall_spring?: number }
  avg_class_size: { summer?: number; fall_spring?: number }
  notes: string
  topics: { id: number; title: string; slug: string; category: string }[]
  prereqs: CourseSummary[]
  past_professors: ProfessorSummary[]
  misc: Record<string, unknown>
  created_at: string
}

export interface CourseCreate {
  course_program: string
  course_code: number
  title: string
  description?: string
  extended_description?: string
  url?: string
  coreq?: boolean
  attributes?: string[]
  terms?: string[]
  tutoring?: string
  category_tag?: CourseCategoryTag[]
  misc?: Record<string, unknown>
  prereq_ids?: number[]
  professor_ids?: number[]
}

export type CourseUpdate = Partial<CourseCreate>

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
  'Social Issues Requirement': {
    label: 'Social Issues Requirement',
    description: 'Students must complete one of the following (the rest may be used as Cyber Electives):',
  },
  'Presentation Requirement': {
    label: 'Presentation Requirement',
    description: 'Students must complete one of the following:',
  },
  'Misc. Elective': {
    label: 'Miscellaneous Electives',
    description: 'Students must complete four of the following:',
  },
}
