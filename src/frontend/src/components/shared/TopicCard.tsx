import { Link } from 'react-router-dom'
import type { TopicSummary } from '@/types/topic'

interface TopicCardProps {
  topic: TopicSummary
}

export function TopicCard({ topic }: TopicCardProps) {
  return (
    <Link
      to={`/topics/${topic.category}/${topic.slug}`}
      className="group flex flex-col gap-3 rounded-md border border-white/10 bg-graphite p-5 transition-all hover:border-carmine/60 hover:bg-graphite/80"
    >
      <h3 className="text-base font-semibold text-alabaster transition-colors group-hover:text-carmine">
        {topic.title}
      </h3>
      {topic.description && (
        <p className="line-clamp-3 text-sm leading-relaxed text-dim-grey">
          {topic.description}
        </p>
      )}
      <span className="mt-auto text-xs font-medium text-carmine opacity-0 transition-opacity group-hover:opacity-100">
        Explore →
      </span>
    </Link>
  )
}
