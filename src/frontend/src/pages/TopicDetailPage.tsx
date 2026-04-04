import { Fragment, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApi } from '@/hooks/useApi'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { getTopicBySlug } from '@/api/topics'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { ResourceSection } from '@/components/shared/ResourceSection'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'
import { CATEGORY_META } from '@/data/topics'
import type { TopicDetail, ResourceItem, CourseSummaryInTopic, KhouryResourceInTopic } from '@/types/topic'
import { NotFoundPage } from './NotFoundPage'

const VALID_CATEGORIES = new Set(['build_and_secure', 'attack_and_defend', 'strategy_and_governance'])
const PREVIEW_COUNT = 4

function RichText({ text }: { text: string }) {
  const segments = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <p className="whitespace-pre-line text-sm leading-relaxed text-alabaster">
      {segments.map((seg, i) =>
        seg.startsWith('**') && seg.endsWith('**')
          ? <strong key={i} className="font-semibold">{seg.slice(2, -2)}</strong>
          : seg
      )}
    </p>
  )
}

function GridBox<T,>({
  title,
  items,
  renderItem,
  emptyMessage = 'Nothing here yet.',
}: {
  title: string
  items: T[]
  renderItem: (item: T) => React.ReactNode
  emptyMessage?: string
}) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? items : items.slice(0, PREVIEW_COUNT)
  return (
    <div className="flex flex-col rounded-md border border-white/10 bg-graphite/40 p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-dim-grey">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-dim-grey">{emptyMessage}</p>
      ) : (
        <>
          <div className="flex flex-col gap-1.5">
            {visible.map((item, i) => (
              <Fragment key={i}>{renderItem(item)}</Fragment>
            ))}
          </div>
          {items.length > PREVIEW_COUNT && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="mt-3 self-start text-xs text-carmine hover:underline"
            >
              {expanded ? 'Show less' : `Read More (${items.length - PREVIEW_COUNT} more)`}
            </button>
          )}
        </>
      )}
    </div>
  )
}

function ResourceItemRow({ item }: { item: ResourceItem }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="rounded px-2 py-1.5 transition-colors hover:bg-black/10">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-2 text-sm text-alabaster hover:text-carmine"
        >
          <span className="min-w-0 truncate">{item.name}</span>
          <span className="shrink-0 text-dim-grey" aria-hidden="true">↗</span>
        </a>
        {item.description && (() => {
          const limit = 100
          const long = item.description.length > limit
          return (
            <p className="mt-0.5 text-xs text-dim-grey">
              {long ? item.description.slice(0, limit).trimEnd() + '…' : item.description}
              {long && (
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="ml-1 font-bold text-carmine hover:text-carmine/70"
                >
                  more
                </button>
              )}
            </p>
          )
        })()}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-lg border border-white/10 bg-graphite p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-medium text-alabaster">{item.name}</p>
            {item.description && (
              <p className="mt-2 text-sm leading-relaxed text-dim-grey">{item.description}</p>
            )}
            <div className="mt-4 flex items-center justify-between">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-carmine hover:underline"
              >
                Open link <span aria-hidden="true">↗</span>
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs text-dim-grey hover:text-alabaster"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function renderResourceItem(item: ResourceItem) {
  return <ResourceItemRow item={item} />
}

function renderCourse(course: CourseSummaryInTopic) {
  return (
    <Link
      to={`/courses/${course.id}`}
      className="group flex items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-black/10"
    >
      <span className="shrink-0 font-mono text-xs text-carmine">
        {course.course_program} {course.course_code}
      </span>
      <span className="min-w-0 truncate text-sm text-alabaster group-hover:text-carmine">
        {course.title}
      </span>
    </Link>
  )
}

function renderKhouryResource(resource: KhouryResourceInTopic) {
  return (
    <a
      href={resource.url || undefined}
      target={resource.url ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="group flex items-start gap-3 rounded px-2 py-1.5 transition-colors hover:bg-black/10"
    >
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-carmine" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-sm font-medium text-alabaster group-hover:text-carmine">{resource.name}</p>
        {resource.description && (
          <p className="mt-0.5 line-clamp-2 text-xs text-dim-grey">{resource.description}</p>
        )}
      </div>
    </a>
  )
}

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
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-md bg-graphite/60" />
          ))}
        </div>
      </PageWrapper>
    )
  }

  if (error || !topic) return <NotFoundPage />

  const whatIs = topic.misc.what_is
  const commonAttacks = topic.misc.common_attacks
  const whyCare = topic.misc.why_care
  const stillConfused = topic.misc.still_confused ?? []
  const activeResearch = topic.misc.active_research ?? []
  const otherResources = topic.misc.other_resources ?? []

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

      <div className="mt-8 grid grid-cols-1 items-start gap-3 lg:grid-cols-3">

        <div className="rounded-md border border-white/10 px-5 py-5 lg:col-span-2">
          <h2 className="mb-6 text-base font-bold uppercase tracking-widest text-carmine">
            Understanding the Topic
          </h2>
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-dim-grey">
                What is {topic.title}?
              </h3>
              <RichText text={whatIs || topic.description} />
            </div>

            {commonAttacks && (
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-dim-grey">
                  Common Attacks
                </h3>
                <RichText text={commonAttacks} />
              </div>
            )}

            {whyCare && (
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-dim-grey">
                  Why should you care?
                </h3>
                <RichText text={whyCare} />
              </div>
            )}

            {stillConfused.length > 0 && (
              <ResourceSection title="Still confused?" items={stillConfused} />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Accordion multiple defaultValue={['on-campus']}>
            <AccordionItem value="on-campus" className="rounded-md border border-white/10 px-5">
              <AccordionTrigger className="text-base font-bold uppercase tracking-widest text-dim-grey hover:text-alabaster hover:no-underline">
                On-Campus Resources
              </AccordionTrigger>
              <AccordionContent className="pb-6 pt-2">
                <div className="flex flex-col gap-4">
                  <GridBox
                    title="Related Courses"
                    items={topic.courses}
                    renderItem={renderCourse}
                    emptyMessage="—"
                  />
                  <GridBox
                    title="Relevant Clubs"
                    items={topic.khoury_resources}
                    renderItem={renderKhouryResource}
                    emptyMessage="—"
                  />
                  <GridBox
                    title="Active Research"
                    items={activeResearch}
                    renderItem={renderResourceItem}
                    emptyMessage="—"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion multiple defaultValue={['off-campus']}>
            <AccordionItem value="off-campus" className="rounded-md border border-white/10 px-5">
              <AccordionTrigger className="text-base font-bold uppercase tracking-widest text-dim-grey hover:text-alabaster hover:no-underline">
                Off-Campus Resources
              </AccordionTrigger>
              <AccordionContent className="pb-6 pt-2">
                <div className="flex flex-col gap-4">
                  <GridBox
                    title="Certifications"
                    items={topic.off_campus.certifications}
                    renderItem={renderResourceItem}
                    emptyMessage="—"
                  />
                  <GridBox
                    title="Online Learning Tools"
                    items={topic.off_campus.learning_tools}
                    renderItem={renderResourceItem}
                    emptyMessage="—"
                  />
                  <GridBox
                    title="Blogs / Newsletters / Discords"
                    items={topic.off_campus.blogs_newsletters}
                    renderItem={renderResourceItem}
                    emptyMessage="—"
                  />
                  <GridBox
                    title="Common Tools & Software"
                    items={topic.off_campus.tools}
                    renderItem={renderResourceItem}
                    emptyMessage="—"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {otherResources.length > 0 && (
          <Accordion multiple defaultValue={['other']} className="lg:col-span-3">
            <AccordionItem value="other" className="rounded-md border border-white/10 px-5">
              <AccordionTrigger className="text-base font-bold uppercase tracking-widest text-dim-grey hover:text-alabaster hover:no-underline">
                Other Resources
              </AccordionTrigger>
              <AccordionContent className="pb-6 pt-2">
                <ResourceSection title="Resources" items={otherResources} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </PageWrapper>
  )
}
