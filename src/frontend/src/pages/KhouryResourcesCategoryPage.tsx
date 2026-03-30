import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useApi } from '@/hooks/useApi'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { getKhouryResources } from '@/api/khouryResources'
import { KHOURY_RESOURCE_CATEGORY_MAP } from '@/data/khouryResources'
import type { KhouryResourceCategory, KhouryResourceSummary } from '@/types/khouryResource'

export function KhouryResourcesCategoryPage() {
  const { category } = useParams<{ category: string }>()
  const meta = category ? KHOURY_RESOURCE_CATEGORY_MAP[category as KhouryResourceCategory] : null

  useDocumentTitle(meta ? `${meta.label} — Khoury Resources` : 'Khoury Resources')

  const isValid = !!meta

  const { data: resources, loading, error } = useApi<KhouryResourceSummary[]>(
    (signal) => getKhouryResources(signal, { category: category as KhouryResourceCategory }),
  )

  if (!isValid) {
    return (
      <PageWrapper>
        <div className="py-16 text-center">
          <p className="text-sm text-dim-grey">Category not found.</p>
          <Link to="/resources" className="mt-4 inline-block text-sm text-carmine hover:underline">
            ← Back to Resources
          </Link>
        </div>
      </PageWrapper>
    )
  }

  const top3 = resources?.filter((r) => r.priority === 'TOP_3') ?? []
  const expand = resources?.filter((r) => r.priority === 'EXPAND') ?? []

  return (
    <PageWrapper>
      <div className="py-12 sm:py-16">
        <Link
          to="/resources"
          className="mb-6 inline-flex items-center gap-1 text-xs text-dim-grey transition-colors hover:text-alabaster"
        >
          ← Khoury Resources
        </Link>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-carmine">
          Khoury Resources
        </p>
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-alabaster sm:text-4xl">
          {meta.label}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-dim-grey">
          {meta.description}
        </p>
      </div>

      <div className="border-t border-white/10 pb-16 pt-10">
        {loading && <p className="text-sm text-dim-grey">Loading…</p>}
        {error && <p className="text-sm text-carmine">Failed to load resources.</p>}

        {!loading && !error && resources && (
          <div className="flex flex-col gap-10">
            {top3.length > 0 && (
              <section>
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-dim-grey">
                  Top Resources
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {top3.map((r) => <ResourceCard key={r.id} resource={r} />)}
                </div>
              </section>
            )}

            {expand.length > 0 && (
              <section>
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-dim-grey">
                  More Resources
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {expand.map((r) => <ResourceCard key={r.id} resource={r} />)}
                </div>
              </section>
            )}

            {resources.length === 0 && (
              <p className="text-sm text-dim-grey">No resources yet.</p>
            )}
          </div>
        )}
      </div>
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
      <p className="font-semibold text-alabaster">{resource.name}</p>
      {resource.description && (
        <p className="text-sm leading-relaxed text-dim-grey">{resource.description}</p>
      )}
      <p className="mt-auto pt-1 text-xs text-carmine">Visit →</p>
    </a>
  )
}
