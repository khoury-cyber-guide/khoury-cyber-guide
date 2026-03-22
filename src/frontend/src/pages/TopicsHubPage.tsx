import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useApi } from '@/hooks/useApi'
import { getTopics } from '@/api/topics'
import { TopicCard } from '@/components/shared/TopicCard'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Skeleton } from '@/components/ui/skeleton'
import { CATEGORY_META, LEARNING_PATHS, TOPICS } from '@/data/topics'
import type { TopicCategory, TopicSummary } from '@/types/topic'

const topicBySlug = Object.fromEntries(TOPICS.map((t) => [t.slug, t]))

const CATEGORY_ORDER: TopicCategory[] = [
  'build_and_secure',
  'attack_and_defend',
  'strategy_and_governance',
]

export function TopicsHubPage() {
  useDocumentTitle('Topics')
  const { data: topics, loading, error } = useApi<TopicSummary[]>((signal) =>
    getTopics(signal),
  )

  const grouped = CATEGORY_ORDER.reduce<Record<TopicCategory, TopicSummary[]>>(
    (acc, cat) => {
      acc[cat] = (topics ?? [])
        .filter((t) => t.category === cat)
        .sort((a, b) => a.order - b.order)
      return acc
    },
    { build_and_secure: [], attack_and_defend: [], strategy_and_governance: [] },
  )

  return (
    <PageWrapper>
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-alabaster sm:text-4xl">Topics</h1>
        <p className="mt-3 max-w-2xl text-base text-dim-grey">
          Explore cybersecurity topics organized by domain. Each topic links to courses, clubs,
          research, and off-campus resources.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-8 rounded-md border border-carmine/40 bg-carmine/10 px-4 py-3 text-sm text-carmine"
        >
          Failed to load topics. Please try refreshing.
        </div>
      )}

      {/* Category columns */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {CATEGORY_ORDER.map((cat) => {
          const meta = CATEGORY_META[cat]
          const catTopics = grouped[cat]

          return (
            <section key={cat} aria-labelledby={`cat-${cat}`} className="flex flex-col gap-4">
              <div className="border-l-4 border-carmine pl-4">
                <h2
                  id={`cat-${cat}`}
                  className="text-sm font-bold uppercase tracking-widest text-alabaster"
                >
                  {meta.label}
                </h2>
                <p className="mt-1 text-sm text-dim-grey">{meta.tagline}</p>
                <Link
                  to={`/topics/${cat}`}
                  className="mt-2 inline-block text-xs font-medium text-carmine hover:underline"
                >
                  View all →
                </Link>
              </div>

              {loading ? (
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-[72px] rounded-md bg-graphite/60" />
                  ))}
                </div>
              ) : catTopics.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {catTopics.map((topic) => (
                    <TopicCard key={topic.id} topic={topic} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-dim-grey">No topics yet.</p>
              )}
            </section>
          )
        })}
      </div>

      {/* Learning Paths */}
      <section aria-labelledby="learning-paths-heading" className="mt-16">
        <div className="mb-6 border-l-4 border-copper pl-4">
          <h2 id="learning-paths-heading" className="text-sm font-bold uppercase tracking-widest text-alabaster">
            Learning Paths
          </h2>
          <p className="mt-1 text-sm text-dim-grey">
            Not sure where to start? These paths group topics by goal.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LEARNING_PATHS.map((path) => (
            <div
              key={path.slug}
              className="flex flex-col gap-3 rounded-md border p-5"
              style={{ backgroundColor: path.color + '1a', borderColor: path.color + '40' }}
            >
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: path.color }} aria-hidden="true" />
                <h3 className="font-semibold text-alabaster">{path.label}</h3>
              </div>
              <p className="text-sm leading-relaxed text-dim-grey">{path.description}</p>
              <ul className="flex flex-col gap-1">
                {path.topicSlugs.map((slug) => {
                  const topic = topicBySlug[slug]
                  if (!topic) return null
                  return (
                    <li key={slug} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: path.color }} aria-hidden="true" />
                      <Link
                        to={`/topics/${topic.category}/${slug}`}
                        className="text-xs text-alabaster/75 transition-colors hover:font-semibold hover:text-alabaster"
                      >
                        {topic.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </PageWrapper>
  )
}
