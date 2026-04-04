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
    tagline: 'Looking for general university resources? This category covers broad tools and services available to all students across campus.',
    description:
      'This section includes general university resources that support students beyond academics, from campus-wide services to institutional tools and platforms. These resources are useful for navigating university systems, accessing support services, and finding information that applies across all majors. If you are unsure where to start or need help with something not specific to cybersecurity, this is a good place to begin.',
  },
  {
    label: 'Advising & Degree Planning',
    slug: 'advising_degree_planning',
    tagline: 'Not sure what classes to take or how to plan your degree? These resources help you stay on track and make informed academic decisions.',
    description:
      'This section focuses on academic advising and degree planning resources that help you understand program requirements, choose courses, and map out your academic path. You can use these tools to plan upcoming semesters, explore electives, and make sure you are meeting graduation requirements. These resources are especially helpful when preparing for registration or making longer-term decisions about your degree.',
  },
  {
    label: 'Co-op & Career Planning',
    slug: 'coop_career_planning',
    tagline: 'Getting ready for co-op or future jobs? These resources help you build experience and prepare for cybersecurity careers.',
    description:
      'This section highlights resources that support career development, including co-op preparation, resume building, interview practice, and job search strategies. These tools are designed to help you gain relevant experience, navigate the co-op process, and position yourself for internships and full-time roles. Whether you are just getting started or actively applying, these resources can help you take the next step in your career.',
  },
  {
    label: 'Clubs & On-Campus Events',
    slug: 'clubs_on_campus_events',
    tagline: 'Want to get involved outside of class? These resources connect you with clubs, events, and the cybersecurity community on campus.',
    description:
      'This section features student organizations, events, and campus opportunities that help you engage with the cybersecurity community. Getting involved can help you build practical skills, meet other students with similar interests, and stay up to date on events and opportunities. These experiences are a great way to supplement coursework and become more connected within the field.',
  },
  {
    label: 'Scholarship & Financial Aid',
    slug: 'scholarship_financial_aid',
    tagline: 'Looking for ways to fund your education? These resources cover scholarships, aid, and financial support options.',
    description:
      'This section includes resources related to scholarships, financial aid, and funding opportunities available to students. These tools can help you find and apply for financial support, understand available aid options, and manage the cost of your education. Taking advantage of these resources can reduce financial stress and allow you to focus more on your academic and career goals.',
  },
  {
    label: 'Undergraduate Research',
    slug: 'undergraduate_research',
    tagline: 'Interested in research opportunities? These resources help you get involved in cybersecurity-related research projects.',
    description:
      'This section highlights opportunities for undergraduate research, including ways to connect with faculty, labs, and ongoing projects. Research experience allows you to explore topics in greater depth, contribute to real-world work, and build strong technical and analytical skills. It can also be a valuable step if you are considering graduate school or research-oriented roles.',
  },
  {
    label: 'Wellbeing & Mental Health',
    slug: 'wellbeing_mental_health',
    tagline: 'Feeling overwhelmed or need support? These resources focus on student wellbeing and mental health.',
    description:
      'This section includes resources that support mental health, wellbeing, and overall student balance. Cybersecurity coursework can be demanding, so it is important to have access to support systems that help manage stress and maintain focus. These tools can help you take care of yourself, stay balanced, and sustain long-term success both academically and personally.',
  },
]

export const KHOURY_RESOURCE_CATEGORY_MAP = Object.fromEntries(
  KHOURY_RESOURCE_CATEGORIES.map((c) => [c.slug, c]),
) as Record<KhouryResourceCategory, KhouryResourceCategoryMeta>
