import type { KhouryResourceCategory } from '@/types/khouryResource'

export interface KhouryResourceCategoryMeta {
  label: string
  slug: KhouryResourceCategory
  tagline: string
  description: string
}

export const KHOURY_RESOURCE_CATEGORIES: KhouryResourceCategoryMeta[] = [
  {
    label: 'General University',
    slug: 'general_university',
    tagline: 'Lorem ipsum dolor sit amet consectetur.',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    label: 'Advising & Degree Planning',
    slug: 'advising_degree_planning',
    tagline: 'Lorem ipsum dolor sit amet consectetur.',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    label: 'Co-op & Career Planning',
    slug: 'coop_career_planning',
    tagline: 'Lorem ipsum dolor sit amet consectetur.',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    label: 'Clubs & On-Campus Events',
    slug: 'clubs_on_campus_events',
    tagline: 'Lorem ipsum dolor sit amet consectetur.',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    label: 'Scholarship & Financial Aid',
    slug: 'scholarship_financial_aid',
    tagline: 'Lorem ipsum dolor sit amet consectetur.',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    label: 'Undergraduate Research',
    slug: 'undergraduate_research',
    tagline: 'Lorem ipsum dolor sit amet consectetur.',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    label: 'Wellbeing & Mental Health',
    slug: 'wellbeing_mental_health',
    tagline: 'Lorem ipsum dolor sit amet consectetur.',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
]

export const KHOURY_RESOURCE_CATEGORY_MAP = Object.fromEntries(
  KHOURY_RESOURCE_CATEGORIES.map((c) => [c.slug, c]),
) as Record<KhouryResourceCategory, KhouryResourceCategoryMeta>
