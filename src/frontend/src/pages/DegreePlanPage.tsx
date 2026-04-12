import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useApi } from '@/hooks/useApi'
import { getCourses } from '@/api/courses'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { DEGREE_PLANS, DEGREE_PLAN_TAG_STYLE } from '@/data/degreePlans'
import type { CourseEntry, PlanYear } from '@/data/degreePlans'
import type { CourseSummary } from '@/types/course'
import { NotFoundPage } from './NotFoundPage'

export function DegreePlanPage() {
  const { slug } = useParams<{ slug: string }>()
  const plan = DEGREE_PLANS.find((p) => p.slug === slug)

  useDocumentTitle(plan ? `${plan.title} — ${plan.degreeType}` : undefined)

  const { data: courses } = useApi<CourseSummary[]>((signal) => getCourses(signal))

  const courseMap = useMemo(() => {
    const map = new Map<string, number>()
    for (const c of courses ?? []) {
      map.set(`${c.course_program}${c.course_code}`, c.id)
    }
    return map
  }, [courses])

  if (!plan) return <NotFoundPage />

  return (
    <PageWrapper>
      <div className="mb-2 text-xs text-dim-grey">
        <Link to="/resources" className="hover:text-alabaster">Khoury Resources</Link>
        <span className="mx-2">/</span>
        <Link to="/resources/advising_degree_planning" className="hover:text-alabaster">
          Advising &amp; Degree Planning
        </Link>
        <span className="mx-2">/</span>
        <span>{plan.title}</span>
      </div>

      <div className="mb-8 mt-4 border-l-4 border-carmine pl-5">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {plan.tags.map((tag) => (
            <span
              key={tag}
              className={`rounded border px-2 py-0.5 text-xs font-semibold ${DEGREE_PLAN_TAG_STYLE[tag]}`}
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-alabaster sm:text-4xl">
          {plan.title}
        </h1>
        <p className="mt-2 text-base text-dim-grey">{plan.degreeType}</p>
        <p className="text-sm text-dim-grey">Graduation: {plan.graduationTerm}</p>
      </div>

      <div className="flex flex-col gap-8">
        {plan.years.map((yr) => (
          <YearSection key={yr.year} yr={yr} courseMap={courseMap} />
        ))}
      </div>
    </PageWrapper>
  )
}

function YearSection({ yr, courseMap }: { yr: PlanYear; courseMap: Map<string, number> }) {
  const cols: { label: string; entries: CourseEntry[] }[] = [
    { label: 'Fall', entries: yr.fall },
    { label: 'Spring', entries: yr.spring },
    { label: 'Summer 1', entries: yr.summer1 },
    { label: 'Summer 2', entries: yr.summer2 },
  ]

  return (
    <section>
      <div className="mb-3 rounded-t-md bg-graphite px-4 py-2">
        <h2 className="text-sm font-bold uppercase tracking-widest text-alabaster">
          Year {yr.year}
        </h2>
      </div>
      <div className="overflow-x-auto">
        <div className="grid min-w-[640px] grid-cols-4 divide-x divide-white/10 rounded-b-md border border-white/10">
          {cols.map((col) => (
            <div key={col.label} className="flex flex-col">
              <div className="border-b border-white/10 bg-graphite/60 px-3 py-2 text-center text-xs font-semibold uppercase tracking-widest text-dim-grey">
                {col.label}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-3">
                {col.entries.length === 0 ? (
                  <span className="text-xs text-white/20">—</span>
                ) : (
                  col.entries.map((entry, i) => (
                    <CourseCell key={i} entry={entry} courseMap={courseMap} />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CourseCell({ entry, courseMap }: { entry: CourseEntry; courseMap: Map<string, number> }) {
  const isPlaceholder = !entry.title

  if (isPlaceholder) {
    return (
      <div className="rounded bg-white/5 px-2 py-1.5 text-xs font-medium italic text-dim-grey">
        {entry.code}
      </div>
    )
  }

  const normalizedCode = entry.code.replace(/\s+/g, '')
  const courseId = courseMap.get(normalizedCode)

  const badge = (
    <span className="mb-1 inline-block rounded bg-carmine/20 px-1.5 py-0.5 font-mono text-xs text-carmine">
      {entry.code}
    </span>
  )

  if (courseId) {
    return (
      <Link
        to={`/courses/${courseId}`}
        className="group flex flex-col rounded border border-white/10 bg-graphite p-2 transition-colors hover:border-carmine/40"
      >
        {badge}
        <span className="text-xs leading-snug text-alabaster group-hover:text-carmine">
          {entry.title}
        </span>
      </Link>
    )
  }

  return (
    <div className="flex flex-col rounded border border-white/10 bg-graphite p-2">
      {badge}
      <span className="text-xs leading-snug text-alabaster">{entry.title}</span>
    </div>
  )
}
