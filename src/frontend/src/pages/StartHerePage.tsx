import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useApi } from '@/hooks/useApi'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { getKhouryResources } from '@/api/khouryResources'
import apiClient from '@/api/client'
import { LEARNING_PATHS, TOPICS } from '@/data/topics'
import type { CourseSummary } from '@/types/course'
import type { KhouryResourceSummary } from '@/types/khouryResource'

const topicBySlug = Object.fromEntries(TOPICS.map((t) => [t.slug, t]))

const FEATURED_TOPICS = TOPICS.filter((t) => t.is_featured).slice(0, 3)

// Tie-break order when scores are equal
const PATH_PRIORITY = [
  'foundational',
  'career-focused',
  'blue-team',
  'red-team',
  'policy-risk',
  'edge-case',
]

interface QuizOption {
  id: string
  label: string
  paths: Record<string, number>
}

const Q1_OPTIONS: QuizOption[] = [
  { id: 'q1-foundational', label: 'Understanding how cybersecurity systems work at a fundamental level', paths: { foundational: 2 } },
  { id: 'q1-career',       label: 'Building skills for internships and real-world cybersecurity jobs',  paths: { 'career-focused': 2 } },
  { id: 'q1-blue',         label: 'Detecting threats and protecting systems from attacks',              paths: { 'blue-team': 2 } },
  { id: 'q1-red',          label: 'Thinking like an attacker and finding system weaknesses',            paths: { 'red-team': 2 } },
  { id: 'q1-policy',       label: 'Managing risk, policy, and security decision-making',               paths: { 'policy-risk': 2 } },
  { id: 'q1-edge',         label: 'Exploring emerging or less commonly taught areas of cybersecurity', paths: { 'edge-case': 2 } },
]

const Q2_OPTIONS: QuizOption[] = [
  { id: 'q2-foundational', label: 'Build a strong technical foundation in cybersecurity',      paths: { foundational: 2 } },
  { id: 'q2-career',       label: 'Prepare for internships or entry-level cybersecurity roles', paths: { 'career-focused': 2 } },
  { id: 'q2-blue',         label: 'Learn how to detect and respond to real-world threats',      paths: { 'blue-team': 2 } },
  { id: 'q2-red',          label: 'Learn how attacks work and how systems get exploited',        paths: { 'red-team': 2 } },
  { id: 'q2-policy',       label: 'Understand risk, policy, and security decision-making',      paths: { 'policy-risk': 2 } },
  { id: 'q2-edge',         label: 'Explore topics beyond what is usually taught in class',      paths: { 'edge-case': 2 } },
]

const Q3_OPTIONS: QuizOption[] = [
  { id: 'q3-networks', label: 'Networks, cryptography, and system fundamentals',          paths: { foundational: 1 } },
  { id: 'q3-soc',      label: 'SOC workflows, cloud systems, and incident response',      paths: { 'career-focused': 1, 'blue-team': 1 } },
  { id: 'q3-pentest',  label: 'Pen testing, exploitation, and social engineering',        paths: { 'red-team': 1 } },
  { id: 'q3-risk',     label: 'Risk frameworks, privacy, and ethics',                     paths: { 'policy-risk': 1 } },
  { id: 'q3-ai',       label: 'AI security, IoT, and emerging technologies',              paths: { 'edge-case': 1 } },
  { id: 'q3-appsec',   label: 'Secure system design and application security',            paths: { foundational: 1, 'career-focused': 1 } },
]

function computeResult(q1id: string, q2id: string, q3id: string): string {
  const scores: Record<string, number> = {}
  for (const opt of [...Q1_OPTIONS, ...Q2_OPTIONS, ...Q3_OPTIONS]) {
    const selected = opt.id === q1id || opt.id === q2id || opt.id === q3id
    if (!selected) continue
    for (const [slug, pts] of Object.entries(opt.paths)) {
      scores[slug] = (scores[slug] ?? 0) + pts
    }
  }
  let best = PATH_PRIORITY[0]
  for (const slug of PATH_PRIORITY) {
    if ((scores[slug] ?? 0) > (scores[best] ?? 0)) best = slug
  }
  return best
}

function QuizGrid({
  options,
  selected,
  onSelect,
}: {
  options: QuizOption[]
  selected: string | null
  onSelect: (id: string) => void
}) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onSelect(opt.id)}
          className={`rounded-md border p-4 text-left text-sm transition-all ${
            selected === opt.id
              ? 'border-carmine bg-carmine/10 text-carmine'
              : 'border-white/10 bg-graphite text-alabaster hover:border-carmine/40'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function StartHerePage() {
  useDocumentTitle('Start Here')

  const [q1, setQ1] = useState<string | null>(null)
  const [q2, setQ2] = useState<string | null>(null)
  const [q3, setQ3] = useState<string | null>(null)
  const [openPath, setOpenPath] = useState<string | null>(null)

  const q2Ref = useRef<HTMLDivElement>(null)
  const q3Ref = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const { data: featuredCourses } = useApi<CourseSummary[]>((signal) =>
    apiClient.get('/api/courses', { signal, params: { is_featured: true } }).then((r) => r.data),
  )

  const { data: featuredResources } = useApi<KhouryResourceSummary[]>((signal) =>
    getKhouryResources(signal, { is_featured: true }),
  )

  function handleQ1(id: string) {
    setQ1(id)
    setQ2(null)
    setQ3(null)
    setTimeout(() => q2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  function handleQ2(id: string) {
    setQ2(id)
    setQ3(null)
    setTimeout(() => q3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  function handleQ3(id: string) {
    setQ3(id)
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const resultSlug = q1 && q2 && q3 ? computeResult(q1, q2, q3) : null
  const resultPath = resultSlug ? LEARNING_PATHS.find((p) => p.slug === resultSlug) ?? null : null

  const popupPath = openPath ? LEARNING_PATHS.find((p) => p.slug === openPath) ?? null : null

  const hasBestOf =
    FEATURED_TOPICS.length > 0 ||
    (featuredCourses && featuredCourses.length > 0) ||
    (featuredResources && featuredResources.length > 0)

  return (
    <PageWrapper>
      {/* Q1 */}
      <div className="flex min-h-[calc(100svh-8rem)] flex-col justify-center py-16">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-carmine">
          Start Here
        </p>
        <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-alabaster sm:text-4xl">
          What draws you to cybersecurity?
        </h1>
        <p className="mt-3 text-sm text-dim-grey">Pick the option that resonates most.</p>
        <QuizGrid options={Q1_OPTIONS} selected={q1} onSelect={handleQ1} />
      </div>

      {/* Q2 */}
      {q1 && (
        <div ref={q2Ref} className="flex min-h-[calc(100svh-8rem)] flex-col justify-center border-t border-white/10 py-16">
          <h2 className="text-xl font-bold tracking-tight text-alabaster">What is your main goal right now?</h2>
          <p className="mt-2 text-sm text-dim-grey">Pick the option that fits best.</p>
          <QuizGrid options={Q2_OPTIONS} selected={q2} onSelect={handleQ2} />
        </div>
      )}

      {/* Q3 */}
      {q1 && q2 && (
        <div ref={q3Ref} className="flex min-h-[calc(100svh-8rem)] flex-col justify-center border-t border-white/10 py-16">
          <h2 className="text-xl font-bold tracking-tight text-alabaster">Which type of topics sounds most appealing?</h2>
          <p className="mt-2 text-sm text-dim-grey">Pick the one that stands out.</p>
          <QuizGrid options={Q3_OPTIONS} selected={q3} onSelect={handleQ3} />
        </div>
      )}

      {/* Result */}
      {q1 && q2 && q3 && resultPath && (
        <div ref={resultRef} className="border-t border-white/10 py-16">
          <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-dim-grey">
            Your recommendation
          </p>
          <div
            className="max-w-md rounded-md border p-5"
            style={{ backgroundColor: resultPath.color + '0d', borderColor: resultPath.color + '40' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: resultPath.color }}>
              Recommended learning path
            </p>
            <p className="mt-2 text-xl font-bold text-alabaster">{resultPath.label}</p>
            <p className="mt-2 text-sm leading-relaxed text-dim-grey">{resultPath.description}</p>
            <ul className="mt-4 flex flex-col gap-1.5">
              {resultPath.topicSlugs.map((slug) => {
                const topic = topicBySlug[slug]
                if (!topic) return null
                return (
                  <li key={slug} className="flex items-start gap-2">
                    <span
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                      style={{ backgroundColor: resultPath.color }}
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
            <button
              type="button"
              onClick={() => setOpenPath(resultPath.slug)}
              className="mt-4 self-start text-xs font-medium transition-colors hover:underline"
              style={{ color: resultPath.color }}
            >
              Read more →
            </button>
          </div>
          <button
            type="button"
            onClick={() => { setQ1(null); setQ2(null); setQ3(null) }}
            className="mt-6 text-xs text-dim-grey hover:text-alabaster"
          >
            ← Start over
          </button>
        </div>
      )}

      {/* Our Picks */}
      {hasBestOf && (
        <div className="border-t-2 border-white/10 py-16">
          <div className="mb-8 border-l-4 border-copper pl-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-alabaster">Our Picks</h2>
            <p className="mt-1 text-sm text-dim-grey">
              A few resources and topics worth bookmarking.
            </p>
          </div>

          <div className="flex flex-col gap-10">
            {FEATURED_TOPICS.length > 0 && (
              <section>
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-dim-grey">Topics</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {FEATURED_TOPICS.map((t) => (
                    <Link
                      key={t.slug}
                      to={`/topics/${t.category}/${t.slug}`}
                      className="flex flex-col gap-1.5 rounded-md border border-white/10 bg-graphite p-4 transition-colors hover:border-carmine/40"
                    >
                      <p className="font-semibold text-alabaster">{t.title}</p>
                      <p className="text-xs leading-relaxed text-dim-grey line-clamp-2">{t.description}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {featuredCourses && featuredCourses.length > 0 && (
              <section>
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-dim-grey">Courses</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {featuredCourses.map((c) => (
                    <Link
                      key={c.id}
                      to={`/courses/${c.id}`}
                      className="flex flex-col gap-1.5 rounded-md border border-white/10 bg-graphite p-4 transition-colors hover:border-carmine/40"
                    >
                      <p className="text-xs text-carmine">{c.course_program} {c.course_code}</p>
                      <p className="font-semibold text-alabaster">{c.title}</p>
                      {c.description && (
                        <p className="text-xs leading-relaxed text-dim-grey line-clamp-2">{c.description}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {featuredResources && featuredResources.length > 0 && (
              <section>
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-dim-grey">Khoury Resources</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {featuredResources.map((r) => (
                    <a
                      key={r.id}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col gap-1.5 rounded-md border border-white/10 bg-graphite p-4 transition-colors hover:border-carmine/40"
                    >
                      <p className="font-semibold text-alabaster">{r.name}</p>
                      {r.description && (
                        <p className="text-xs leading-relaxed text-dim-grey line-clamp-2">{r.description}</p>
                      )}
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      )}

      {/* Learning Paths */}
      <div className="border-t border-white/10 pb-16 pt-16">
        <div className="mb-6 border-l-4 border-carmine pl-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-alabaster">Or browse by learning path</h2>
          <p className="mt-1 text-sm text-dim-grey">
            These paths group topics by goal — useful if you already know what direction you want to go.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
              <button
                type="button"
                onClick={() => setOpenPath(lp.slug)}
                className="mt-1 self-start text-xs font-medium transition-colors hover:underline"
                style={{ color: lp.color }}
              >
                Read more →
              </button>
            </div>
          ))}
        </div>
      </div>

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
            <div className="flex items-center gap-2 mb-4">
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
