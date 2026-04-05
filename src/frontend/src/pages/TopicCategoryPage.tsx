import { useParams, Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useApi } from '@/hooks/useApi'
import { getTopics } from '@/api/topics'
import { TopicCard } from '@/components/shared/TopicCard'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Skeleton } from '@/components/ui/skeleton'
import { CATEGORY_META } from '@/data/topics'
import type { TopicCategory, TopicSummary } from '@/types/topic'
import { NotFoundPage } from './NotFoundPage'

const VALID_CATEGORIES = new Set<string>([
  'build_and_secure',
  'attack_and_defend',
  'strategy_and_governance',
])

export function TopicCategoryPage() {
  const { category } = useParams<{ category: string }>()
  const isValid = category != null && VALID_CATEGORIES.has(category)
  const cat = (isValid ? category : 'build_and_secure') as TopicCategory
  const meta = CATEGORY_META[cat]

  useDocumentTitle(isValid ? meta.label : undefined)

  const { data: topics, loading, error } = useApi<TopicSummary[]>(
    (signal) => isValid ? getTopics(signal, cat) : Promise.resolve([]),
    [cat],
  )

  if (!isValid) return <NotFoundPage />

  const sorted = (topics ?? []).slice().sort((a, b) => a.order - b.order)

  return (
    <PageWrapper>
      <div className="mb-2 text-xs text-dim-grey">
        <Link to="/topics" className="hover:text-alabaster">Topics</Link>
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
          Failed to load topics. Please try refreshing.
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-md bg-graphite/60" />
          ))}
        </div>
      ) : sorted.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-dim-grey">No topics in this category yet.</p>
      )}
    </PageWrapper>
  )
}
