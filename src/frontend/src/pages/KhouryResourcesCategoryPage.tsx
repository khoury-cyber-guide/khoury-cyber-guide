import { Link, useParams } from 'react-router-dom'
import { useApi } from '@/hooks/useApi'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Skeleton } from '@/components/ui/skeleton'
import { getKhouryResources } from '@/api/khouryResources'
import { KHOURY_RESOURCE_CATEGORY_MAP } from '@/data/khouryResources'
import { NotFoundPage } from './NotFoundPage'
import type { KhouryResourceCategory, KhouryResourceSummary } from '@/types/khouryResource'

const VALID_CATEGORIES = new Set<string>([
  'general_university',
  'advising_degree_planning',
  'coop_career_planning',
  'clubs_on_campus_events',
  'scholarship_financial_aid',
  'undergraduate_research',
  'wellbeing_mental_health',
])

export function KhouryResourcesCategoryPage() {
  const { category } = useParams<{ category: string }>()
  const isValid = category != null && VALID_CATEGORIES.has(category)
  const meta = isValid ? KHOURY_RESOURCE_CATEGORY_MAP[category as KhouryResourceCategory] : null

  useDocumentTitle(meta ? `${meta.label} — Khoury Resources` : undefined)

  const { data: resources, loading, error } = useApi<KhouryResourceSummary[]>(
    (signal) =>
      isValid
        ? getKhouryResources(signal, { category: category as KhouryResourceCategory })
        : Promise.resolve([]),
    [category],
  )

  if (!isValid || !meta) return <NotFoundPage />

  const top3 = resources?.filter((r) => r.priority === 'TOP_3') ?? []
  const expand = resources?.filter((r) => r.priority === 'EXPAND') ?? []

  return (
    <PageWrapper>
      <div className="mb-2 text-xs text-dim-grey">
        <Link to="/resources" className="hover:text-alabaster">Khoury Resources</Link>
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
          Failed to load resources. Please try refreshing.
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-md bg-graphite/60" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {top3.length > 0 && (
            <section>
              <div className="mb-5 border-l-4 border-carmine pl-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-alabaster">
                  Top Resources
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {top3.map((r) => <ResourceCard key={r.id} resource={r} />)}
              </div>
            </section>
          )}

          {expand.length > 0 && (
            <section>
              <div className="mb-5 border-l-4 border-copper pl-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-alabaster">
                  More Resources
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {expand.map((r) => <ResourceCard key={r.id} resource={r} />)}
              </div>
            </section>
          )}

          {resources?.length === 0 && (
            <p className="text-sm text-dim-grey">No resources yet.</p>
          )}
        </div>
      )}
    </PageWrapper>
  )
}

function ResourceCard({ resource }: { resource: KhouryResourceSummary }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col gap-2 rounded-md border border-white/10 bg-graphite p-5 transition-colors hover:border-carmine/40"
    >
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-semibold text-alabaster">{resource.name}</p>
        {resource.is_featured && (
          <span className="rounded border border-copper/60 bg-copper/10 px-1.5 py-0.5 text-xs font-semibold text-copper">
            ★ Our Pick
          </span>
        )}
      </div>
      {resource.description && (
        <p className="text-sm leading-relaxed text-dim-grey">{resource.description}</p>
      )}
      <p className="mt-auto pt-1 text-xs text-carmine">Visit →</p>
    </a>
  )
}
