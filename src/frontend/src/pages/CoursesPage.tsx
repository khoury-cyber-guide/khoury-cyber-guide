import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useApi } from '@/hooks/useApi'
import { getCourses } from '@/api/courses'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { COURSE_CATEGORY_META } from '@/types/course'
import type { CourseCategoryTag, CourseSummary } from '@/types/course'
import { Link } from 'react-router-dom'

const CATEGORY_ORDER: CourseCategoryTag[] = [
  'CY Requirement',
  'CS Requirement',
  'Support',
  'CY Elective',
]

export function CoursesPage() {
  useDocumentTitle('Courses')
  const { data: courses, loading, error } = useApi<CourseSummary[]>((signal) =>
    getCourses(signal),
  )

  const grouped = CATEGORY_ORDER.reduce<Record<CourseCategoryTag, CourseSummary[]>>(
    (acc, tag) => {
      acc[tag] = (courses ?? [])
        .filter((c) => c.category_tag.includes(tag))
        .sort((a, b) => a.course_code - b.course_code)
      return acc
    },
    {
      'CY Requirement': [],
      'CS Requirement': [],
      Support: [],
      'CY Elective': [],
    },
  )

  return (
    <PageWrapper>
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-alabaster sm:text-4xl">Courses</h1>
        <p className="mt-3 max-w-2xl text-base text-dim-grey">
          All Khoury cybersecurity courses, grouped by degree requirement. Click any course for
          full details including prerequisites, attributes, and past instructors.
        </p>
      </div>

      {error && (
        <div role="alert" className="mb-8 rounded-md border border-carmine/40 bg-carmine/10 px-4 py-3 text-sm text-carmine">
          Failed to load courses. Please try refreshing.
        </div>
      )}

      <div className="flex flex-col gap-10">
        {CATEGORY_ORDER.map((tag, idx) => {
          const meta = COURSE_CATEGORY_META[tag]
          const catCourses = grouped[tag]

          return (
            <section key={tag} aria-labelledby={`cat-${tag}`}>
              {idx > 0 && <Separator className="mb-10 bg-white/10" />}

              <div className="mb-5 flex items-end justify-between gap-4">
                <div className="border-l-4 border-carmine pl-4">
                  <h2
                    id={`cat-${tag}`}
                    className="text-sm font-bold uppercase tracking-widest text-alabaster"
                  >
                    {meta.label}
                  </h2>
                  <p className="mt-1 text-sm text-dim-grey">{meta.description}</p>
                </div>
                <Link
                  to={`/courses/group/${encodeURIComponent(tag)}`}
                  className="shrink-0 text-xs font-medium text-carmine hover:underline"
                >
                  Browse all →
                </Link>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-36 rounded-md bg-graphite/60" />
                  ))}
                </div>
              ) : catCourses.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {catCourses.slice(0, 5).map((course) => (
                    <Link
                      key={course.id}
                      to={`/courses/${course.id}`}
                      className="group flex flex-col gap-2 rounded-md border border-white/10 bg-graphite p-4 transition-colors hover:border-carmine/40"
                    >
                      <Badge className="w-fit bg-carmine font-mono text-xs text-white">
                        {course.course_program} {course.course_code}
                      </Badge>
                      <p className="font-medium text-alabaster transition-colors group-hover:text-carmine">
                        {course.title}
                      </p>
                      {course.description && (
                        <p className="line-clamp-2 text-xs leading-relaxed text-dim-grey">
                          {course.description}
                        </p>
                      )}
                    </Link>
                  ))}
                  <Link
                    to={`/courses/group/${encodeURIComponent(tag)}`}
                    className="flex flex-col items-center justify-center gap-2 rounded-md border border-carmine/40 bg-carmine/5 p-4 text-center transition-colors hover:bg-carmine/10"
                  >
                    <span className="text-2xl text-carmine" aria-hidden="true">→</span>
                    <span className="font-semibold text-carmine">Browse all</span>
                    <span className="text-xs text-dim-grey">{catCourses.length} courses</span>
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-dim-grey">No courses in this category yet.</p>
              )}
            </section>
          )
        })}
      </div>
    </PageWrapper>
  )
}
