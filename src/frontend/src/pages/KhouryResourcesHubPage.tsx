import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useApi } from '@/hooks/useApi'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { getKhouryResources } from '@/api/khouryResources'
import { KHOURY_RESOURCE_CATEGORIES } from '@/data/khouryResources'
import type { KhouryResourceSummary } from '@/types/khouryResource'

export function KhouryResourcesHubPage() {
  useDocumentTitle('Khoury Resources')

  const { data: allResources, loading, error } = useApi<KhouryResourceSummary[]>(
    (signal) => getKhouryResources(signal),
  )

  const grouped = KHOURY_RESOURCE_CATEGORIES.reduce<Record<string, KhouryResourceSummary[]>>(
    (acc, cat) => {
      acc[cat.slug] = (allResources ?? []).filter((r) => r.category === cat.slug)
      return acc
    },
    {},
  )

  return (
    <PageWrapper>
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-alabaster sm:text-4xl">
          Khoury Resources
        </h1>
        <p className="mt-3 max-w-2xl text-base text-dim-grey">
          University resources organized by category. Find advising, career support, clubs, research
          opportunities, and more — all in one place.
        </p>
      </div>

      {error && (
        <div role="alert" className="mb-8 rounded-md border border-carmine/40 bg-carmine/10 px-4 py-3 text-sm text-carmine">
          Failed to load resources. Please try refreshing.
        </div>
      )}

      <div className="flex flex-col gap-10">
        {KHOURY_RESOURCE_CATEGORIES.map((cat, idx) => {
          const catResources = grouped[cat.slug] ?? []

          return (
            <section key={cat.slug} aria-labelledby={`cat-${cat.slug}`}>
              {idx > 0 && <Separator className="mb-10 bg-white/10" />}

              <div className="mb-5 border-l-4 border-carmine pl-4">
                <h2
                  id={`cat-${cat.slug}`}
                  className="text-sm font-bold uppercase tracking-widest text-alabaster"
                >
                  {cat.label}
                </h2>
                <p className="mt-1 text-sm text-dim-grey">{cat.tagline}</p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-28 rounded-md bg-graphite/60" />
                  ))}
                </div>
              ) : catResources.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {catResources.slice(0, 5).map((r) => (
                    <a
                      key={r.id}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col gap-2 rounded-md border border-white/10 bg-graphite p-4 transition-colors hover:border-carmine/40"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-alabaster transition-colors group-hover:text-carmine">
                          {r.name}
                        </p>
                        {r.is_featured && (
                          <span className="rounded border border-copper/60 bg-copper/10 px-1.5 py-0.5 text-xs font-semibold text-copper">
                            ★ Our Pick
                          </span>
                        )}
                      </div>
                      {r.description && (
                        <p className="line-clamp-2 text-xs leading-relaxed text-dim-grey">
                          {r.description}
                        </p>
                      )}
                    </a>
                  ))}
                  <Link
                    to={`/resources/${cat.slug}`}
                    className="flex flex-col items-center justify-center gap-2 rounded-md border border-carmine/40 bg-carmine/5 p-4 text-center transition-colors hover:bg-carmine/10"
                  >
                    <span className="text-2xl text-carmine" aria-hidden="true">→</span>
                    <span className="font-semibold text-carmine">Browse all</span>
                    <span className="text-xs text-dim-grey">{catResources.length} resources</span>
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-dim-grey">No resources in this category yet.</p>
              )}
            </section>
          )
        })}
      </div>
    </PageWrapper>
  )
}
