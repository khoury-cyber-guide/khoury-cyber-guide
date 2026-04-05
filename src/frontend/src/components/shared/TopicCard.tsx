import { Link } from 'react-router-dom'
import { TOPICS } from '@/data/topics'
import type { TopicSummary } from '@/types/topic'

interface TopicCardProps {
  topic: TopicSummary
}

export function TopicCard({ topic }: TopicCardProps) {
  const isFeatured = TOPICS.find((t) => t.slug === topic.slug)?.is_featured ?? false

  return (
    <Link
      to={`/topics/${topic.category}/${topic.slug}`}
      className="group flex flex-col gap-3 rounded-md border border-white/10 bg-graphite p-5 transition-all hover:border-carmine/60 hover:bg-graphite/80"
    >
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-base font-semibold text-alabaster transition-colors group-hover:text-carmine">
          {topic.title}
        </h3>
        {isFeatured && (
          <span className="rounded border border-copper/60 bg-copper/10 px-1.5 py-0.5 text-xs font-semibold text-copper">
            ★ Our Pick
          </span>
        )}
      </div>
      {topic.description && (
        <p className="text-sm leading-relaxed text-dim-grey">
          {topic.description}
        </p>
      )}
      <span className="mt-auto text-xs font-medium text-carmine opacity-0 transition-opacity group-hover:opacity-100">
        Explore →
      </span>
    </Link>
  )
}
