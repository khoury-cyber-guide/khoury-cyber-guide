import { useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApi } from '@/hooks/useApi'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { getCourseById } from '@/api/courses'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import type { CourseDetail } from '@/types/course'
import { NotFoundPage } from './NotFoundPage'

export function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const courseId = id ? parseInt(id, 10) : NaN
  const isValid = !isNaN(courseId)

  const { data: course, loading, error, refetch } = useApi<CourseDetail | null>((signal) =>
    isValid ? getCourseById(signal, courseId) : Promise.resolve(null),
  )

  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return }
    refetch()
  }, [courseId, refetch])

  useDocumentTitle(course ? `${course.course_program} ${course.course_code}: ${course.title}` : undefined)

  if (!isValid) return <NotFoundPage />

  if (loading) {
    return (
      <PageWrapper>
        <Skeleton className="mb-4 h-8 w-64 bg-graphite/60" />
        <Skeleton className="mb-8 h-6 w-96 bg-graphite/60" />
        <Skeleton className="h-48 rounded-md bg-graphite/60" />
      </PageWrapper>
    )
  }

  if (error || !course) return <NotFoundPage />

  const code = `${course.course_program} ${course.course_code}`

  return (
    <PageWrapper>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-2 text-xs text-dim-grey">
        <Link to="/courses" className="hover:text-alabaster">Courses</Link>
        <span className="mx-2">/</span>
        <span className="text-alabaster">{code}</span>
      </nav>

      {/* Header */}
      <div className="mt-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant="outline"
            className="border-carmine/60 bg-carmine/10 font-mono text-sm text-carmine"
          >
            {code}
          </Badge>
          {course.coreq && (
            <Badge variant="outline" className="border-copper/60 bg-copper/10 text-xs text-copper">
              Co-req
            </Badge>
          )}
        </div>
        <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-alabaster sm:text-4xl">
          {course.title}
        </h1>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Description */}
          <section aria-labelledby="desc-heading">
            <h2 id="desc-heading" className="mb-3 text-xs font-semibold uppercase tracking-widest text-dim-grey">
              Course Description
            </h2>
            <p className="text-sm leading-relaxed text-alabaster">
              {course.extended_description || course.description || 'No description available.'}
            </p>
          </section>

          <Separator className="bg-white/10" />

          {/* Prerequisites */}
          {(course.prereqs.length > 0 || course.prereq_text) && (
            <section aria-labelledby="prereqs-heading">
              <h2 id="prereqs-heading" className="mb-3 text-xs font-semibold uppercase tracking-widest text-dim-grey">
                Prerequisites
              </h2>
              {course.prereq_text && (
                <p className="mb-3 whitespace-pre-line text-sm leading-relaxed text-dim-grey">{course.prereq_text}</p>
              )}
              {course.prereqs.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {course.prereqs.map((p) => (
                    <Link key={p.id} to={`/courses/${p.id}`}>
                      <Badge
                        variant="outline"
                        className="cursor-pointer border-white/20 font-mono text-xs text-alabaster underline-offset-2 transition-colors hover:border-carmine/60 hover:text-carmine hover:underline"
                      >
                        {p.course_program} {p.course_code}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          )}

        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          {/* Quick Info */}
          {(course.terms.length > 0 || course.class_type || course.avg_section_count?.fall_spring != null || course.avg_class_size?.fall_spring != null) && (
            <div className="rounded-md border border-white/10 bg-graphite p-5">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-dim-grey">
                Quick Info
              </h2>
              <dl className="flex flex-col gap-5">
                {course.terms.length > 0 && (
                  <div>
                    <dt className="text-xs text-dim-grey">Past Terms</dt>
                    <dd className="mt-1.5 flex flex-wrap gap-1.5">
                      {course.terms.map((t) => (
                        <Badge key={t} variant="secondary" className="bg-white/5 text-xs text-alabaster">
                          {t}
                        </Badge>
                      ))}
                    </dd>
                  </div>
                )}
                {course.class_type && (
                  <div>
                    <dt className="text-xs text-dim-grey">Class Type</dt>
                    <dd className="mt-0.5 text-sm text-alabaster">{course.class_type}</dd>
                  </div>
                )}
                {(course.avg_section_count?.summer != null || course.avg_section_count?.fall_spring != null) && (
                  <div>
                    <dt className="text-xs text-dim-grey">Avg. Section Count</dt>
                    <dd className="mt-0.5 flex flex-col gap-1 text-sm text-alabaster">
                      {course.avg_section_count?.fall_spring != null && (
                        <span>Fall/Spring: <span className="font-medium">{course.avg_section_count.fall_spring}</span></span>
                      )}
                      {course.avg_section_count?.summer != null && (
                        <span>Summer: <span className="font-medium">{course.avg_section_count.summer}</span></span>
                      )}
                    </dd>
                  </div>
                )}
                {(course.avg_class_size?.summer != null || course.avg_class_size?.fall_spring != null) && (
                  <div>
                    <dt className="text-xs text-dim-grey">Avg. Class Size</dt>
                    <dd className="mt-0.5 flex flex-col gap-1 text-sm text-alabaster">
                      {course.avg_class_size?.fall_spring != null && (
                        <span>Fall/Spring: <span className="font-medium">{course.avg_class_size.fall_spring}</span></span>
                      )}
                      {course.avg_class_size?.summer != null && (
                        <span>Summer: <span className="font-medium">{course.avg_class_size.summer}</span></span>
                      )}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Past Professors */}
          {course.past_professors.length > 0 && (
            <div className="rounded-md border border-white/10 bg-graphite p-5">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-dim-grey">
                Past Instructors
              </h2>
              <div className="flex flex-col gap-2">
                {course.past_professors.map((prof) => (
                  <a
                    key={prof.id}
                    href={prof.url || undefined}
                    target={prof.url ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-md border border-white/10 bg-graphite p-3 transition-colors hover:border-carmine/40"
                  >
                    {prof.photo ? (
                      <img src={prof.photo} alt="" className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-carmine/20 text-xs font-semibold text-carmine">
                        {prof.full_name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-alabaster">{prof.full_name}</p>
                      {prof.area_of_focus && (
                        <p className="truncate text-xs text-dim-grey">{prof.area_of_focus}</p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* NUPath Attributes */}
          {course.attributes.length > 0 && (
            <div className="rounded-md border border-white/10 bg-graphite p-5">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-dim-grey">
                NUPath Attributes
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {course.attributes.map((attr) => (
                  <Badge key={attr} variant="secondary" className="bg-white/5 text-xs text-alabaster">
                    {attr}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tutoring */}
          {course.tutoring && (
            <div className="rounded-md border border-white/10 bg-graphite p-5">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-dim-grey">
                Tutoring
              </h2>
              <p className="text-sm text-alabaster">{course.tutoring}</p>
            </div>
          )}

          {/* Catalog link */}
          {course.url && (
            <a
              href={course.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-md border border-carmine/40 bg-carmine/10 px-4 py-3 text-sm font-medium text-carmine transition-colors hover:bg-carmine/20"
            >
              View in Catalog
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </aside>
      </div>
    </PageWrapper>
  )
}
