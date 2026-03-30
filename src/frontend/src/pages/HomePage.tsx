import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PageWrapper } from '@/components/layout/PageWrapper'

const EVENTS_URL = 'https://www.khoury.northeastern.edu/events/'

export function HomePage() {
  useDocumentTitle('Home')

  return (
    <PageWrapper>
      {/* Hero */}
      <div className="py-16 sm:py-24">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-carmine">
          Khoury College of Computer Sciences
        </p>
        <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-alabaster sm:text-5xl lg:text-6xl">
          Your roadmap for cybersecurity at Northeastern.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-dim-grey">
          Not sure where to start in cybersecurity? This guide maps out the topics, courses, clubs,
          and resources available to you at Khoury — from foundational concepts to cutting-edge research areas.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/start"
            className="inline-flex items-center gap-2 rounded-md bg-carmine px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-burgundy"
          >
            Start Here <span aria-hidden="true">→</span>
          </Link>
          <Link
            to="/topics"
            className="inline-flex items-center gap-2 rounded-md border border-white/10 px-5 py-2.5 text-sm font-semibold text-alabaster transition-colors hover:border-white/30"
          >
            Browse Topics
          </Link>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="border-t border-white/10 py-12">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-dim-grey">
          Upcoming Events
        </p>
        <p className="mb-4 max-w-xl text-sm leading-relaxed text-dim-grey">
          Check the Khoury events page for upcoming club events, career workshops, and industry talks.
        </p>
        <a
          href={EVENTS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-white/10 px-5 py-2.5 text-sm font-semibold text-alabaster transition-colors hover:border-white/30"
        >
          View Events <span aria-hidden="true">↗</span>
        </a>
      </div>
    </PageWrapper>
  )
}
