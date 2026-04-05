import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useApi } from '@/hooks/useApi'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { adminDeleteClub } from '@/api/admin'
import apiClient from '@/api/client'

interface ClubSummary {
  id: number
  name: string
  mission: string
  url: string
  tags: string[]
}

export function CurateClubsPage() {
  useDocumentTitle('Clubs — Curate')
  const { token } = useAdminAuth()
  const { data: clubs, loading, error, refetch } = useApi<ClubSummary[]>((signal) =>
    apiClient.get('/api/clubs', { signal }).then((r) => r.data),
  )
  const [deleting, setDeleting] = useState<number | null>(null)
  const [query, setQuery] = useState('')

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await adminDeleteClub(token!, id)
      refetch()
    } catch {
      alert('Failed to delete club.')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-alabaster">Clubs</h1>
          <p className="mt-0.5 text-sm text-dim-grey">{clubs?.length ?? 0} total</p>
        </div>
        <Link
          to="/curate/clubs/new"
          className="rounded bg-carmine px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          + New Club
        </Link>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search clubs…"
        className="mb-4 w-full max-w-sm rounded border border-white/15 bg-graphite px-3 py-2 text-sm text-alabaster placeholder:text-dim-grey/50 focus:border-carmine/60 focus:outline-none"
      />

      {error && <p role="alert" className="mb-4 text-sm text-carmine">Failed to load clubs.</p>}

      {loading ? (
        <p className="text-sm text-dim-grey">Loading…</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-graphite/40 text-left">
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-dim-grey">Name</th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-dim-grey">Tags</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(clubs ?? []).filter((c) =>
                c.name.toLowerCase().includes(query.toLowerCase())
              ).map((club) => (
                <tr key={club.id} className="transition-colors hover:bg-graphite/20">
                  <td className="px-4 py-3 font-medium text-alabaster">{club.name}</td>
                  <td className="px-4 py-3 text-xs text-dim-grey">{club.tags.join(', ') || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        to={`/curate/clubs/${club.id}/edit`}
                        className="text-xs text-dim-grey transition-colors hover:text-alabaster"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(club.id, club.name)}
                        disabled={deleting === club.id}
                        className="text-xs text-dim-grey transition-colors hover:text-carmine disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {clubs?.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-sm text-dim-grey">
                    No clubs yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
