import { useParams, Link } from 'react-router-dom'
import { useApi } from '@/hooks/useApi'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { getCourses } from '@/api/courses'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { COURSE_CATEGORY_META } from '@/types/course'
import type { CourseCategoryTag, CourseSummary } from '@/types/course'
import { NotFoundPage } from './NotFoundPage'

const VALID_TAGS = new Set<string>(Object.keys(COURSE_CATEGORY_META))
const FALLBACK_TAG = Object.keys(COURSE_CATEGORY_META)[0] as CourseCategoryTag

export function CourseGroupPage() {
  const { tag } = useParams<{ tag: string }>()
  const decoded = tag ? decodeURIComponent(tag) : ''
  const isValid = !!decoded && VALID_TAGS.has(decoded)
  const categoryTag = (isValid ? decoded : FALLBACK_TAG) as CourseCategoryTag
  const meta = COURSE_CATEGORY_META[categoryTag]

  useDocumentTitle(isValid ? meta.label : undefined)

  const { data: courses, loading, error } = useApi<CourseSummary[]>((signal) =>
    isValid ? getCourses(signal, categoryTag) : Promise.resolve([]),
  )

  if (!isValid) return <NotFoundPage />

  const sorted = (courses ?? []).slice().sort((a, b) => a.course_code - b.course_code)

  return (
    <PageWrapper>
      <div className="mb-2 text-xs text-dim-grey">
        <Link to="/courses" className="hover:text-alabaster">Courses</Link>
        <span className="mx-2">/</span>
        <span>{meta.label}</span>
      </div>

      <div className="mb-10 mt-4 border-l-4 border-carmine pl-5">
        <h1 className="text-3xl font-bold tracking-tight text-alabaster sm:text-4xl">
          {meta.label}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-dim-grey">
          {meta.description}
        </p>
      </div>

      {error && (
        <div role="alert" className="mb-8 rounded-md border border-carmine/40 bg-carmine/10 px-4 py-3 text-sm text-carmine">
          Failed to load courses. Please try refreshing.
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-md bg-graphite/60" />
          ))}
        </div>
      ) : sorted.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((course) => (
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
        </div>
      ) : (
        <p className="text-sm text-dim-grey">No courses in this category yet.</p>
      )}
    </PageWrapper>
  )
}
