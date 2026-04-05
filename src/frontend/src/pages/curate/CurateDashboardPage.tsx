import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

const SECTIONS = [
  {
    label: 'Topics',
    description: 'Add or edit cybersecurity topics and their linked resources.',
    to: '/curate/topics',
  },
  {
    label: 'Courses',
    description: 'Manage course listings, descriptions, and prerequisites.',
    to: '/curate/courses',
  },
  {
    label: 'Professors',
    description: 'Add faculty profiles and link them to courses and topics.',
    to: '/curate/professors',
  },
  {
    label: 'Clubs',
    description: 'Add clubs as Khoury Resources (Clubs & On-Campus Events). A dedicated Clubs page may be added in the future.',
    to: '/curate/clubs',
    disabled: true,
  },
  {
    label: 'Khoury Resources',
    description: 'Manage university resource links across all categories.',
    to: '/curate/khoury-resources',
  },
]

export function CurateDashboardPage() {
  useDocumentTitle('Curate')

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-alabaster">Dashboard</h1>
        <p className="mt-1 text-sm text-dim-grey">What would you like to update?</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) =>
          s.disabled ? (
            <div
              key={s.to}
              className="flex flex-col gap-1 rounded-lg border border-white/5 bg-graphite/10 p-5 opacity-50"
            >
              <span className="font-semibold text-dim-grey">{s.label}</span>
              <span className="text-sm text-dim-grey">{s.description}</span>
            </div>
          ) : (
            <Link
              key={s.to}
              to={s.to}
              className="flex flex-col gap-1 rounded-lg border border-white/10 bg-graphite/30 p-5 transition-colors hover:border-carmine/40 hover:bg-graphite/50"
            >
              <span className="font-semibold text-alabaster">{s.label}</span>
              <span className="text-sm text-dim-grey">{s.description}</span>
            </Link>
          )
        )}
      </div>
    </div>
  )
}
