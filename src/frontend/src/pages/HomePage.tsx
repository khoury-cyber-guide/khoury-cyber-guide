import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApi } from '@/hooks/useApi'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Skeleton } from '@/components/ui/skeleton'

const CALENDAR_ID = 'khourycyber@gmail.com'
const API_KEY = import.meta.env.VITE_GCAL_API_KEY

interface CalEvent {
  id: string
  summary: string
  description?: string
  start: { dateTime?: string; date?: string }
  location?: string
  htmlLink: string
}

function getWeekRange(offset: number) {
  const now = new Date()
  const day = now.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day

  const monday = new Date(now)
  monday.setDate(now.getDate() + diffToMonday + offset * 7)
  monday.setHours(0, 0, 0, 0)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)

  return {
    timeMin: offset === 0 ? now.toISOString() : monday.toISOString(),
    timeMax: sunday.toISOString(),
  }
}

function weekLabel(offset: number): string {
  if (offset === 0) return 'This Week'
  if (offset === 1) return 'Next Week'
  const now = new Date()
  const day = now.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  const monday = new Date(now)
  monday.setDate(now.getDate() + diffToMonday + offset * 7)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const fmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
  return `${fmt.format(monday)} – ${fmt.format(sunday)}`
}

function formatEventDate(start: CalEvent['start']): string {
  const raw = start.dateTime ?? start.date
  if (!raw) return ''
  const date = new Date(raw)
  if (start.dateTime) {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit',
    }).format(date)
  }
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  }).format(date)
}

export function HomePage() {
  useDocumentTitle('Home')

  const [collapsed, setCollapsed] = useState(false)
  const [weekOffset, setWeekOffset] = useState(0)
  const weekOffsetRef = useRef(0)

  const { data: events, loading, error, refetch } = useApi<CalEvent[]>(async (signal) => {
    const { timeMin, timeMax } = getWeekRange(weekOffsetRef.current)
    const url = new URL(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`
    )
    url.searchParams.set('key', API_KEY)
    url.searchParams.set('timeMin', timeMin)
    url.searchParams.set('timeMax', timeMax)
    url.searchParams.set('maxResults', '20')
    url.searchParams.set('orderBy', 'startTime')
    url.searchParams.set('singleEvents', 'true')
    const r = await fetch(url.toString(), { signal })
    const d = await r.json()
    return d.items ?? []
  })

  function goToWeek(offset: number) {
    weekOffsetRef.current = offset
    setWeekOffset(offset)
    refetch()
  }

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
      <div className="border-t border-white/10 pt-12 pb-16">
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-dim-grey hover:text-alabaster"
          >
            Upcoming Events
            <span aria-hidden="true" className="text-xs">{collapsed ? '▼' : '▲'}</span>
          </button>

          {!collapsed && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => goToWeek(weekOffset - 1)}
                disabled={weekOffset === 0}
                className="text-sm text-dim-grey hover:text-alabaster disabled:opacity-30"
                aria-label="Previous week"
              >
                ←
              </button>
              <span className="min-w-24 text-center text-xs text-dim-grey">{weekLabel(weekOffset)}</span>
              <button
                type="button"
                onClick={() => goToWeek(weekOffset + 1)}
                className="text-sm text-dim-grey hover:text-alabaster"
                aria-label="Next week"
              >
                →
              </button>
            </div>
          )}
        </div>

        {!collapsed && (
          <>
            {loading && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-28 rounded-md bg-graphite/60" />
                ))}
              </div>
            )}

            {!loading && error && (
              <p className="text-sm text-dim-grey">Unable to load events.</p>
            )}

            {!loading && !error && events?.length === 0 && (
              <p className="text-sm text-dim-grey">No events this week.</p>
            )}

            {!loading && !error && events && events.length > 0 && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <a
                    key={event.id}
                    href={event.htmlLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col rounded-md border border-white/10 bg-graphite p-4 transition-colors hover:border-carmine/40"
                  >
                    <p className="text-xs text-carmine">{formatEventDate(event.start)}</p>
                    <p className="mt-1.5 font-medium text-alabaster group-hover:text-carmine">
                      {event.summary}
                    </p>
                    {event.description && (
                      <p className="mt-1 text-xs text-dim-grey">
                        {event.description.length > 120
                          ? event.description.slice(0, 120).trimEnd() + '…'
                          : event.description}
                      </p>
                    )}
                    {event.location && (
                      <p className="mt-1 truncate text-xs text-dim-grey">{event.location}</p>
                    )}
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  )
}
