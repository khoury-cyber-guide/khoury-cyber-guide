import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { CATEGORY_META, LEARNING_PATHS, TOPICS } from '@/data/topics'
import type { TopicCategory } from '@/types/topic'

const topicBySlug = Object.fromEntries(TOPICS.map((t) => [t.slug, t]))

interface QuizOption {
  id: string
  label: string
  description: string
  category: TopicCategory | null
  pathSlug: string
}

const Q1_OPTIONS: QuizOption[] = [
  {
    id: 'build',
    label: 'I want to build secure systems',
    description: 'Networks, applications, and infrastructure designed to resist attacks.',
    category: 'build_and_secure',
    pathSlug: 'career-focused',
  },
  {
    id: 'attack',
    label: 'I want to think like an attacker',
    description: 'Finding vulnerabilities, penetration testing, and adversarial thinking.',
    category: 'attack_and_defend',
    pathSlug: 'red-team',
  },
  {
    id: 'defend',
    label: 'I want to detect and respond to threats',
    description: 'Monitoring systems, investigating incidents, and defending organizations.',
    category: 'attack_and_defend',
    pathSlug: 'blue-team',
  },
  {
    id: 'policy',
    label: 'I want to work in policy, law, or risk',
    description: 'Frameworks, compliance, ethics, and strategic cybersecurity decisions.',
    category: 'strategy_and_governance',
    pathSlug: 'policy-risk',
  },
  {
    id: 'explore',
    label: "I'm not sure yet — just exploring",
    description: 'Start with foundational topics that appear across every area of the field.',
    category: null,
    pathSlug: 'foundational',
  },
]

// TODO: Q2 is TBD — will be filled in once the Khoury-specific section of the page
// is designed. Q2 will likely relate to the student's current year/experience level
// or their specific Khoury program. Revisit when that content is ready.
const Q2_PLACEHOLDER = true

export function StartHerePage() {
  useDocumentTitle('Start Here')

  const [q1, setQ1] = useState<string | null>(null)
  const q2Ref = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  function handleQ1(id: string) {
    setQ1(id)
    setTimeout(() => {
      q2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const option = Q1_OPTIONS.find((o) => o.id === q1)
  const path = option ? LEARNING_PATHS.find((p) => p.slug === option.pathSlug) : null
  const categoryMeta = option?.category ? CATEGORY_META[option.category] : null

  return (
    <PageWrapper>
      {/* Q1 */}
      <div className="py-12 sm:py-16">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-carmine">
          Start Here
        </p>
        <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-alabaster sm:text-4xl">
          What draws you to cybersecurity?
        </h1>
        <p className="mt-3 text-base text-dim-grey">
          Pick the option that resonates most.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Q1_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleQ1(opt.id)}
              className={`flex flex-col gap-2 rounded-md border p-5 text-left transition-all ${
                q1 === opt.id
                  ? 'border-carmine bg-carmine/10'
                  : 'border-white/10 bg-graphite hover:border-carmine/40'
              }`}
            >
              <p className={`font-semibold ${q1 === opt.id ? 'text-carmine' : 'text-alabaster'}`}>
                {opt.label}
              </p>
              <p className="text-xs leading-relaxed text-dim-grey">{opt.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Q2 — placeholder, content TBD */}
      {q1 && (
        <div ref={q2Ref} className="border-t border-white/10 py-12">
          {Q2_PLACEHOLDER && (
            <div className="rounded-md border border-white/10 bg-graphite/40 px-6 py-8 text-center">
              <p className="text-sm font-semibold text-dim-grey">Question 2 coming soon</p>
              <p className="mt-1 text-xs text-dim-grey/60">
                We'll add a second question here to further personalize your recommendation.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Result */}
      {q1 && option && (
        <div ref={resultRef} className="border-t border-white/10 pt-10 pb-12">
          <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-dim-grey">
            Your recommendation
          </p>

          <div className={`grid grid-cols-1 gap-4 ${categoryMeta ? 'sm:grid-cols-2' : 'max-w-md'}`}>
            {categoryMeta && (
              <div className="flex flex-col gap-3 rounded-md border border-carmine/40 bg-carmine/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-carmine">
                  Start with this category
                </p>
                <p className="text-lg font-bold text-alabaster">{categoryMeta.label}</p>
                <p className="text-sm leading-relaxed text-dim-grey">{categoryMeta.tagline}</p>
                <Link
                  to={`/topics/${option.category}`}
                  className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-carmine hover:underline"
                >
                  View all topics →
                </Link>
              </div>
            )}

            {path && (
              <div
                className="flex flex-col gap-3 rounded-md border p-5"
                style={{ backgroundColor: path.color + '0d', borderColor: path.color + '40' }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: path.color }}>
                  Recommended learning path
                </p>
                <p className="text-lg font-bold text-alabaster">{path.label}</p>
                <p className="text-sm leading-relaxed text-dim-grey">{path.description}</p>
                <ul className="mt-1 flex flex-col gap-1">
                  {path.topicSlugs.map((slug) => {
                    const topic = topicBySlug[slug]
                    if (!topic) return null
                    return (
                      <li key={slug} className="flex items-start gap-2">
                        <span
                          className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                          style={{ backgroundColor: path.color }}
                          aria-hidden="true"
                        />
                        <Link
                          to={`/topics/${topic.category}/${slug}`}
                          className="text-xs text-alabaster/75 hover:text-alabaster"
                        >
                          {topic.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setQ1(null)}
            className="mt-6 text-xs text-dim-grey hover:text-alabaster"
          >
            ← Start over
          </button>
        </div>
      )}

      {/* Learning paths */}
      <div className="border-t border-white/10 pt-16 pb-16">
        <div className="mb-3">
          <h2 className="text-xl font-bold tracking-tight text-alabaster">Or browse by learning path</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-dim-grey">
            These paths group topics by goal — useful if you already know what direction you want to go.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LEARNING_PATHS.map((lp) => (
            <div
              key={lp.slug}
              className="flex flex-col gap-3 rounded-md border p-5"
              style={{ backgroundColor: lp.color + '1a', borderColor: lp.color + '40' }}
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: lp.color }} aria-hidden="true" />
                <h3 className="font-semibold text-alabaster">{lp.label}</h3>
              </div>
              <p className="text-sm leading-relaxed text-dim-grey">{lp.description}</p>
              <ul className="flex flex-col gap-1">
                {lp.topicSlugs.map((slug) => {
                  const topic = topicBySlug[slug]
                  if (!topic) return null
                  return (
                    <li key={slug} className="flex items-start gap-2">
                      <span
                        className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                        style={{ backgroundColor: lp.color }}
                        aria-hidden="true"
                      />
                      <Link
                        to={`/topics/${topic.category}/${slug}`}
                        className="text-xs text-alabaster/75 transition-colors hover:text-alabaster"
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
      </div>
    </PageWrapper>
  )
}
