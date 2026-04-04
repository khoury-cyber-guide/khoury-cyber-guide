import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useApi } from '@/hooks/useApi'
import { getTopics } from '@/api/topics'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { CATEGORY_META, LEARNING_PATHS, TOPICS } from '@/data/topics'
import type { TopicCategory } from '@/types/topic'
import type { LearningPath } from '@/data/topics'

const topicBySlug = Object.fromEntries(TOPICS.map((t) => [t.slug, t]))

const CATEGORY_ORDER: TopicCategory[] = [
  'build_and_secure',
  'attack_and_defend',
  'strategy_and_governance',
]

export function TopicsHubPage() {
  useDocumentTitle('Topics')
  const { error } = useApi((signal) => getTopics(signal))
  const [openPath, setOpenPath] = useState<string | null>(null)

  const popupPath: LearningPath | null = openPath
    ? (LEARNING_PATHS.find((p) => p.slug === openPath) ?? null)
    : null

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
          return (
            <section key={cat} aria-labelledby={`cat-${cat}`} className="flex flex-col gap-4">
              <div className="border-l-4 border-carmine pl-4">
                <h2
                  id={`cat-${cat}`}
                  className="text-lg font-bold tracking-tight text-alabaster"
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
              <div className="flex flex-col gap-3">
                {meta.hub_description.map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-dim-grey">{para}</p>
                ))}
              </div>
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
              <button
                type="button"
                onClick={() => setOpenPath(path.slug)}
                className="mt-1 self-start text-xs font-medium transition-colors hover:underline"
                style={{ color: path.color }}
              >
                Read more →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Path detail popup */}
      {popupPath && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpenPath(null)}
            aria-hidden="true"
          />
          <div className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-lg border border-white/10 bg-background p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setOpenPath(null)}
              className="absolute right-4 top-4 text-dim-grey transition-colors hover:text-alabaster"
              aria-label="Close"
            >
              ✕
            </button>
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: popupPath.color }} aria-hidden="true" />
              <h3 className="text-lg font-bold text-alabaster">{popupPath.label}</h3>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-dim-grey">{popupPath.description}</p>
            <ul className="flex flex-col gap-4">
              {popupPath.topicSlugs.map((slug) => {
                const topic = topicBySlug[slug]
                if (!topic) return null
                const focus = popupPath.topicFocus[slug]
                return (
                  <li key={slug}>
                    <Link
                      to={`/topics/${topic.category}/${slug}`}
                      onClick={() => setOpenPath(null)}
                      className="font-semibold text-alabaster hover:text-carmine"
                    >
                      {topic.title}
                    </Link>
                    {focus && (
                      <p className="mt-0.5 text-xs text-dim-grey">{focus}</p>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}
