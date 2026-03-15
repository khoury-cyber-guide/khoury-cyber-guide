import { useParams, Link } from 'react-router-dom'
import { useApi } from '@/hooks/useApi'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { getTopicBySlug } from '@/api/topics'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { ResourceSection } from '@/components/shared/ResourceSection'
import { CourseCard } from '@/components/shared/CourseCard'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'
import { CATEGORY_META } from '@/data/topics'
import type { TopicDetail } from '@/types/topic'
import { NotFoundPage } from './NotFoundPage'

const VALID_CATEGORIES = new Set(['build_and_secure', 'attack_and_defend', 'strategy_and_governance'])

export function TopicDetailPage() {
  const { category, slug } = useParams<{ category: string; slug: string }>()
  const isValid = !!category && VALID_CATEGORIES.has(category) && !!slug

  const { data: topic, loading, error } = useApi<TopicDetail | null>((signal) =>
    isValid ? getTopicBySlug(signal, slug!) : Promise.resolve(null),
  )

  useDocumentTitle(topic?.title)

  if (!isValid) return <NotFoundPage />

  const categoryMeta = CATEGORY_META[category as keyof typeof CATEGORY_META]

  if (loading) {
    return (
      <PageWrapper>
        <Skeleton className="mb-3 h-4 w-48 bg-graphite/60" />
        <Skeleton className="mb-6 h-10 w-96 bg-graphite/60" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-md bg-graphite/60" />
          ))}
        </div>
      </PageWrapper>
    )
  }

  if (error || !topic) {
    return <NotFoundPage />
  }

  const whyCare = topic.misc.why_care
  const secondary = topic.misc.secondary_section
  const stillConfused = topic.misc.still_confused
  const activeResearch = topic.misc.active_research ?? {}
  const tools = topic.misc.tools ?? {}
  const otherResources = topic.misc.other_resources ?? {}

  return (
    <PageWrapper>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-2 text-xs text-dim-grey">
        <Link to="/topics" className="hover:text-alabaster">Topics</Link>
        <span className="mx-2">/</span>
        <Link to={`/topics/${category}`} className="hover:text-alabaster">
          {categoryMeta?.label}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-alabaster">{topic.title}</span>
      </nav>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-alabaster sm:text-4xl">
        {topic.title}
      </h1>

      {/* Main content */}
      <div className="mt-8">
        <Accordion multiple defaultValue={['understanding', 'on-campus', 'off-campus']} className="flex flex-col gap-3">

          {/* Section 1: Understanding the Topic */}
          <AccordionItem value="understanding" className="rounded-md border border-white/10 bg-graphite px-5">
            <AccordionTrigger className="text-sm font-bold uppercase tracking-widest text-carmine hover:no-underline">
              Understanding the Topic
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-6 pb-6 pt-2">
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-dim-grey">
                  What is {topic.title}?
                </h3>
                <p className="text-sm leading-relaxed text-alabaster">{topic.description}</p>
              </div>

              {secondary && (
                <div>
                  <p className="text-sm leading-relaxed text-alabaster">{secondary}</p>
                </div>
              )}

              {whyCare && (
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-dim-grey">
                    Why should you care?
                  </h3>
                  <p className="text-sm leading-relaxed text-alabaster">{whyCare}</p>
                </div>
              )}

              {stillConfused && (
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-dim-grey">
                    Still confused?
                  </h3>
                  <p className="text-sm leading-relaxed text-alabaster">{stillConfused}</p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Section 2: On-Campus Resources */}
          <AccordionItem value="on-campus" className="rounded-md border border-white/10 bg-graphite px-5">
            <AccordionTrigger className="text-sm font-bold uppercase tracking-widest text-dim-grey hover:text-alabaster hover:no-underline">
              On-Campus Resources
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-6 pb-6 pt-2">
              {/* Related Courses */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-dim-grey">
                  Related Courses
                </h3>
                {topic.courses.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {topic.courses.map((course) => (
                      <CourseCard key={course.id} course={course} compact />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-dim-grey">No courses linked yet.</p>
                )}
              </div>

              {/* Relevant Clubs */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-dim-grey">
                  Relevant Clubs
                </h3>
                {topic.clubs.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {topic.clubs.map((club) => (
                      <a
                        key={club.id}
                        href={club.url || undefined}
                        target={club.url ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="group flex items-start gap-3 rounded px-3 py-2 transition-colors hover:bg-black/20"
                      >
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-carmine" aria-hidden="true" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-alabaster group-hover:text-carmine">
                            {club.name}
                          </p>
                          {club.mission && (
                            <p className="mt-0.5 line-clamp-2 text-xs text-dim-grey">{club.mission}</p>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-dim-grey">No clubs linked yet.</p>
                )}
              </div>

              {/* Active Research */}
              {Object.keys(activeResearch).length > 0 && (
                <ResourceSection title="Active Research" items={activeResearch} />
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Section 3: Off-Campus Resources */}
          <AccordionItem value="off-campus" className="rounded-md border border-white/10 bg-graphite px-5">
            <AccordionTrigger className="text-sm font-bold uppercase tracking-widest text-dim-grey hover:text-alabaster hover:no-underline">
              Off-Campus Resources
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-6 pb-6 pt-2">
              <ResourceSection
                title="Certifications"
                items={topic.off_campus.certifications}
                emptyMessage="No certifications listed yet."
              />
              <ResourceSection
                title="Online Learning"
                items={topic.off_campus.learning_tools}
                emptyMessage="No learning tools listed yet."
              />
              <ResourceSection
                title="Blogs & Communities"
                items={topic.off_campus.socials}
                emptyMessage="No community resources listed yet."
              />
            </AccordionContent>
          </AccordionItem>

          {/* Section 4: Common Tools */}
          {Object.keys(tools).length > 0 && (
            <AccordionItem value="tools" className="rounded-md border border-white/10 bg-graphite px-5">
              <AccordionTrigger className="text-sm font-bold uppercase tracking-widest text-dim-grey hover:text-alabaster hover:no-underline">
                Common Tools & Software
              </AccordionTrigger>
              <AccordionContent className="pb-6 pt-2">
                <ResourceSection title="Tools" items={tools} />
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Section 5: Other Resources */}
          {Object.keys(otherResources).length > 0 && (
            <AccordionItem value="other" className="rounded-md border border-white/10 bg-graphite px-5">
              <AccordionTrigger className="text-sm font-bold uppercase tracking-widest text-dim-grey hover:text-alabaster hover:no-underline">
                Other Resources
              </AccordionTrigger>
              <AccordionContent className="pb-6 pt-2">
                <ResourceSection title="Resources" items={otherResources} />
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    </PageWrapper>
  )
}
